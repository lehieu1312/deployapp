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
var paypal = require("paypal-rest-sdk");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ac1YRFBQMzjwaB6QGsMxW_Z321sYjpE7l9ngSQBoaIiTfRWC-ZHH2NKvRxbqKNtNkUi08Xgz7u5IDH5X',
    'client_secret': 'EHdNlc0ANRNjgyOOI3d-0QK5AOP-Y47W7ZqMS-Wvh3afOVHig5VsIlIUPumExqSbM4p5L8rIOMAiLZZB'
});

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

router.post("/dashboard/add-to-cart", (req, res) => {
    try {
        req.session.cart.push(req.body.idApp);
        data_session_cart = filtercart(req.session.cart);
        async function get_data_car() {
            var cart = [];
            for (let i = 0; i < data_session_cart.length; i++) {
                let getdata = await infor_app_admin.findOne({
                    idApp: data_session_cart[i].id
                }).exec();
                await cart.push({
                    cart: getdata,
                    count: data_session_cart[i].count
                })
            }
            console.log(cart)
            return res.json({
                status: "1",
                cart
            })
        }
        get_data_car();
    } catch (error) {
        console.log(error + "")
    }
})


router.post("/get-cart", (req, res) => {
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
        console.log(cart)
        return res.json({
            cart
        })
    }
    get_data_car();
})

router.post("/add-product-cart", checkAdmin, checkcart, (req, res) => {
    req.session.cart.push(req.body.idApp);
    console.log(req.session.cart)
    return res.json({
        status: "1",
        message: "ok"
    })
})
router.post("/remove-product-cart", checkAdmin, checkcart, (req, res) => {
    var i = req.session.cart.indexOf(req.body.idApp);
    if (i != -1) {
        req.session.cart.splice(i, 1);
    }
    console.log(req.session.cart)
    return res.json({
        status: "1",
        message: "ok"
    })
})
router.post("/checkout/ok", (req, res) => {
    console.log("Checkout ok!")
    console.log(req.body);
    try {
        var create_payment_json = JSON.stringify({
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: hostServer + '/checkout/ok/process',
                cancel_url: hostServer + '/checkout/ok/cancel',
            },
            transactions: [{
                amount: {
                    total: req.body.total,
                    currency: 'USD'
                },
                description: 'This is the payment transaction description.'
            }]
        });
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log('loi:' + error.response);
                throw error;
            } else {
                for (var index = 0; index < payment.links.length; index++) {
                    //Redirect user to this endpoint for redirect url
                    if (payment.links[index].rel == 'approval_url') {
                        // console.log(payment.links[index].href);
                        res.redirect(payment.links[index].href)
                    }
                }

            }
        });
    } catch (error) {
        console.log(error + "");
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }


})

router.get('/checkout/ok/process', (req, res) => {
    // console.log(req.query)
    var paymentId = req.query.paymentId;
    var payerId = {
        payer_id: req.query.PayerID
    };

    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        // console.log(payment)
        if (error) {
            console.error(JSON.stringify(error));
        } else {
            // console.log(JSON.stringify(payment));
            // console.log('-----------------------------------------');
            // console.log(payment.transactions[0].related_resources[0].sale.id);
            if (payment.state == 'approved') {
                paypal.sale.get(payment.transactions[0].related_resources[0].sale.id, (err, data) => {
                    if (error) {
                        console.error(JSON.stringify(error));
                    } else {
                        console.log('--------------------+--------------------');
                        if (data.state == "completed") {
                            res.end("ban da mua duoc roi nhe.hihi :)");
                        } else {
                            res.redirect('/checkout/ok/cancel')
                        }
                        console.log(data);
                    }
                })

            } else {
                res.redirect('/cancel');
            }
        }
    })


})
router.get('/checkout/ok/cancel', (req, res) => {
    res.end("ban chua mua duoc nhe !");
});

module.exports = router;