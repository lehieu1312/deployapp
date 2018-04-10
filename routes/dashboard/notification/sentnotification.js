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
var notification = require("../../../models/notification")
var appsetting = require("../../../models/appsettings")
//var devicesTest = require("../../../models/devicesNotification")

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

// setup save file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(appRoot, 'public', 'themes/img/settingnotification'))
    },
    filename: function (req, file, cb) {
        // console.log(file.originalname);
        cb(null, md5(Date.now()) + "." + file.originalname.split('.').pop().toLowerCase())
    }
})
var uploading = multer({
    storage: storage
});
router.get("/sentnotification", (req, res) => {

    try {
        appsetting.findOne({
            idApp: "Y29tLnRheWRvdGVjaC5jZWxsc3RvcmU"
        }).then((setting) => {
            notification.find({
                idApp: "Y29tLnRheWRvdGVjaC5jZWxsc3RvcmU",
                status: true
            }, {
                idNotification: 1
            }).then((id_noti) => {
                var myNoti = new OneSignal.Client({
                    userAuthKey: setting.oneSignalUserID,
                    app: {
                        appAuthKey: setting.oneSignalAPIKey,
                        appId: setting.oneSignalID
                    }
                });
                (async () => {
                    for (let i = 0; i < id_noti.length; i++) {
                        await new Promise(function (resolve, reject) {
                            myNoti.viewNotification(id_noti[i].idNotification, function (err, httpResponse, data) {
                                if (httpResponse.statusCode === 200 && !err) {
                                    let datanoti = JSON.parse(data);
                                    console.log(datanoti)
                                    notification.update({
                                        idApp: setting.idApp,
                                        status: true,
                                        idNotification: id_noti[i].idNotification
                                    }, {
                                        successful: datanoti.successful,
                                        failed: datanoti.failed,
                                        // failed: 77,
                                        converted: datanoti.converted,
                                        remaining: datanoti.remaining,
                                    }).then((datax) => {
                                        resolve(data);
                                    })
                                }
                            })
                        })

                    }
                    let data_noti = await notification.find({
                        idApp: "Y29tLnRheWRvdGVjaC5jZWxsc3RvcmU",
                        status: true
                    }).exec()
                    res.render("./dashboard/notification/sentnotification", {
                        title: "Sent Notification",
                        appuse: {
                            idApp: setting.idApp,
                            nameApp: setting.nameApp
                        },
                        data: data_noti
                    })
                })()
            })
        })
    } catch (error) {
        console.log(error + '')
    }


})

module.exports = router;