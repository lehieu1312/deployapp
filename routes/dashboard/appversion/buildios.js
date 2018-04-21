var express = require('express');
var router = express.Router();
var Q = require('q'),
    mongoose = require('mongoose'),
    fse = require('fs-extra'),
    fs = require('fs'),
    path = require('path'),
    nodemailer = require('nodemailer'),
    hbs = require('nodemailer-express-handlebars'),
    spawn = require('child_process').spawn,
    spawnSync = require('child_process').spawnSync,
    crossSpawn = require('cross-spawn'),
    async = require('async'),
    http = require('http'),
    https = require('https'),
    plist = require('plist'),
    request = require('request'),
    extract = require('extract-zip'),
    multipart = require('connect-multiparty');
var zipFolder = require('zip-folder');
var Base64js = require('js-base64').Base64;

var multipartMiddleware = multipart();
var jsonfile = require('jsonfile');
var moment = require('moment');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
var multer = require('multer');

var AppSettingModels = require('../../../models/appsettings');
var AppVersionAdminModels = require('../../../models/appversionadmin');
var AppVersionUserModels = require('../../../models/appversionuser');
var tempBuildAppModels = require('../../../models/tempbuildapp');
var listBuildingModels = require('../../../models/listbuilding');
var UsersModels = require('../../../models/user');
var base64 = require('../../../lib/base64');
var libSetting = require('../../../lib/setting');
var devMode = libSetting.devMode;
var hostServer = libSetting.hostServer;
var hostIOS = libSetting.hostIOS;
var sumBuild = libSetting.totalBuilding;


router.post('/deployapp-ios-dash', multipartMiddleware, async(req, res) => {
    try {
        var provisionAdHocExtFile, cerExtFileAdHoc, provisionAppStoreExtFile, cerExtFileAppStore;
        var platformsApp, versionAppAdmin, idAppServerAdmin, nameFileCodeAdmin, idAppUser, idAppUserDecode, emailUser;
        var packageID, nameApp, versionApp, descriptionApp, emailApp, hrefApp, authApp;
        var wordpressUrl, wordpressPerPage, requestTimeOut, targetBlank, dateFormat, onesignalID, ggAnalytic, adModAndroidBanner, adModeAndroidInterstitial, adModiOsBanner, adModiOSInterstitial;
        var sTypeApp, sPathRootApp, sAppName, dLinkFileZipProject;
        var caseAll = false;
        console.log('body: ' + JSON.stringify(req.body));
        console.log('files: ' + JSON.stringify(req.files));
        req.check('platform', 'Platform is required').notEmpty();
        req.check('version', 'Version is required').notEmpty();
        req.check('idapp', 'App ID is required').notEmpty();
        req.check('idappuser', 'App ID User is required').notEmpty();
        var errors = req.validationErrors(); //req.getValidationResult();
        err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", content: errors });
        }

        var provisionAdHocFile = req.files.provisionfile_adhoc;
        var provisionAppStoreFile = req.files.provisionfile_appstore;
        var certificateFileAppStore = req.files.certificatefile_appstore;
        var certificateFileAdHoc = req.files.certificatefile_adhoc;
        var provisionAdHocName, provisionAppStoreName, certificateAdHocName, certificateAppStoreName;

        if (typeof provisionAdHocFile != 'undefined' && typeof certificateFileAdHoc != 'undefined' &&
            typeof provisionAppStoreFile != 'undefined' && typeof certificateFileAppStore != 'undefined') {
            provisionAdHocExtFile = provisionAdHocFile.name.split('.').pop();
            cerExtFileAdHoc = certificateFileAdHoc.name.split('.').pop();
            provisionAppStoreExtFile = provisionAppStoreFile.name.split('.').pop();
            cerExtFileAppStore = certificateFileAppStore.name.split('.').pop();
            provisionAdHocName = provisionAdHocFile.name;
            certificateAdHocName = certificateFileAdHoc.name;
            provisionAppStoreName = provisionAppStoreFile.name;
            certificateAppStoreName = certificateFileAppStore.name;
            if (provisionAdHocExtFile != 'mobileprovision' || provisionAppStoreExtFile != 'mobileprovision') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.mobileprovision)' });
            } else if (cerExtFileAdHoc != 'p12' || cerExtFileAppStore != 'p12') {
                return res.json({ status: "2", content: 'Please upload a file with a valid extension (*.p12)' });
            } else if (provisionAdHocFile.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + provisionAdHocFile.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (certificateFileAdHoc.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + certificateFileAdHoc.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (provisionAppStoreFile.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + provisionAppStoreFile.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else if (certificateFileAppStore.size > 5000000) {
                return res.json({ status: "2", content: 'The "' + certificateFileAppStore.name + '" is too large.Please upload a file less than or equal to 5MB' });
            } else {
                caseAll = true;
            }
        } else {
            return res.json({ status: "2", content: 'You must upload all files in "App to the Testing" section Or You must upload all files in "App to the App Store" section Or all file' });
        }

        platformsApp = req.body.platform;
        versionAppAdmin = req.body.version;
        idAppServerAdmin = req.body.idapp;
        idAppUser = req.body.idappuser;

        console.log(idAppServerAdmin);
        console.log(versionAppAdmin);
        idAppUserDecode = Base64js.decode(idAppUser);
        console.log(idAppUserDecode);
        var dataAppVersionAdmin = await AppVersionAdminModels.findOne({ idApp: idAppServerAdmin }, { inforAppversion: { $elemMatch: { version: versionAppAdmin } } }).exec();
        console.log('dataAppVersionAdmin: ' + dataAppVersionAdmin);
        console.log('inforAppversion: ' + dataAppVersionAdmin.inforAppversion[0].version);
        console.log('nameFile: ' + dataAppVersionAdmin.inforAppversion[0].nameFile);
        //////////////
        nameFileCodeAdmin = dataAppVersionAdmin.inforAppversion[0].nameFile;
        console.log('nameFileCodeAdmin: ' + nameFileCodeAdmin);
        ///////////GET VALUE APP SETTINGS//////////////////
        var dataSettings = await AppSettingModels.findOne({ idApp: idAppUser }).exec();
        console.log('dataSettings: ' + dataSettings);
        packageID = Base64js.decode(dataSettings.idApp);
        console.log(packageID);
        nameApp = dataSettings.nameApp;
        versionApp = dataSettings.version;
        descriptionApp = dataSettings.description;
        emailApp = dataSettings.emailApp;
        hrefApp = dataSettings.authHref;
        authApp = dataSettings.auth;

        wordpressUrl = dataSettings.wpUrl;
        wordpressPerPage = dataSettings.wpPerPage;
        requestTimeOut = dataSettings.requestTimeout;
        targetBlank = dataSettings.targetBlank;
        dateFormat = dataSettings.dateFormat;
        onesignalID = dataSettings.oneSignalID;
        ggAnalytic = dataSettings.ggAnalytic;
        adModAndroidBanner = dataSettings.adModAndroidBanner;
        adModeAndroidInterstitial = dataSettings.adModeAndroidInterstitial;
        adModiOsBanner = dataSettings.adModeIosBaner;
        adModiOSInterstitial = dataSettings.adModeIosInterstitial;

        ///// Get Email Of User////////
        console.log(req.session.iduser);
        var dataUser = await UsersModels.findOne({ id: req.session.iduser }).exec();
        console.log('dataUser: ' + dataUser);
        emailUser = dataUser.email;

        ////////////////////CHECK FOLDER PROJECT SOURCE APP////////////////////
        if (!fs.existsSync(path.join(appRoot, 'public', 'project', idAppUser))) {
            fs.mkdirSync(path.join(appRoot, 'public', 'project', idAppUser));
        } else {
            fse.removeSync(path.join(appRoot, 'public', 'project', idAppUser));
            fs.mkdirSync(path.join(appRoot, 'public', 'project', idAppUser));
        }
        // if (!fs.existsSync(path.join(appRoot, 'public', 'project', idAppUser, versionApp))) {
        //     fs.mkdirSync(path.join(appRoot, 'public', 'project', idAppUser, versionApp));
        // }
        if (!fs.existsSync(path.join(appRoot, 'public', 'project', idAppUser, 'inputprovision'))) {
            fs.mkdirSync(path.join(appRoot, 'public', 'project', idAppUser, 'inputprovision'));
        }
        var pathProvision = path.join(appRoot, 'public', 'project', idAppUser, 'inputprovision');

        /////////////////////////UPLOAD FILE PROVISION/////////////////////////////////
        var dataAdHoc = fs.readFileSync(provisionAdHocFile.path);
        fs.writeFileSync(path.join(pathProvision, provisionAdHocFile.name), dataAdHoc);

        var dataCertificateAdHoc = fs.readFileSync(certificateFileAdHoc.path);
        fs.writeFileSync(path.join(pathProvision, certificateFileAdHoc.name), dataCertificateAdHoc);
        var dataAppStore = fs.readFileSync(provisionAppStoreFile.path);
        fs.writeFileSync(path.join(pathProvision, provisionAppStoreFile.name), dataAppStore);

        var dataCertificateAppStore = fs.readFileSync(certificateFileAppStore.path);
        fs.writeFileSync(path.join(pathProvision, certificateFileAppStore.name), dataCertificateAppStore);

        ////////////////////////////////////FUNCTION BUILD APP////////////////////////////
        let getInfoToSendMail = (fIDUserApp) => {
                return new Promise((resolve, reject) => {
                    try {
                        // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                        var linkAppDebug, linkAppSigned, sAppName, sVersionApp, sBundleID, sEmail, sCaseFileBuildiOS;
                        tempBuildAppModels.find({ idUser: fIDUserApp }).exec((err, result) => {
                            if (err) {
                                console.log(err);
                                return reject(err + '');
                                // return res.render('error', { error: err, title: 'Error Data' });
                            }
                            console.log('res: ' + result);
                            console.log('res lenght: ' + result.length);
                            // console.log('params: ' + result.isParams);
                            if (result.length < 1) {
                                return reject('Not Find Data');
                            } else {

                                async.each(result, function(kq) {
                                    // var mang = kq.keyFolder;
                                    linkAppDebug = kq.linkIPADebug;
                                    console.log('link debug app:' + linkAppDebug);
                                    linkAppSigned = kq.linkIPAAppStore;
                                    console.log('link signed app:' + linkAppSigned);
                                    sAppName = kq.appName;
                                    console.log('app Name:' + sAppName);
                                    sVersionApp = kq.versionApp;
                                    console.log('sVersionApp:' + sVersionApp);
                                    sBundleID = kq.bundleID;
                                    console.log('sBundleID:' + sBundleID);
                                    sEmail = kq.email;
                                    console.log('sEmail:' + sEmail);
                                    sCaseFileBuildiOS = kq.caseFileBuildiOS;
                                    console.log('sCaseFileBuildiOS:' + sCaseFileBuildiOS);

                                });
                                var result = { linkDebug: linkAppDebug, linkSigned: linkAppSigned, appName: sAppName, bundleID: sBundleID, versionApp: sVersionApp, email: sEmail, caseFileBuildiOS: sCaseFileBuildiOS };
                                resolve(result);
                            }
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
            }
            /////CHECK SOURCE APP ADMIN//////////
        var pathSourceCodeAdmin = path.join(appRoot, 'public', 'sourcecodeapp', nameFileCodeAdmin);
        if (fs.existsSync(pathSourceCodeAdmin)) {

            /////////////////////EXTRACT SOURCE ADMIN/////////////////
            console.log('..........Extracting file source code admin........');
            extract(pathSourceCodeAdmin, { dir: path.join(appRoot, 'public', 'project', idAppUser) }, async function(err, zipdata) {
                if (err) {
                    console.log('Extract fail: ' + err);
                    return res.json({ status: 3, content: "Error extract file: " + err + '' });
                } else {

                    ////////Check Replace File In Setting App///////////////
                    //////Create file config.xml/////////////
                    var pathFileConfigExample = path.join(appRoot, 'public', 'project', idAppUser, 'config-example.xml');
                    var pathFileConfigMain = path.join(appRoot, 'public', 'project', idAppUser, 'config.xml');
                    if (fs.existsSync(pathFileConfigExample)) {
                        console.log('check config.');
                        var dataConfig = fs.readFileSync(pathFileConfigExample);
                        // console.log(dataConfig);
                        // console.log(packageID);
                        var resultConfig = dataConfig.toString().replace('PACKAGE_ID', packageID);
                        resultConfig = resultConfig.replace('APP_VERSION', versionApp);
                        resultConfig = resultConfig.replace('APP_NAME', nameApp);
                        resultConfig = resultConfig.replace('APP_DESCRIPTION', descriptionApp);
                        resultConfig = resultConfig.replace('APP_EMAIL', emailApp);
                        resultConfig = resultConfig.replace('AUTH_HREF', hrefApp);
                        resultConfig = resultConfig.replace('APP_AUTHOR', authApp);
                        // console.log(resultConfig);
                        fse.writeFileSync(pathFileConfigMain, resultConfig);
                        // fse.copySync(pathFileConfigExample, pathFileConfigMain);
                    }
                    ///////////////Create file setting.js///////////////////
                    var pathFileSettingExample = path.join(appRoot, 'public', 'project', idAppUser, 'src', 'assets', 'js', 'settings-example.js');
                    var pathFileSettingsMain = path.join(appRoot, 'public', 'project', idAppUser, 'src', 'assets', 'js', 'settings.js');
                    if (fs.existsSync(pathFileSettingExample)) {
                        console.log('check setting.');
                        var dataSettings = fs.readFileSync(pathFileSettingExample);
                        // console.log(dataSettings);
                        var result = dataSettings.toString().replace('WORDPRESS_URL', wordpressUrl);
                        result = result.replace('WORDPRESS_PER_PAGE', wordpressPerPage);
                        result = result.replace('REQUEST_TIMEOUT', requestTimeOut);
                        result = result.replace('OPEN_TARGET_BLANK', targetBlank);
                        result = result.replace('DATE_FORMAT', dateFormat);
                        result = result.replace('ONESIGNAL_APP_ID', onesignalID);
                        result = result.replace('GOOGLE_ANALYTICS', ggAnalytic);
                        result = result.replace('ADMOB_ANDROID_BANNER', adModAndroidBanner);
                        result = result.replace('ADMOB_ANDROID_INTERSTITIAL', adModeAndroidInterstitial);
                        result = result.replace('ADMOB_IOS_BANNER', adModiOsBanner);
                        result = result.replace('ADMOB_IOS_INTERSTITIAL', adModiOSInterstitial);
                        // console.log(result);
                        fse.writeFileSync(pathFileSettingsMain, result);

                        // var outFile = fs.writeFileSync(pathFilePrimary, result);
                    }
                    /////////////////////////////////////////////////
                    zipFolder(path.join(appRoot, 'public', 'project', idAppUser), path.join(appRoot, 'public', 'project', idAppUser + '.zip'), async function(err) {
                        if (err) {
                            console.log('oh no!', err);
                            return res.json({ status: "3", content: err + '' });
                        }
                        console.log('............................................Zip Success.....');
                        var hostName = req.headers.host;
                        console.log(hostName);
                        dLinkFileZipProject = hostServer + '/' + 'getfilezipproject-dash/' + idAppUser + "/" + versionApp;
                        var temBuildData = new tempBuildAppModels({
                            idApp: idAppUser,
                            idUser: req.session.iduser,
                            appName: nameApp,
                            version: versionApp,
                            platform: 'ios',
                            linkFileZipProject: dLinkFileZipProject,
                            dateCreate: Date.now(),
                            status: true
                        });
                        await temBuildData.save();
                        console.log('...Saved Data in DB...');
                        console.log(hostIOS);
                        request.post(hostIOS + '/build-ios-macsv-dash', { json: { idappuser: idAppUser, version: versionApp, nameapp: nameApp } }, async(err, respone, body) => {
                            if (err) {
                                console.log(err);
                                return res.json({ status: "3", content: err + '' });
                            }
                            console.log('respone: ' + JSON.stringify(respone));
                            console.log('body: ' + JSON.stringify(body));
                            console.log('body content: ' + body.content);
                            if (body.status == '1') {
                                var linkFileZipIPA, sAppName, sBundleId, sVersionApp;
                                let result = await tempBuildAppModels.find({ idUser: idAppUser }).exec();
                                if (result) {
                                    if (result.length > 0) {
                                        async.each(result, function(kq) {
                                            linkFileZipIPA = kq.linkZipIPA;
                                            console.log(linkFileZipIPA);
                                            sAppName = kq.appName;
                                            // sBundleId = kq.bundleID;
                                            // sVersionApp = kq.versionApp;
                                        });
                                    }
                                }
                                if (!fs.existsSync(path.join(appRoot, 'public', 'backupipa', idAppUser))) {
                                    fs.mkdirSync(path.join(appRoot, 'public', 'backupipa', idAppUser));
                                }
                                if (!fs.existsSync(path.join(appRoot, 'public', 'backupipa', idAppUser, versionApp))) {
                                    fs.mkdirSync(path.join(appRoot, 'public', 'backupipa', idAppUser, versionApp));
                                }
                                var linkPipe = path.join(appRoot, 'public', 'backupipa', idAppUser, versionApp, idAppUser + '.zip');
                                var file = fs.createWriteStream(linkPipe);
                                var request = http.get(linkFileZipIPA, function(response) {
                                    response.pipe(file);
                                    file.on('finish', function() {
                                        file.close();
                                        console.log('success get file');
                                        // extract(pathFileZip, { dir: path.join(appRoot, 'public', 'projectios', fKeyFolder) }, function(err) {
                                        if (fs.existsSync(path.join(appRoot, 'public', 'backupipa', idAppUser, versionApp))) {
                                            fse.removeSync(path.join(appRoot, 'public', 'backupipa', idAppUser, versionApp));
                                        }
                                        extract(linkPipe, { dir: path.join(appRoot, 'public', 'backupipa', idAppUser) }, function(err) {
                                            if (err) {
                                                console.log('Extract fail: ' + err);
                                                return res.json({ status: "3", content: "Error extract file: " + err + '' });
                                            } else {
                                                var tLinkDebug, tLinksigned, tAppName, tVersionApp, tBundleID, tEmail, tDate, mCaseFileiOS;
                                                console.log('===gEt info to send mail ===');
                                                return getInfoToSendMail(idAppUser).then((result) => {
                                                        console.log('=====Gennerate  Plist File======');
                                                        console.log(result);
                                                        tLinkDebug = result.linkDebug;
                                                        console.log(tLinkDebug);
                                                        tLinksigned = result.linkSigned;
                                                        console.log(tLinksigned);
                                                        tAppName = result.appName;
                                                        console.log(tAppName);
                                                        tVersionApp = result.versionApp;
                                                        console.log(tVersionApp);
                                                        tBundleID = result.bundleID;
                                                        console.log(tBundleID);
                                                        tEmail = result.email;
                                                        console.log(tEmail);
                                                        // mCaseFileiOS = result.caseFileBuildiOS;
                                                        // console.log(mCaseFileiOS);
                                                        // sDate = moment(kq.dateCreate).format('YYYY-MM-DD hh:mm:ss');
                                                        tDate = moment(result.dateCreate).format('YYYY-MM-DD hh:mm:ss');
                                                        console.log('tDate: ' + tDate);
                                                        return generatePlistFile(sKeyFolder, tLinkDebug, tAppName, tBundleID, tVersionApp);
                                                        // return sendLinkMail(sEmail, debug, signed, appName);
                                                    }).then(() => {
                                                        console.log('=====Update DB link install=====');
                                                        return updateLinkInstalliOS(sKeyFolder);
                                                    }).then((result) => {
                                                        console.log('===Start Send Mail====');
                                                        return sendLinkMail(tEmail, result, tLinksigned, tAppName, tDate, mCaseFileiOS);
                                                    }).then(() => {
                                                        console.log('====Build Success====');
                                                        console.log('key: ' + sKeyFolder);
                                                        return res.json({ status: '1', keyFolder: sKeyFolder, content: 'Build Success.' });
                                                    }).catch((ex) => {
                                                        console.log(ex);
                                                        if (devMode) {
                                                            return res.json({ status: "3", content: ex + '' });
                                                        } else {
                                                            return res.json({ status: "3", content: 'Oops, something went wrong' });
                                                        }
                                                    })
                                                    ///
                                            }
                                        })

                                    });

                                }).on('error', function(err) { // Handle errors
                                    fse.unlinkSync(linkPipe); // Delete the file async. (But we don't check the result)
                                    console.log('unlink: ' + err);
                                    return res.json({ status: '3', content: 'Oops - something went wrong. We were unable to deploy this app at this time. Retry.' });
                                });
                                // return res.json({ status: 1, content: 'Success' });
                            } else {
                                console.log(body.content);
                                return res.json({ status: "3", content: body.content });
                            }


                        });
                    });


                }
            });

        } else {
            return res.json({ status: 3, content: "Can't find source code from admin." });
        }

    } catch (error) {
        console.log("ERROR: " + error);
        return res.json({ status: 3, content: error + '' });
    }
});

router.post('/build-ios-macsv-dash', async(req, res) => {
    try {
        var idAppUser, versionApp, appName, sProvisionAdHocFileName, sProvisionAppStoreFileName, sCertificateAdHocFileName,
            sCertificateAppStoreFileName, sAppName, linkFileZip, sCaseFileiOs;
        var nameAdHoc, nameAppStore, nameCertificate, UUIDAdHoc, UUIDAppStore, TeamIDAdHoc, TeamIDAppStore, mailCustomer;
        idAppUser = req.body.idappuser;
        versionApp = req.body.version;
        appName = req.body.nameapp;
        console.log('vao roi');
        return res.json({ status: "1", content: 'success' });
    } catch (error) {
        console.log(error);
        return res.json({ status: '3', content: error + '' });
    }
});
module.exports = router;