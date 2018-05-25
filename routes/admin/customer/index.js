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

var libAppCountry = require('../../../lib/country');
var libCountry = libAppCountry.country;
var userModels = require('../../../models/user');
var orderModels = require('../../../models/order');

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

router.get('/', checkAdmin, (req, res) => {
    try {
        console.log('abc');
        var condition = req.query.con;
        if (condition == "affiliate") {
            console.log('1');
            userModels.aggregate([{
                    $lookup: {
                        from: 'affiliates',
                        localField: 'id',
                        foreignField: 'idUser',
                        as: 'affiliates'
                    }
                },
                {
                    $addFields: {
                        count: { $size: '$affiliates' }
                    }
                }, {
                    $match: {
                        count: { $gte: 1 }
                    }
                }
            ]).then((dataUser) => {
                console.log(dataUser);
                userModels.find().sort({ dateCreate: -1 }).then((dataAll) => {
                    userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((userBocked) => {
                        userModels.find({ status: false }).sort({ dateCreate: -1 }).then((userDeactive) => {
                            res.render('admin/customer', { dataUser, affiliateData: dataUser, dataAll, userDeactive, userBocked, moment, title: "Customer" });
                        });
                    });
                });
            });

        } else if (condition == "deactive") {
            userModels.find({ status: false }).sort({ dateCreate: -1 }).then((dataUser) => {
                userModels.aggregate([{
                        $lookup: {
                            from: 'affiliates',
                            localField: 'id',
                            foreignField: 'idUser',
                            as: 'affiliates'
                        }
                    },
                    {
                        $addFields: {
                            count: { $size: '$affiliates' }
                        }
                    }, {
                        $match: {
                            count: { $gte: 1 }
                        }
                    }
                ]).then((affiliateData) => {
                    userModels.find().sort({ dateCreate: -1 }).then((dataAll) => {
                        userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((userBocked) => {
                            userModels.find({ status: false }).sort({ dateCreate: -1 }).then((userDeactive) => {
                                res.render('admin/customer', { dataUser, dataAll, affiliateData, userDeactive, userBocked, moment, title: "Customer" });
                            });
                        });
                    });
                });
            });
        } else if (condition == "blocked") {
            userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((dataUser) => {
                userModels.aggregate([{
                        $lookup: {
                            from: 'affiliates',
                            localField: 'id',
                            foreignField: 'idUser',
                            as: 'affiliates'
                        }
                    },
                    {
                        $addFields: {
                            count: { $size: '$affiliates' }
                        }
                    }, {
                        $match: {
                            count: { $gte: 1 }
                        }
                    }
                ]).then((affiliateData) => {
                    userModels.find().sort({ dateCreate: -1 }).then((dataAll) => {
                        userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((userBocked) => {
                            userModels.find({ status: false }).sort({ dateCreate: -1 }).then((userDeactive) => {
                                res.render('admin/customer', { dataUser, dataAll, affiliateData, userDeactive, userBocked, moment, title: "Customer" });
                            });
                        });
                    });
                });

            });
        } else {
            userModels.find().sort({ dateCreate: -1 }).then((dataUser) => {
                userModels.aggregate([{
                        $lookup: {
                            from: 'affiliates',
                            localField: 'id',
                            foreignField: 'idUser',
                            as: 'affiliates'
                        }
                    },
                    {
                        $addFields: {
                            count: { $size: '$affiliates' }
                        }
                    }, {
                        $match: {
                            count: { $gte: 1 }
                        }
                    }
                ]).then((affiliateData) => {
                    userModels.find().sort({ dateCreate: -1 }).then((dataAll) => {
                        userModels.find({ blocked: true }).sort({ dateCreate: -1 }).then((userBocked) => {
                            userModels.find({ status: false }).sort({ dateCreate: -1 }).then((userDeactive) => {
                                res.render('admin/customer', { dataUser, dataAll, affiliateData, userDeactive, userBocked, moment, title: "Customer" });
                            });
                        });
                    });
                });
            });
        }

    } catch (error) {
        console.log(error);
        return res.render('error', { error, title: "Page Error" });
    }
});
router.post('/addcustomer', checkAdmin, multipartMiddleware, async(req, res) => {
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
router.post('/blockmulti', checkAdmin, async(req, res) => {
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
router.post('/delmulti', checkAdmin, async(req, res) => {
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
router.post('/blockuser', checkAdmin, async(req, res) => {
    try {
        console.log(req.body);
        var idUser = req.body.iduser;
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataFindUser) => {
                console.log('dataFindUser: ' + dataFindUser);
                if (dataFindUser) {
                    return userModels.update({ id: idUser }, { $set: { blocked: true } }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    });
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
router.post('/unblockuser', checkAdmin, async(req, res) => {
    try {
        console.log(req.body);
        var idUser = req.body.iduser;
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataFindUser) => {
                console.log('dataFindUser: ' + dataFindUser);
                if (dataFindUser) {
                    return userModels.update({ id: idUser }, { $set: { blocked: false } }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    });
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

router.post('/deleteuser', checkAdmin, async(req, res) => {
    try {
        console.log(req.body);
        var idUser = req.body.iduser;
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataFindUser) => {
                console.log('dataFindUser: ' + dataFindUser);
                if (dataFindUser) {
                    return userModels.remove({ id: idUser }).then(() => {
                        return res.json({ status: 1, msg: 'Success' });
                    });
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
router.get('/login/:id', checkAdmin, async(req, res) => {
    try {
        console.log(req.params);
        var idUser = req.params.id;
        console.log(idUser);
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataFindUser) => {
                console.log(dataFindUser);
                if (dataFindUser) {
                    req.session.fullname = dataFindUser.firstname + " " + dataFindUser.lastname;
                    req.session.iduser = dataFindUser.id;
                    req.session.cart = [];
                    return res.redirect('/dashboard');
                } else {
                    return res.json({ status: 3, msg: 'Not find user' });
                }
            });
        } else {
            return res.json({ status: 3, msg: 'Not item selected' });
        }
    } catch (error) {
        return res.json({ status: 3, msg: error + '' });
    }
});
router.get('/edit/:id', checkAdmin, async(req, res) => {
    try {
        console.log(req.params);
        var idUser = req.params.id;
        console.log(idUser);
        if (idUser) {
            return userModels.findOne({ id: idUser }).then((dataUserOne) => {
                console.log(dataUserOne);
                if (dataUserOne) {
                    return res.render('admin/customer/edit', { libCountry, dataUserOne, title: 'Edit User' });

                } else {
                    return res.render('404', { title: 'Page Not Found' });
                }
            });
        } else {
            return res.render('404', { title: 'Page Not Found' });
        }
    } catch (error) {
        console.log(error);
        return res.render('error', { error: error + '', title: 'Page Error' });
    }
});
router.post('/edit', checkAdmin, async(req, res) => {
    try {
        console.log('===========');
        console.log(req.body);
        req.checkBody('id', 'ID Not Defined').notEmpty();
        req.checkBody('firstname', 'First name can not be empty').notEmpty();
        req.checkBody('lastname', 'Last name can not be empty').notEmpty();
        req.checkBody('username', 'Username can not be empty').notEmpty();
        req.checkBody('email', 'Email can not be empty').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password can not be empty').notEmpty();
        req.checkBody('country', 'Country can not be empty').notEmpty();
        req.checkBody('confirmpassword', 'Confirm password can not be empty').notEmpty();
        req.check('password', 'Confirm password does not match the password.').equals(req.body.password);
        req.checkBody('address', 'Address can not be empty').notEmpty();
        req.checkBody('zipcode', 'Zip code can not be empty').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            return res.json({ status: 3, msg: errors });
        } else {
            var idUser = req.body.id;
            console.log(idUser);
            if (idUser) {
                return userModels.findOne({ id: idUser }).then((dataUserOne) => {
                    console.log(dataUserOne);
                    if (dataUserOne) {
                        dataUserOne.firstname = req.body.firstname;
                        dataUserOne.lastname = req.body.lastname;
                        dataUserOne.username = req.body.username;
                        dataUserOne.email = req.body.email;
                        dataUserOne.password = md5(req.body.password);
                        dataUserOne.country = req.body.country;
                        dataUserOne.address = req.body.address;
                        dataUserOne.zipcode = req.body.zipcode;
                        dataUserOne.save().then(() => {
                            return res.json({ status: 1, msg: "Success" });
                        });
                    } else {
                        return res.json({ status: 3, msg: 'ID Not Defined' });
                    }
                });
            } else {
                return res.json({ status: 3, msg: 'ID Not Defined' });
            }
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