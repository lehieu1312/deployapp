var express = require('express');
var router = express.Router();
var TrafficModel = require('../../models/traffic');
var InforAppModel = require('../../models/inforapp');
var OrderOfAppModels = require('../../models/orderofapp')
var multipart = require('connect-multiparty');
var async = require('async');
var md5 = require('md5');

var multipartMiddleware = multipart();

router.post('/vieworder', multipartMiddleware, (req, res) => {
    console.log(req.body);
    if (req.body.product) {
        for (var i = 0; i < req.body.product.length; i++) {
            console.log(req.body.product[i]);
        }
    }
    res.json({ status: 1, msg: "success" });
});
router.post('/addneworder', multipartMiddleware, (req, res) => {
    try {
        console.log(req.body)


        var sApiKey, sNameApp, sIDOrder, sCodeOrder, sNameCustomer, sEmail, sAddress, sPhoneNumber, sAddressShip, sDateCreate, sNote;
        var sDiscount, sFeeShip, sFeeVat, sTotalMonney, sMethodPayment, sMethodOrder, sCurency, sStatusOrder, sStatus;
        var sProduct, sIDProduct, sNameProduct, sProductCode, sSize, sColor, sImage, sPrice, sQuantity;
        if (req.body.apikey) {
            sApiKey = req.body.apikey;
        } else {
            sApiKey = null;
        }
        if (req.body.nameapp) {
            sNameApp = req.body.nameapp;
        } else {
            sNameApp = null;
        }
        if (req.body.idorder) {
            sIDOrder = req.body.idorder;
        } else {
            sIDOrder = null;
        }
        if (req.body.codeorder) {
            sCodeOrder = req.body.codeorder;
        } else {
            sCodeOrder = null;
        }
        if (req.body.namecustomer) {
            sNameCustomer = req.body.namecustomer;
        } else {
            sNameCustomer = null;
        }
        if (req.body.email) {
            sEmail = req.body.email;
        } else {
            sEmail = null;
        }
        if (req.body.address) {
            sAddress = req.body.address;
        } else {
            sAddress = null;
        }
        if (req.body.phonenumber) {
            sPhoneNumber = req.body.phonenumber;
        } else {
            sPhoneNumber = null;
        }
        if (req.body.addressship) {
            sAddressShip = req.body.addressship;
        } else {
            sAddressShip = null;
        }
        if (req.body.note) {
            sNote = req.body.note;
        } else {
            sNote = null;
        }
        sDateCreate = new Date();
        if (req.body.discount) {
            sDiscount = req.body.discount;
        } else {
            sDiscount = null;
        }
        if (req.body.feeship) {
            sFeeShip = req.body.feeship;
        } else {
            sFeeShip = null;
        }
        if (req.body.feevat) {
            sFeeVat = req.body.feevat;
        } else {
            sFeeVat = null;
        }
        if (req.body.totalmoney) {
            sTotalMonney = req.body.totalmoney;
        } else {
            sTotalMonney = null;
        }
        if (req.body.methodpayment) {
            sMethodPayment = req.body.methodpayment;
        } else {
            sMethodPayment = null;
        }
        if (req.body.methodorder) {
            sMethodOrder = req.body.methodorder;
        } else {
            sMethodOrder = null;
        }
        if (req.body.curency) {
            sCurency = req.body.curency;
        } else {
            sCurency = '$';
        }
        if (req.body.statusorder) {
            sStatusOrder = req.body.statusorder;
        } else {
            sStatusOrder = null;
        }
        if (req.body.product) {
            sProduct = req.body.product;
        } else {
            sProduct = null;
        }
        console.log(sApiKey);
        console.log(sNameApp);
        console.log(sIDOrder);
        console.log(sCodeOrder);
        console.log(sNameCustomer);
        console.log(sEmail);
        console.log(sAddress);
        console.log(sPhoneNumber);
        console.log(sAddressShip);
        console.log(sFeeShip);
        console.log(sFeeVat);
        console.log(sTotalMonney);
        console.log(sMethodPayment);
        console.log(sStatusOrder);

        console.log(sProduct);
        if (!sApiKey || !sNameApp || !sIDOrder || !sCodeOrder || !sNameCustomer || !sEmail || !sAddress || !sPhoneNumber || !sAddressShip || !sFeeShip || !sFeeVat || !sTotalMonney || !sMethodPayment || !sStatusOrder || !sProduct) {
            return res.json({
                status: 3,
                msg: 'Lỗi: Điều kiện không đủ'
            });
        } else {
            (async() => {
                for (let i = 0; i < sProduct.length; i++) {
                    console.log(sProduct[i]);
                    console.log(sProduct[i].idproduct);
                    console.log(sProduct[i].nameproduct);
                    if (!sProduct[i].idproduct || !sProduct[i].nameproduct || !sProduct[i].codeproduct || !sProduct[i].image || !sProduct[i].size || !sProduct[i].color || !sProduct[i].price || !sProduct[i].quantity) {
                        return res.json({
                            status: 3,
                            msg: 'Lỗi: Điều kiện của sản phẩm không đủ'
                        });
                    }
                }
            })

            InforAppModel.findOne({
                idApp: sApiKey
            }).then((checkInfor) => {
                console.log('insert');
                if (checkInfor) {
                    var orderData = new OrderOfAppModels({
                        id: md5(Date.now()),
                        idApp: sApiKey,
                        nameApp: sNameApp,
                        idOrder: sIDOrder,
                        codeOrder: sCodeOrder,
                        nameCustomer: sNameCustomer,
                        email: sEmail,
                        address: sAddress,
                        phoneNumber: sPhoneNumber,
                        addressShip: sAddressShip,
                        dateCreate: sDateCreate,
                        note: sNote,
                        discount: sDiscount,
                        feeShip: sFeeShip,
                        feeVat: sFeeVat,
                        product: [],
                        totalMonney: sTotalMonney,
                        methodPayment: sMethodPayment,
                        methodOrder: sMethodOrder,
                        curency: sCurency,
                        statusOrder: sStatusOrder,
                        status: true
                    });
                    orderData.save((err, data) => {
                        if (err) {
                            return res.json({
                                status: "3",
                                msg: err + ''
                            });
                        }
                        console.log('----------');
                        console.log(data);
                        (async() => {
                            for (var i = 0; i < sProduct.length; i++) {
                                await OrderOfAppModels.update({ id: data.id }, {
                                    $push: {
                                        product: {
                                            id: md5(Date.now()),
                                            idProduct: sProduct[i].idproduct,
                                            image: sProduct[i].image,
                                            nameProduct: sProduct[i].nameproduct,
                                            size: sProduct[i].size,
                                            color: sProduct[i].color,
                                            productCode: sProduct[i].codeproduct,
                                            price: sProduct[i].price,
                                            quantity: sProduct[i].quantity
                                        }
                                    }
                                }, {
                                    safe: true,
                                    upsert: false
                                }).exec();
                            }
                        })()

                        res.json({
                            status: 1,
                            msg: 'Thêm thành công bản ghi'
                        });
                    });
                } else {
                    return res.json({
                        status: 2,
                        msg: 'Không tồn tại app trên server.'
                    });
                }
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: 3,
            msg: 'Lỗi: ' + error + ''
        });
    }
});
module.exports = router;