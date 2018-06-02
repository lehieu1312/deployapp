var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var request = require('request');
var multer = require('multer')
// var upload = multer({ dest: 'uploads/' });
var app = express();
var md5 = require('md5');
var User = require('../../models/user');
var libSetting = require('../../lib/setting');
var devMode = libSetting.devMode;
var Country = require('../../models/country');
var Inforapp = require('../../models/inforapp');
var TrafficModel = require('../../models/traffic');
var infor_app_admin = require('../../models/inforappadmin');
var notifiUserModels = require('../../models/notificationuser');
var appsetting_models = require('../../models/appsettings');
var order = require("../../models/order");
var hostServer = libSetting.hostServer;
var fs = require('fs');
var server = require('http').Server(app);
var io = require("socket.io")(server);
var moment = require("moment");
// server.listen(3000)


function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}


router.post('/getaccount', (req, res) => {
    try {
        if (req.session.iduser) {
            User.findOne({
                id: req.session.iduser,
                blocked: false,
                status: true
            }, (err, data) => {
                if (err) {
                    console.log(err)
                }
                if (data) {
                    if (!data.picture) {
                        return res.json({
                            picture: "/themes/img/dashboard/avatar.png",
                            fullname: data.firstname + " " + data.lastname
                        })
                    } else {
                        if (fs.existsSync(path.join(appRoot, 'public', 'themes/img/profile/' + data.picture))) {
                            return res.json({
                                picture: "/themes/img/profile/" + data.picture,
                                fullname: data.firstname + " " + data.lastname
                            })
                        } else {
                            return res.json({
                                picture: "/themes/img/dashboard/avatar.png",
                                fullname: data.firstname + " " + data.lastname
                            })
                        }
                    }
                } else {
                    res.redirect("/login");
                }
            })
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

});
router.post('/getnumbernoti', (req, res) => {
    try {
        if (req.session.iduser) {
            return notifiUserModels.find({
                idUser: req.session.iduser,
                status: false
            }).count().then((dataNumberNoti) => {
                return notifiUserModels.find({
                    idUser: req.session.iduser,
                    status: false
                }).sort({
                    dateCreate: -1
                }).then((dataNoti) => {
                    console.log('number noti: ' + dataNumberNoti);
                    return res.json({
                        number: dataNumberNoti,
                        data: dataNoti
                    });
                })
            });
        }
    } catch (error) {
        console.log(error)
        res.json({
            status: 3,
            msg: error + ''
        })
    }

});
router.post('/updatestatusnotiforuser', (req, res) => {
    try {
        console.log(req.body);
        notifiUserModels.update({
            id: req.body.id
        }, {
            $set: {
                status: true
            }
        }).then(() => {
            return res.send('Success.');
        })
        // if (req.session.iduser) {
        //     return notifiUserModels.find({
        //         idUser: req.session.iduser,
        //         status: false
        //     }).count().then((dataNumberNoti) => {
        //         return notifiUserModels.find({
        //             idUser: req.session.iduser
        //         }).then((dataNoti) => {
        //             console.log('number noti: ' + dataNumberNoti);
        //             return res.json({ number: dataNumberNoti, data: dataNoti });
        //         })

        //     });
        // }
    } catch (error) {
        console.log(error)
        res.json({
            status: 3,
            msg: error + ''
        })
    }

});
// 
router.get('/dashboard', checkAdmin, (req, res) => {
    try {
        // console.log('idusernoti: ' );
        User.findOne({
            id: req.session.iduser,
            status: true
        }).then((data) => {
            var myapps = [];
            async function getmyapp() {
                var today = moment().startOf('day')
                var tomorrow = moment(today).add(1, 'days')
                for (let i = 0; i < data.myapp.length; i++) {
                    await TrafficModel.find({
                        idApp: data.myapp[i].idApp,
                        status: true
                    }).then((result) => {
                        if (result == []) {
                            var userOnline = [];
                            var appToday = [];
                            var useIos = [];
                            var useAndroid = [];
                            myapps[i] = {
                                idApp: data.myapp[i].idApp,
                                nameApp: data.myapp[i].nameApp,
                                userOnline: userOnline.length,
                                useToday: appToday.length,
                                useIos: useIos.length,
                                useAndroid: useAndroid.length
                            }
                        } else {
                            var userOnline = result.filter(function (el) {
                                return el.dateOutSession == null;
                            })
                            var appToday = result.filter(function (el) {
                                return el.dateAccess - today >= 0 &&
                                    el.dateAccess - today <= 86400000
                            })
                            var useIos = result.filter(function (el) {
                                return el.platform == "ios" &&
                                    el.dateAccess - today >= 0 &&
                                    el.dateAccess - today <= 86400000
                            });
                            var useAndroid = result.filter(function (el) {
                                return el.platform == "android" &&
                                    el.dateAccess - today >= 0 &&
                                    el.dateAccess - today <= 86400000
                            });
                            // console.log(useIos)
                            myapps[i] = {
                                idApp: data.myapp[i].idApp,
                                nameApp: data.myapp[i].nameApp,
                                userOnline: userOnline.length,
                                useToday: appToday.length,
                                useIos: useIos.length,
                                useAndroid: useAndroid.length
                            }
                        }
                    })

                }
                infor_app_admin.find({
                    status: true
                }).then((apps_admin) => {
                    return res.render("./dashboard/detail", {
                        title: "Dashboard",
                        myapps,
                        appAdmin: apps_admin,
                        appuse: ""
                    });
                })
            }
            getmyapp();
        })

    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})
// router.get('/dashboard/app', checkAdmin, (req, res) => {
//     if (req.session.iduser) {

//     }
// })

router.post("/getamountapp", (req, res) => {
    try {
        User.findOne({
            id: req.session.iduser,
            status: true
        }, (err, data) => {
            if (err) throw err;
            // console.log("myapp:" + data.length)
            if (data) {
                return res.json({
                    amount: data.myapp.length
                });
            } else {
                return res.json({
                    amount: 0
                });
            }

        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})

router.post("/dashboard/deleteapp", (req, res) => {
    try {
        Inforapp.findOne({
            idApp: req.body.idApp,
            status: true
        }, {
            idUser: {
                $elemMatch: {
                    idUser: req.session.iduser,
                    status: true
                }
            }
        }).then((role) => {
            try {
                console.log(role)
                if (role.idUser[0].role == 1) {
                    User.update({
                        id: req.session.iduser,
                        status: true
                    }, {
                        "$pull": {
                            myapp: {
                                idApp: req.body.idApp,
                            }
                        }
                    }, {
                        safe: true
                    }).then(() => {
                        Inforapp.remove({
                            idApp: req.body.idApp
                        }).then(() => {
                            TrafficModel.remove({
                                idApp: req.body.idApp
                            }).then(() => {
                                appsetting_models.remove({
                                    idApp: req.body.idApp
                                }).then(() => {
                                    return res.json({
                                        status: "1"
                                    })
                                })
                            })
                        })
                    })
                } else {
                    return res.json({
                        status: "2",
                        message: "You can't remove app"
                    })
                }
            } catch (error) {
                console.log(error + "")
                res.render("error", {
                    title: "Error",
                    error: error + ""
                })
            }

        })
    } catch (error) {
        console.log(error + "")
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})

function filtercart(a) {
    var b = [];
    while (a.length > 0) {
        let c = a.filter(function (el) {
            return el == a[0]
        });
        b.push({
            id: c[0],
            count: c.length
        });
        a = a.filter(function (el) {
            return el != a[0]
        });
    }
    return b;
}


module.exports = router;