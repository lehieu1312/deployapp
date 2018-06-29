var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var request = require('request');
var multer = require('multer');
// var upload = multer({ dest: 'uploads/' })
var app = express();
var md5 = require('md5');
var User = require('../../../models/user');
var libSetting = require('../../../lib/setting');
var devMode = libSetting.devMode;
var Country = require('../../../models/country');
var hostServer = libSetting.hostServer;
var isoCountries = libSetting.isoCountries;
var Appversion = require('../../../models/appversionadmin');
var appversionUser = require('../../../models/appversionuser');
var appsetting_model = require("../../../models/appsettings");
var fs = require('fs');
var Inforapp = require('../../../models/inforapp');

var moment = require("moment");

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
    let a2 = Math.floor((a - a1 * 100) / 10);
    let a3 = Math.floor(a - a1 * 100 - a2 * 10);
    return a1 + "." + a2 + "." + a3;
}

var getCountryFromHTTP = function (accept_language){

    var CC; //Country Code

    //in some cases like "fr" or "hu" the language and the country codes are the same
    if (accept_language.length === 2){
        CC = accept_language.toUpperCase(); 
    }
    //get "PT" out of "pt-PT"
    else if (accept_language.length === 5){          
        CC = accept_language.substring(3, 5); 
    }
    //ex: "pt-PT,pt;q=0.9,en;q=0.8,en-GB;q=0.7,de-DE;q=0.6,de;q=0.5,fr-FR;q=0.4,fr;q=0.3,es;q=0.2"
    //gets the first two capial letters that fit into 2-letter ISO country code
    else if (accept_language.length > 5) {
        var substr;
        for (var i=7; i+2<accept_language.length; i++){
            substr = accept_language.substring(i, i+2);
            if (isoCountries.hasOwnProperty(substr)){
                return substr;
            }            
        }
    }

    if (isoCountries.hasOwnProperty(CC)){
        return CC;
    }

    return false;
};



router.get('/appversion/:idapp', checkAdmin, (req, res) => {
    try {
        var timezone = getCountryFromHTTP(req.headers["accept-language"]);
         console.log("timezone :" + timezone)
        appsetting_model.findOne({
            idApp: req.params.idapp
        }).then(setting => {
            if (
                setting.packageIDApp &&
                setting.version &&
                setting.nameApp &&
                setting.description &&
                setting.emailApp &&
                setting.authHref &&
                setting.auth &&
                setting.oneSignalID &&
                setting.oneSignalUserID &&
                setting.oneSignalAPIKey
            ) {
                appversionUser.find({
                    idApp: req.params.idapp,
                    status: true
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
                            "idUser.idUser": req.session.iduser,
                            status: true
                        }).then((data1) => {
                            if (data1) {
                                Appversion.findOne({
                                    idApp: data[0].idAppAdmin,
                                    status: true
                                }, (err, count) => {
                                    if (err) throw err;
                                    // console.log(count)

                                    var appuse = {
                                        idApp: data1.idApp,
                                        nameApp: data1.nameApp
                                    };
                                    res.render('./dashboard/appversion/appversion', {
                                        title: "App Version",
                                        appversions: count,
                                        appuse: appuse,
                                        countversion: data[0].versionAdmin,
                                        checkSetting: "true"
                                    });
                                });
                            } else {
                                res.redirect("/dashboard/404")
                            }
                        })
                    } else {
                        Inforapp.findOne({
                            idApp: req.params.idapp,
                            "idUser.idUser": req.session.iduser,
                            status: true
                        }).then((data1) => {
                            if (data1) {
                                Appversion.findOne({
                                    idApp: data1.idAppAdmin,
                                    status: true
                                }, (err, count) => {
                                    if (err) throw err;
                                    // console.log(count)
                                    var appuse = {
                                        idApp: data1.idApp,
                                        nameApp: data1.nameApp
                                    };
                                    res.render('./dashboard/appversion/appversion', {
                                        title: "App Version",
                                        appversions: count,
                                        appuse: appuse,
                                        countversion: "",
                                        checkSetting: "true"
                                    });
                                });
                            } else {
                                res.redirect("/dashboard/404")
                            }
                        });
                    }

                })
            } else {

                appversionUser.find({
                    idApp: req.params.idapp,
                    status: true
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
                            "idUser.idUser": req.session.iduser,
                            status: true
                        }).then((data1) => {
                            if (data1) {
                                Appversion.findOne({
                                    idApp: data[0].idAppAdmin,
                                    status: true
                                }, (err, count) => {
                                    if (err) throw err;
                                    // console.log(count)
                                    var appuse = {
                                        idApp: data1.idApp,
                                        nameApp: data1.nameApp
                                    };

                                    res.render('./dashboard/appversion/appversion', {
                                        title: "App Version",
                                        appversions: count,
                                        appuse: appuse,
                                        countversion: data[0].versionAdmin,
                                        checkSetting: "false"
                                    });
                                });
                            } else {
                                res.redirect("/dashboard/404");
                            }
                        })
                    } else {
                        Inforapp.findOne({
                            idApp: req.params.idapp,
                            "idUser.idUser": req.session.iduser,
                            status: true
                        }).then((data1) => {
                            if (data1) {
                                Appversion.findOne({
                                    idApp: data1.idAppAdmin,
                                    status: true
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
                                        countversion: "",
                                        checkSetting: "false"
                                    })
                                });
                            } else {
                                res.redirect("/dashboard/404");
                            }
                        })
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