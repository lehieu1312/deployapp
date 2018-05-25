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
        inforAppAdminModels.find().sort({ dateCreate: -1 }).then((dataApps) => {
            // console.log(dataApps);
            res.render('admin/apps/index', { dataApps, moment, title: "Apps" });
        });
        // res.render('admin/apps/index', { title: "Apps" });
    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }

});

///////Redirect page add app
router.get('/add', (req, res) => {
    try {
        res.render('admin/apps/add', { title: "Add Apps" });
    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }
})

///////////Add New App
router.post('/addapp', multipartMiddleware, async(req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);
        var imageFile = req.files.imagefile;

        req.check('appname', 'App name is required').notEmpty();
        req.check('versionapp', 'Version is required').notEmpty();
        req.check('listprice', 'List price  is not number').isInt();
        req.check('priceapp', 'Price  is not number').isInt();
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", msg: errors });
        }
        if (typeof imageFile == 'undefined') {
            return res.json({ status: "3", msg: ' File image is not empty' });
        }

        var sAppName = req.body.appname;
        var sVersionApp = req.body.versionapp;
        var sAppName = req.body.appname;
        var sListPrice = req.body.listprice;
        var sPriceApp = req.body.priceapp;
        var sDescription = req.body.description;


        var checkDataInfor = await inforAppAdminModels.findOne({ nameApp: sAppName }).exec();
        if (checkDataInfor) {
            return res.json({ status: "3", msg: 'This app already exists.' });
        }
        var nameFileImage = md5(Date.now()) + '.' + imageFile.name.split('.').pop();
        var pathIMG = path.join(appRoot, 'public', 'themes', 'img', 'appdashboard');
        var dataImageFile = fs.readFileSync(imageFile.path);
        fs.writeFileSync(path.join(pathIMG, nameFileImage), dataImageFile);

        var appNewData = new inforAppAdminModels({
            idApp: md5(Date.now()),
            idUser: [],
            nameApp: sAppName.trim(),
            image: nameFileImage,
            installed: 0,
            lastVersion: sVersionApp.trim(),
            description: sDescription.trim(),
            cost: sListPrice,
            price: sPriceApp,
            dateCreate: Date.now(),
            dateUpdate: Date.now(),
            status: true
        });
        appNewData.save().then(() => {
            res.json({ status: 1, msg: 'Success' });
        })
    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }
});


///////Redirect page EDIT app
router.get('/edit/:id', (req, res) => {
    try {
        inforAppAdminModels.findOne({ idApp: req.params.id }).then((dataApp) => {
            console.log(dataApp);
            if (dataApp) {
                res.render('admin/apps/edit', { dataApp, title: "Edit Apps" });
            } else {
                res.render('404', { title: "Page Not Found" });
            }
        });

    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }
})

///////////Edit New App
router.post('/editapp', multipartMiddleware, async(req, res) => {
    try {
        // console.log(req.body);
        // console.log(req.files);
        var imageFile = req.files.imagefile;

        req.check('idapp', 'ID app is required').notEmpty();
        req.check('appname', 'App name is required').notEmpty();
        req.check('versionapp', 'Version is required').notEmpty();
        req.check('listprice', 'List price  is not number').isInt();
        req.check('priceapp', 'Price  is not number').isInt();
        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", msg: errors });
        }

        var sIDApp = req.body.idapp;
        var sAppName = req.body.appname;
        var sVersionApp = req.body.versionapp;
        var sAppName = req.body.appname;
        var sListPrice = req.body.listprice;
        var sPriceApp = req.body.priceapp;
        var sDescription = req.body.description;

        // if (typeof imageFile == 'undefined') {
        //     return res.json({ status: "3", msg: ' File image is not empty' });
        // }

        var checkDataInfor = await inforAppAdminModels.findOne({ idApp: sIDApp }).exec();
        if (checkDataInfor) {
            console.log('---checkDataInfor---');
            console.log(checkDataInfor);
            inforAppAdminModels.findOne({ $and: [{ nameApp: sAppName.trim() }, { nameApp: { $ne: checkDataInfor.nameApp } }] }).then((datacheckExist) => {
                console.log('---datacheckExist---');
                console.log(datacheckExist);
                if (datacheckExist) {
                    return res.json({ status: "3", msg: 'This app already exists.' });
                } else {
                    var nameFileImage = "";
                    if (typeof imageFile != 'undefined' && imageFile != '') {
                        nameFileImage = md5(Date.now()) + '.' + imageFile.name.split('.').pop();
                        var pathIMG = path.join(appRoot, 'public', 'themes', 'img', 'appdashboard');
                        var dataImageFile = fs.readFileSync(imageFile.path);
                        fs.writeFileSync(path.join(pathIMG, nameFileImage), dataImageFile);
                        if (checkDataInfor.image != "")
                            if (fs.existsSync(path.join(appRoot, 'public', 'themes', 'img', 'appdashboard', checkDataInfor.image)))
                                fs.unlinkSync(path.join(appRoot, 'public', 'themes', 'img', 'appdashboard', checkDataInfor.image));
                    } else {
                        nameFileImage = checkDataInfor.image;
                    }
                    checkDataInfor.nameApp = sAppName.trim();
                    checkDataInfor.image = nameFileImage;
                    checkDataInfor.lastVersion = sVersionApp.trim();
                    checkDataInfor.description = sDescription.trim();
                    checkDataInfor.cost = sListPrice;
                    checkDataInfor.price = sPriceApp;
                    checkDataInfor.dateUpdate = Date.now();

                    checkDataInfor.save().then(() => {
                        res.json({ status: 1, msg: 'Success' });
                    });
                }
            })

        } else {
            return res.json({ status: "3", msg: 'ID app not exists.' });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }
});


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
                inforAppAdminModels.findOne({ idApp: item }).then((data) => {
                    if (data) {
                        if (fs.existsSync(path.join(appRoot, 'public', 'themes', 'img', 'appdashboard', data.image)))
                            fs.unlinkSync(path.join(appRoot, 'public', 'themes', 'img', 'appdashboard', data.image));
                        inforAppAdminModels.remove({ idApp: item }).then(() => {
                            console.log(item);
                        });
                    }
                })

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
                    if (fs.existsSync(path.join(appRoot, 'public', 'themes', 'img', 'appdashboard', dataFindApp.image)))
                        fs.unlinkSync(path.join(appRoot, 'public', 'themes', 'img', 'appdashboard', dataFindApp.image));
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