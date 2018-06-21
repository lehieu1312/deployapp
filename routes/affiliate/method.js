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



function settimelocal(a){
    var d = a;
    var offset = (new Date().getTimezoneOffset() / 60) * -1;
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));
    return
}

router.get("/affiliate/payment-method", checkAdmin, (req, res) => {
    try {
        affiliate_method_modal.find({
            idUser: req.session.iduser,
            status: true
        }).then((data) => {
            console.log(data);
            console.log(data[0].dateCreate);
            res.render("./affiliate/method", {
                title: "Payment Methods",
                method: data,
                appuse: ""
            })
        })
    } catch (error) {
        console.log(error + "")
    }

})
router.get("/affiliate/payment-method/add", checkAdmin, (req, res) => {
    try {
        res.render("./affiliate/addmethod", {
            title: "Add a payment method",
            appuse: ""
        })
    } catch (error) {
        console.log(error + "")
    }

})

router.post("/affiliate/payment-method/delete", (req, res) => {
    affiliate_method_modal.remove({
        idMethod: req.body.id,
        status: true
    }).then(() => {
        res.json({
            status: "1"
        })
    })
})

router.post("/affiliate/payment-method/add/ok", (req, res) => {
    try {
        console.log("++++++++++++++++++++payment-method+++++++++++++++++++++++")
        if (req.body.method == "paypal") {
            affiliate_method_modal.findOne({
                method: "paypal",
                idUser: req.session.iduser,
                status: true
            }).then(method_user => {
                if (method_user) {
                    affiliate_method_modal.update({
                        method: "paypal",
                        idUser: req.session.iduser,
                        status: true
                    }, {
                        accountNumber: req.body.accountNumber,
                        dateUpdate: new Date()
                    }).then(() => {
                        return res.json({
                            status: "1"
                        })
                    });
                } else {
                    let quety_method = {
                        idMethod: makeid(),
                        idUser: req.session.iduser,
                        method: "paypal",
                        accountHolder: req.session.fullname,
                        accountNumber: req.body.accountNumber,
                        bankSend: "paypal",
                        bankReceipt: "paypal",
                        bank: "paypal",
                        bankBranch: "paypal",
                        dateUpdate: new Date(),
                        dateCreate: new Date(),
                        status: true
                    };
                    var new_method = new affiliate_method_modal(quety_method);
                    new_method.save().then(() => {
                        return res.json({
                            status: "1"
                        })
                    });
                }
            })
        }

    } catch (error) {
        console.log(error + "")
    }
})



module.exports = router;