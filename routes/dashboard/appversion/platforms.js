var express = require('express'),
    path = require('path'),
    fse = require('fs-extra'),
    spawn = require('child_process').spawn,
    childProcess = require('child_process'),
    spawnSync = require('child_process').spawnSync,
    spawnPromise = require('child-process-promise').spawn,
    crossSpawnPromise = require('cross-spawn-promise'),
    crossSpawn = require('cross-spawn'),
    async = require('async'),
    xml2js = require('xml2js'),
    bbPromise = require('bluebird'),
    appRoot = require('app-root-path'),
    Q = require('q'),
    fs = require('fs'),
    bodyParser = require('body-parser');
var extract = require('extract-zip');
var libSetting = require('../../../lib/setting');
var devMode = libSetting.devMode;
var sumBuild = libSetting.totalBuilding;
var hostServer = libSetting.hostServer;

var AppSettingModels = require('../../../models/appsettings');
var AppVersionAdminModels = require('../../../models/appversionadmin');
var listBuildingModels = require('../../../models/listbuilding');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var parser = new xml2js.Parser();
appRoot = appRoot.toString();
var router = express.Router();

router.post('/platform-dash', async(req, res) => {
    try {
        var sTypeApp, sPathRootApp, sAppName;
        var platformsApp, versionAppAdmin, idAppServerAdmin, nameFileCodeAdmin, idAppUser, idAppUserDecode, emailUser;
        var packageID, nameApp, versionApp, descriptionApp, emailApp, hrefApp, authApp;
        var wordpressUrl, wordpressPerPage, requestTimeOut, targetBlank, dateFormat, onesignalID, ggAnalytic, adModAndroidBanner, adModeAndroidInterstitial, adModiOsBanner, adModiOSInterstitial;
        ////////////////Check Value Form///////////////
        req.check('platform', 'Platform is required').notEmpty();
        req.check('versionadmin', 'Version admin is required').notEmpty();
        req.check('idappadmin', 'ID App Admin is required').notEmpty();
        req.check('idappuser', 'ID App User is required').notEmpty();

        var errors = req.validationErrors(); //req.getValidationResult();
        err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            console.log(errors);
            return res.json({ status: "2", content: errors });
        }
        //////////////Get Value Form////////////////
        platformsApp = req.body.platform;
        versionAppAdmin = req.body.versionadmin;
        idAppServerAdmin = req.body.idappadmin;
        idAppUser = req.body.idappuser;

        /////////////////////////////////////
        // sKeyFolder = req.body.cKeyFolder;
        console.log(platformsApp);
        console.log(idAppServerAdmin);
        console.log(versionAppAdmin);
        console.log(idAppUser);


        //{ inforAppversion: { $elemMatch: { version: versionAppAdmin } }
        var dataAppVersionAdmin = await AppVersionAdminModels.findOne({ idApp: idAppServerAdmin }, { inforAppversion: { $elemMatch: { version: versionAppAdmin } } }).exec();
        console.log('dataAppVersionAdmin: ' + dataAppVersionAdmin);
        console.log('inforAppversion: ' + dataAppVersionAdmin.inforAppversion[0].version);
        console.log('nameFile: ' + dataAppVersionAdmin.inforAppversion[0].nameFile);
        //////////////
        nameFileCodeAdmin = dataAppVersionAdmin.inforAppversion[0].nameFile;
        ///////////Get Value AppSettings//////////////////
        var dataSettings = await AppSettingModels.findOne({ idApp: idAppUser }).exec();
        console.log('dataSettings: ' + dataSettings);

        packageID = dataSettings.packageIDApp;
        console.log(packageID);
        nameApp = dataSettings.nameApp;
        versionApp = dataSettings.version;
        descriptionApp = dataSettings.description;
        emailApp = dataSettings.emailApp;
        hrefApp = dataSettings.authHref;
        authApp = dataSettings.auth;

        let checkBuilding = (totalBuild, fKeyFolder) => {
            return new Promise(async(resolve, reject) => {
                try {
                    let listBuild = new listBuildingModels({
                        keyFolder: fKeyFolder,
                        dateStartBuild: Date.now()
                    });
                    listBuild.save((err, result) => {
                        if (err) {
                            console.log('err save list build: ' + err);
                            reject(err);
                        }
                        // resolve('Insert building success.');
                        listBuildingModels.find({}).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                            if (err) {
                                console.log('Error find building: ' + err);
                                reject(err);
                            }
                            async.each(result, function(key) {
                                console.log('Check key: ' + key.keyFolder);
                                if (fKeyFolder == key.keyFolder) {
                                    return resolve('Key success ');
                                }
                            });
                            var CheckKeyFolderInterval = setInterval(function() {
                                listBuildingModels.find({}).sort({ dateStartBuild: 1 }).limit(totalBuild).exec((err, result) => {
                                    if (err) {
                                        console.log('Error find building: ' + err);
                                        reject(err);
                                    }
                                    async.each(result, function(key) {
                                        console.log('Check key interval: ' + key.keyFolder);
                                        console.log('Key check: ' + fKeyFolder);
                                        if (fKeyFolder == key.keyFolder) {
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
                        // if (data.toString().toLowerCase().indexOf('err') >= 0) {
                        //     // console.log(chalk.bold(data.toString()));
                        //     reject(data);
                        // }
                    });
                    // commandLine.on('error',function(err){
                    //     reject(err);
                    // });
                    commandLine.on('close', function(code) {
                        if (code > 0) {
                            reject(new Error(code));
                        }
                        resolve('Success commandline.');
                    });
                } catch (error) {
                    console.log(error);
                    reject(error);
                }
            })
        }

        var pathSourceCodeAdmin = path.join(appRoot, 'public', 'sourcecodeapp', nameFileCodeAdmin);
        if (fs.existsSync(pathSourceCodeAdmin)) {
            /////// Extract File Source from admin////////////////
            console.log('..........Extracting file source code admin........');
            if (fs.existsSync(path.join(appRoot, 'public', 'project', idAppUser))) {
                fse.removeSync(path.join(appRoot, 'public', 'project', idAppUser));
            }
            console.log('start extract');
            extract(pathSourceCodeAdmin, { dir: path.join(appRoot, 'public', 'project', idAppUser) }, async function(err, zipdata) {
                if (err) {
                    console.log('Extract fail: ' + err);
                    return res.json({ status: 3, content: "Error extract file: " + err + '' });
                } else {
                    ////////Check Replace File In Setting App///////////////
                    //////Create file config.xml/////////////
                    console.log('Extract complete');
                    var pathFileConfigExample = path.join(appRoot, 'public', 'project', idAppUser, 'config-example.xml');
                    var pathFileConfigMain = path.join(appRoot, 'public', 'project', idAppUser, 'config.xml');
                    if (fs.existsSync(pathFileConfigExample)) {
                        console.log('check config.');
                        var dataConfig = fs.readFileSync(pathFileConfigExample);
                        console.log(dataConfig);
                        console.log(packageID);
                        var resultConfig = dataConfig.toString().replace('PACKAGE_ID', packageID);
                        resultConfig = resultConfig.replace('APP_VERSION', versionApp);
                        resultConfig = resultConfig.replace('APP_NAME', nameApp);
                        resultConfig = resultConfig.replace('APP_DESCRIPTION', descriptionApp);
                        resultConfig = resultConfig.replace('APP_EMAIL', emailApp);
                        resultConfig = resultConfig.replace('AUTH_HREF', hrefApp);
                        resultConfig = resultConfig.replace('APP_AUTHOR', authApp);
                        console.log(resultConfig);
                        fse.writeFileSync(pathFileConfigMain, resultConfig);
                        // fse.copySync(pathFileConfigExample, pathFileConfigMain);
                    }
                    ///////////////Create file setting.js///////////////////
                    // var pathFileSettingExample = path.join(appRoot, 'public', 'project', idAppUser, 'src', 'assets', 'js', 'settings-example.js');
                    // var pathFileSettingsMain = path.join(appRoot, 'public', 'project', idAppUser, 'src', 'assets', 'js', 'settings.js');
                    // if (fs.existsSync(pathFileSettingExample)) {
                    //     console.log('check setting.');
                    //     var dataSettings = fs.readFileSync(pathFileSettingExample);
                    //     console.log(dataSettings);
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
                }
                return checkBuilding(sumBuild, idAppUser)
                    .then(() => {
                        if (hostServer != 'http://localhost:3000') {
                            process.chdir(path.join(appRoot, 'public', 'project', idAppUser));
                            console.log('...Access file...');
                            return commandLine('chmod', ['-R', '777', './']);
                        }
                    })
                    .then(() => {
                        process.chdir(path.join(appRoot, 'public', 'project', idAppUser));
                        console.log('Start rebuild...');
                        return commandLine('npm', ['rebuild', 'node-sass']);
                    })
                    .then(() => {
                        console.log('...Add platform...');
                        var cmdRelease = 'ionic';
                        var argv;
                        argv = ['platform', 'add', 'android'];
                        process.chdir(path.join(appRoot, 'public', 'project', idAppUser));
                        return commandLine(cmdRelease, argv);
                    }).then(() => {
                        console.log('Added platforms');

                        if (!fs.existsSync(path.join(appRoot, 'public', 'project', idAppUser, 'www', 'params.xml'))) {
                            return res.json({ status: 3, msg: 'Params.xml not found' });
                        }
                        var dataFileParams = fs.readFileSync(path.join(appRoot, 'public', 'project', idAppUser, 'www', 'params.xml'));

                        parser.parseString(dataFileParams, function(err, result) {
                            if (err) {
                                console.log(err);
                                return res.json({ status: 3, msg: err + '' });
                            }
                            console.log('file params');
                            console.log('arrFile: ' + result['root']['file']);
                            var arrFile = result['root']['file'];
                            console.log('arr: ' + arrFile);
                            console.log(JSON.stringify(arrFile));
                            // return res.render('info-app', { fKeyFolder, title: 'Mobile App Builder For iOS and Android' });
                            return res.json({ status: 1, keyFolder: idAppUser, arrFileParams: arrFile });
                        });
                        // res.json({ status: 1, keyFolder: idAppUser, });
                    })
                    .catch((ex) => {
                        console.log('========================= ERROR =========================================');
                        console.log('Lỗi Tổng: ' + ex);
                        listBuildingModels.remove({ keyFolder: idAppUser }, function(err, kq) {
                            if (err) {
                                return res.json({ status: 3, content: err + '' });
                            }
                            try {
                                fse.removeSync(path.join(appRoot, 'public', 'project', idAppUser));
                                return res.json({ status: 3, content: ex + '' });
                            } catch (error) {
                                return res.json({ status: 3, content: error + '' });
                            }
                        });
                    });
            });

        } else {
            return res.json({ status: 3, content: "Can't find source code from admin." });
        }

    } catch (error) {
        res.json({ status: 3, msg: error + '' });
    }
});


module.exports = router;