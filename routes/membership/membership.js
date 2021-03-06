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
var email_admin = libSetting.emailAdmin;
var devMode = libSetting.devMode;

var Base64 = require('js-base64').Base64;
// var crypto = require('crypto-js');
// var promise = require("promise");
var app = express();
var User = require('../../models/user');
var infor_app_admin = require('../../models/inforappadmin');
var order_modal = require("../../models/order");
var promo_code = require("../../models/promocode");
var affiliate_withdrawal_modal = require("../../models/withdraw");
var affiliate_modal = require("../../models/affiliate");
var affiliate_method_modal = require("../../models/paymentmethod");
var membership_modal = require("../../models/membership");
var notiUser_Models = require('../../models/notificationuser');

var http = require('http');
var server = http.Server(app);
var paypal = require("paypal-rest-sdk");
var country = require("../../lib/country");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'Ac1YRFBQMzjwaB6QGsMxW_Z321sYjpE7l9ngSQBoaIiTfRWC-ZHH2NKvRxbqKNtNkUi08Xgz7u5IDH5X',
    'client_secret': 'EHdNlc0ANRNjgyOOI3d-0QK5AOP-Y47W7ZqMS-Wvh3afOVHig5VsIlIUPumExqSbM4p5L8rIOMAiLZZB'
});

var plan = [{
    text: "Basic",
    plan: 1,
    money: 23,
}, {
    text: "Silver",
    plan: 2,
    money: 45,
}, {
    text: "Gold",
    plan: 3,
    money: 66,
}]

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



router.get("/membership", checkAdmin, (req, res) => {
    try {
        membership_modal.findOne({
            idUser: req.session.iduser,
            status: true
        }).then(data => {
            res.render("./membership/membership", {
                title: "Membership",
                membership: data,
                appuse: ""
            })
        })
    } catch (error) {
        console.log(error + "");
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }



})

router.post("/membership/checkout/ok", (req, res) => {
    req.session.inforMembership = req.body;
    console.log(req.body);

    var money = 0;
    if (req.session.percentSale) {
        money = plan[req.body.plan - 1].money - plan[req.body.plan - 1].money * Number(req.session.percentSale) / 100;
    } else {
        money = plan[req.body.plan - 1].money;
    }
    var create_payment_json = JSON.stringify({
        intent: 'sale',
        payer: {
            payment_method: 'paypal'
        },
        redirect_urls: {
            return_url: hostServer + '/membership/checkout/ok/process',
            cancel_url: hostServer + '/membership/checkout?plan=' + req.body.plan,
        },
        transactions: [{
            amount: {
                total: money,
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

router.get('/membership/checkout/ok/process', (req, res) => {
    if (req.session.percentSale) {
        money = plan[req.session.inforMembership.plan - 1].money - plan[req.session.inforMembership.plan - 1].money * Number(req.session.percentSale) / 100
    } else {
        money = plan[req.session.inforMembership.plan - 1].money
    }
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
                        var new_date = new Date();
                        var expire_Day = new_date;
                        expire_Day.setDate(new_date.getDate() + 30);

                        User.findOne({
                            id: req.session.iduser,
                            status: true
                        }).then((user_meber) => {
                            membership_modal.findOne({
                                idUser: req.session.iduser,
                                blocked: false,
                                status: true
                            }).then((member) => {
                                if (member) {
                                    membership_modal.update({
                                        idUser: req.session.iduser,
                                        blocked: false,
                                        status: true
                                    }, {
                                        dateUpdate: new Date(),
                                        expireDay: expire_Day,
                                        isMember: req.session.inforMembership.plan,
                                        amount: money,
                                        lastname: req.session.inforMembership.lastname,
                                        firstname: req.session.inforMembership.firstname,
                                        username: user_meber.username,
                                        email: req.session.inforMembership.email,
                                    }).then(() => {
                                        req.session.percentSale = null;
                                        res.redirect("/membership")
                                    })
                                } else {
                                    var new_membership = new membership_modal({
                                        id: makeid(),
                                        idUser: req.session.iduser,
                                        lastname: req.session.inforMembership.lastname,
                                        firstname: req.session.inforMembership.firstname,
                                        username: user_meber.username,
                                        email: req.session.inforMembership.email,
                                        isMember: req.session.inforMembership.plan,
                                        amount: money,
                                        dateCreate: new Date(),
                                        dateUpdate: new Date(),
                                        expireDay: expire_Day,
                                        blocked: false,
                                        status: true
                                    })
                                    new_membership.save().then(() => {
                                        req.session.percentSale = null;
                                        res.redirect("/membership")
                                    })
                                }
                            })
                        })

                    }
                })
            } else {
                res.redirect("/checkout")
            }
        }
    })
})

router.get("/membership/checkout", checkAdmin, (req, res) => {
    try {

        if (req.query.plan) {
            if (req.query.plan == 1 || req.query.plan == 2 || req.query.plan == 3) {
                User.findOne({
                    id: req.session.iduser,
                    status: true
                }).then((user_using) => {
                    res.render('./membership/checkout', {
                        title: 'Checkout',
                        plan: plan[req.query.plan - 1],
                        user: user_using,
                        appuse: "",

                    })
                })
            } else {
                res.redirect("/membership")
            }
        } else {
            res.redirect("/membership")
        }
    } catch (error) {
        console.log(error + "");
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }


})

router.get("/notification", checkAdmin, (req, res) => {
    try {
        notiUser_Models.find({
            idUser: req.session.iduser
        })
        .sort({dateCreate: -1})
        .then((all_noti) => {
            res.render("./notificationuser/notification", {
                title: "Notification",
                appuse: "",
                noti: all_noti
            })
        })
    } catch (error) {
        console.log(error + "");
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }

})

router.get('/notification/:id', checkAdmin, (req, res) => {
    try {
        notiUser_Models.findOneAndUpdate({
            id: req.params.id
        }, {
            status: true
        }, (err, noti) => {
            if (err) throw err;
            res.render("./notificationuser/detailnotification", {
                title: "Detail Notification",
                appuse: "",
                noti: {
                    id: noti.id,
                    title: noti.title,
                    content: noti.content.split("\n"),
                    dateCreate: noti.dateCreate,
                }
            })
        })
    } catch (error) {
        console.log(error + "");
        res.render("error", {
            title: "Error",
            error: error + ""
        })
    }
})


router.post('/notification/delete-noti/ok', (req, res) => {
    try {
        console.log(req.body);
        console.log(req.body.id);
        async function deletenoti() {
            for (let i = 0; i < req.body.id.length; i++) {
                await notiUser_Models.remove({
                    id: req.body.id[i]
                }).exec()
            }
            await res.json({
                status: 1,
                message: "ok"
            });
        }
        deletenoti();
    } catch (error) {
        console.log(error + "");
    }
})


module.exports = router;