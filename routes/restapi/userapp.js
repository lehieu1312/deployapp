var express = require('express');
var router = express.Router();
var TrafficModel = require('../../models/traffic');
var InforAppModel = require('../../models/inforapp');
var UsersOfAppModels = require('../../models/userofapp');
var UserStatisticModels = require('../../models/userstatistic');

var libBase64 = require('../../lib/base64');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var Base64js = require('js-base64').Base64;
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('/addnewuser', multipartMiddleware, (req, res) => {
    try {
        console.log(req.body);
        var reqAPIKey = req.body.apikey;
        console.log('reqAPIKey: ' + reqAPIKey);
        var sNameApp = req.body.nameapp;
        var sIDUser = req.body.iduser;
        var sEmail = req.body.email;
        var sFirstName, sLastName, sUserName, sAddress, sCity, sZipCode, sCompany, sPhoneNumber;

        if (!reqAPIKey || !sNameApp || !sIDUser || !sEmail) {
            return res.json({ status: 2, msg: 'Điều kiện không đủ.' });
        } else {
            if (req.body.firtsname) {
                sFirstName = req.body.firtsname;
            } else {
                sFirstName = '';
            }
            if (req.body.lastname) {
                sLastName = req.body.lastname;
            } else {
                sLastName = '';
            }
            if (req.body.lastname) {
                sLastName = req.body.lastname;
            } else {
                sLastName = '';
            }
            if (req.body.username) {
                sUserName = req.body.username;
            } else {
                sUserName = '';
            }
            if (req.body.address) {
                sAddress = req.body.address;
            } else {
                sAddress = '';
            }
            if (req.body.city) {
                sCity = req.body.city;
            } else {
                sCity = '';
            }
            if (req.body.zipcode) {
                sZipCode = req.body.zipcode;
            } else {
                sZipCode = '';
            }
            if (req.body.company) {
                sCompany = req.body.company;
            } else {
                sCompany = '';
            }
            if (req.body.phonenumber) {
                sPhoneNumber = req.body.phonenumber;
            } else {
                sPhoneNumber = '';
            }

            InforAppModel.findOne({
                idApp: reqAPIKey
            }).then((data) => {
                if (data) {
                    var userAppData = new UsersOfAppModels({
                        idApp: reqAPIKey,
                        nameApp: sNameApp,
                        idUserApp: sIDUser,
                        email: sEmail,
                        firstName: sFirstName,
                        lastName: sLastName,
                        userName: sUserName,
                        address: sAddress,
                        city: sCity,
                        zipCode: sZipCode,
                        company: sCompany,
                        phoneNumber: sPhoneNumber,
                        dateCreate: Date.now(),
                        dateUpdate: Date.now(),
                        status: true
                    });
                    userAppData.save().then(() => {
                        return res.json({ status: 1, msg: 'Đã thêm thành công 1 user' })
                    });
                } else {
                    return res.json({
                        status: 3,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            });
        }


    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }
});
router.post('/userlogin', multipartMiddleware, (req, res) => {
    try {
        var reqAPIKey = req.body.apikey;
        console.log('reqAPIKey: ' + reqAPIKey);

        var sNameApp = req.body.nameapp;
        var sIDUser = req.body.iduser;
        var sEmail = req.body.email;
        var sSessionUser = req.body.sessionuser;
        var sUserName = req.body.username;
        console.log(reqAPIKey);
        var sFirstName, sLastName, sAddress, sCity, sZipCode, sCompany, sPhoneNumber;

        if (!reqAPIKey || !sNameApp || !sIDUser || !sEmail || !sSessionUser || !sUserName) {
            return res.json({ status: 2, msg: 'Điều kiện không đủ.' });
        } else {
            if (req.body.firtsname) {
                sFirstName = req.body.firtsname;
            } else {
                sFirstName = '';
            }
            if (req.body.lastname) {
                sLastName = req.body.lastname;
            } else {
                sLastName = '';
            }
            if (req.body.lastname) {
                sLastName = req.body.lastname;
            } else {
                sLastName = '';
            }
            if (req.body.address) {
                sAddress = req.body.address;
            } else {
                sAddress = '';
            }
            if (req.body.city) {
                sCity = req.body.city;
            } else {
                sCity = '';
            }
            if (req.body.zipcode) {
                sZipCode = req.body.zipcode;
            } else {
                sZipCode = '';
            }
            if (req.body.company) {
                sCompany = req.body.company;
            } else {
                sCompany = '';
            }
            if (req.body.phonenumber) {
                sPhoneNumber = req.body.phonenumber;
            } else {
                sPhoneNumber = '';
            }
            // var sIDApp = libBase64.Base64.encode(reqIDApp);
            // console.log(sIDApp);
            InforAppModel.findOne({
                idApp: reqAPIKey
            }).then((data) => {
                if (data) {
                    UsersOfAppModels.findOne({
                        idApp: reqAPIKey,
                        idUser: sIDUser
                    }).then((dataUser) => {
                        if (dataUser) {
                            var userAppData = new UserStatisticModels({
                                idApp: reqAPIKey,
                                nameApp: sNameApp,
                                idUser: sIDUser,
                                email: sEmail,
                                firstName: sFirstName,
                                lastName: sLastName,
                                userName: sUserName,
                                address: sAddress,
                                city: sCity,
                                zipCode: sZipCode,
                                company: sCompany,
                                phoneNumber: sPhoneNumber,
                                sessionUser: sSessionUser,
                                dateAccess: Date.now(),
                                timeAccess: null,
                                dateOutSession: null,
                                status: true
                            });
                            userAppData.save().then(() => {
                                return res.json({ status: 1, msg: 'Đã thêm thành công 1 bản ghi.' })
                            });
                        } else {
                            return res.json({
                                status: 3,
                                msg: 'Không tồn tại user trên server.'
                            });
                        }
                    });
                } else {
                    return res.json({
                        status: 3,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }
});
router.post('/userlogout', multipartMiddleware, (req, res) => {
    try {
        console.log(req.body);
        var reqAPIKey = req.body.apikey;
        console.log('reqAPIKey: ' + reqAPIKey);

        var sIDUser = req.body.iduser;
        var sSessionUser = req.body.sessionuser;
        console.log(reqAPIKey);
        console.log(sIDUser);
        console.log(sSessionUser);


        if (!reqAPIKey || !sIDUser || !sSessionUser) {
            return res.json({ status: 2, msg: 'Điều kiện không đủ.' });
        } else {


            InforAppModel.findOne({
                idApp: reqAPIKey
            }).then((data) => {
                if (data) {
                    UsersOfAppModels.findOne({
                        idApp: reqAPIKey,
                        idUserApp: sIDUser
                    }).then((dataUser) => {
                        if (dataUser) {
                            UserStatisticModels.findOne({
                                idApp: reqAPIKey,
                                idUser: sIDUser,
                                sessionUser: sSessionUser
                            }).then((dataCheckSession) => {
                                if (dataCheckSession) {
                                    var sDateOut = Date.now();
                                    var sTimeAccess = sDateOut - dataCheckSession.dateAccess;
                                    UserStatisticModels.update({
                                        idApp: reqAPIKey,
                                        idUser: sIDUser,
                                        sessionUser: sSessionUser
                                    }, {
                                        $set: {
                                            timeAccess: sTimeAccess,
                                            dateOutSession: sDateOut
                                        }
                                    }).then(() => {
                                        return res.json({ status: 1, msg: 'Cập nhật phiên làm việc thành công.' })
                                    });
                                } else {
                                    return res.json({
                                        status: 3,
                                        msg: 'Không tồn tại phiên làm việc của user.'
                                    });
                                }
                            });
                        } else {
                            return res.json({
                                status: 3,
                                msg: 'Không tồn tại user trên server.'
                            });
                        }
                    });
                } else {
                    return res.json({
                        status: 3,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            });
        }

    } catch (error) {
        console.log(error);
        return res.json({ status: 3, msg: error + '' });
    }
});

module.exports = router;