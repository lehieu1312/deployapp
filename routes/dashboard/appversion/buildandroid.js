var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var QRCode = require('qrcode');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var AppSettingModels = require('../../../models/appsettings');
var AppVersionAdminModels = require('../../../models/appversionadmin');
var AppVersionUserModels = require('../../../models/appversionuser');



router.post('/build-android-dash', multipartMiddleware, async(req, res) => {
    try {
        var mailCustomer, OU, CN, O, L, ST, C, keystore, keystore_again, alias, sKeyFolder;
        var sTypeApp, sPathRootApp, sAppName;
        var platformsApp, versionAppAdmin, idAppServerAdmin, nameFileCodeAdmin;

        req.check('platform', 'Platform is required').notEmpty();
        req.check('version', 'Version is required').notEmpty();
        req.check('idapp', 'ID App is required').notEmpty();
        req.check('confirmkeystore', 'Confirm keystore does not match the keystore.').equals(req.body.keystore);
        req.check('CN', 'First and last name is required').notEmpty();
        req.check('OU', 'Organizational unit is required').notEmpty();
        req.check('O', 'Organizational is required').notEmpty();
        req.check('L', 'City or location is required').notEmpty();
        req.check('ST', 'State or Province is required').notEmpty();
        req.check('C', 'Two-letter country is required').notEmpty();
        req.check('alias', 'Alias is required').notEmpty();
        var errors = req.validationErrors(); //req.getValidationResult();
        err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", content: errors });
        }
        platformsApp = req.body.platform;
        versionAppAdmin = req.body.version;
        idAppServerAdmin = req.body.idapp;
        OU = req.body.OU;
        CN = req.body.CN;
        O = req.body.O;
        L = req.body.L;
        ST = req.body.ST;
        C = req.body.C;
        // keystore = req.body.keystore,
        keystore_again = req.body.confirmKeystore;
        alias = req.body.alias;
        // sKeyFolder = req.body.cKeyFolder;
        console.log(idAppServerAdmin);
        console.log(versionAppAdmin);
        //{ inforAppversion: { $elemMatch: { version: versionAppAdmin } }
        AppVersionAdminModels.findOne({ idApp: idAppServerAdmin }, { inforAppversion: { $elemMatch: { version: versionAppAdmin } } }).then((dataAppVersionAdmin) => {
            console.log('dataAppVersionAdmin: ' + dataAppVersionAdmin);
            console.log('inforAppversion: ' + dataAppVersionAdmin.inforAppversion[0].version);
            console.log('nameFile: ' + dataAppVersionAdmin.inforAppversion[0].nameFile);

            // nameFileCodeAdmin = dataAppVersionAdmin.inforAppversion[0];
            // console.log('nameFileCodeAdmin: ' + nameFileCodeAdmin);
            return res.json({ status: 1, content: 'success' });
            // AppSettingModels.findOne({ idApp: idAppServerAdmin }).then((dataSettings) => {
            //     console.log(dataSettings);
            //     return res.json({ status: 1, content: 'success' });
            // });
        });

    } catch (error) {
        console.log(error);
        res.json({ status: 3, content: error + '' });
    }
})
module.exports = router;