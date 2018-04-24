var express = require('express');
var router = express.Router();
var TrafficModel = require('../../models/traffic');
var InforAppModel = require('../../models/inforapp');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/insertorderapp', multipartMiddleware, (req, res) => {
    try {
        var idApp, nameApp, idOrder, codeOrder, nameCustomer, email, address, phoneNumber, addressShip, dateCreate, note;
        var discount, feeShip, feeVat, totalMonney, methodPayment, methodOrder, curency, statusOrder, status;
        var idProduct, nameProduct, productCode, size, color, image, price, quantity;

        idApp = req.body.idapp;
        nameApp = req.body.nameapp;
        idOrder = req.body.idorder;
        codeOrder = req.body.codeorder;
        nameCustomer = req.body.namecustomer;
        email = req.body.email;
        address = req.body.address;
        phoneNumber = req.body.phonenumber;
        addressShip = req.body.addressship;
        dateCreate = new Date();
        note = req.body.note;




        console.log(idOrder);
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