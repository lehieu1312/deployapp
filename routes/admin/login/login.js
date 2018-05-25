var express = require('express');
var router = express.Router();

var async = require('async');
var fse = require('fs-extra');
var fs = require('fs');
var md5 = require('md5');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var moment = require('moment');
var nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var libAppCountry = require('../../../lib/country');
var libCountry = libAppCountry.country;
var userModels = require('../../../models/user');
var orderModels = require('../../../models/order');
var userAdminModel = require("../../../models/useradmin");

router.get("/", (req, res) => {
    res.render("admin/login/login", {
        title: "Login"
    })
})

router.post("/tk", (req, res) => {
    userAdminModel.findOne({
        username: req.body.username
    }).then((result) => {
        if (!result) {
            return res.json({
                status: "2",
                message: "The username or password is incorrect"
            });
        } else {
            if (md5(req.body.password) == result.password) {
                if (result.status == true && result.blocked == false) {
                    req.session.iduseradmin = result.id;
                    return res.send({
                        status: "1",
                        message: "success"
                    });
                } else if (result.status == true && result.blocked == true) {
                    return res.send({
                        status: "2",
                        message: "Your account has been locked"
                    });
                } else {
                    return res.send({
                        status: "2",
                        message: "Please verify your email to log in"
                    });
                }
            } else {
                return res.send({
                    status: "2",
                    message: "The username or password is incorrect"
                });
            }
        }
    })
})

function checkAdmin(req, res, next) {
    if (req.session.iduseradmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}
module.exports = router;