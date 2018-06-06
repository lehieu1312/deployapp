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
        console.log(idAppUser);
        // idAppUserDecode = Base64js.decode(idAppUser);
        // var dataAppVersionAdmin = await AppVersionAdminModels.findOne({ idApp: idAppServerAdmin }, { inforAppversion: { $elemMatch: { version: versionAppAdmin } } }).exec();
        // console.log('dataAppVersionAdmin: ' + dataAppVersionAdmin);
        // console.log('inforAppversion: ' + dataAppVersionAdmin.inforAppversion[0].version);
        // console.log('nameFile: ' + dataAppVersionAdmin.inforAppversion[0].nameFile);
        // //////////////
        // nameFileCodeAdmin = dataAppVersionAdmin.inforAppversion[0].nameFile;
        // console.log('nameFileCodeAdmin: ' + nameFileCodeAdmin);
        ///////////GET VALUE APP SETTINGS//////////////////
        var dataSettings = await AppSettingModels.findOne({ idApp: idAppUser }).exec();
        console.log('dataSettings: ' + dataSettings);
        packageID = Base64js.decode(dataSettings.idApp);
        console.log(packageID);
        nameApp = dataSettings.nameApp;
        versionApp = dataSettings.version;

        // descriptionApp = dataSettings.description;
        // emailApp = dataSettings.emailApp;
        // hrefApp = dataSettings.authHref;
        // authApp = dataSettings.auth;

        // wordpressUrl = dataSettings.wpUrl;
        // wordpressPerPage = dataSettings.wpPerPage;
        // requestTimeOut = dataSettings.requestTimeout;
        // targetBlank = dataSettings.targetBlank;
        // dateFormat = dataSettings.dateFormat;
        // onesignalID = dataSettings.oneSignalID;
        // ggAnalytic = dataSettings.ggAnalytic;
        // adModAndroidBanner = dataSettings.adModAndroidBanner;
        // adModeAndroidInterstitial = dataSettings.adModeAndroidInterstitial;
        // adModiOsBanner = dataSettings.adModeIosBaner;
        // adModiOSInterstitial = dataSettings.adModeIosInterstitial;

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
        // var pathSourceCodeAdmin = path.join(appRoot, 'public', 'sourcecodeapp', nameFileCodeAdmin);
        // if (fs.existsSync(pathSourceCodeAdmin)) {

        /////////////////////EXTRACT SOURCE ADMIN/////////////////
        // console.log('..........Extracting file source code admin........');
        // extract(pathSourceCodeAdmin, { dir: path.join(appRoot, 'public', 'project', idAppUser) }, async function(err, zipdata) {
        // if (err) {
        //     console.log('Extract fail: ' + err);
        //     return res.json({ status: 3, content: "Error extract file: " + err + '' });
        // } else {

        ////////Check Replace File In Setting App///////////////
        //////Create file config.xml/////////////
        // var pathFileConfigExample = path.join(appRoot, 'public', 'project', idAppUser, 'config-example.xml');
        // var pathFileConfigMain = path.join(appRoot, 'public', 'project', idAppUser, 'config.xml');
        // if (fs.existsSync(pathFileConfigExample)) {
        //     console.log('check config.');
        //     var dataConfig = fs.readFileSync(pathFileConfigExample);
        //     // console.log(dataConfig);
        //     // console.log(packageID);
        //     var resultConfig = dataConfig.toString().replace('PACKAGE_ID', packageID);
        //     resultConfig = resultConfig.replace('APP_VERSION', versionApp);
        //     resultConfig = resultConfig.replace('APP_NAME', nameApp);
        //     resultConfig = resultConfig.replace('APP_DESCRIPTION', descriptionApp);
        //     resultConfig = resultConfig.replace('APP_EMAIL', emailApp);
        //     resultConfig = resultConfig.replace('AUTH_HREF', hrefApp);
        //     resultConfig = resultConfig.replace('APP_AUTHOR', authApp);
        //     // console.log(resultConfig);
        //     fse.writeFileSync(pathFileConfigMain, resultConfig);
        //     // fse.copySync(pathFileConfigExample, pathFileConfigMain);
        // }
        ///////////////Create file setting.js///////////////////
        // var pathFileSettingExample = path.join(appRoot, 'public', 'project', idAppUser, 'src', 'assets', 'js', 'settings-example.js');
        // var pathFileSettingsMain = path.join(appRoot, 'public', 'project', idAppUser, 'src', 'assets', 'js', 'settings.js');
        // if (fs.existsSync(pathFileSettingExample)) {
        //     console.log('check setting.');
        //     var dataSettings = fs.readFileSync(pathFileSettingExample);
        //     // console.log(dataSettings);
        //     var result = dataSettings.toString().replace('WORDPRESS_URL', wordpressUrl);
        //     result = result.replace('WORDPRESS_PER_PAGE', wordpressPerPage);
        //     result = result.replace('REQUEST_TIMEOUT', requestTimeOut);
        //     result = result.replace('OPEN_TARGET_BLANK', targetBlank);
        //     result = result.replace('DATE_FORMAT', dateFormat);
        //     result = result.replace('ONESIGNAL_APP_ID', onesignalID);
        //     result = result.replace('GOOGLE_ANALYTICS', ggAnalytic);
        //     result = result.replace('ADMOB_ANDROID_BANNER', adModAndroidBanner);
        //     result = result.replace('ADMOB_ANDROID_INTERSTITIAL', adModeAndroidInterstitial);
        //     result = result.replace('ADMOB_IOS_BANNER', adModiOsBanner);
        //     result = result.replace('ADMOB_IOS_INTERSTITIAL', adModiOSInterstitial);
        //     // console.log(result);
        //     fse.writeFileSync(pathFileSettingsMain, result);

        //     // var outFile = fs.writeFileSync(pathFilePrimary, result);
        // }
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
                provisionAdHocName: provisionAdHocName,
                provisionFileAppStore: provisionFileAppStore,
                certificateFileAdHoc: certificateFileAdHoc,
                certificateFileAppStore: certificateFileAppStore,
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


        // }
        // });

        // } else {
        //     return res.json({ status: 3, content: "Can't find source code from admin." });
        // }

    } catch (error) {
        console.log("ERROR: " + error);
        return res.json({ status: 3, content: error + '' });
    }
});

router.post('/build-ios-macsv-dash', async(req, res) => {
    try {
        var sIDAppUser, sVersionApp, sAppName, sProvisionAdHocFileName, sProvisionAppStoreFileName, sCertificateAdHocFileName,
            sCertificateAppStoreFileName, linkFileZip, sCaseFileiOs;
        var nameAdHoc, nameAppStore, nameCertificate, UUIDAdHoc, UUIDAppStore, TeamIDAdHoc, TeamIDAppStore, mailCustomer;
        sIDAppUser = req.body.idappuser;
        sVersionApp = req.body.version;
        sAppName = req.body.nameapp;
        console.log('Bắt đầu build iOS');

        let result = await tempBuildAppModels.find({ idApp: sIDAppUser, version: sVersionApp, appName: sAppName }).exec();
        if (result) {
            if (result.length > 0) {
                async.each(result, function(kq) {
                    linkFileZip = kq.linkFileZipProject;
                    console.log('linkFileZip: ' + linkFileZip);
                    sProvisionAdHocFileName = kq.provisionFileAdHoc;
                    console.log('sProvisionAdHocFileName: ' + sProvisionAdHocFileName);
                    sProvisionAppStoreFileName = kq.provisionFileAppStore;
                    console.log('sProvisionAppStoreFileName: ' + sProvisionAppStoreFileName);
                    sCertificateAdHocFileName = kq.certificateFileAdHoc;
                    console.log('sCertificateAdHocFileName: ' + sCertificateAdHocFileName);
                    sCertificateAppStoreFileName = kq.certificateFileAppStore;
                    console.log('sCertificateAppStoreFileName: ' + sCertificateAppStoreFileName);
                });
            } else {
                return res.json({ status: '3', content: 'Not Find Project' });
            }
        } else {
            return res.json({ status: '3', content: 'Not Find Project' });
        }

        /////////////////////////////////////////FUNCTION///////////////////////////////

        /////////////////COMMAND LINE////////////////
        let commandLine = (cmd, optionList) => {
            return new Promise((resolve, reject) => {
                try {
                    var commandLine = crossSpawn.spawn(cmd, optionList);
                    commandLine.stdout.on('data', function(data) {
                        console.log('data out: ' + data.toString());
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                    });
                    commandLine.stderr.on('data', function(data) {
                        console.log('data error: ' + data.toString());
                        if (data instanceof Error) {
                            //console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                        if (data.toString().toLowerCase().indexOf('error') >= 0) {
                            // console.log(chalk.bold(data.toString()));
                            reject(data);
                        }
                    });
                    commandLine.on('close', function(code) {
                        if (code > 0) {
                            reject(new Error(code));
                        }
                        resolve('Success commandline.');
                    });
                } catch (error) {
                    reject(error);
                }
            })
        }

        ///////////////////////////generatesBuildJSONAdHoc/////////////
        let generatesBuildJSONAdHoc = (fUUID, fTeamID, fIDAppUser, fVersionApp) => {

            return new Promise((resolve, reject) => {
                try {
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersionApp, 'build.json'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersionApp, 'build.json'));
                    }
                    var content = {
                        "ios": {
                            "debug": {
                                "codeSignIdentity": "iPhone Development",
                                "provisioningProfile": fUUID,
                                "developmentTeam": fTeamID,
                                "packageType": "development"
                            },
                            "release": {
                                "codeSignIdentity": "iPhone Distribution",
                                "provisioningProfile": fUUID,
                                "developmentTeam": fTeamID,
                                "packageType": "ad-hoc"
                            }
                        }
                    };
                    jsonfile.writeFileSync(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersionApp, 'build.json'), content);
                    resolve('generate build success.');
                } catch (e) {
                    console.log("Cannot write file ", e + '');
                    reject(e);
                }
            })
        }

        ////////////////////////////BUILD IOS TO TEST////////////////////
        let buildiOSToTest = (fIDAppUser, fVersion, fProvisionFileAdHoc, fCertificateFileAdHoc, fAppName) => {
            return new Promise((resolve, reject) => {

                console.log('===============Security import certificate===============');
                var cmd = 'security';
                var argv = ['import', fCertificateFileAdHoc, '-P', ''];
                // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
                process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'inputprovision'));
                return commandLine(cmd, argv).then(() => {
                        console.log('===============Open Provision Ad-Hoc ===============');
                        console.log(fProvisionFileAdHoc);
                        console.log(fIDAppUser);
                        // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', adHocFileName)
                        var pathFileProvision = path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'inputprovision', fProvisionFileAdHoc);
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'inputprovision'));
                        return commandLine('open', [pathFileProvision]);
                    })
                    .then(() => {
                        console.log('======Generate Plist File Ad-Hoc=========');
                        nameProvisionAdHoc = fProvisionFileAdHoc.split('.').shift();
                        console.log('nameProvisionAdHoc: ' + nameProvisionAdHoc);
                        //security cms -D -i sunbri.mobileprovision -o sunbri.plist
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'inputprovision'));
                        return commandLine('security', ['cms', '-D', '-i', fProvisionFileAdHoc, '-o', nameProvisionAdHoc + '.plist']);
                    }).then(() => {
                        console.log('====== Read File Plist Ad-Hoc =========');
                        console.log('nameProvisionAdHoc 2: ' + nameProvisionAdHoc);
                        var pathPlistAdHoc = path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'inputprovision', nameProvisionAdHoc + '.plist');
                        return readPlistFileAdHoc(pathPlistAdHoc);
                    }).then((result) => {
                        console.log('======Generate Build JSON File=========');
                        console.log(result);
                        return generatesBuildJSONAdHoc(result.UUID, result.teamID, fIDAppUser, fVersion);
                    }).then(() => {
                        console.log('=========Building IPA to Test==========');
                        // var cmd = 'ionic';
                        var cmd = 'cordova';
                        var argvBuild = ['build', 'ios', '--device', '--release', '--buildConfig'];
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion));
                        return commandLine(cmd, argvBuild);
                    }).then(() => {
                        console.log('=========Copy File IPA to Test==========');
                        var pathDirIPA = path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion);
                        var pathCopyIPA = path.join(appRoot, 'public', 'backupipa');
                        return copyFileIPATest(pathDirIPA, pathCopyIPA, fIDAppUser, fVersion, fAppName);
                    }).then(() => {
                        console.log('log: Generate File Build Ad-Hoc Success...');
                        return resolve('Generate File Build Ad-Hoc Success...');
                    })
                    .catch((ex) => {
                        console.log(ex);
                        reject(ex);
                    })
            })
        }


        ////////////////////CHECK BUILDING IOS//////////////
        let checkBuildingiOS = (totalBuild, fIDAppUser) => {
            return new Promise((resolve, reject) => {
                try {
                    let listBuild = new listBuildingModels({
                        keyFolder: fIDAppUser,
                        platforms: 'ios',
                        dateStartBuild: Date.now()
                    });
                    listBuildingModels.save((err, result) => {
                        if (err) {
                            console.log('err save list build: ' + err);
                            reject(err);
                        }
                        // resolve('Insert building success.');
                        listBuildingModels.find({ platforms: 'ios' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                            if (err) {
                                console.log('Error find building: ' + err);
                                reject(err);
                            }
                            async.each(result, function(key) {
                                console.log('Check key: ' + key.keyFolder);
                                if (fIDAppUser == key.keyFolder) {
                                    return resolve('Key success ');
                                }
                            });
                            var CheckKeyFolderInterval = setInterval(function() {
                                listBuildingModels.find({ platforms: 'ios' }).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                                    if (err) {
                                        console.log('Error find building: ' + err);
                                        reject(err);
                                    }
                                    async.each(result, function(key) {
                                        console.log('Check key interval: ' + key.keyFolder);
                                        if (fIDAppUser == key.keyFolder) {
                                            clearInterval(CheckKeyFolderInterval);
                                            return resolve('Key success');
                                        }
                                    });
                                });
                            }, 3000)
                        });
                    });
                } catch (error) {
                    console.log('Error total check build: ' + error);
                    reject(error);
                }
            })
        }

        //////

        let extractFile = (pathFileZip, fIDAppUser) => {
                return new Promise((resolve, reject) => {
                    try {
                        console.log('start extract');
                        console.log('pathFileZip: ' + pathFileZip);
                        console.log(path.join(appRoot, 'public', 'projectios', fIDAppUser));
                        if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fIDAppUser))) {
                            fse.removeSync(path.join(appRoot, 'public', 'projectios', fIDAppUser));
                        }
                        extract(pathFileZip, { dir: path.join(appRoot, 'public', 'projectios', fIDAppUser) }, function(err) {
                            // extraction is complete. make sure to handle the err 
                            if (err) {
                                console.log('Extract fail: ' + err);
                                reject(err);
                            } else {
                                console.log('success');
                                resolve('success');
                            }
                        })
                    } catch (error) {
                        console.log(error);
                        reject(error);
                    }
                })
            }
            ///////      
        let getFileZipProject = (fileZip, fIDAppUser) => {
            return new Promise((resolve, reject) => {
                try {
                    console.log('1');
                    if (fs.exists(path.join(appRoot, 'public', 'projectios', fIDAppUser + '.zip'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', fIDAppUser + '.zip'));
                    }
                    console.log(fileZip);
                    var linkPipe = path.join(appRoot, 'public', 'projectios', fIDAppUser + '.zip');
                    var file = fs.createWriteStream(linkPipe);
                    var request = https.get(fileZip, function(response) {
                        response.pipe(file);
                        file.on('finish', function() {
                            file.close();
                            console.log('success get file');
                            resolve(linkPipe);
                        });

                    }).on('error', function(err) { // Handle errors
                        fse.unlinkSync(linkPipe); // Delete the file async. (But we don't check the result)
                        console.log('unlink: ' + err);
                        reject(err);
                    });

                } catch (error) {
                    console.log('error get file: ' + error);
                    reject(error);
                }
            })
        }

        /////////////////////////////
        let updateDB = (fIDAppUser, fVersionApp, listArgv) => {
                return new Promise((resolve, reject) => {
                    try {
                        // Infomation.findOneAndUpdate({ keyFolder: dbNameFolder }, { $set: { isParams: false } }, { upsert: false }, function(err, result) 
                        AppVersionUserModels.findOneAndUpdate({ idApp: fIDAppUser, version: fVersionApp }, { $set: listArgv }, function(err, result) {
                            if (err) {
                                reject(err);
                            }
                            listBuildingModels.remove({ keyFolder: fIDAppUser }, function(err, kq) {
                                if (err) {
                                    console.log('Error remove key building: ' + err);
                                    reject(err);
                                }
                                resolve('Update db success.');
                            })
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
            }
            ///////////////////
        let zipIPAAndUpdate = (fIDAppUser) => {
            return new Promise((resolve, reject) => {
                try {
                    zipFolder(path.join(appRoot, 'public', 'backupipa', fIDAppUser), path.join(appRoot, 'public', 'backupipa', fIDAppUser + '.zip'), function(err) {
                        if (err) {
                            console.log('oh no!', err);
                            reject(err);
                        }
                        // var hostName = req.headers.host;
                        var cLinkZipIpa = hostIOS + '/' + 'send-zipipa/' + fIDAppUser;

                        tempBuildAppModels.findOneAndUpdate({ idUser: fIDAppUser }, { $set: { linkZipIPA: cLinkZipIpa } }, function(err, result) {
                            if (err) {
                                console.log(err);
                                reject(err);
                            }
                            if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fIDAppUser))) {
                                fse.removeSync(path.join(appRoot, 'public', 'projectios', fIDAppUser));
                            }
                            if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fIDAppUser + '.zip'))) {
                                fse.removeSync(path.join(appRoot, 'public', 'projectios', fIDAppUser + '.zip'));
                            }
                            resolve('Zip success.');
                        });
                    });
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }

        ///////////////////
        let readPlistFileAdHoc = (plistFile) => {
            return new Promise((resolve, reject) => {
                try {
                    var obj = plist.parse(fs.readFileSync(plistFile, "utf8"));
                    // console.log(JSON.stringify(obj));
                    console.log(obj.UUID);
                    console.log(obj.TeamIdentifier[0]);
                    UUIDAdHoc = obj.UUID;
                    TeamIDAdHoc = obj.TeamIdentifier[0];
                    resolve({ teamID: TeamIDAdHoc, UUID: UUIDAdHoc });
                } catch (error) {
                    console.log(error);
                    reject(error + '');
                }
            })
        }

        ////////////////////////
        let copyFileIPATest = (pathProjectApp, pathBackupIPA, fIDAppUser, fVersion, fAppName) => {
            return new Promise((resolve, reject) => {
                try {
                    var pathFolder = path.join(pathBackupIPA, fIDAppUser);
                    if (!fs.existsSync(pathFolder)) {
                        fs.mkdirSync(pathFolder);
                    }
                    var pathFolderVerSion = path.join(pathBackupIPA, fIDAppUser, fVersion);
                    if (!fs.existsSync(pathFolderVerSion)) {
                        fs.mkdirSync(pathFolderVerSion);
                    }
                    var pathUnsigned = path.join(pathBackupIPA, fIDAppUser, fVersion, 'unsigned');
                    if (!fs.existsSync(pathUnsigned)) {
                        fs.mkdirSync(pathUnsigned);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', fAppName + '.ipa');
                    console.log('r: ' + rFile);
                    var wFile = path.join(pathUnsigned, fAppName + '-test.ipa');
                    console.log('w: ' + wFile);
                    fse.copy(rFile, wFile, { replace: true }, (err) => {
                        if (err) return reject(err + '');
                        resolve('Copy file apk unsign success.');
                    });
                    // const outAplication = fs.createWriteStream(path.join(path_signed, 'android-release-unsigned.apk'));
                    // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release-unsigned.apk'))
                    //     .pipe(outAplication);
                    // outAplication.on("end", resolve("copy success."));
                    // outAplication.on("error", reject('Error copy file apk.'));
                } catch (error) {
                    reject(error);
                }
            });
        }

        ///////////////
        let buildiOSToAppStore = (fIDAppUser, fVerionApp, fProvisionFileAppStore, fCertificateFileAppStore, fAppName) => {
            return new Promise((resolve, reject) => {
                console.log('===============Security import certificate===============');
                var cmd = 'security';
                var argv = ['import', fCertificateFileAppStore, '-P', ''];
                // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', certificateFileName)
                process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp, 'inputprovision'));
                return commandLine(cmd, argv).then(() => {
                        console.log('===============Open Provision App-Store ===============');
                        console.log(fProvisionFileAppStore);
                        console.log(fKeyFolder);
                        // var pathCertificateFile = path.join(appRoot, 'public', 'projectios', sKeyFolder, 'inputprovision', adHocFileName)
                        var pathFileProvision = path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp, 'inputprovision', fProvisionFileAppStore);
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp, 'inputprovision'));
                        return commandLine('open', [pathFileProvision]);
                    }).then(() => {
                        console.log('======Generate Plist File App-Store=========');
                        nameProvisionAppStore = fProvisionFileAppStore.split('.').shift();
                        console.log('nameProvisionAppStore: ' + nameProvisionAppStore);
                        //security cms -D -i sunbri.mobileprovision -o sunbri.plist
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp, 'inputprovision'));
                        return commandLine('security', ['cms', '-D', '-i', fProvisionFileAppStore, '-o', nameProvisionAppStore + '.plist']);
                    }).then(() => {
                        console.log('====== Read File Plist App-Store =========');
                        console.log('nameProvisionAppStore 2: ' + nameProvisionAppStore);
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser));
                        var pathPlistAdHoc = path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp, 'inputprovision', nameProvisionAppStore + '.plist');
                        return readPlistFileAppStore(pathPlistAdHoc);
                    }).then((result) => {
                        console.log('======Generate Build JSON File=========');
                        console.log('result: ' + result);
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp));
                        return generatesBuildJSONAppStore(result.UUID, result.teamID, fIDAppUser, fVerionApp);
                    }).then(() => {
                        console.log('=========Building IPA to App Store==========');
                        // var cmd = 'ionic';
                        var cmd = 'cordova';
                        var argvBuild = ['build', 'ios', '--device', '--release', '--buildConfig'];
                        process.chdir(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp));
                        return commandLine(cmd, argvBuild);
                    }).then(() => {
                        console.log('=========Copy File IPA to App Store==========');
                        var pathDirIPA = path.join(appRoot, 'public', 'projectios', fIDAppUser, fVerionApp);
                        var pathCopyIPA = path.join(appRoot, 'public', 'backupipa');
                        return copyFileIPAAppStore(pathDirIPA, pathCopyIPA, fIDAppUser, fVerionApp, fAppName);
                    }).then(() => {
                        console.log('log: Generate File Build App Store Success...');
                        return resolve('Generate File Build App Store Success...');
                    })
                    .catch((ex) => {
                        console.log(ex);
                        reject(ex);
                    })
            })

        }

        /////////////////////////
        let readPlistFileAppStore = (plistFile) => {
            return new Promise((resolve, reject) => {
                try {
                    var obj = plist.parse(fs.readFileSync(plistFile, "utf8"));
                    console.log(JSON.stringify(obj));
                    console.log(obj.UUID);
                    console.log(obj.TeamIdentifier[0]);
                    UUIDAppStore = obj.UUID;
                    TeamIDAppStore = obj.TeamIdentifier[0];
                    resolve({ teamID: TeamIDAppStore, UUID: UUIDAppStore });
                } catch (error) {
                    console.log(error);
                    reject(error + '');
                }
            })
        }

        //////////////////////////
        let generatesBuildJSONAppStore = (fUUID, fTeamID, fIDAppUser, fVersion) => {

            return new Promise((resolve, reject) => {
                if (fs.existsSync(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'build.json'))) {
                    fse.removeSync(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'build.json'));
                }
                var content = {
                    "ios": {
                        "debug": {
                            "codeSignIdentity": "iPhone Development",
                            "provisioningProfile": fUUID,
                            "developmentTeam": fTeamID,
                            "packageType": "development"
                        },
                        "release": {
                            "codeSignIdentity": "iPhone Distribution",
                            "provisioningProfile": fUUID,
                            "developmentTeam": fTeamID,
                            "packageType": "app-store"
                        }
                    }
                };

                try {
                    jsonfile.writeFile(path.join(appRoot, 'public', 'projectios', fIDAppUser, fVersion, 'build.json'), content, (err) => {
                        if (err) {
                            console.log(err + '');
                            reject(err);
                        } else resolve('generate build success.');
                    });
                } catch (e) {
                    console.log("Cannot write file ", e + '');
                    reject(e);
                }
            })
        }

        ///////////////////////////////////////
        let copyFileIPAAppStore = (pathProjectApp, pathBackupIPA, fIDAppUser, fVersion, fAppName) => {
            return new Promise((resolve, reject) => {
                try {
                    var pathFolder = path.join(pathBackupIPA, fIDAppUser);
                    if (!fs.existsSync(pathFolder)) {
                        fs.mkdirSync(pathFolder);
                    }
                    var pathFolderVersion = path.join(pathBackupIPA, fIDAppUser, fVersion);
                    if (!fs.existsSync(pathFolderVersion)) {
                        fs.mkdirSync(pathFolderVersion);
                    }
                    var pathSigned = path.join(pathBackupIPA, fIDAppUser, fVersion, 'signed');
                    if (!fs.existsSync(pathSigned)) {
                        fs.mkdirSync(pathSigned);
                    }
                    var rFile = path.join(pathProjectApp, 'platforms', 'ios', 'build', 'device', fAppName + '.ipa');
                    console.log('r: ' + rFile);
                    var wFile = path.join(pathSigned, fAppName + '.ipa');
                    console.log('w: ' + wFile);
                    fse.copy(rFile, wFile, { replace: true }, (err) => {
                        if (err) return reject(err + '');
                        resolve('Copy file apk unsign success.');
                    });
                    // const outAplication = fs.createWriteStream(path.join(path_signed, 'android-release-unsigned.apk'));
                    // fs.createReadStream(path.join(pathProjectApp, 'platforms', 'android', 'build', 'outputs', 'apk', 'android-release-unsigned.apk'))
                    //     .pipe(outAplication);
                    // outAplication.on("end", resolve("copy success."));
                    // outAplication.on("error", reject('Error copy file apk.'));
                } catch (error) {
                    reject(error);
                }
            });
        }

        /////////////////////////////////////////////////////BUILD IOS COMMAND LINE IN SERVER MACOS///////////////////////

        console.log('======================= Check list building =======================');
        return checkBuildingiOS(sumBuild, sIDAppUser).then(() => {
                console.log('======================= Start get url =======================');
                return getFileZipProject(linkFileZip, sIDAppUser);
            }).then((result) => {
                console.log('================== Extract file =========================');
                return extractFile(result, sIDAppUser);
            })
            .then(() => {
                console.log('Access file...');
                process.chdir(path.join(appRoot, 'public', 'projectios', sIDAppUser, sVersionApp));
                return commandLine('chmod', ['-R', '777', './']);
            })
            .then(() => {
                console.log('==================NPM install package================');
                process.chdir(path.join(appRoot, 'public', 'projectios', sIDAppUser, sVersionApp));
                return commandLine('npm', ['install']);
            })
            .then(() => {
                console.log('=======ReBuild Node-Sass========');
                process.chdir(path.join(appRoot, 'public', 'projectios', sIDAppUser, sVersionApp));
                return commandLine('npm', ['rebuild', 'node-sass']);
            })
            .then(() => {
                //    console.log('kq: ' + result);
                console.log('=======Add Platform========');
                // var cmdRelease = 'ionic';
                var cmdRelease = 'cordova';
                var argv;
                // console.log(sPlatform);
                argv = ['platform', 'add', 'ios'];
                process.chdir(path.join(appRoot, 'public', 'projectios', sIDAppUser, sVersionApp));
                return commandLine(cmdRelease, argv);
            }).then(() => {
                console.log('=====Build test=====');
                process.chdir(path.join(appRoot, 'public', 'projectios', sIDAppUser, sVersionApp));
                return buildiOSToTest(sIDAppUser, sVersionApp, sProvisionAdHocFileName, sCertificateAdHocFileName, sAppName);
            })
            .then(() => {
                console.log('=====Start build ios app store=====');
                process.chdir(path.join(appRoot, 'public', 'projectios', sIDAppUser));
                return buildiOSToAppStore(sIDAppUser, sVersionApp, sProvisionAppStoreFileName, sCertificateAppStoreFileName, sAppName);
            })
            .then(() => {
                console.log('================== Update Database ===================');
                var hostName = req.headers.host;
                console.log('hostName:' + hostName);
                slinkDebug = path.join('static', 'debug', sIDAppUser, sVersionApp, sAppName + '-test.ipa');
                slinkSigned = path.join('static', 'signed', sIDAppUser, sVersionApp, sAppName + '.ipa');
                slinkDebug = slinkDebug.replace(/ /g, '%20');
                slinkDebug = slinkDebug.replace("\\", "/");

                slinkSigned = slinkSigned.replace(/ /g, '%20');
                slinkSigned = slinkSigned.replace("\\", "/");
                console.log(slinkDebug);
                console.log(slinkSigned);
                slinkDebug = hostServer + '/' + slinkDebug;
                slinkSigned = hostServer + '/' + slinkSigned;
                // slinkDebug = path.join(hostServer, slinkDebug);
                // slinkSigned = path.join(hostServer, slinkSigned);
                console.log(slinkDebug);
                console.log(slinkSigned);

                var cond = sIDAppUser;
                var value = { linkIPADebug: slinkDebug, linkIPAAppStore: slinkSigned };
                return updateDB(sIDAppUser, sVersionApp, value);
            }).then((kq) => {
                console.log(kq);
                console.log('================== Zip folder outputs ===================');
                return zipIPAAndUpdate(sIDAppUser);
            })
            .then(() => {
                console.log('================== Finish Process ===================');
                return res.json({ status: "1", content: 'success' });
            }).catch((ex) => {
                console.log('ex: ' + ex);
                if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sIDAppUser))) {
                    fse.removeSync(path.join(appRoot, 'public', 'projectios', sIDAppUser));
                }
                if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sIDAppUser + '.zip'))) {
                    fse.removeSync(path.join(appRoot, 'public', 'projectios', sIDAppUser + '.zip'));
                }
                return res.json({ status: "3", content: ex + '' });

            });
        // return res.json({ status: "1", content: 'success' });
    } catch (error) {
        console.log('ERROR: ' + error);
        return res.json({ status: '3', content: error + '' });
    }
});
module.exports = router;