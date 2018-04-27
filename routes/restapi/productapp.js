var express = require('express');
var router = express.Router();
var TrafficModel = require('../../models/traffic');
var InforAppModel = require('../../models/inforapp');
var ProductStatisticModels = require('../../models/productstatistic');
var libBase64 = require('../../lib/base64');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var Base64js = require('js-base64').Base64;


router.post('/accessproductpage', multipartMiddleware, (req, res) => {
    try {
        var reqIDApp = req.body.idapp;
        console.log('reqIDApp: ' + reqIDApp);
        var sNameApp = req.body.nameapp;
        var sIDProduct = req.body.idproduct;
        var sNameProduct = req.body.nameproduct;
        var sSessionProduct = req.body.sessionproduct;

        var sImage;
        if (!reqIDApp || !sNameApp || !sIDProduct || !sNameProduct || !sSessionProduct) {
            res.json({ status: 3, msg: 'Lỗi: Điều kiện không đủ' });
        } else {
            var sIDApp = libBase64.Base64.encode(reqIDApp);
            InforAppModel.findOne({
                idApp: sIDApp
            }).then((data) => {
                console.log(data);
                if (data) {
                    if (req.body.image)
                        sImage = req.body.image;
                    else
                        sImage = '';
                    var productStatisticData = new ProductStatisticModels({
                        idApp: sIDApp,
                        nameApp: sNameApp,
                        idProduct: sIDProduct,
                        name: sNameProduct,
                        image: sImage,
                        sessionProduct: sSessionProduct,
                        dateAccess: Date.now(),
                        timeAccess: null,
                        dateOutSession: null,
                        dateCreate: Date.now(),
                        status: true
                    });
                    productStatisticData.save().then(() => {
                        return res.json({ status: 1, msg: 'Đã thêm 1 bản ghi.' });
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


router.get('/outproductpage', multipartMiddleware, (req, res) => {
    try {
        var reqIDApp = req.query.idapp;
        console.log('reqIDApp: ' + reqIDApp);
        var sIDProduct = req.query.idproduct;
        var sSessionProduct = req.query.sessionproduct;

        var sImage;
        if (!reqIDApp || !sIDProduct || !sSessionProduct) {
            res.json({ status: 3, msg: 'Lỗi: Điều kiện không đủ' });
        } else {
            var sIDApp = libBase64.Base64.encode(reqIDApp);
            InforAppModel.findOne({
                idApp: sIDApp
            }).then((data) => {
                // console.log(data);
                if (data) {

                    ProductStatisticModels.findOne({
                        idApp: sIDApp,
                        idProduct: sIDProduct,
                        sessionProduct: sSessionProduct
                    }).then((data) => {
                        if (data) {
                            console.log(data);
                            var sDateOut = Date.now();
                            console.log(data.dateAccess);
                            var sTimeAccess = sDateOut - data.dateAccess;

                            ProductStatisticModels.update({
                                idApp: sIDApp,
                                idProduct: sIDProduct,
                                sessionProduct: sSessionProduct
                            }, {
                                $set: {
                                    dateOutAccess: sDateOut,
                                    timeAccess: sTimeAccess
                                }
                            }).then(() => {
                                return res.json({
                                    status: 1,
                                    msg: 'Cập nhật phiên làm việc thành công.'
                                });
                            })
                        } else {
                            return res.json({
                                status: 3,
                                msg: 'Không tồn tại phiên làm việc của product.'
                            });
                        }
                    })
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