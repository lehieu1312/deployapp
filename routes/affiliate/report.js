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
    // withdraws_modal.find();

    affiliate_modal.find({
        idUser: req.session.iduser,
        status: true
    }).then((data) => {
        if (data) {
            var date_now = new Date();
            var early_day = [];
            var yesterday = [];
            var yesterday_old = [];
            var last_7_days = [];
            var last_7_days_old = [];
            var this_month = [];
            var this_month_old = [];
            // ------------------------------------------------
            async function affiliate_earning() {
                early_day = await data.filter((el) => {
                    return data.dateCreate > date_now.setHours(0, 0, 0, 0)
                })
                // ------------------------------------------------
                yesterday = await data.filter((el) => {
                    return data.dateCreate < date_now.setHours(0, 0, 0, 0) &&
                        data.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000
                })
                // ------------------------------------------------
                yesterday_old = await data.filter((el) => {
                    return data.dateCreate < date_now.setHours(0, 0, 0, 0) - 86400000 &&
                        data.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 2
                })
                // ------------------------------------------------
                last_7_days = await data.filter((el) => {
                    return data.dateCreate < date_now.setHours(0, 0, 0, 0) &&
                        data.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 7
                })
                // ------------------------------------------------
                last_7_days_old = await data.filter((el) => {
                    return data.dateCreate < date_now.setHours(0, 0, 0, 0) - 86400000 * 7 &&
                        data.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 14
                })
                // ------------------------------------------------
                this_month = await data.filter((el) => {
                    return data.dateCreate < date_now.setHours(0, 0, 0, 0) &&
                        data.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 30
                })
                // ------------------------------------------------
                this_month_old = await data.filter((el) => {
                    return data.dateCreate < date_now.setHours(0, 0, 0, 0) - 86400000 * 30 &&
                        data.dateCreate > date_now.setHours(0, 0, 0, 0) - 86400000 * 30
                })
                // ------------------------------------------------
            }

        }
    })

    res.render('./affiliate/report', {
        title: 'Report',
        appuse: "",
    });

})

module.exports = router;