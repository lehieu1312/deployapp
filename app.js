var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session'),
    expressValidator = require('express-validator'),
    fs = require('fs'),
    fse = require('fs-extra'),
    md5 = require('md5'),
    http = require('http'),
    spawn = require('child_process').spawn,
    crossSpawn = require('cross-spawn'),
    Q = require('q'),
    extract = require('extract-zip'),
    async = require('async'),
    jsonfile = require('jsonfile'),
    taydoCommandUtils = require('./lib/taydoCommandutils'),
    mongoose = require('mongoose'),
    nodemailer = require('nodemailer'),
    moment = require('moment'),
    multipart = require('connect-multiparty');
var timeout = require('connect-timeout');
var debug = require('debug')('appbuild:server');
// var flash = require('connect-flash');
var appRoot = require('app-root-path');
appRoot = appRoot.toString();
//var io = require('socket.io')(server);
var Statistic = require('./models/statistic');
var Infomation = require('./models/infomation');
var listBuilding = require('./models/listbuilding');

var User = require('./models/user');
var affiliate_statistic_modal = require('./models/affiliatestatistics')

var libSetting = require('./lib/setting');
var pathBackupDB = libSetting.pathBackupDB;

var multipartMiddleware = multipart();
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

app.use(function(req, res, next) {
    req.io = io;
    next();
});
// io.on('connection', function(socket) {
//     console.log('co nguoi ket noi: ' + socket.id);
//     //io.sockets.emit
//     io.sockets.emit('SERVER-SEND-DATA', 'server');
// });

// app.set('devMode', true);

// socketapp = require('./lib/socketapp');
// socketapp(io);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.timeout = 10000000;

mongoose.Promise = require('bluebird');
//"mongodb://uer:pass@ip/db_mongo"
//'mongodb://127.0.0.1/deployapp'
// 'mongodb://deployapp:admindeployapp@45.76.180.221/deployapp'
// 'mongodb://deployapp:admindeployapp@104.207.148.242/deployapp'

mongoose.connect('mongodb://127.0.0.1/deployapp', {
    poolSize: 20,
    socketTimeoutMS: 480000,
    useMongoClient: true,
    keepAlive: 300000,
    connectTimeoutMS: 300000,
    reconnectTries: 30,
    reconnectInterval: 3000
        // ssl: true,
        // sslValidate: false
});
var dbMongo = mongoose.connection;

dbMongo.on('error', function(err) {
    console.log(err);

});
dbMongo.on('open', function() {
    console.log('Mongodb conected');
    // console.log(io);
})


// dang nhap fb, gg, tw su dung passport
var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findOne({
        id: id
    }, (err, user) => {
        console.log("deserializeUser user :" + user);
        done(null, user);
    })
});
//////////////////////////////////


let updateDataDBUploaded = async() => {
    var sUploaded, sDeployed, sRegister;
    try {
        let staticUpload = await Statistic.find().exec();
        // console.log(staticUpload);

        await staticUpload.forEach(function(kq) {
            sUploaded = kq.uploaded;
            // sDeployed = kq.deployed;
            // sRegister = kq.register;
        });

        sUploaded = sUploaded + 1;
        // sDeployed = sDeployed + 1;
        // sRegister = sRegister + 1;
        //, deployed: sDeployed, register: sRegister
        let udStatistic = await Statistic.update({}, {
            $set: {
                uploaded: sUploaded
            }
        }, {
            upsert: false
        }).exec();
    } catch (error) {

    }
}
let updateDataDBDeployed = async() => {
    var sUploaded, sDeployed, sRegister;
    try {
        let staticUpload = await Statistic.find().exec();
        console.log('staticUpload: ' + staticUpload);

        await staticUpload.forEach(function(kq) {
            // sUploaded = kq.uploaded;
            console.log('kq: ' + kq);
            sDeployed = kq.deployed;
            sRegister = kq.register;
        });
        console.log('1: ' + sRegister);
        // sUploaded = sUploaded + 1;
        sDeployed = sDeployed + 1;
        sRegister = sRegister + 1;
        console.log('2: ' + sRegister);
        //, deployed: sDeployed, register: sRegister
        let udStatistic = await Statistic.update({}, {
            $set: {
                deployed: sDeployed,
                register: sRegister
            }
        }, {
            upsert: false
        }).exec();
    } catch (error) {
        console.log(error);
    }
}
setInterval(updateDataDBUploaded, 120000);
setInterval(updateDataDBDeployed, 500000);

let delKeyBuilding = () => {
    try {
        var sDateNow = Date.now();
        listBuilding.remove({
            dateStartBuild: {
                $lt: sDateNow - (1000 * 60 * 30)
            }
        }).exec((err, result) => {
            if (err) {
                console.log(err);
                // return res.render('error', { error: err, title: 'Error Data' });
            }
            // console.log('Deleted key building...');
        });
        // listBuilding.remove({}, ).exec();

    } catch (error) {
        console.log(error);
    }
}

setInterval(delKeyBuilding, 60000);
io.on('connection', function(socket) {

    console.log('co nguoi ket noi: ' + socket.id + ' ---> ' + moment(Date.now()).format('DD-MM-YYYY, HH:mm:ss'));
    var sUploaded, sDeployed, sRegister;

    let queryDBUploaded = async() => {

        let realUploaded = await Infomation.find({}).count().exec();
        // let realBuilded = await Infomation.find({ stepBuild: 'builded' }).count().exec();
        // let realRegister = await User.find().count().exec();

        let staticUpload = await Statistic.find().exec();
        // console.log(staticUpload);

        await staticUpload.forEach(function(kq) {
            sUploaded = kq.uploaded;
            // sDeployed = kq.deployed;
            // sRegister = kq.register;
        });

        sUploaded = sUploaded + realUploaded;
        // sDeployed = sDeployed + realBuilded;
        // sRegister = sRegister + realRegister;

        // console.log(sUploaded);
        // console.log(sDeployed);
        // console.log(sRegister);

        // uploaded = uploaded + 1;
        io.sockets.emit('Server-send-data-uploaded', {
            clUploaded: sUploaded
        });
    }
    let queryDBDeployed = async() => {

        // let realUploaded = await Infomation.find({ stepBuild: 'uploaded' }).count().exec();
        let realBuilded = await Infomation.find({
            stepBuild: 'builded'
        }).count().exec();
        let realRegister = await User.find().count().exec();

        let staticUpload = await Statistic.find().exec();
        // console.log(staticUpload);

        await staticUpload.forEach(function(kq) {
            // sUploaded = kq.uploaded;
            sDeployed = kq.deployed;
            sRegister = kq.register;
        });

        // sUploaded = sUploaded + realUploaded;
        sDeployed = sDeployed + realBuilded;
        sRegister = sRegister + realRegister;

        // console.log(sUploaded);
        // console.log(sDeployed);
        // console.log(sRegister);

        // uploaded = uploaded + 1;
        io.sockets.emit('Server-send-data-deployed', {
            clDeployed: sDeployed,
            clRegister: sRegister
        });
    }
    setInterval(queryDBUploaded, 120000);
    setInterval(queryDBDeployed, 500000);


});
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

let backupDB = () => {
    try {
        var date = new Date();
        var daynow = date.getDate();
        var monthnow = date.getMonth() + 1;
        var yearnow = date.getFullYear();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        var folderName = yearnow + '-' + monthnow + '-' + daynow + '-' + hour + '-' + min + '-' + sec;
        var mongodump = 'mongodump';
        console.log(pathBackupDB);
        // var argv = ['-d', 'deployapp', '-o', 'E:\\TayDoTech\\Nodejs\\Project\\deployapp\\public\\backupdb\\' + folderName, '--gzip'];
        var argv = ['-d', 'deployapp', '-o', pathBackupDB + folderName, '--gzip'];
        commandLine(mongodump, argv);
        console.log('success');
    } catch (error) {
        console.log(error);
    }
}

setInterval(backupDB, 14400000);

let delFolderNotExist = () => {
    try {
        console.log('====Start del folder empty=====');
        console.log('====Temporary=====');
        var pathProjectTemp = path.join(appRoot, 'public', 'temporary');
        var arrFolder = fs.readdirSync(pathProjectTemp);
        async.each(arrFolder, function(result) {
            console.log('res temp: ' + result);
            Infomation.find({
                keyFolder: result
            }).count().exec((err, data) => {
                if (err) console.log(err);
                console.log('data: ' + data);
                if (data <= 0) {
                    console.log('Del folder');
                    fse.removeSync(path.join(pathProjectTemp, result));
                }
            });
        });
        console.log('====Project=====');
        var pathProjectPro = path.join(appRoot, 'public', 'project');
        var arrFolderPro = fs.readdirSync(pathProjectPro);
        async.each(arrFolderPro, function(resultPro) {
            console.log('res project: ' + resultPro);
            Infomation.find({
                keyFolder: resultPro
            }).count().exec((err, data) => {
                if (err) console.log(err);
                console.log('data: ' + data);
                if (data <= 0) {
                    console.log('Del folder');
                    fse.removeSync(path.join(pathProjectPro, resultPro));
                }
            })
        });
        console.log('====Uploads=====');
        var pathProjectUploads = path.join(appRoot, 'public', 'uploads');
        var arrFolderUp = fs.readdirSync(pathProjectUploads);
        async.each(arrFolderUp, function(resultUp) {
            console.log('res uploads: ' + resultUp);
            Infomation.find({
                keyFolder: resultUp
            }).count().exec((err, data) => {
                if (err) console.log(err);
                console.log('data: ' + data);
                if (data <= 0) {
                    console.log('Del folder');
                    fse.removeSync(path.join(pathProjectUploads, resultUp));
                }
            })
        });
    } catch (error) {
        console.log(error);
    }

}

setInterval(delFolderNotExist, 25200000);

let delFolderApp = () => {
    try {
        var sDateNow = Date.now();
        var sKey;
        console.log('=============Start Del=============');
        Infomation.find({
            dateCreate: {
                $lt: sDateNow - (1000 * 60 * 60 * 12)
            }
        }).exec(async(err, result) => {
            if (err) {
                console.log(err);
                return res.render('error', {
                    error: err,
                    title: 'Error Data'
                });
            }
            console.log('number folder: ' + result.length);
            if (result.length > 0) {
                async.each(result, function(kq) {
                    // var mang = kq.keyFolder;
                    sKey = kq.keyFolder;

                    console.log('Folder: ' + sKey);
                    if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sKey))) {
                        fse.removeSync(path.join(appRoot, 'public', 'temporary', sKey));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'uploads', sKey + '.zip'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'uploads', sKey + '.zip'));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'project', sKey))) {
                        fse.removeSync(path.join(appRoot, 'public', 'project', sKey));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKey))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', sKey));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKey + '.zip'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', sKey + '.zip'));
                    }
                })
            }
        });
    } catch (error) {
        console.log('Error delete file periodic: ' + error);
    }
}
setInterval(delFolderApp, 25200000);

let delFolderNotSuccess = () => {
    try {
        var sDateNow = Date.now();
        var sKey;
        console.log('=============Start Del=============');
        Infomation.find({
            logError: '',
            stepBuild: {
                $nin: ['stepBuild', 'sendMail']
            },
            dateCreate: {
                $lt: sDateNow - (1000 * 60 * 60 * 12)
            }
        }).exec(async(err, result) => {
            if (err) {
                console.log(err);
                return res.render('error', {
                    error: err,
                    title: 'Error Data'
                });
            }
            console.log('number folder not success: ' + result.length);
            if (result.length > 0) {
                async.each(result, function(kq) {
                    // var mang = kq.keyFolder;
                    sKey = kq.keyFolder;

                    console.log('Folder not success: ' + sKey);
                    if (fs.existsSync(path.join(appRoot, 'public', 'temporary', sKey))) {
                        fse.removeSync(path.join(appRoot, 'public', 'temporary', sKey));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'uploads', sKey + '.zip'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'uploads', sKey + '.zip'));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'project', sKey))) {
                        fse.removeSync(path.join(appRoot, 'public', 'project', sKey));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKey))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', sKey));
                    }
                    if (fs.existsSync(path.join(appRoot, 'public', 'projectios', sKey + '.zip'))) {
                        fse.removeSync(path.join(appRoot, 'public', 'projectios', sKey + '.zip'));
                    }
                })
            }
        });
    } catch (error) {
        console.log('Error delete file periodic: ' + error);
    }
}
setInterval(delFolderNotSuccess, 21600000);
// mongoose.connect('mongodb://localhost/buildapp');
// var dbMongo = mongoose.connection;
// dbMongo.on('error', console.error.bind(console, 'connection error:'));
// dbMongo.once('open', function() {
//     console.log('MongoDb connected');
// });

// var apimyapp = require("./routes/restapi/apimyapp");
// var apiappversion = require("./routes/restapi/apiappversion");

var paypal = require("./routes/checkout/paypal");
var stripe = require("./routes/checkout/stripe");
// view engine setup
// let Customer = require('./models/customer');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(timeout(10000000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next) {
    if (!req.timedout) next();
}
// app.use(flash());
// app.use(function(req, res, next) {
//     res.locals.log_message = req.flash('log_message');
//     next();
// });
// app.use(function(req, res, next) {
//     req.setTimeout(0) // no timeout for all requests, your server will be DoS'd
//     next()
// });
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    type: 'application/*+json'
}));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(function(req, res, next) {
    res.locals.title = 'Build App Auto one click';
    res.locals.error = '';
    next();
});
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'appbuild'
}));
app.use(function(req, res, next) {
    try {
        if (req.session.iduser) {
            // var picturex;
            // console.log('gose....................');
            res.locals.staticuser = {
                msglog: "Profile",
                msgregis: "Logout",
                statusli: "hideli",
                useronline: "useronline"
            };
            res.locals.menuaccount = {
                statususer: ""
            };
            next();

        } else {
            // console.log('not gose....................');
            res.locals.staticuser = {
                msglog: "Login",
                msgregis: "Register",
                statusli: "",
                useronline: ""
            };
            res.locals.menuaccount = {
                statususer: "statususer"
            };
            next();
        }
    } catch (error) {
        console.log(error);
        res.locals.staticuser = {
            msglog: "Login",
            msgregis: "Register",
            statusli: "",
            useronline: ""
        };
        res.locals.menuaccount = {
            statususer: "statususer"
        };
        next();
        // if (devMode == true)
        //     return res.send({ status: "3", message: error + '' });
        // else
        //     return res.json({ status: "3", message: 'Oops, something went wrong' });
    }
});
app.get("*", (req, res, next) => {
    console.log(req.session.iduser);
    if (req.session.iduser) {
        res.locals.idusernoti = req.session.iduser;
    } else {
        res.locals.idusernoti = '';
    }
    next();
});

app.get("*", (req, res, next) => {
    // res.clearCookie("codesharedeployapp");
    try {
        console.log(req.cookies);
        var id_now = md5(new Date());
        User.count({
            codeShare: req.query.codeshare,
            status: true
        }).then((count) => {
            if (count > 0) {
                if (req.query.codeshare) {
                    if (!req.cookies.codesharedeployapp) {
                        var path_codeshare = req.url.split("?")[0];
                        affiliate_statistic_modal.findOne({
                            id: id_now,
                            codeShare: req.query.codeshare,
                            dateOut: null,
                            status: true
                        }).then((data) => {
                            if (data) {
                                affiliate_statistic_modal.update({
                                    id: data.id
                                }, {
                                    "$push": {
                                        page: {
                                            pageText: path_codeshare,
                                            dateCreate: new Date(),
                                            dateOut: null
                                        }
                                    }
                                }, {
                                    safe: true,
                                    upsert: true
                                }).then(() => {
                                    next();
                                })
                            } else {
                                var new_affiliate_statistic_modal = new affiliate_statistic_modal({
                                    id: id_now,
                                    idUser: id_now,
                                    codeShare: req.query.codeshare,
                                    dateCreate: new Date(),
                                    dateOut: null,
                                    page: [{
                                        pageText: path_codeshare,
                                        dateCreate: new Date(),
                                        dateOut: null
                                    }],
                                    status: true
                                })
                                new_affiliate_statistic_modal.save().then(() => {
                                    res.cookie("codesharedeployapp", {
                                        id: id_now,
                                        code: req.query.codeshare
                                    }, {
                                        expires: new Date() + 2592000000,
                                        maxAge: 2592000000
                                    })
                                    next();
                                });
                            }
                        })

                        setTimeout(function() {
                            affiliate_statistic_modal.update({
                                id: id_now
                            }, {
                                dateOut: new Date(),
                            }, function(err, data) {
                                if (err) {
                                    // console.log(err);
                                    if (devMode == true)
                                        return res.send({
                                            status: "3",
                                            message: err + ''
                                        });
                                    else
                                        return res.json({
                                            status: "3",
                                            message: 'Oops, something went wrong'
                                        });
                                }
                                // console.log(data);
                            })
                        }, 240000)
                    } else {
                        if (req.cookies.codesharedeployapp.code != req.query.codeshare) {
                            var path_codeshare = req.url.split("?")[0];

                            affiliate_statistic_modal.findOne({
                                id: id_now,
                                codeShare: req.query.codeshare,
                                dateOut: null,
                                status: true
                            }).then((data) => {
                                if (data) {
                                    affiliate_statistic_modal.update({
                                        id: data.id
                                    }, {
                                        "$push": {
                                            page: {
                                                pageText: path_codeshare,
                                                dateCreate: new Date(),
                                                dateOut: null
                                            }
                                        }
                                    }, {
                                        safe: true,
                                        upsert: true
                                    }).then(() => {
                                        next();
                                    })
                                } else {
                                    var new_affiliate_statistic_modal = new affiliate_statistic_modal({
                                        id: id_now,
                                        idUser: id_now,
                                        codeShare: req.query.codeshare,
                                        dateCreate: new Date(),
                                        dateOut: null,
                                        page: [{
                                            pageText: path_codeshare,
                                            dateCreate: new Date(),
                                            dateOut: null
                                        }],
                                        status: true
                                    })
                                    new_affiliate_statistic_modal.save().then(() => {
                                        res.cookie("codesharedeployapp", {
                                            id: id_now,
                                            code: req.query.codeshare
                                        }, {
                                            expires: new Date() + 2592000000,
                                            maxAge: 2592000000
                                        })
                                        next();
                                    });
                                }
                            })

                            setTimeout(function() {
                                affiliate_statistic_modal.update({
                                    id: req.cookies.codesharedeployapp.id
                                }, {
                                    dateOut: new Date(),
                                }, function(err, data) {
                                    if (err) {
                                        // console.log(err);
                                        if (devMode == true)
                                            return res.send({
                                                status: "3",
                                                message: err + ''
                                            });
                                        else
                                            return res.json({
                                                status: "3",
                                                message: 'Oops, something went wrong'
                                            });
                                    }
                                    // console.log(data);
                                })
                            }, 240000)
                        } else {
                            var path_codeshare = req.url.split("?")[0];
                            affiliate_statistic_modal.findOne({
                                id: req.cookies.codesharedeployapp.id,
                                codeShare: req.query.codeshare,
                                dateOut: null,
                                status: true
                            }).then((data) => {
                                if (data) {
                                    affiliate_statistic_modal.update({
                                        id: data.id
                                    }, {
                                        "$push": {
                                            page: {
                                                pageText: path_codeshare,
                                                dateCreate: new Date(),
                                                dateOut: null
                                            }
                                        }
                                    }, {
                                        safe: true,
                                        upsert: true
                                    }).then(() => {
                                        next();
                                    })
                                } else {
                                    var new_affiliate_statistic_modal = new affiliate_statistic_modal({
                                        id: id_now,
                                        idUser: id_now,
                                        codeShare: req.query.codeshare,
                                        dateCreate: new Date(),
                                        dateOut: null,
                                        page: [{
                                            pageText: path_codeshare,
                                            dateCreate: new Date(),
                                            dateOut: null
                                        }],
                                        status: true
                                    })
                                    new_affiliate_statistic_modal.save().then(() => {
                                        res.cookie("codesharedeployapp", {
                                            id: id_now,
                                            code: req.query.codeshare
                                        }, {
                                            expires: new Date() + 2592000000,
                                            maxAge: 2592000000
                                        })
                                        next();
                                    });
                                }
                            })

                            setTimeout(function() {
                                affiliate_statistic_modal.update({
                                    id: req.cookies.codesharedeployapp.id
                                }, {
                                    dateOut: new Date(),
                                }, function(err, data) {
                                    if (err) {
                                        // console.log(err);
                                        if (devMode == true)
                                            return res.send({
                                                status: "3",
                                                message: err + ''
                                            });
                                        else
                                            return res.json({
                                                status: "3",
                                                message: 'Oops, something went wrong'
                                            });
                                    }
                                    // console.log(data);
                                })
                            }, 240000)
                        }
                    }
                } else {
                    if (req.cookies.codesharedeployapp) {
                        if (req.cookies.codesharedeployapp.id && req.cookies.codesharedeployapp.code) {
                            // console.log(req.cookies)
                            var code_share_app = req.cookies.codesharedeployapp.code;
                            var path_codeshare = req.url.split("?")[0];
                            affiliate_statistic_modal.findOne({
                                id: req.cookies.codesharedeployapp.id,
                                codeShare: req.cookies.codesharedeployapp.code,
                                dateOut: null,
                                status: true
                            }).then((data) => {
                                // console.log("data:" + JSON.stringify(data))
                                if (data) {
                                    affiliate_statistic_modal.update({
                                        id: data.id
                                    }, {
                                        "$push": {
                                            page: {
                                                pageText: path_codeshare,
                                                dateCreate: new Date(),
                                                dateOut: null
                                            }
                                        }
                                    }, {
                                        safe: true,
                                        upsert: true
                                    }).then(() => {
                                        next();
                                    })
                                } else {
                                    var new_affiliate_statistic_modal = new affiliate_statistic_modal({
                                        id: id_now,
                                        idUser: id_now,
                                        codeShare: req.cookies.codesharedeployapp.code,
                                        dateCreate: new Date(),
                                        dateOut: null,
                                        page: [{
                                            pageText: path_codeshare,
                                            dateCreate: new Date(),
                                            dateOut: null
                                        }],
                                        status: true
                                    })
                                    new_affiliate_statistic_modal.save().then(() => {
                                        res.cookie("codesharedeployapp", {
                                            id: id_now,
                                            code: code_share_app
                                        }, {
                                            expires: new Date() + 2592000000,
                                            maxAge: 2592000000
                                        })
                                        next();
                                    });
                                }
                            })

                            setTimeout(function() {
                                affiliate_statistic_modal.update({
                                    id: req.cookies.codesharedeployapp.id
                                }, {
                                    dateOut: new Date(),
                                }, function(err, data) {
                                    if (err) {
                                        // console.log(err);
                                        if (devMode == true)
                                            return res.send({
                                                status: "3",
                                                message: err + ''
                                            });
                                        else
                                            return res.json({
                                                status: "3",
                                                message: 'Oops, something went wrong'
                                            });
                                    }
                                    // console.log(data);
                                })
                            }, 240000)
                        } else {
                            next();
                        }
                    } else {
                        next();
                    }
                }
            } else {
                next();
            }
        })
    } catch (error) {
        console.log(error + "");
    }

})


/// HOME
var index = require('./routes/index');
var uploads = require('./routes/uploads');
var buildandroid = require('./routes/buildandroid');
var appstatic = require('./routes/app');
var buildios = require('./routes/buildios');
var settingapp = require('./routes/settingapp');
var users = require('./routes/users');
var static = require('./routes/static');
var test = require('./routes/test');
var success = require('./routes/success');
var platform = require('./routes/platform');
var track = require('./routes/admin/track');
var checkBuildiOS = require('./routes/admin/checkbuildios');
var buildandroiddash = require("./routes/dashboard/appversion/buildandroid");
var buildiosdash = require("./routes/dashboard/appversion/buildios");
// var buildiosdiawi = require('./routes/buildiosdiawi');

//login
var login = require("./routes/login/login");
var register = require("./routes/login/register");
var updateinfo = require("./routes/login/updateinfo");
var forgot = require("./routes/login/forgot");
// detail
var detail = require("./routes/dashboard/detail");
var editprofile = require("./routes/dashboard/editprofile");
var errdashboard404 = require("./routes/dashboard/error/404");
var appversion = require("./routes/dashboard/appversion/appversion");
var history = require("./routes/dashboard/history/history");
var myteam = require("./routes/dashboard/myteam/myteam");
var appsetting = require("./routes/dashboard/appsetting/appsetting");
var myorder = require("./routes/dashboard/myorder/myorder");
var traffic = require("./routes/dashboard/traffic/traffic");
var notification = require("./routes/dashboard/notification/notification");
var appsetting = require("./routes/dashboard/appsetting/appsetting");

var sentnotification = require("./routes/dashboard/notification/sentnotification");
var allusernoti = require("./routes/dashboard/notification/allusers");
// Rest API
var API = require("./routes/restapi/app");
var APIOrder = require("./routes/restapi/orderapp");
var APIUserApp = require("./routes/restapi/userapp");
var APIProductStatistic = require("./routes/restapi/productapp");

/// Administrator
var loginAdmin = require('./routes/admin/login/login');
var homeAdmin = require('./routes/admin/index');
var adminCustomer = require('./routes/admin/customer/index');
var adminWithdraw = require('./routes/admin/withdraw/index');
var adminMembership = require('./routes/admin/membership/index');
var adminStatements = require('./routes/admin/statements/index');
var adminApps = require('./routes/admin/apps/index');
// var adminVersionApps = require('./routes/admin/apps/index');
//checkout
var checkout = require("./routes/checkout/checkout");

// affiliate

var affiliate_report = require("./routes/affiliate/report");
var affiliate_statement = require("./routes/affiliate/statement");
var affiliate_withdrawal = require("./routes/affiliate/withdrawal");
var affiliate_method = require("./routes/affiliate/method");

// membership
var membership = require("./routes/membership/membership");

//Test
var testBody = require("./routes/testbody");

//===================================================================

app.use('/', index);
app.use('/', uploads);
app.use('/', settingapp);
app.use('/', platform);
app.use('/', success);
app.use('/', buildandroid);
app.use('/', buildios);
app.use('/', static);
app.use('/', test);
app.use('/', appstatic);
app.use('/admin', track);
app.use('/admin', checkBuildiOS);
app.use('/dashboard', buildandroiddash);
app.use('/dashboard', buildiosdash);

//
app.use('/', testBody);

///////////////////////////
app.use('/', login);
app.use('/', register);
app.use('/', updateinfo);
app.use('/', detail);
app.use('/', editprofile);
app.use('/', forgot);
app.use('/', errdashboard404);

// app.use('/dashboard', homeapp);
app.use('/dashboard', appversion);
app.use('/dashboard', history);
app.use('/dashboard', myteam);
app.use('/dashboard', appsetting);
app.use('/dashboard', myorder);
app.use('/dashboard', traffic);
app.use('/dashboard', notification);
app.use('/dashboard', sentnotification);
app.use('/dashboard', allusernoti);
// app.use('/dashboard', appsetting);

//Administrator 
app.use('/admin', homeAdmin);
app.use('/admin/customer', adminCustomer);
app.use('/admin/withdraw', adminWithdraw);
app.use('/admin/membership', adminMembership);
app.use('/admin/statements', adminStatements);
app.use('/admin/apps', adminApps);
app.use('/admin', loginAdmin);




//checkout
app.use('/', checkout);

//affiliate
app.use('/', affiliate_report);
app.use('/', affiliate_statement);
app.use('/', affiliate_withdrawal);
app.use('/', affiliate_method);

// membership
app.use('/', membership);

/////////////////////
app.use('/deploy-api', API);
app.use('/deploy-api', APIOrder);
app.use('/deploy-api', APIUserApp);
app.use('/deploy-api', APIProductStatistic);

app.use('/', stripe);
app.use('/', paypal);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    // next(err);
    res.render('404', {
        title: 'Page Not Found'
    });
});
// app.use(function(req, res, next) {
//     res.cookie('arrFileUpload', [])
// });
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    console.log(err);
    console.log(err.message);
    res.status(err.status || 500);
    return res.render('error', {
        title: 'Page Not Found'
    });
});



function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind);
    debug('Listening on ' + bind);
}
module.exports = app;