var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var request = require('request');
var multer = require('multer')
// var upload = multer({ dest: 'uploads/' })
var app = express();
var md5 = require('md5');
var User = require('../../../models/user');
var libSetting = require('../../../lib/setting');
var devMode = libSetting.devMode;
var Country = require('../../../models/country');
var hostServer = libSetting.hostServer;
var Appversion = require('../../../models/appversionadmin');
var appversionUser = require('../../../models/appversionuser');
var fs = require('fs');
var Inforapp = require('../../../models/inforapp');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

function setNumberVersion(a) {
    let arrNumber = a.split(".");
    let a1 = parseInt(arrNumber[0]) * 100;
    let a2 = parseInt(arrNumber[1]) * 10;
    let a3 = parseInt(arrNumber[2]) * 1;
    return a1 + a2 + a3;
}

function setStringVersion(a) {
    let a1 = Math.floor(a / 100);
    let a2 = Math.floor((a - a1 * 100) / 10)
    let a3 = Math.floor(a - a1 * 100 - a2 * 10)
    return a1 + "." + a2 + "." + a3;
}

router.get('/appversion/:idapp', checkAdmin, (req, res) => {
    try {

        appversionUser.find({
            idApp: req.params.idapp
        }).then((data) => {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    data[i].versionAdmin = setNumberVersion(data[i].versionAdmin);
                }
                data.sort(function (a, b) {
                    return b.versionAdmin - a.versionAdmin;
                });
                Inforapp.findOne({
                    idApp: req.params.idapp,
                    "idUser.idUser": req.session.iduser
                }).then((data1) => {
                    if (data1) {
                        Appversion.findOne({
                            idApp: data[0].idAppAdmin
                        }, (err, count) => {
                            if (err) throw err;
                            // console.log(count)
                            var appuse = {
                                idApp: data1.idApp,
                                nameApp: data1.nameApp
                            }

                            res.render('./dashboard/appversion/appversion', {
                                title: "App Version",
                                appversions: count,
                                appuse: appuse,
                                countversion: data[0].versionAdmin
                            })
                        });
                    } else {
                        res.redirect("/dashboard/404")
                    }
                })
            } else {
                Inforapp.findOne({
                    idApp: req.params.idapp,
                    "idUser.idUser": req.session.iduser
                }).then((data1) => {
                    if (data1) {
                        Appversion.findOne({
                            idApp: data1.idAppAdmin
                        }, (err, count) => {
                            if (err) throw err;
                            // console.log(count)
                            var appuse = {
                                idApp: data1.idApp,
                                nameApp: data1.nameApp
                            }
                            res.render('./dashboard/appversion/appversion', {
                                title: "App Version",
                                appversions: count,
                                appuse: appuse,
                                countversion: ""
                            })
                        });
                    } else {
                        res.redirect("/dashboard/404")
                    }
                })
            }

        })


        // console.log(req.params.idapp)
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})

module.exports = router;