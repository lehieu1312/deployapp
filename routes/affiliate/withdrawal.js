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
var http = require('http');
var server = http.Server(app);
var paypal = require("paypal-rest-sdk");
var country = require("../../lib/country");
var affiliate_method_modal = require("../../models/paymentmethod");




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

router.get("/affiliate/withdrawal", checkAdmin, (req, res) => {
    User.findOne({
        id: req.session.iduser,
        status: true
    }).then(user => {
        affiliate_withdrawal_modal.find({
            idUser: req.session.iduser,
            status: true
        }).sort({
            dateCreate: -1
        }).then((data) => {
            if (data.length > 0) {
                res.render('./affiliate/withdrawal', {
                    title: 'Withdrawal',
                    money: data[0].blance,
                    user,
                    appuse: "",
                });
            } else {
                affiliate_modal.find({
                    idUser: req.session.iduser,
                    status: true
                }).sort({
                    dateCreate: -1
                }).then((data_affiliate) => {
                    if (data_affiliate.length > 0) {
                        res.render('./affiliate/withdrawal', {
                            title: 'Withdrawal',
                            money: data_affiliate[0].blance,
                            user,
                            appuse: "",
                        });
                    } else {
                        res.render('./affiliate/withdrawal', {
                            title: 'Withdrawal',
                            money: 0,
                            user,
                            appuse: "",
                        });
                    }

                })
            }
        })
    })

})

var sendLinkMail = (emailReceive, name, money) => {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({ // config mail server
            host: 'smtp.gmail.com',
            // port:'465',
            auth: {
                user: 'no-reply@taydotech.com',
                pass: 'taydotech!@#deployapp'
            }
        });
        transporter.use('compile', hbs({
            viewPath: path.join(appRoot, 'views'),
            extName: '.ejs'
        }));
        var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'TayDoTech Team',
            to: emailReceive,
            subject: 'Withdrawal Deployapp',
            template: './affiliate/mailwithdrawal',
            context: {
                name,
                money
            }
        }
        transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
                return reject(err);
            }
            resolve('Message sent: ' + info.response);

        });
    });
}

router.post("/affiliate/withdrawal/ok", (req, res) => {
    try {
        function getBalance() {
            return new Promise((resolve, reject) => {
                affiliate_withdrawal_modal.find({
                    idUser: req.session.iduser,
                    status: true
                }).sort({
                    dateCreate: -1
                }).then((data) => {
                    if (data.length > 0) {
                        resolve(data[0].blance);
                    } else {
                        affiliate_modal.find({
                            idUser: req.session.iduser,
                            status: true
                        }).sort({
                            dateCreate: -1
                        }).then((data_affiliate) => {
                            if (data_affiliate.length > 0) {
                                resolve(data_affiliate[0].blance);
                            } else {
                                resolve(0);
                            }
                        })
                    }
                })
            })
        }

        affiliate_method_modal.findOne({
            method: req.body.method,
            idUser: req.session.iduser,
            status: true
        }).then((method_payment) => {
            if (method_payment) {
                getBalance().then((balance) => {
                    User.findOne({
                        id: req.session.iduser,
                        status: true
                    }).then(user => {
                        var query = {
                            id: makeid(),
                            idUser: req.session.iduser,
                            username: user.username,
                            email: user.email,
                            codeShare: user.codeShare,
                            bankSend: req.body.method,
                            bankReceipt: req.body.method,
                            bank: req.body.method,
                            bankBranch: req.body.method,
                            accountNumber: method_payment.accountNumber,
                            accountHolder: method_payment.accountHolder,
                            fee: 3 * req.body.amount / 100,
                            amount: req.body.amount,
                            blance: Number((balance - req.body.amount - 3 * req.body.amount / 100).toFixed(1)),
                            content: "tranfer $" + req.body.amount,
                            note: req.body.note,
                            method: req.body.method,
                            dateCreate: new Date(),
                            statusWithdraw: 1,
                            isWithdraw: true,
                            status: true
                        }
                        var new_withdrawal = new affiliate_withdrawal_modal(query);

                        sendLinkMail(email_admin, req.session.fullname, req.body.amount)
                            .then(() => {
                                new_withdrawal.save().then(() => {
                                    res.json({
                                        status: "1",
                                        balance: Number((balance - req.body.amount - 3 * req.body.amount / 100).toFixed(1))
                                    })
                                })
                            })
                    })
                })
            } else {
                res.json({
                    status: "2",
                    message: "You are missing accounting information. Please enter the payment method method for more information."
                })
            }
        })



    } catch (error) {
        console.log(error + "")
    }
})




module.exports = router;