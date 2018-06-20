var express = require('express');
var router = express.Router();

var async = require('async');
var fse = require('fs-extra');
var fs = require('fs');
var path = require('path');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var moment = require('moment');
var libSetting = require('../../lib/setting');
var devMode = libSetting.devMode;

router.get('/', checkAdmin, (req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
        ];
        res.render('admin/index', { title: "Administrator" });

    } catch (error) {
        return res.render('error', { error, title: "ERROR-PAGE" });
    }
});

router.post('/getbreadcrumb', (req, res) => {
    try {
        if (req.session.breadcrumbs) {
            res.json({ status: 1, breadcrumbs: req.session.breadcrumbs });
        }
        // res.render('admin/index', { title: "Administrator" });

    } catch (error) {
        return res.json({ status: 3, error: error + '' });
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