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

var inforAppAdminModels = require('../../../models/inforappadmin');

router.get('/', (req, res) => {
    try {
        inforAppAdminModels.find({}).then((dataApps) => {
            // console.log(dataApps);
            res.render('admin/apps/index', { dataApps, moment, title: "Apps" });
        });
        // res.render('admin/apps/index', { title: "Apps" });

    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }

});

router.get('/add', (req, res) => {
    try {
        res.render('admin/apps/add', { title: "Add Apps" });

    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }
})

router.post('/enableappsmulti', (req, res) => {
    try {
        console.log(req.body);
        var arrApps = req.body.arrapps;
        if (arrApps) {
            async.forEach(arrApps, (item) => {
                console.log(item);
                inforAppAdminModels.update({ idApp: item }, { $set: { status: true } }).then(() => {
                    console.log(item);
                });
            });
            return res.json({ status: 1, msg: 'Success' });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }

});

router.post('/disableappsmulti', (req, res) => {
    try {
        console.log(req.body);
        var arrApps = req.body.arrapps;
        if (arrApps) {
            async.forEach(arrApps, (item) => {
                console.log(item);
                inforAppAdminModels.update({ idApp: item }, { $set: { status: false } }).then(() => {
                    console.log(item);
                });
            });
            return res.json({ status: 1, msg: 'Success' });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }

});

router.post('/deleteappsmulti', (req, res) => {
    try {
        console.log(req.body);
        var arrApps = req.body.arrapps;
        if (arrApps) {
            async.forEach(arrApps, (item) => {
                console.log(item);
                inforAppAdminModels.remove({ idApp: item }).then(() => {
                    console.log(item);
                });
            });
            return res.json({ status: 1, msg: 'Success' });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }

});

router.post('/enableapp', async(req, res) => {
    try {
        console.log(req.body);
        var sIdApp = req.body.idapp;
        if (sIdApp) {
            return inforAppAdminModels.findOne({ idApp: sIdApp }).then((dataFindApp) => {
                console.log('dataFindApp: ' + dataFindApp);
                if (dataFindApp) {
                    return inforAppAdminModels.update({ idApp: sIdApp }, { $set: { status: true } }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    });
                } else {
                    return res.json({ status: 3, msg: 'Not find app to enable.' });
                }
            });

        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});

router.post('/disableapp', async(req, res) => {
    try {
        console.log(req.body);
        var sIdApp = req.body.idapp;
        if (sIdApp) {
            return inforAppAdminModels.findOne({ idApp: sIdApp }).then((dataFindApp) => {
                console.log('dataFindApp: ' + dataFindApp);
                if (dataFindApp) {
                    return inforAppAdminModels.update({ idApp: sIdApp }, { $set: { status: false } }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    });
                } else {
                    return res.json({ status: 3, msg: 'Not find app to disable.' });
                }
            });

        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});

router.post('/deleteapp', async(req, res) => {
    try {
        console.log(req.body);
        var sIdApp = req.body.idapp;
        if (sIdApp) {
            return inforAppAdminModels.findOne({ idApp: sIdApp }).then((dataFindApp) => {
                console.log('dataFindApp: ' + dataFindApp);
                if (dataFindApp) {
                    return inforAppAdminModels.remove({ idApp: sIdApp }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    });
                } else {
                    return res.json({ status: 3, msg: 'Not find app to delete.' });
                }
            });

        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});
module.exports = router;