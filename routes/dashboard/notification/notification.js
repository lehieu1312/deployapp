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
var userOnesignal = require("../../../models/usersonesignal");
var userplayers = require("../../../models/usersonesignal");


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
// get notification
router.get("/notification/:idApp", checkAdmin, (req, res) => {
    try {
        notification.findOne({
            idApp: req.params.idApp,
            status: false
        }).then((data) => {
            console.log("data:");
            // console.log(data);
            if (!data) {
                (async () => {
                    await notification.create({
                        idApp: req.params.idApp,
                        idNotification: "",
                        titleNotification: "",
                        contentNotification: "",
                        internalLink: "",
                        smallIcon: "",
                        iconNotification: "",
                        bigimagesNotification: "",
                        backgroundNotification: "",
                        titleColor: "",
                        contentColor: "",
                        ledColor: "",
                        accentColor: "",
                        sendToUser: "",
                        include_player_ids: "",
                        excludesendToUser: "",
                        dateCreate: new Date(),
                        statusNotification: "",
                        status: false
                    });
                    await notification.findOne({
                        idApp: req.params.idApp,
                        status: false
                    }).then((data) => {
                        Inforapp.findOne({
                            idApp: req.params.idApp,
                            status: true
                        }).then((infor) => {

                            let appuse = {
                                idApp: infor.idApp,
                                nameApp: infor.nameApp
                            }
                            userplayers.find({
                                idApp: req.params.idApp,
                                isTest: true
                            }, {
                                id: 1,
                                device_model: 1,
                                device_os: 1
                            }).then((devide_test) => {
                                console.log("devide_test:");
                                console.log(devide_test);
                                res.render("./dashboard/notification/notification", {
                                    title: "Notification",
                                    appuse,
                                    notification: data,
                                    device: devide_test
                                })
                            })
                        })
                    })
                })()
            } else {
                Inforapp.findOne({
                    idApp: req.params.idApp,
                    status: true
                }).then((infor) => {
                    let appuse = {
                        idApp: infor.idApp,
                        nameApp: infor.nameApp
                    }
                    userplayers.find({
                        idApp: req.params.idApp,
                        isTest: true
                    }, {
                        id: 1,
                        device_model: 1,
                        device_os: 1
                    }).then((devide_test) => {
                        console.log("devide_test:");
                        console.log(devide_test);
                        res.render("./dashboard/notification/notification", {
                            title: "Notification",
                            appuse,
                            notification: data,
                            device: devide_test
                        })
                    })
                })
            }
        })

    } catch (error) {
        console.log(error + "");
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})
// save icon small notification
router.post("/iconnotification/:idApp", uploading.single('iconnotification'), (req, res) => {
    try {
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
    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})
// save icon large notification
router.post("/iconlargenotification/:idApp", uploading.single('imglarge'), (req, res) => {
    try {
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
    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})
// save icon big notification
router.post("/iconbigimagesnotification/:idApp", uploading.single('bigimages'), (req, res) => {
    try {
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
    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})
// save icon background notification
router.post("/iconbackgroundnotification/:idApp", uploading.single('background'), (req, res) => {
    try {
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

    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})

router.post("/canceliconnotification/:idApp", (req, res) => {
    try {
        notification.update({
            idApp: req.params.idApp,
            status: false
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
    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }



    // console.log(req)

})
router.post("/canceliconlargenotification/:idApp", (req, res) => {
    try {
        notification.update({
            idApp: req.params.idApp,
            status: false
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
    } catch (error) {

        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }



})
router.post("/canceliconbigimagesnotification/:idApp", (req, res) => {
    try {
        notification.update({
            idApp: req.params.idApp,
            status: false
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
    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})
router.post("/canceliconbackgroundnotification/:idApp", (req, res) => {
    try {
        notification.update({
            idApp: req.params.idApp,
            status: false
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
    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})


router.post('/save-data-notification/:idApp', (req, res) => {
    try {
        var data = JSON.parse(Object.getOwnPropertyNames(req.body)[0]);
        // console.log(data)
        var nametitle = data.title['country'];
        var namecontent = data.content['country'];
        let query = {
            titleNotification: {
                [nametitle]: data.title['value']
            },
            contentNotification: {
                [namecontent]: data.content['value']
            },
            titleColor: data.colorTitle,
            contentColor: data.colorContent,
            ledColor: data.colorLed,
            accentColor: data.colorAccent,
            internalLink: data.internalLink[0],
            sendToUser: data.sendToUser,
            excludesendToUser: data.exclude,
            include_player_ids: data.devices_test
        }
        notification.update({
            idApp: req.params.idApp,
            status: false
        }, query).then(() => {
            return res.json({
                status: 1,
                message: "ok"
            })
        })
    } catch (error) {
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }


})


router.post('/send-notification/:idApp', (req, res) => {
    try {
        notification.findOne({
            idApp: req.params.idApp,
            status: false
        }).then((result) => {
            console.log("result:")
            console.log(JSON.stringify(result))
            appsetting.findOne({
                idApp: req.params.idApp
            }).then((setting) => {
                if (setting.oneSignalAPIKey && setting.oneSignalID) {
                    var sendNotification = function (data) {
                        return new Promise(function (resolve, reject) {
                            var headers = {
                                "Content-Type": "application/json; charset=utf-8",
                                "Authorization": "Basic " + setting.oneSignalAPIKey
                            };
                            var options = {
                                host: "onesignal.com",
                                port: 443,
                                path: "/api/v1/notifications",
                                method: "POST",
                                headers: headers
                            };

                            var reqnoti = https.request(options, function (resnoti) {
                                resnoti.on('data', function (data) {
                                    let getdata = JSON.parse(data);
                                    console.log("getdata:");
                                    console.log(getdata);
                                    var myNoti = new OneSignal.Client({
                                        userAuthKey: setting.oneSignalUserID,
                                        app: {
                                            appAuthKey: setting.oneSignalAPIKey,
                                            appId: setting.oneSignalID
                                        }
                                    });
                                    myNoti.viewNotification(getdata.id, function (err, httpResponse, data) {
                                        let datanoti = JSON.parse(data);
                                        console.log("datanoti:");
                                        console.log(datanoti);
                                        if (datanoti.errors) {
                                            res.render("error", {
                                                title: "Error",
                                                error: datanoti.errors + ""
                                            })
                                        }
                                        if (httpResponse.statusCode === 200 && !err) {
                                            var notiArrays = [];
                                            notification.update({
                                                idApp: setting.idApp,
                                                status: false
                                            }, {
                                                idNotification: getdata.id,
                                                successful: datanoti.successful,
                                                failed: datanoti.failed,
                                                converted: datanoti.converted,
                                                remaining: datanoti.remaining,
                                            }).then(() => {
                                                resolve(datanoti);
                                            })
                                        }
                                    });
                                })

                            });

                            reqnoti.on('error', function (e) {
                                console.log("ERROR:");
                                console.log(e);
                            });
                            reqnoti.write(JSON.stringify(data));
                            reqnoti.end();
                        })
                    };

                    var message = {
                        app_id: setting.oneSignalID,
                        headings: result.titleNotification,
                        contents: result.contentNotification,
                        url: result.internalLink[0].url,
                        // large_icon: "https://dev.deployapp.net/themes/img/profile/8d18ea3b1e9add36c219de44631c4f92.jpg",
                        // small_icon: "https://dev.deployapp.net/themes/img/profile/8d18ea3b1e9add36c219de44631c4f92.jpg",
                        // big_picture: "https://dev.deployapp.net/themes/img/profile/8d18ea3b1e9add36c219de44631c4f92.jpg",
                        // android_background_layout: {
                        //     "image": "https://dev.deployapp.net/themes/img/profile/8d18ea3b1e9add36c219de44631c4f92.jpg"
                        // },
                        large_icon: hostServer + "/themes/img/settingnotification/" + result.smallIcon,
                        small_icon: hostServer + "/themes/img/settingnotification/" + result.iconNotification,
                        big_picture: hostServer + "/themes/img/settingnotification/" + result.bigimagesNotification,
                        android_background_layout: {
                            "image": hostServer + "/themes/img/settingnotification/" + result.backgroundNotification
                        },

                        android_led_color: "#ededed",
                        android_accent_color: "#ededed",
                        included_segments: result.sendToUser,
                        excluded_segments: result.excludesendToUser
                    };
                    if (result.include_player_ids.length > 0) {
                        message.include_player_ids = result.include_player_ids
                    }
                    sendNotification(message).then(() => {
                        notification.update({
                            idApp: setting.idApp,
                            status: false
                        }, {
                            status: true
                        }).then(() => {
                            console.log("vao out..")
                            return res.json({
                                status: 1,
                                message: "ok"
                            })
                        });
                    })
                } else {
                    return res.json({
                        status: 2,
                        message: "You need to add the onesignal information in appsetting"
                    })
                }

            })

        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})

module.exports = router;