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
var membershipModels = require('../../../models/membership');
var sendNotiUserModels = require('../../../models/notificationuser');

router.get('/', checkAdmin, (req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
            { name: "Membership", url: "admin/membership" }
        ];
        membershipModels.find().sort({ dateCreate: -1 }).then((dataMemberShipModels) => {
            res.render('admin/membership/index', { dataMemberShipModels, moment, title: "Membership" });
        });

    } catch (error) {
        console.log(error);
        return res.render('error', { error, title: 'Page Error' });
    }
});

router.post('/send-noti-to-user', checkAdmin, multipartMiddleware, (req, res) => {
    try {
        console.log(req.body);
        req.checkBody('iduser', 'ID user not defined').notEmpty();
        req.checkBody('title', 'Title can not be empty').notEmpty();
        req.checkBody('content', 'Content can not be empty').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            return res.json({ status: 2, msg: errors });
        } else {
            var sDate = Date.now();
            var sID = md5(Date.now());
            var notificationUserData = new sendNotiUserModels({
                id: sID,
                idUser: req.body.iduser,
                title: req.body.title,
                content: req.body.content,
                dateCreate: sDate,
                statusNoti: false,
                status: true
            });
            return notificationUserData.save().then(() => {
                return sendNotiUserModels.find({
                    idUser: req.body.iduser,
                    status: false
                }).count();
            }).then((datanumber) => {
                console.log('datanumber: ' + datanumber);
                return req.io.sockets.emit('notification-' + req.body.iduser, {
                    id: sID,
                    title: req.body.title,
                    content: req.body.content,
                    date: sDate
                });
            }).then(() => {
                return res.json({ status: 1, msg: "Send success to user." });
            })
        }

        // 

        // withDrawModels.find().then((dataWithdraw) => {
        //     res.render('admin/withdraw/index', { dataWithdraw, moment, title: "Withdraw" });
        // });

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
        // return res.render('error', { error, title: 'Page Error' });
    }
});

function checkAdmin(req, res, next) {
    if (req.session.iduseradmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}
module.exports = router;