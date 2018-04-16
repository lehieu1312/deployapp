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
var libSetting = require('../../../lib/setting');
var devMode = libSetting.devMode;
var sumBuild = libSetting.totalBuilding;


var listBuilding = require('../../../models/listbuilding');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var parser = new xml2js.Parser();
appRoot = appRoot.toString();
var router = express.Router();

router.get('/platform-dash', multipartMiddleware, (req, res) => {

});


module.exports = router;