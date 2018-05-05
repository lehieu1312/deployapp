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
var libSetting = require('../../lib/setting');
var hostServer = libSetting.hostServer;
var devMode = libSetting.devMode;
var passport = require('passport');
var passportfb = require('passport-facebook').Strategy,
    passportgg = require('passport-google-oauth2').Strategy,
    passporttw = require('passport-twitter').Strategy;

var Base64 = require('js-base64').Base64;
// var crypto = require('crypto-js');
// var promise = require("promise");
var app = express();
var User = require('../../models/user');
var infor_app_admin = require('../../models/inforappadmin');
var order = require("../../models/order");
var http = require('http');
var server = http.Server(app);


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

router.get('/checkout', checkAdmin, checkcart, (req, res) => {
    User.findOne({
        id: req.session.iduser
    }).then((user_using) => {
        data_session_cart = filtercart(req.session.cart);
        async function get_data_car() {
            var cart = [];
            for (let i = 0; i < data_session_cart.length; i++) {
                let getdata = await infor_app_admin.findOne({
                    idApp: data_session_cart[i].id
                }).exec();
                cart.push({
                    cart: getdata,
                    count: data_session_cart[i].count
                })
            }
            res.render('./checkout/checkout', {
                title: 'Checkout',
                cart,
                user: user_using,
                appuse: "",
            });
        }
        get_data_car();
    })
});

router.post("/add-product-cart", checkAdmin, checkcart, (req, res) => {
    req.session.cart.push(req.body.idApp);
    console.log(req.session.cart)
    res.json({
        Status: "1",
        message: "ok"
    })
})
router.post("/remove-product-cart", checkAdmin, checkcart, (req, res) => {
    var i = req.session.cart.indexOf(req.body.idApp);
    if (i != -1) {
        req.session.cart.splice(i, 1);
    }
    console.log(req.session.cart)
    res.json({
        Status: "1",
        message: "ok"
    })
})

router.post('/test/data', (req, res) => {
    console.log("product:");
    console.log(req.body);
});
module.exports = router;