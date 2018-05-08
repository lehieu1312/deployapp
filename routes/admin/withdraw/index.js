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

router.get('/', (req, res) => {
    try {
        res.render('admin/withdraw/index', { title: "Withdraw" });
    } catch (error) {
        console.log(error);
        return res.render('error', { error, title: 'Page Error' });
    }
});
module.exports = router;