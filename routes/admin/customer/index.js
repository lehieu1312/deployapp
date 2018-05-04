var express = require('express');
var router = express.Router();

var async = require('async');
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var moment = require('moment');

router.get('/customer', (req, res) => {
    try {
        res.render('admin/customer', { title: "Customer" });

    } catch (error) {
        return res.render('error', { error, title: "Page Error" });
    }
});


module.exports = router;