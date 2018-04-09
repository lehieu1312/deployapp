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
    // res.render("./dashboard/notification/sentnotification", {
    //     title: "Sent Notification",
    //     appuse: ""
    // })
    try {
        console.log("avc")
        appsetting.findOne({
            idApp: "Y29tLnRheWRvdGVjaC5jZWxsc3RvcmU"
        }).then((setting) => {
            console.log(setting)
            var myNoti = new OneSignal.Client({
                userAuthKey: setting.oneSignalUserID,
                app: {
                    appAuthKey: setting.oneSignalAPIKey,
                    appId: setting.oneSignalID
                }
            });
            myNoti.viewNotifications('limit=30', function (err, httpResponse, data) {
                if (httpResponse.statusCode === 200 && !err) {
                    let datanoti = JSON.parse(data);
                    datanoti = datanoti.notifications
                    var notiArrays = [];
                    // for (let i = 0; i < datanoti.length; i++) {
                    //     notiArrays.push {
                    //         datanoti[i].
                    //     }
                    // }
                    return res.json(datanoti)
                }
            });
        })
    } catch (error) {
        console.log(error + '')
    }


})

module.exports = router;