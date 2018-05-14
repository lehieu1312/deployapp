var express = require('express');
var router = express.Router();
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var md5 = require('md5');
var async = require('async');
var libSetting = require('../../lib/setting');
var hostServer = libSetting.hostServer;
var devMode = libSetting.devMode;

var Base64 = require('js-base64').Base64;
// var crypto = require('crypto-js');
// var promise = require("promise");
var app = express();
var User = require('../../models/user');
var infor_app_admin = require('../../models/inforappadmin');
var order_modal = require("../../models/order");
var promo_code = require("../../models/promocode");
var affiliate_modal = require("../../models/affiliate");
var affiliate_statictis_modal = require("../../models/affiliatestatistics");
var withdraws_modal = require("../../models/withdraw");
var http = require('http');
var server = http.Server(app);
var paypal = require("paypal-rest-sdk");
var country = require("../../lib/country");


function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}

function checkcart(req, res, next) {
    if (req.session.cart.length > 0) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}


function makeid() {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < 7; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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


router.get("/affiliate/report", checkAdmin, (req, res) => {
    function sum_affiliate(a) {
        var b = 0;
        for (let i = 0; i < a.length; i++) {
            b = b + a[i].money;
        }
        return b;
    }

    // withdraws_modal.find();

    // ------------------------------------------------
    function affiliate_earning() {
        return new Promise((resolve, reject) => {
            affiliate_modal.find({
                idUser: req.session.iduser,
                status: true
            }, {
                money: 1,
                blance: 1,
                dateCreate: 1
            }).sort({
                dateCreate: -1
            }).then((data) => {
                console.log("data: " + JSON.stringify(data))
                if (data.length > 0) {
                    var date_now = new Date();
                    var early_day = data.filter((el) => {
                        return el.dateCreate > date_now.setHours(0, 0, 0, 0)
                    })
                    // ------------------------------------------------
                    var yesterday = data.filter((el) => {
                        return el.dateCreate < date_now.setHours(0, 0, 0, 0) &&
                            el.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000
                    })
                    // ------------------------------------------------
                    var yesterday_old = data.filter((el) => {
                        return el.dateCreate < date_now.setHours(0, 0, 0, 0) - 86400000 &&
                            el.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 2
                    })
                    // ------------------------------------------------
                    var last_7_days = data.filter((el) => {
                        return el.dateCreate < date_now.setHours(0, 0, 0, 0) &&
                            el.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 7
                    })
                    // ------------------------------------------------
                    var last_7_days_old = data.filter((el) => {
                        return el.dateCreate < date_now.setHours(0, 0, 0, 0) - 86400000 * 7 &&
                            el.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 14
                    })
                    // ------------------------------------------------
                    var last_30_days = data.filter((el) => {
                        return el.dateCreate < date_now.setHours(0, 0, 0, 0) &&
                            el.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 30
                    })
                    // ------------------------------------------------
                    var last_30_days_old = data.filter((el) => {
                        return el.dateCreate < date_now.setHours(0, 0, 0, 0) - 86400000 * 30 &&
                            el.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 60
                    })
                    // ------------------------------------------------
                    console.log(early_day);
                    resolve({
                        total: data[0].blance,
                        early_day: sum_affiliate(early_day),
                        yesterday: sum_affiliate(yesterday),
                        yesterday_old: sum_affiliate(yesterday_old),
                        last_7_days: sum_affiliate(last_7_days),
                        last_7_days_old: sum_affiliate(last_7_days_old),
                        last_30_days: sum_affiliate(last_30_days),
                        last_30_days_old: sum_affiliate(last_30_days_old)
                    })
                } else {
                    resolve({
                        total: 0,
                        early_day: sum_affiliate(0),
                        yesterday: sum_affiliate(0),
                        yesterday_old: sum_affiliate(0),
                        last_7_days: sum_affiliate(0),
                        last_7_days_old: sum_affiliate(0),
                        last_30_days: sum_affiliate(0),
                        last_30_days_old: sum_affiliate(0)
                    })
                }
            })
        })
    }
    affiliate_earning().then((traffic_affiliate) => {
        console.log("traffic_affiliate: " + JSON.stringify(traffic_affiliate))
        res.render('./affiliate/report', {
            title: 'Report',
            earning: traffic_affiliate,
            appuse: "",
        });
    });
})

function filter_user_traffic(a) {
    var b = [];
    while (a.length > 0) {
        let c = a.filter(function (el) {
            return el.idUser == a[0].idUser
        });
        b.push(c[0]);
        a = a.filter(function (el) {
            return el.idUser != a[0].idUser
        });
    }
    return b;
}

router.get("/affiliate/report/user-traffic", (req, res) => {
    var time_start = 0;
    var time_end = 7;
    var time_now = new Date();
    var date_now = time_now.setHours(0, 0, 0, 0);
    User.findOne({
        id: "06517fb6f210355bd73620f38b4d5469",
        status: true
    }).then((user_session) => {
        console.log("user:" + JSON.stringify(user_session));
        var data_use = [];
        async function data_daily_traffic() {
            for (let i = 0; i < time_end; i++) {
                let getdata = await affiliate_statictis_modal.find({
                    idUser: user_session.codeShare,
                    dateCreate: {
                        $gte: date_now - (i + 1) * 86400000,
                        $lt: date_now - (i) * 86400000
                    },
                    status: true
                }, {
                    idUser: 1,
                    dateCreate: 1,
                    dateOut: 1,
                    page: 1
                }).exec();
                data_use[i] = await {
                    user: filter_user_traffic(getdata).length,
                    session: getdata.length,
                    bounce_rate: function () {
                        var c = getdata.filter((e) => {
                            return e.dateOut != null &&
                                e.page.length < 2
                        })
                        return c.length
                    },
                    time_session: function () {
                        var c = getdata.filter((e) => {
                            return e.dateOut != null
                        })
                        return c
                    }
                }
            }
            return res.json(data_use)
        }
        data_daily_traffic();
    })
})

module.exports = router;