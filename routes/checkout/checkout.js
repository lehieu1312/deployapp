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
var base64_custom = require('../../lib/base64');

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
var infor_app_user = require('../../models/inforapp');
var app_setting = require('../../models/appsettings');

var affiliate_modal = require("../../models/affiliate")
var order_modal = require("../../models/order");
var promo_code = require("../../models/promocode")
var http = require('http');
var server = http.Server(app);
var paypal = require("paypal-rest-sdk");
var country = require("../../lib/country");


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

router.get('/checkout', checkAdmin, checkcart, (req, res) => {
    User.findOne({
        id: req.session.iduser,
        status: true
    }).then((user_using) => {
        var data_session_cart = filtercart(req.session.cart);
        async function get_data_car() {
            var cart = [];
            for (let i = 0; i < data_session_cart.length; i++) {
                let getdata = await infor_app_admin.findOne({
                    idApp: data_session_cart[i].id,
                    status: true
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
        var data_session_cart = filtercart(req.session.cart);
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
    var data_session_cart = filtercart(req.session.cart);
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

router.post("/checkout/check-promo-code", (req, res) => {
    promo_code.findOne({
        promoCode: req.body.promoCode,
        status: true,
        dateCreate: {
            $lt: new Date()
        },
        dateExpiration: {
            $gt: new Date()
        },
    }).then((data) => {
        // console.log("data:" + JSON.stringify(data))
        if (data != null) {
            req.session.percentSale = data.percentSale;
            res.json({
                status: "1",
                message: data.percentSale
            })
        } else {
            req.session.percentSale = null;
            res.json({
                status: "2",
                message: "invalid promotional code or used expires"
            })
        }
    })
})

// res.cookie('codesharedeployapp', "abc", {
//     expires: new Date() + 2592000000,
//     maxAge: 2592000000
// })

router.post("/checkout/ok", (req, res) => {
    try {
        // console.log(req.body)
        req.session.inforCheckout = req.body;

        function get_total_price() {
            return new Promise((resolve, reject) => {
                let data_session_cart = filtercart(req.session.cart);
                (async () => {
                    let total = 0;
                    for (let i = 0; i < data_session_cart.length; i++) {
                        let getdata = await infor_app_admin.findOne({
                            idApp: data_session_cart[i].id
                        }).exec();
                        total = total + Number(getdata.price) * data_session_cart[i].count;
                    }
                    if (req.session.percentSale != null) {
                        resolve(Math.round(total - total * Number(req.session.percentSale) / 100));
                    } else {
                        resolve(Math.round(total));
                    }
                })()
            })

        }

        get_total_price()
            .then((amount_total) => {
                console.log("amount:" + amount_total);
                var create_payment_json = JSON.stringify({
                    intent: 'sale',
                    payer: {
                        payment_method: 'paypal'
                    },
                    redirect_urls: {
                        return_url: hostServer + '/checkout/ok/process',
                        cancel_url: hostServer + '/checkout',
                    },
                    transactions: [{
                        amount: {
                            total: amount_total,
                            currency: 'USD'
                        },
                        description: 'Payments from deployapp.net.'
                    }]
                });
                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        console.log('loi:' + JSON.stringify(error.response));
                        throw error;
                    } else {
                        for (var index = 0; index < payment.links.length; index++) {
                            //Redirect user to this endpoint for redirect url
                            if (payment.links[index].rel == 'approval_url') {
                                return res.json({
                                    status: "1",
                                    message: payment.links[index].href
                                })
                            }
                        }

                    }
                });
            })
    } catch (error) {
        console.log(error + "");
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }


})


router.get('/checkout/ok/process', (req, res) => {
    var paymentId = req.query.paymentId;
    var payerId = {
        payer_id: req.query.PayerID
    };
    paypal.payment.execute(paymentId, payerId, function (error, payment) {
        // console.log(payment)
        if (error) {
            console.error(JSON.stringify(error));
        } else {
            if (payment.state == 'approved') {
                paypal.sale.get(payment.transactions[0].related_resources[0].sale.id, (err, data) => {
                    if (error) {
                        console.error(JSON.stringify(error));
                    } else {
                        // console.log('--------------------+--------------------');
                        // if (data.state == "completed") {
                        console.log("data checkout: " + JSON.stringify(data))
                        async function get_data_car() {
                            var product = [];
                            var code_order = makeid();
                            let data_session_cart = await filtercart(req.session.cart);
                            console.log("data json:" + JSON.stringify(data_session_cart));
                            for (let i = 0; i < data_session_cart.length; i++) {
                                let getdata = await infor_app_admin.findOne({
                                    idApp: data_session_cart[i].id
                                }).exec();
                                product[i] = {
                                    idProduct: getdata.idApp,
                                    countProduct: data_session_cart[i].count,
                                    nameProduct: getdata.nameApp,
                                    imageProduct: getdata.image,
                                    price: getdata.price
                                }
                                await infor_app_admin.update({
                                    idApp: data_session_cart[i].id
                                }, {
                                    installed: getdata.installed + data_session_cart[i].count
                                }).exec();
                                for (let j = 0; j < data_session_cart[i].count; j++) {
                                    let id_inforapp = "com.taydo.app" + Date.now();

                                    await User.update({
                                        id: req.session.iduser,
                                        status: true
                                    }, {
                                        "$push": {
                                            myapp: {
                                                idApp: base64_custom.Base64.encode(id_inforapp),
                                                nameApp: getdata.nameApp,
                                                status: true
                                            }
                                        }
                                    }).exec();

                                    var new_infor_app_user = new infor_app_user({
                                        idApp: base64_custom.Base64.encode(id_inforapp),
                                        idUser: [{
                                            idUser: req.session.iduser,
                                            dateAdded: new Date(),
                                            role: 1,
                                            status: true
                                        }],
                                        idAppAdmin: getdata.idApp,
                                        nameApp: getdata.nameApp,
                                        dateCreate: new Date(),
                                        status: true
                                    })
                                    await new_infor_app_user.save();

                                    var new_app_setting = new app_setting({
                                        idApp: base64_custom.Base64.encode(id_inforapp),
                                        idUser: req.session.iduser,
                                        dateCreate: new Date(),
                                        status: true
                                    })
                                    await new_app_setting.save();
                                }
                            }

                            var id_order = md5(new Date());

                            var user_checkout = await User.findOne({
                                id: req.session.iduser,
                                status: true
                            }).exec()

                            console.log("product:" + JSON.stringify(product))
                            var queryCheckout = await Object.assign({
                                id: id_order,
                                codeOrder: code_order,
                                idUser: req.session.iduser,
                                productInformation: product,
                                amount: data.amount.total,
                                username: user_checkout.username,
                                paymentMethod: "paypal",
                                statusOrder: data.state,
                                dateCreate: new Date(),
                                isOrder: true,
                                status: true
                            }, req.session.inforCheckout);
                            // if(req.cookies.codesharedeployapp)

                            var new_order = new order_modal(queryCheckout);


                            await new_order.save().then(() => {
                                if (req.cookies.codesharedeployapp) {
                                    User.findOne({
                                        codeShare: req.cookies.codesharedeployapp.code,
                                        status: true
                                    }).then((user_share) => {
                                        if (user_share) {
                                            affiliate_modal.find({
                                                codeShare: req.cookies.codesharedeployapp.code,
                                                idUser: user_share.id
                                            }).sort({
                                                dateCreate: -1
                                            }).then((affiliate_old) => {
                                                if (affiliate_old.length > 0) {
                                                    var new_affiliate = new affiliate_modal({
                                                        id: md5(new Date()),
                                                        idUser: user_share.id,
                                                        username: user_checkout.username,
                                                        codeShare: req.cookies.codesharedeployapp.code,
                                                        idOrder: id_order,
                                                        codeOrder: code_order,
                                                        orderMoney: data.amount.total,
                                                        percentSale: 1,
                                                        money: (data.amount.total / 100).toFixed(2),
                                                        blance: Number(affiliate_old[0].blance) + Number((data.amount.total / 100).toFixed(2)),
                                                        idUserOroder: req.session.iduser,
                                                        nameUserOrder: req.session.fullname,
                                                        paymentMethodOrder: "paypal",
                                                        note: "note deploy",
                                                        dateCreate: new Date(),
                                                        status: true
                                                    })
                                                    new_affiliate.save().then(() => {
                                                        delete req.session.percentSale;
                                                        req.session.cart = [];
                                                        res.redirect("/dashboard?checkout=ok")
                                                    });
                                                } else {
                                                    var new_affiliate = new affiliate_modal({
                                                        id: md5(new Date()),
                                                        idUser: user_share.id,
                                                        codeShare: req.cookies.codesharedeployapp.code,
                                                        idOrder: id_order,
                                                        codeOrder: code_order,
                                                        orderMoney: data.amount.total,
                                                        percentSale: 1,
                                                        money: Number((data.amount.total / 100).toFixed(2)),
                                                        blance: Number((data.amount.total / 100).toFixed(2)),
                                                        idUserOroder: req.session.iduser,
                                                        nameUserOrder: req.session.fullname,
                                                        paymentMethodOrder: "paypal",
                                                        note: "note deploy",
                                                        dateCreate: new Date(),
                                                        status: true
                                                    })
                                                    new_affiliate.save().then(() => {
                                                        delete req.session.percentSale;
                                                        req.session.cart = [];
                                                        res.redirect("/dashboard?checkout=ok")
                                                    });
                                                }

                                            })
                                        } else {
                                            req.session.percentSale = null;
                                            req.session.cart = [];
                                            res.redirect("/dashboard?checkout=ok")
                                        }
                                    })
                                } else {
                                    req.session.percentSale = null;
                                    req.session.cart = [];
                                    res.redirect("/dashboard?checkout=ok")
                                }
                            })
                        }
                        get_data_car();
                    }
                })
            } else {
                res.redirect("/checkout")
            }
        }
    })
})

router.post("/remove-product-all-in-cart", (req, res) => {
    req.session.cart = req.session.cart.filter((el) => {
        return el != req.body.idApp
    })

    res.json({
        status: "1"
    })
})

router.post("/delete/promo-code", (req, res) => {

    function get_total_price() {
        return new Promise((resolve, reject) => {
            let data_session_cart = filtercart(req.session.cart);
            (async () => {
                let total = 0;
                for (let i = 0; i < data_session_cart.length; i++) {
                    let getdata = await infor_app_admin.findOne({
                        idApp: data_session_cart[i].id
                    }).exec();
                    total = total + Number(getdata.price) * data_session_cart[i].count;
                }
                resolve(Math.round(total));
            })()
        })

    }
    get_total_price()
        .then((data) => {
            req.session.percentSale = null;
            res.json({
                status: "1",
                message: data
            })
        })
})


module.exports = router;