var express = require('express');
var router = express.Router();
var TrafficModel = require('../../models/traffic');
var InforAppModel = require('../../models/inforapp');
var libBase64 = require('../../lib/base64');
var libCountry = require('../../lib/country');
var libCountryJson = libCountry.country;
var async = require('async');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var Base64js = require('js-base64').Base64;

//////////////Lần đầu truy cập app/////////////
router.get('/appaccess', (req, res) => {
    try {

        var reqAPIKey = req.query.apikey;

        var nameApp = req.query.nameapp;
        var platform = req.query.platform;
        var sessionIdUser = req.query.sessionid;
        var dateAccess = Date.now();
        var pageAccess = req.query.page;
        var sessionAccessPage = req.query.sessionpage;
        var sCountry = req.query.country;
        var checkIsHome = req.query.ishome;
        ///////////////////////

        var sIDCustomer, sNameCustomer, sEmailCustomer,
            sPhoneCustomer, sAddCustomer, sTimeAccess, sDateOutAccess, sPageTimeAccess, sPageDateOutAccess;
        if (req.query.idcustomer)
            sIDCustomer = req.query.idcustomer;
        else
            sIDCustomer = null;

        if (req.query.namecustomer)
            sNameCustomer = req.query.namecustomer;
        else
            sEmailCustomer = null;

        if (req.query.emailcustomer)
            sEmailCustomer = req.query.emailcustomer;
        else
            sEmailCustomer = null;

        if (req.query.phonecustomer)
            sPhoneCustomer = req.query.phonecustomer;
        else
            sPhoneCustomer = null;

        if (req.query.addresscustomer)
            sAddCustomer = req.query.addresscustomer;
        else
            sAddCustomer = null;

        // if (req.query.dateoutaccess)
        //     sDateOutAccess = req.query.dateoutaccess;
        // else
        //     sDateOutAccess = null;

        console.log(platform);
        console.log(sessionIdUser);
        console.log(pageAccess);
        console.log(sessionAccessPage);
        console.log(sCountry);
        console.log(checkIsHome);


        if (!reqAPIKey || !nameApp || !platform || !sessionIdUser || !pageAccess || !sessionAccessPage || !sCountry || !checkIsHome) {
            res.json({ status: 3, msg: 'Lỗi: Điều kiện không đủ' });
        } else {
            var arrCountry = '';
            // console.log(libCountryJson);
            async.each(libCountryJson, (item) => {
                // console.log('item: ' + item);
                if (item.code == sCountry) {
                    arrCountry = item;
                }
            });
            if (arrCountry == "")
                return res.json({ status: 3, msg: 'Country không xác định' });
            // console.log('arrCountry: ' + arrCountry);
            // var idApp = libBase64.Base64.encode(reqIDApp);
            InforAppModel.findOne({
                idApp: reqAPIKey
            }).then((data) => {
                console.log(data);
                if (data) {
                    var trafficData = new TrafficModel({
                        idApp: reqAPIKey,
                        nameApp: data.nameApp,
                        idCustomer: sIDCustomer,
                        nameCustomer: sNameCustomer,
                        emailCustomer: sEmailCustomer,
                        phoneNumerCustomer: sPhoneCustomer,
                        addCustomer: sAddCustomer,
                        sessionIdUser: sessionIdUser,
                        platform: platform,
                        dateAccess: dateAccess,
                        timeAccess: null,
                        dateOutSession: null,
                        pageAccess: [{
                            page: pageAccess,
                            dateAccess: Date.now(),
                            timeAccess: null,
                            dateOutSession: null,
                            sessionAccess: sessionAccessPage,
                            isHome: checkIsHome
                        }],
                        codeCountry: arrCountry.code,
                        country: arrCountry.name,
                        status: true
                    });
                    trafficData.save((err, kq) => {
                        if (err) {
                            console.log('loi: ' + err);
                            return res.json({
                                status: "3",
                                msg: err + ''
                            });
                        }

                        var sDateNow = Date.now();
                        TrafficModel.find({
                            $and: [{
                                dateOutSession: null
                            }, {
                                idApp: reqAPIKey
                            }]
                        }).count().exec((err, data) => {
                            if (err) {
                                return console.log(err);
                                // return res.render('error', { error: err, title: 'Error Data' });
                            }
                            console.log('data: ' + data);
                            req.io.sockets.emit('server-send-user-online', {
                                idApp: reqAPIKey,
                                userOnline: data
                            });
                        });
                        // console.log('đã connect socketio');
                        res.json({
                            status: 1,
                            msg: 'Thêm thành công bản ghi'
                        });
                    });
                } else {
                    return res.json({
                        status: 3,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            })
        }
        // currentonline
    } catch (error) {
        console.log(error);
        res.json({
            status: 3,
            msg: 'Lỗi: ' + error + ''
        });
    }
});

router.get('/pageaccess', (req, res) => {
    try {

        var reqAPIKey = req.query.apikey;
        console.log('reqAPIKey: ' + reqAPIKey);
        // var idApp = libBase64.Base64.encode(reqIDApp);
        // var nameApp = req.query.nameapp;
        // var platform = req.query.platform;
        var sSessionIdUser = req.query.sessionid;
        // var dateAccess = Date.now();
        var pageAccess = req.query.page;
        var sessionAccessPage = req.query.sessionpage;
        // var country = req.query.country;
        var checkIsHome = req.query.ishome;
        ///////////////////////
        var sIDCustomer, sNameCustomer, sEmailCustomer, sPlatforms,
            sPhoneCustomer, sAddCustomer, sTimeAccess, sDateOutAccess, sPageTimeAccess, sPageDateOutAccess;

        if (!reqAPIKey || !sSessionIdUser || !pageAccess || !sessionAccessPage || !checkIsHome) {
            res.json({ status: 3, msg: 'Lỗi: Điều kiện không đủ' });
        } else {
            InforAppModel.findOne({
                idApp: reqAPIKey
            }).then((data) => {
                console.log(data);
                if (data) {
                    TrafficModel.update({
                        idApp: reqAPIKey,
                        sessionIdUser: sSessionIdUser
                    }, {
                        "$push": {
                            pageAccess: {
                                page: pageAccess,
                                dateAccess: Date.now(),
                                timeAccess: null,
                                dateOutSession: null,
                                sessionAccess: sessionAccessPage,
                                isHome: checkIsHome
                            }
                        }
                    }, {
                        safe: true,
                        upsert: true
                    }).then(() => {
                        res.json({
                            status: 1,
                            msg: 'Cập nhật bản ghi thành công'
                        });
                    });

                } else {
                    res.json({
                        status: 2,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            })
        }
        // currentonline
    } catch (error) {
        console.log(error);
        res.json({
            status: 3,
            msg: 'Lỗi: ' + error + ''
        });
    }
});

router.get('/outapp', (req, res) => {
    try {

        var reqAPIKey = req.query.apikey;
        console.log('reqAPIKey: ' + reqAPIKey);
        // var idApp = libBase64.Base64.encode(reqIDApp);
        // var nameApp = req.query.nameapp;
        // var platform = req.query.platform;
        var sSessionIdUser = req.query.sessionid;
        // var dateAccess = Date.now();

        // var pageAccess = req.query.page;
        // var country = req.query.country;
        // var checkIsHome = req.body.ishome;
        ///////////////////////

        if (!reqAPIKey || !sSessionIdUser) {
            res.json({ status: 3, msg: 'Lỗi: Điều kiện không đủ' });
        } else {
            InforAppModel.findOne({
                idApp: reqAPIKey
            }).then(async(data) => {
                console.log(data);
                var sDateOut = Date.now();

                if (data) {
                    TrafficModel.findOne({
                        idApp: reqAPIKey,
                        sessionIdUser: sSessionIdUser
                    }).then((dataOne) => {
                        if (dataOne) {
                            var sTimeAccess = sDateOut - dataOne.dateAccess;
                            TrafficModel.update({
                                idApp: reqAPIKey,
                                sessionIdUser: sSessionIdUser
                            }, {
                                "$set": {
                                    timeAccess: sTimeAccess,
                                    dateOutSession: sDateOut
                                }
                            }).then(() => {
                                TrafficModel.find({
                                    $and: [{
                                        dateOutSession: null
                                    }, {
                                        idApp: reqAPIKey
                                    }]
                                }).count().exec((err, data) => {
                                    if (err) {
                                        return console.log(err);
                                        // return res.render('error', { error: err, title: 'Error Data' });
                                    }
                                    console.log('data: ' + data);
                                    req.io.sockets.emit('server-send-user-online', {
                                        idApp: reqAPIKey,
                                        userOnline: data
                                    });
                                });
                                // console.log('đã connect socketio');
                                return res.json({
                                    status: 1,
                                    msg: 'Cập nhật phiên làm việc thành công'
                                });
                            })
                        } else {
                            return res.json({
                                status: 3,
                                msg: 'Phiên làm việc không tồn tại.'
                            });
                        }
                    })
                } else {
                    res.json({
                        status: 2,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            })
        }
        // currentonline
    } catch (error) {
        console.log(error);
        res.json({
            status: 3,
            msg: 'Lỗi: ' + error + ''
        });
    }
});
router.get('/outpage', (req, res) => {
    try {

        var reqAPIKey = req.query.apikey;
        console.log('reqAPIKey: ' + reqAPIKey);
        // var idApp = libBase64.Base64.encode(reqIDApp);
        // var nameApp = req.query.nameapp;
        // var platform = req.query.platform;
        var sSessionIdUser = req.query.sessionid;
        // var dateAccess = Date.now();
        // var pageAccess = req.query.page;
        var sessionAccessPage = req.query.sessionpage;
        // var country = req.query.country;
        // var checkIsHome = req.body.ishome;
        ///////////////////////

        if (!reqAPIKey || !sSessionIdUser || !sessionAccessPage) {
            res.json({ status: 3, msg: 'Lỗi: Điều kiện không đủ' });
        } else {
            InforAppModel.findOne({
                idApp: reqAPIKey
            }).then(async(data) => {
                // console.log(data);
                var sDateOut = Date.now();
                if (data) {
                    TrafficModel.findOne({
                        idApp: reqAPIKey,
                        sessionIdUser: sSessionIdUser
                    }).then((dataOne) => {
                        if (dataOne) {
                            console.log('dataOne: ' + dataOne)
                            var sTimeAccess = sDateOut - dataOne.dateAccess;
                            TrafficModel.update({
                                idApp: reqAPIKey,
                                sessionIdUser: sSessionIdUser,
                                pageAccess: { $elemMatch: { sessionAccess: { $eq: sessionAccessPage } } }
                            }, {
                                "$set": {
                                    "pageAccess.$.timeAccess": sTimeAccess,
                                    "pageAccess.$.dateOutSession": sDateOut
                                }
                            }).then(() => {
                                return res.json({
                                    status: 1,
                                    msg: 'Cập nhật phiên làm việc của page thành công.'
                                });
                            })
                        } else {
                            return res.json({
                                status: 3,
                                msg: 'Không tồn tại phiên làm việc của app.'
                            });
                        }
                    });
                } else {
                    res.json({
                        status: 2,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            })
        }
        // currentonline
    } catch (error) {
        console.log(error);
        res.json({
            status: 3,
            msg: 'Lỗi: ' + error + ''
        });
    }
});






router.post('/inserarray', multipartMiddleware, (req, res) => {
    try {
        var idApp, nameApp, idOrder, codeOrder, nameCustomer, email, address, phoneNumber, addressShip, dateCreate, note;
        var discount, feeShip, feeVat, totalMonney, methodPayment, methodOrder, curency, statusOrder, status;
        var idProduct, nameProduct, productCode, size, color, image, price, quantity;

        idApp = req.body.ten;
        console.log(idApp);
        console.log('clmm');
        idapp = Object(idApp);
        console.log(typeof idapp);
        console.log(idapp);
        res.json({
            status: 1,
            msg: 'idApp: ' + idApp
        });

    } catch (error) {
        console.log(error);
        res.json({
            status: 3,
            msg: 'Lỗi: ' + error + ''
        });
    }
});
module.exports = router;