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
var appVersionAdminModels = require('../../../models/appversionadmin');

////////////////Index apps
router.get('/', checkAdmin, (req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
            { name: "Apps", url: "admin/apps" }
        ];
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
router.get('/add', checkAdmin, (req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
            { name: "Apps", url: "admin/apps" },
            { name: "Add", url: "admin/apps/add" }
        ];
        res.render('admin/apps/add', { title: "Add Apps" });
    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }
})

///////////Add New App
router.post('/addapp', checkAdmin, multipartMiddleware, async(req, res) => {
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
router.get('/edit/:id', checkAdmin, (req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
            { name: "Apps", url: "admin/apps" },
            { name: "Edit", url: "admin/apps/edit/" + req.params.id }
        ];
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
router.post('/editapp', checkAdmin, multipartMiddleware, async(req, res) => {
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

////////
router.post('/enableappsmulti', checkAdmin, (req, res) => {
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

router.post('/disableappsmulti', checkAdmin, (req, res) => {
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

router.post('/deleteappsmulti', checkAdmin, (req, res) => {
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

router.post('/enableapp', checkAdmin, async(req, res) => {
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

router.post('/disableapp', checkAdmin, async(req, res) => {
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

router.post('/deleteapp', checkAdmin, async(req, res) => {
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
/////////////////////////////////////////   APP   VerSion  /////////////////////////////////////////////////


////////////////Index appversion
router.get('/version/:idApp', checkAdmin, (req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
            { name: "Apps", url: "admin/apps" },
            { name: "Version", url: "admin/apps/version/" + req.params.idApp }
        ];
        var sIDApp = req.params.idApp;

        appVersionAdminModels.findOne({ idApp: sIDApp }).sort({ dateCreate: -1 }).then((dataAppVersion) => {
            res.render('admin/appversion/index', { dataAppVersion, sIDApp, moment, title: "Version Apps" });
        });
        // res.render('admin/apps/index', { title: "Apps" });
    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }

});

////////////////GEt Add Appversion /////////////////
router.get('/version/add/:idApp', checkAdmin, async(req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
            { name: "Apps", url: "admin/apps" },
            { name: "Version", url: "admin/apps/version/" + req.params.idApp },
            { name: "Add", url: "admin/apps/version/add/" + req.params.idApp }
        ];
        var sIDApp = req.params.idApp;
        var checkAppExists = await inforAppAdminModels.findOne({ idApp: sIDApp }).exec();
        res.render('admin/appversion/add', { sIDApp, appName: checkAppExists.nameApp, title: "Add Version Apps" });
    } catch (error) {
        console.log(error);
        return res.render('error', { error });
    }

});
////////////////POST Add Appversion /////////////////
router.post('/version/add', checkAdmin, multipartMiddleware, async(req, res) => {
    try {
        // console.log('vao check add version');
        console.log(req.body);
        console.log(req.files);
        var appFile = req.files.appfile;

        req.check('idapp', 'ID app is required').notEmpty();
        req.check('lastversion', 'Last version is required').notEmpty();
        req.check('changelog', 'Change log is required').notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", msg: errors });
        }
        if (typeof appFile == 'undefined') {
            return res.json({ status: "3", msg: 'App file can not be empty' });
        }

        var sIDApp = req.body.idapp;
        var sVersionApp = req.body.lastversion;
        var sChangeLog = req.body.changelog;
        var checkAppExists = await inforAppAdminModels.findOne({ idApp: sIDApp }).exec();
        if (!checkAppExists) {
            return res.json({ status: 3, msg: 'ID app not exists.' });
        }
        var checkDataVersion = await appVersionAdminModels.findOne({ idApp: sIDApp, inforAppversion: { $elemMatch: { version: sVersionApp } } }).exec();
        if (checkDataVersion) {
            return res.json({ status: "3", msg: 'This version app already exists.' });
        }
        var nameFileApp = md5(Date.now()) + '.' + appFile.name.split('.').pop();
        var pathSourceApp = path.join(appRoot, 'public', 'sourcecodeapp');
        var dataAppFile = fs.readFileSync(appFile.path);
        fs.writeFileSync(path.join(pathSourceApp, nameFileApp), dataAppFile);

        var checkAppVersionExist = await appVersionAdminModels.findOne({ idApp: sIDApp }).exec();
        if (checkAppVersionExist) {
            appVersionAdminModels.update({ idApp: sIDApp }, {
                $push: {
                    inforAppversion: {
                        id: md5(Date.now()),
                        version: sVersionApp,
                        changeLog: sChangeLog,
                        createDate: Date.now(),
                        updatedDate: Date.now(),
                        nameFile: nameFileApp,
                        isDeployed: false,
                        status: true
                    }
                }
            }, {
                safe: true,
                upsert: true
            }).then(() => {
                res.json({ status: 1, msg: 'Success' });
            })
        } else {
            var dataVersionApp = new appVersionAdminModels({
                id: md5(Date.now()),
                idApp: sIDApp,
                nameApp: checkAppExists.nameApp,
                inforAppversion: [{
                    id: md5(Date.now() + 1),
                    version: sVersionApp,
                    changeLog: sChangeLog,
                    createDate: Date.now(),
                    updatedDate: Date.now(),
                    nameFile: nameFileApp,
                    isDeployed: false,
                    status: true
                }],
                image: '',
                dateCreate: Date.now(),
                status: true
            });
            dataVersionApp.save().then(() => {
                res.json({ status: 1, msg: 'Success' });
            })
        }
        // var sIDApp = req.params.idApp;

        // res.render('admin/apps/index', { title: "Apps" });
    } catch (error) {
        console.log(error);
        return res.json({ status: 1, mag: error + '' });
    }

});

//////////////// Enable Multi app version//////
router.post('/version/enablemultiversion', checkAdmin, (req, res) => {
    try {
        console.log(req.body);
        var arrApps = req.body.arrapps;
        var sIDApp = req.body.idapp;
        if (arrApps && sIDApp) {
            async.forEach(arrApps, (item) => {
                console.log(item);

                appVersionAdminModels.updateOne({ idApp: sIDApp, "inforAppversion.id": item }, { $set: { "inforAppversion.$.status": true } }).then(() => {
                    console.log('Update disable multi success');
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

//////////////// Disable Multi app version//////
router.post('/version/disablemultiversion', checkAdmin, (req, res) => {
    try {
        console.log(req.body);
        var arrApps = req.body.arrapps;
        var sIDApp = req.body.idapp;
        if (arrApps && sIDApp) {
            async.forEach(arrApps, (item) => {
                console.log(item);

                appVersionAdminModels.updateOne({ idApp: sIDApp, "inforAppversion.id": item }, { $set: { "inforAppversion.$.status": false } }).then(() => {
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



//////////////// Enable Multi app version//////
router.post('/version/deletemultiversion', checkAdmin, (req, res) => {
    try {
        console.log(req.body);
        var arrApps = req.body.arrapps;
        var sIDApp = req.body.idapp;
        if (arrApps && sIDApp) {
            async.forEach(arrApps, async(item) => {
                console.log(item);
                var dataVersion = await appVersionAdminModels.findOne({ idApp: sIDApp }, { inforAppversion: { $elemMatch: { id: item } } }).exec();
                console.log('dataVersion');
                console.log(dataVersion.inforAppversion[0].nameFile);
                if (dataVersion.inforAppversion[0].nameFile != '') {
                    if (fs.existsSync(path.join(appRoot, 'public', 'sourcecodeapp', dataVersion.inforAppversion[0].nameFile))) {
                        fs.unlinkSync(path.join(appRoot, 'public', 'sourcecodeapp', dataVersion.inforAppversion[0].nameFile));
                    }
                }
                appVersionAdminModels.updateOne({ idApp: sIDApp }, { $pull: { inforAppversion: { id: item } } }).then(() => {
                    console.log('Delete multi success');
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



//////////////// Enable version app//////
router.post('/version/enableversion', checkAdmin, (req, res) => {
    try {
        console.log(req.body);
        var idVersion = req.body.idversion;
        var sIDApp = req.body.idapp;
        if (idVersion && sIDApp) {
            appVersionAdminModels.updateOne({ idApp: sIDApp, "inforAppversion.id": idVersion }, { $set: { "inforAppversion.$.status": true } }).then(() => {
                return res.json({ status: 1, msg: 'Success' });
            });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }

});


//////////////// Enable version app//////
router.post('/version/disableversion', checkAdmin, (req, res) => {
    try {
        console.log(req.body);
        var idVersion = req.body.idversion;
        var sIDApp = req.body.idapp;
        if (idVersion && sIDApp) {
            appVersionAdminModels.updateOne({ idApp: sIDApp, "inforAppversion.id": idVersion }, { $set: { "inforAppversion.$.status": false } }).then(() => {
                return res.json({ status: 1, msg: 'Success' });
            });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }

});


//////////////// Enable version app//////
router.post('/version/deleteversion', checkAdmin, async(req, res) => {
    try {
        console.log(req.body);
        var idVersion = req.body.idversion;
        var sIDApp = req.body.idapp;
        if (idVersion && sIDApp) {
            var dataVersion = await appVersionAdminModels.findOne({ idApp: sIDApp }, { inforAppversion: { $elemMatch: { id: idVersion } } }).exec();
            console.log('dataVersion');
            console.log(dataVersion.inforAppversion[0].nameFile);
            if (dataVersion.inforAppversion[0].nameFile != '') {
                if (fs.existsSync(path.join(appRoot, 'public', 'sourcecodeapp', dataVersion.inforAppversion[0].nameFile))) {
                    fs.unlinkSync(path.join(appRoot, 'public', 'sourcecodeapp', dataVersion.inforAppversion[0].nameFile));
                }
            }
            appVersionAdminModels.updateOne({ idApp: sIDApp }, { $pull: { inforAppversion: { id: idVersion } } }).then(() => {
                return res.json({ status: 1, msg: 'Success' });
            });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
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