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

var multer = require('multer');

var User = require('../../../models/user');
var Inforapp = require('../../../models/inforapp');
var orderofapp = require('../../../models/orderofapp');
var traffic = require('../../../models/traffic');
var producstatictis = require('../../../models/productstatistic');
var userofapp = require('../../../models/userofapp');
var userstatistic = require('../../../models/userstatistic');
var notification = require("../../../models/notification")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(appRoot, 'public', 'themes/img/settingnotification'))
    },
    filename: function (req, file, cb) {
        console.log(file.originalname);
        cb(null, md5(Date.now()) + "." + file.originalname.split('.').pop().toLowerCase())
    }
})

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

var uploading = multer({
    storage: storage
});

router.get("/notification/:idApp", checkAdmin, (req, res) => {
    notification.findOne({
        idApp: req.params.idApp,
        status: false
    }).then((data) => {
        console.log(data);
        if (!data) {
            let newnotification = new notification({
                idApp: req.params.idApp,
                status: false
            });
            newnotification.save();
            res.render("./dashboard/notification/notification", {
                title: "Notification",
                appuse,
                notification: ""
            })
        } else {
            Inforapp.findOne({
                idApp: req.params.idApp
            }).then((infor) => {
                let appuse = {
                    idApp: infor.idApp,
                    nameApp: infor.nameApp
                }
                res.render("./dashboard/notification/notification", {
                    title: "Notification",
                    appuse,
                    notification: data
                })
            })

        }
    })
})

router.post("/iconnotification/:idApp", uploading.single('iconnotification'), (req, res) => {
    notification.findOne({
        idApp: req.params.idApp,
        status: false
    }).then((data) => {
        if (!data.smallIcon) {
            data.smallIcon = req.file.filename
        } else {
            if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.smallIcon))) {
                fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.smallIcon));
            }
            data.smallIcon = req.file.filename
        }
        data.save();
        return res.json({
            status: 1,
            message: req.file.filename
        })
    })
})
router.post("/iconlargenotification/:idApp", uploading.single('imglarge'), (req, res) => {
    notification.findOne({
        idApp: req.params.idApp,
        status: false
    }).then((data) => {
        if (!data.iconNotification) {
            data.iconNotification = req.file.filename
        } else {
            if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.iconNotification))) {
                fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.iconNotification));
            }
            data.iconNotification = req.file.filename
        }
        data.save();
        return res.json({
            status: 1,
            message: req.file.filename
        })
    })
})

router.post("/iconbigimagesnotification/:idApp", uploading.single('bigimages'), (req, res) => {
    notification.findOne({
        idApp: req.params.idApp,
        status: false
    }).then((data) => {
        if (!data.bigimagesNotification) {
            data.bigimagesNotification = req.file.filename
        } else {
            if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.bigimagesNotification))) {
                fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.bigimagesNotification));
            }
            data.bigimagesNotification = req.file.filename
        }
        data.save();
        return res.json({
            status: 1,
            message: req.file.filename
        })
    })
})
router.post("/iconbackgroundnotification/:idApp", uploading.single('background'), (req, res) => {
    notification.findOne({
        idApp: req.params.idApp,
        status: false
    }).then((data) => {
        if (!data.backgroundNotification) {
            data.backgroundNotification = req.file.filename
        } else {
            if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.backgroundNotification))) {
                fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + data.backgroundNotification));
            }
            data.backgroundNotification = req.file.filename
        }
        data.save();
        return res.json({
            status: 1,
            message: req.file.filename
        })
    })
})

router.post("/canceliconnotification/:idApp", (req, res) => {
    console.log(req)
    notification.update({
        idApp: req.params.idApp
    }, {
        smallIcon: ""
    }).then((data) => {
        if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelSmall))) {
            fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelSmall));
        }
        return res.json({
            status: 1,
            message: "ok"
        })
    })

})
router.post("/canceliconlargenotification/:idApp", (req, res) => {
    notification.update({
        idApp: req.params.idApp
    }, {
        iconNotification: ""
    }).then((data) => {
        if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelIcon))) {
            fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelIcon));
        }
        return res.json({
            status: 1,
            message: "ok"
        })
    })

})
router.post("/canceliconbigimagesnotification/:idApp", (req, res) => {
    notification.update({
        idApp: req.params.idApp
    }, {
        bigimagesNotification: ""
    }).then((data) => {
        if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelBig))) {
            fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelBig));
        }
        return res.json({
            status: 1,
            message: "ok"
        })
    })

})
router.post("/canceliconbackgroundnotification/:idApp", (req, res) => {
    notification.update({
        idApp: req.params.idApp
    }, {
        backgroundNotification: ""
    }).then((data) => {
        if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelBackground))) {
            fs.unlinkSync(path.join(appRoot, 'public', 'themes/img/settingnotification/' + req.body.cancelBackground));
        }
        return res.json({
            status: 1,
            message: "ok"
        })
    })
})

router.post("/push-notification", (req, res) => {
    var sendNotification = function (data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic MDc0M2FlZjMtNTE0MS00ZWViLWFjYmMtYWY2MTRiYzliYzRm"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var req = https.request(options, function (res) {
            res.on('data', function (data) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        req.on('error', function (e) {
            console.log("ERROR:");
            console.log(e);
        });

        req.write(JSON.stringify(data));
        req.end();
    };

})

module.exports = router;