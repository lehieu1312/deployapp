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

var userModels = require('../../../models/user');

function genderPassword() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function genderCodeShare() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 6; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

router.get('/', (req, res) => {
    try {
        var condition = req.query.con;
        if (condition == "deactive") {
            userModels.find({ status: false }).sort({ dateCreate: -1 }).then((dataUser) => {
                userModels.find().sort({ dateCreate: -1 }).then((dataAll) => {
                    userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((userBocked) => {
                        userModels.find({ status: false }).sort({ dateCreate: -1 }).then((userDeactive) => {
                            res.render('admin/customer', { dataUser, dataAll, userDeactive, userBocked, moment, title: "Customer" });
                        });
                    });
                });
            });
        } else if (condition == "blocked") {
            userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((dataUser) => {
                userModels.find().sort({ dateCreate: -1 }).then((dataAll) => {
                    userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((userBocked) => {
                        userModels.find({ status: false }).sort({ dateCreate: -1 }).then((userDeactive) => {
                            res.render('admin/customer', { dataUser, dataAll, userDeactive, userBocked, moment, title: "Customer" });
                        });
                    });
                });
            });
        } else {
            userModels.find().sort({ dateCreate: -1 }).then((dataUser) => {
                userModels.find().sort({ dateCreate: -1 }).then((dataAll) => {
                    userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((userBocked) => {
                        userModels.find({ status: false }).sort({ dateCreate: -1 }).then((userDeactive) => {
                            res.render('admin/customer', { dataUser, dataAll, userDeactive, userBocked, moment, title: "Customer" });
                        });
                    });
                });
            });
        }

    } catch (error) {
        return res.render('error', { error, title: "Page Error" });
    }
});
router.post('/addcustomer', multipartMiddleware, async(req, res) => {
    try {
        var sEmail;
        req.check('email', 'Email is required').notEmpty();
        req.check('email', 'Email is valid').isEmail();
        var errors = req.validationErrors(); //req.getValidationResult();
        err = JSON.stringify(errors);
        console.log('errors check: ');
        if (errors) {
            console.log(errors);
            return res.json({ status: 2, msg: errors });
        }
        sEmail = req.body.email;
        console.log(sEmail);

        var sendLinkMail = (fEmail, fPass) => {
            return new Promise((resolve, reject) => {
                var transporter = nodemailer.createTransport({ // config mail server
                    host: 'smtp.gmail.com',
                    // port:'465',
                    auth: {
                        user: 'no-reply@taydotech.com',
                        pass: 'taydotech!@#deployapp'
                    }
                });
                transporter.use('compile', hbs({
                    viewPath: path.join(appRoot, 'views'),
                    extName: '.ejs'
                }));

                var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                    from: 'TayDoTech Team',
                    to: fEmail,
                    subject: 'Wellcome DeployApp',
                    template: './admin/customer/mailpass',
                    context: {
                        fPass,
                        fEmail
                    }
                }
                transporter.sendMail(mainOptions, function(err, info) {
                    if (err) {
                        return reject(err);
                    }
                    resolve('Message sent: ' + info.response);

                });
            });
        }

        var checkExitsUser = await userModels.findOne({ email: sEmail }).exec();
        console.log('checkExitsUser: ' + checkExitsUser);
        if (checkExitsUser) {
            return res.json({ status: 3, msg: "This email already exists." });
        } else {
            var setPassUser = genderPassword();
            console.log(setPassUser);
            console.log(md5(setPassUser));
            var dataUserAdd = new userModels({
                id: md5(Date.now()),
                idfb: '',
                idgg: '',
                idtw: '',
                lastname: sEmail,
                firstname: '',
                username: sEmail,
                gender: '',
                birthday: '',
                picture: '',
                agerange: '',
                email: sEmail,
                password: md5(setPassUser),
                dateCreate: Date.now(),
                address: '',
                locale: '',
                country: 230,
                zipcode: '',
                verifycode: '',
                codeShare: genderCodeShare(),
                myapp: [],
                blocked: false,
                status: true
            });
            return dataUserAdd.save().then(() => {
                return sendLinkMail(sEmail, setPassUser);
            }).then(() => {
                return res.json({ status: 1, msg: 'Added user' });
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }
});
router.post('/blockmulti', async(req, res) => {
    try {
        console.log(req.body);
        var arrUser = req.body.arruser;
        if (arrUser) {
            async.forEach(arrUser, (item) => {
                console.log(item);
                userModels.update({ id: item }, { $set: { blocked: true } }).then(() => {
                    console.log(item);
                });
            });
            return res.json({ status: 1, msg: 'Success' });
            // userModels.update({})
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});
router.post('/delmulti', async(req, res) => {
    try {
        console.log(req.body);
        var arrUser = req.body.arruser;
        if (arrUser) {
            async.forEach(arrUser, (item) => {
                console.log(item);
                userModels.remove({ id: item }).then(() => {
                    console.log(item);
                });
            });
            return res.json({ status: 1, msg: 'Success' });
            // userModels.update({})
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});
router.post('/blockuser', async(req, res) => {
    try {
        console.log(req.body);
        var idUser = req.body.iduser;
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataFindUser) => {
                console.log('dataFindUser: ' + dataFindUser);
                if (dataFindUser) {
                    return userModels.update({ id: idUser }, { $set: { blocked: true } }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    })
                } else {
                    return res.json({ status: 3, msg: 'Not find user to unblock.' });
                }
            });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});
router.post('/unblockuser', async(req, res) => {
    try {
        console.log(req.body);
        var idUser = req.body.iduser;
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataFindUser) => {
                console.log('dataFindUser: ' + dataFindUser);
                if (dataFindUser) {
                    return userModels.update({ id: idUser }, { $set: { blocked: false } }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    })
                } else {
                    return res.json({ status: 3, msg: 'Not find user to unblock.' });
                }
            });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});

router.post('/deleteuser', async(req, res) => {
    try {
        console.log(req.body);
        var idUser = req.body.iduser;
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataFindUser) => {
                console.log('dataFindUser: ' + dataFindUser);
                if (dataFindUser) {
                    return userModels.remove({ id: idUser }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    })
                } else {
                    return res.json({ status: 3, msg: 'Not find user to delete.' });
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