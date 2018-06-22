var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var md5 = require('md5');
var User = require('../../../models/user');

var Appversion = require('../../../models/appversionadmin');
var inforappModels = require('../../../models/inforapp');
var appsettingModels = require('../../../models/appsettings');
var Base64 = require('js-base64').Base64;
var base64js = require('../../../lib/base64');

var fs = require('fs');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}
router.get("/appsettings/:idapp", checkAdmin, (req, res) => {
    try {
        console.log(req.params.idapp);
        inforappModels.findOne({
            idApp: req.params.idapp,
            status: true
        }).then((data) => {
            if (data) {
                appsettingModels.findOne({
                    idApp: req.params.idapp,
                    status: true
                }).then((dataSettings) => {
                    console.log(dataSettings);
                    res.render("./dashboard/appsetting/appsetting", {
                        title: "App Setting",
                        appuse: {
                            idApp: req.params.idapp,
                            nameApp: data.nameApp,
                            appID: Base64.decode(req.params.idapp)
                        },
                        appSetting: dataSettings
                    });
                });
            } else {
                res.render('404', {
                    title: "Page Not Found"
                });
            }
        });
    } catch (error) {
        res.render('error', {
            error,
            title: "Data Error"
        });
    }
});
router.post("/appsettings", checkAdmin, (req, res) => {
    try {
        // console.log(JSON.stringify(req.body));
        // console.log('da vao');
        req.check('idapp', 'ID app is required').notEmpty();
        req.check('packageid', 'Application Identifier is required').notEmpty();
        req.check('appname', 'Application name is required').notEmpty();
        req.check('version', 'Version is required').notEmpty();
        req.check('description', 'Description is required').notEmpty();
        req.check('email', 'Email is required').notEmpty();
        req.check('href', 'Href is required').notEmpty();
        req.check('auth', 'Auth is required').notEmpty();

        req.check('onesignalapikey', 'Onesignal API Key is required').notEmpty();
        req.check('onesignalid', 'Onesignal ID is required').notEmpty();
        req.check('onesignaluserid', 'Onesignal User ID is required').notEmpty();
        // oneSignalUserID
        // onesignaluserid

        // req.check('onesignalapikey', 'Onesignal API Key is required').notEmpty();
        // req.check('onesignalapikey', 'Onesignal API Key is required').notEmpty();

        var errors = req.validationErrors(); //req.getValidationResult();
        err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            console.log(errors);
            return res.json({
                status: "2",
                content: errors
            });
        }
        console.log(req.body.version);
        console.log(req.body.appid);

        appsettingModels.findOne({
                idApp: req.body.idapp,
                status: true
            }).then((dataOne) => {
                if (dataOne) {
                    console.log(req.body.appname);
                    console.log('vao update app');
                    console.log(req.body.idapp.trim());
                    // console.log(base64js.Base64.encode(req.body.idapp));

                    dataOne.packageIDApp = req.body.packageid.trim();
                    dataOne.nameApp = req.body.appname.trim();
                    dataOne.version = req.body.version.trim();
                    dataOne.description = req.body.description.trim();
                    dataOne.emailApp = req.body.email.trim();
                    dataOne.authHref = req.body.href.trim();
                    dataOne.auth = req.body.auth.trim();

                    dataOne.oneSignalID = req.body.onesignalid.trim();
                    dataOne.oneSignalUserID = req.body.onesignaluserid.trim();
                    // dataOne.oneSignalAppID = req.body.onesignalappid.trim();
                    dataOne.oneSignalAPIKey = req.body.onesignalapikey.trim();

                    dataOne.dateUpdate = Date.now();
                    dataOne.status = true;
                    dataOne.save().then(() => {
                            return res.json({
                                status: "1",
                                content: 'Saved'
                            });
                        })
                        // dataOne.oneSignalID = req.body.onesignalid;

                } else {
                    inforappModels.findOne({
                        idApp: base64js.Base64.encode(req.body.idapp.trim()),
                        status: true
                    }).then((dataCheck) => {
                        if (dataCheck) {
                            var appSettingData = new appsettingModels({
                                idApp: base64js.Base64.encode(req.body.idapp.trim()),
                                idUser: req.session.iduser.trim(),
                                version: req.body.version.trim(),
                                nameApp: req.body.appname.trim(),
                                description: req.body.description,
                                emailApp: req.body.email.trim(),
                                authHref: req.body.href.trim(),
                                auth: req.body.auth.trim(),
                                wpUrl: req.body.wpurl.trim(),
                                wpPerPage: req.body.wpperpage.trim(),
                                requestTimeout: req.body.reqtimeout.trim(),
                                targetBlank: req.body.isblank,
                                dateFormat: req.body.dateformat.trim(),
                                oneSignalID: req.body.onesignalid.trim(),
                                oneSignalUserID: req.body.onesignaluserid.trim(),
                                // oneSignalAppID: req.body.onesignalappid.trim(),
                                oneSignalAPIKey: req.body.onesignalapikey.trim(),
                                ggAnalytic: req.body.gganalytic.trim(),
                                adModAndroidBanner: req.body.admodeandroidbanner.trim(),
                                adModeAndroidInterstitial: req.body.admodeandroidinterstitial.trim(),
                                adModeIosBaner: req.body.admodeiosbanner.trim(),
                                adModeIosInterstitial: req.body.admodeiosinterstitial.trim(),
                                dateCreate: Date.now(),
                                status: true
                            });
                            appSettingData.save().then(() => {
                                return res.json({
                                    status: "1",
                                    content: 'Saved'
                                });
                            });
                        } else {
                            return res.json({
                                status: "3",
                                content: 'Not Find Application Identifier'
                            });
                        }
                    });
                }
            })
            // appsettingModels.

    } catch (error) {
        res.render('error', {
            error,
            title: "Data Error"
        });
    }
});
module.exports = router;