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

router.get('/customer', (req, res) => {
    try {
        userModels.find().then((dataUser) => {
            userModels.find({ blocked: true }).then((userBocked) => {
                userModels.find({ blocked: true }).then((userDeactive) => {
                    res.render('admin/customer', { dataUser, userDeactive, userBocked, moment, title: "Customer" });
                });
            });
        });
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


module.exports = router;