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
var http = require('http');
var server = http.Server(app);

router.get('/checkout', (req, res) => {
    res.render('./checkout/checkout', {
        title: 'Checkout',
        appuse: "",
    });

});
module.exports = router;