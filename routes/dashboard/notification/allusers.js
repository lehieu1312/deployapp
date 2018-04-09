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

// get data device test onesignal app
function setDataDevices(idApp) {
    try {
        appsetting.findOne({
            idApp
        }).then((setting) => {
            var myClient = new OneSignal.Client({
                app: {
                    appAuthKey: setting.oneSignalAPIKey,
                    appId: setting.oneSignalID
                }
            });
            // you can set limit and offset (optional) or you can leave it empty
            myClient.viewDevices('limit=100&offset=0', function (err, httpResponse, data) {
                let getdata = JSON.parse(data);
                console.log("getdata:")
                console.log(getdata)
                let play_user = getdata.players;
                let device_test = play_user.filter(function (el) {
                    return el.test_type != null
                });
                let get_device_tes = [];
                for (let i = 0; i < device_test.length; i++) {
                    get_device_tes.push({
                        idApp,
                        idUser: device_test[i].id,
                        device_os: device_test[i].device_os,
                        device_model: device_test[i].device_model,
                        dateCreate: device_test[i].created_at,
                        status: true
                    })
                }
                devicesTest.remove({
                    idApp
                }).then(() => {
                    devicesTest.insertMany(get_device_tes)
                })
            });
        })
    } catch (error) {
        console.log(error + "")
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


router.get("/allusernotificaion", (req, res) => {
    res.render("./dashboard/notification/allusers", {
        title: "All Users",
        appuse: ""
    })
})

module.exports = router;