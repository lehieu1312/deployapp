var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var QRCode = require('qrcode');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();



router.post('/build-android-dash', multipartMiddleware, async(req, res) => {
    try {
        var mailCustomer, OU, CN, O, L, ST, C, keystore, keystore_again, alias, sKeyFolder;
        var sTypeApp, sPathRootApp, sAppName;

        req.check('keystore', 'Keystore is required').notEmpty();
        req.check('confirmkeystore', 'Confirm keystore does not match the keystore.').equals(req.body.keystore);
        req.check('CN', 'First and last name is required').notEmpty();
        req.check('OU', 'Organizational unit is required').notEmpty();
        req.check('C', 'Organizational is required').notEmpty();
        req.check('L', 'City or location is required').notEmpty();
        req.check('ST', 'State or Province is required').notEmpty();
        req.check('C', 'Two-letter country is required').notEmpty();
        req.check('alias', 'Alias is required').notEmpty();
        var errors = req.validationErrors(); //req.getValidationResult();
        err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", content: errors + '' });
        }
        OU = req.body.OU,
            CN = req.body.CN,
            O = req.body.O,
            L = req.body.L,
            ST = req.body.ST,
            C = req.body.C,
            keystore = req.body.keystore,
            keystore_again = req.body.confirmKeystore,
            alias = req.body.alias,
            sKeyFolder = req.body.cKeyFolder;


    } catch (error) {
        res.json({ status: 1 });
    }
})
module.exports = router;