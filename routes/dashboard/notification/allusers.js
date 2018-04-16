var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var bodyParser = require('body-parser');
var request = require('request');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var md5 = require('md5');
var async = require('async');
var libSetting = require('../../../lib/setting');
var hostServer = libSetting.hostServer;
var devMode = libSetting.devMode;
var Base64 = require('js-base64').Base64;
var app = express();
var moment = require("moment");
var https = require('https');
var OneSignal = require('onesignal-node');
var multer = require('multer');
var User = require('../../../models/user');
var Inforapp = require('../../../models/inforapp');
var orderofapp = require('../../../models/orderofapp');
var traffic = require('../../../models/traffic');
var producstatictis = require('../../../models/productstatistic');
var userofapp = require('../../../models/userofapp');
var userstatistic = require('../../../models/userstatistic');
var notification = require("../../../models/notification");
var appsetting = require("../../../models/appsettings");
var userplayers = require("../../../models/usersonesignal");
var language = require("./language.json");


function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}


router.get("/notification/alluser/:idApp", checkAdmin, (req, res) => {
    try {
        var idApp = req.params.idApp;
        appsetting.findOne({
            idApp
        }).then((setting) => {
            var APIuserAll = new OneSignal.Client({
                app: {
                    appAuthKey: setting.oneSignalAPIKey,
                    appId: setting.oneSignalID
                }
            });
            APIuserAll.viewDevices('', function (err, httpResponse, data) {
                let getdata = JSON.parse(data);
                let play_user = getdata.players;
                let get_device_tes = [];


                // get all player to Onesignal
                function get_all_player() {
                    return new Promise((resolve, reject) => {
                        for (let i = 0; i < play_user.length; i++) {
                            get_device_tes.push({
                                idApp,
                                id: play_user[i].id,
                                identifier: play_user[i].identifier,
                                session_count: play_user[i].session_count,
                                language: play_user[i].language,
                                timezone: play_user[i].timezone,
                                game_version: play_user[i].game_version,
                                device_os: play_user[i].device_os,
                                device_type: play_user[i].device_type,
                                device_model: play_user[i].device_model,
                                ad_id: play_user[i].ad_id,
                                tags: play_user[i].tags,
                                last_active: play_user[i].last_active,
                                playtime: play_user[i].playtime,
                                amount_spent: play_user[i].amount_spent,
                                created_at: play_user[i].created_at,
                                invalid_identifier: play_user[i].invalid_identifier,
                                badge_count: play_user[i].badge_count,
                                sdk: play_user[i].sdk,
                                test_type: play_user[i].test_type,
                                ip: play_user[i].ip,
                                status: true,
                            })
                        }
                        resolve(get_device_tes)
                    })
                }
                // update information for old player
                async function updatePlayer(a) {
                    var APIuser = new OneSignal.Client({
                        app: {
                            appAuthKey: setting.oneSignalAPIKey,
                            appId: setting.oneSignalID
                        }
                    });

                    for (let i = 0; i < a.length; i++) {
                        APIuser.viewDevice(a[i].id, function (err, httpResponse, data) {
                            let getdataxx = JSON.parse(data)
                            userplayers.update({
                                id: a[i].id
                            }, {
                                session_count: getdataxx.session_count,
                                playtime: getdataxx.playtime,
                                amount_spent: getdataxx.amount_spent,
                                badge_count: getdataxx.badge_count
                            });
                        })
                    }
                }
                // get users don't save to database
                function get_user_new(a, b) {
                    return new Promise((resolve, reject) => {
                        for (var j = 0; j < a.length; j++) {
                            for (var i = 0; i < b.length; i++) {
                                if (a[j].id == b[i].id) {
                                    a.splice(j, 1);
                                }
                            }
                        }
                        resolve(a)
                    })
                }

                get_all_player().then((players) => {
                    userplayers.find({
                        idApp
                    }).then((users_deploy) => {
                        (() => {
                            return new Promise((resolve, reject) => {
                                if (users_deploy.length > 0) {
                                    updatePlayer(users_deploy);
                                    get_user_new(players, users_deploy).then((user_new) => {
                                        userplayers.insertMany(user_new)
                                        resolve(user_new);
                                    })
                                } else {
                                    userplayers.insertMany(players)
                                    resolve(players);
                                }
                            })
                        })().then(() => {
                            userplayers.find({
                                idApp
                            }).sort({
                                created_at: -1
                            }).then((user_playser) => {
                                var language_device = [];
                                for (var j = 0; j < language.length; j++) {
                                    for (var i = 0; i < user_playser.length; i++) {
                                        if (language[j].code == user_playser[i].language) {
                                            language_device.push(language[j])
                                        }
                                    }
                                }
                                console.log(language_device);
                                console.log(language_device.length);
                                res.render("./dashboard/notification/allusers", {
                                    title: "All Users",
                                    appuse: {
                                        idApp,
                                        nameApp: setting.nameApp
                                    },
                                    data: user_playser,
                                    language: language_device
                                })
                            })
                        })

                    })
                })

            });
        })

    } catch (error) {
        console.log(error + "");
    }


})


router.put("/sentnotification/edituser", (req, res) => {
    try {
        userplayers.update({
            id: req.body.id
        }, {
            isTest: req.body.isTest
        }).then(() => {
            res.json({
                status: 1
            })

        })
    } catch (error) {
        console.log(error + "")
    }
})
module.exports = router;