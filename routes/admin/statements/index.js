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

var withdrawModels = require('../../../models/withdraw');
var orderModels = require('../../../models/order');





router.get('/', (req, res) => {
    try {
        var arrData = [];
        withdrawModels.find({}, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, status: 1 }).then((dataWithdraw) => {
            console.log(dataWithdraw);
            arrData.push(dataWithdraw);
            console.log(arrData);
            res.render('admin/statements/index', { moment, title: "Statements" });
        })

        // membershipModels.find().sort({ dateCreate: -1 }).then((dataMemberShipModels) => {
        //     res.render('admin/statements/index', { dataMemberShipModels, moment, title: "Statements" });
        // });

    } catch (error) {
        console.log(error);
        return res.render('error', { error, title: 'Page Error' });
    }
});


module.exports = router;