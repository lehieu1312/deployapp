var express = require('express');
var router = express.Router();
var TrafficModel = require('../../models/traffic');
var InforAppModel = require('../../models/inforapp');
var OrderOfApp = require('../../models/userofapp')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/insertorderapp', multipartMiddleware, (req, res) => {
    try {
        console.log(req.body)
        var idApp, nameApp, idOrder, codeOrder, nameCustomer, email, address, phoneNumber, addressShip, dateCreate, note;
        var discount, feeShip, feeVat, totalMonney, methodPayment, methodOrder, curency, statusOrder, status;
        var product, idProduct, nameProduct, productCode, size, color, image, price, quantity;
        if (req.body.idapp) {
            idApp = req.body.idapp;
        } else {
            idApp = null;
        }
        if (req.body.nameapp) {
            nameApp = req.body.nameapp;
        } else {
            nameApp = null;
        }
        if (req.body.idorder) {
            idOrder = req.body.idorder;
        } else {
            idOrder = null;
        }
        if (req.body.codeorder) {
            codeOrder = req.body.codeorder;
        } else {
            codeOrder = null;
        }
        if (req.body.namecustomer) {
            nameCustomer = req.body.namecustomer;
        } else {
            nameCustomer = null;
        }
        if (req.body.email) {
            email = req.body.email;
        } else {
            email = null;
        }
        if (req.body.address) {
            address = req.body.address;
        } else {
            address = null;
        }
        if (req.body.phonenumber) {
            phoneNumber = req.body.phonenumber;
        } else {
            phoneNumber = null;
        }
        if (req.body.addressship) {
            addressShip = req.body.addressship;
        } else {
            addressShip = null;
        }
        if (req.body.note) {
            note = req.body.note;
        } else {
            note = null;
        }
        dateCreate = new Date();
        if (req.body.discount) {
            discount = req.body.discount;
        } else {
            discount = null;
        }
        if (req.body.feeship) {
            feeShip = req.body.feeship;
        } else {
            feeShip = null;
        }
        if (req.body.feevat) {
            feeVat = req.body.feevat;
        } else {
            feeVat = null;
        }
        if (req.body.totalMonney) {
            totalMonney = req.body.totalMonney;
        } else {
            totalMonney = null;
        }
        if (req.body.methodpayment) {
            methodPayment = req.body.methodpayment;
        } else {
            methodPayment = null;
        }
        if (req.body.curency) {
            curency = req.body.curency;
        } else {
            curency = null;
        }
        if (req.body.statusorder) {
            statusOrder = req.body.statusorder;
        } else {
            statusOrder = null;
        }
        if (req.body.product) {
            product = req.body.product;
        } else {
            product = null;
        }
        if (!idApp || !nameApp || !idOrder || !codeOrder || !nameCustomer || !email || !address || !phoneNumber || !addressShip || !feeShip || !feeVat || !totalMonney || !methodPayment || !statusOrder || !product) {
            res.json({
                status: 3,
                msg: 'Lỗi: Điều kiện không đủ'
            });
        } else {
            for (let i = 0; i < product.length; i++) {
                if (!product[i].idProduct || !product[i].nameProduct || !product[i].productCode || !product[i].size || !product[i].color || !product[i].price || !product[i].quantity) {
                    res.json({
                        status: 3,
                        msg: 'Lỗi: Điều kiện của sản phẩm không đủ'
                    });
                }
            }
            InforAppModel.findOne({
                idApp
            }).then((infor) => {
                if (infor) {
                    var order = new OrderOfApp({
                        idApp,
                        nameApp,
                        idOrder,
                        codeOrder,
                        nameCustomer,
                        email,
                        address,
                        phoneNumber,
                        addressShip,
                        dateCreate,
                        note,
                        discount,
                        feeShip,
                        feeVat,
                        product,
                        totalMonney,
                        methodPayment,
                        methodOrder,
                        curency,
                        statusOrder,
                        status: true
                    });
                    order.save((err, data) => {
                        if (err) {
                            return res.json({
                                status: "3",
                                msg: err + ''
                            });
                        }
                        res.json({
                            status: 1,
                            msg: 'Thêm thành công bản ghi'
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
        res.json({
            status: 1,
            msg: 'idApp: ' + idApp + ' ,idOrder: ' + idOrder
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