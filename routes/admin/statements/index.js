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

var withdrawModels = require('../../../models/withdraw');
var orderModels = require('../../../models/order');

router.get('/', checkAdmin, async(req, res) => {
    try {
        req.session.breadcrumbs = [
            { name: "Admin", url: "admin" },
            { name: "Statement", url: "admin/statement" }
        ];
        var arrData = [];
        var arrDataMath = [];
        var sRevenue = 0,
            sWithdraw = 0,
            sProfit = 0,
            sPending = 0,
            pRevenue = 0,
            pWithdraw = 0,
            pProfit = 0,
            pPending = 0,
            checkRevenue = 0,
            checkWithdraw = 0,
            checkProfit = 0,
            checkPending = 0;

        if (!req.query.st) {

            withdrawModels.find({}, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusWithdraw: 1, isWithdraw: 1, dateCreate: 1, status: 1 }).then((dataWithdraw) => {
                // console.log(dataWithdraw);
                async.forEach(dataWithdraw, (item) => {
                    arrData.push(item);
                    if (item.statusWithdraw == 2) {
                        sWithdraw += item.amount;
                    }
                    if (item.statusWithdraw == 1) {
                        sPending += item.amount;
                    }
                });
                // console.log(sWithdraw);
                console.log('=====================================================================');
                orderModels.find({}, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusOrder: 1, isOrder: 1, dateCreate: 1, status: 1 }).then((dataOrders) => {
                    async.forEach(dataOrders, (item) => {
                        arrData.push(item);
                        sRevenue += item.amount;
                    });
                    // console.log(sRevenue);
                    console.log('=====================================================================');
                    sProfit = sRevenue - sWithdraw;
                    // console.log(sProfit);
                    arrData = arrData.slice(0);
                    arrData.sort(function(a, b) {
                        return a.dateCreate - b.dateCreate;
                    });
                    console.log(arrData);
                    res.render('admin/statements/index', {
                        data: arrData,
                        sRevenue,
                        sWithdraw,
                        sProfit,
                        sPending,
                        pRevenue,
                        pWithdraw,
                        pProfit,
                        pPending,
                        moment,
                        checkRevenue,
                        checkWithdraw,
                        checkProfit,
                        checkPending,
                        title: "Statements"
                    });
                    // alert(keysSorted);
                });
            });
        } else {
            ///////////////Hours Ago//////////////////////////////////////////////////////////////////////////////////////////////////////////
            if (req.query.st == 'hoursago') {
                var sRevenueTwoHours = 0,
                    sWithdrawTwoHours = 0,
                    sProfitTwoHours = 0,
                    sPendingTwoHours = 0;

                var sDateNow = new Date();
                console.log(sDateNow);
                // console.log(moment(sDateNow).format('DD/MM/YYYY HH:mm:ss'));
                // var mathDateHoursAgo = sDateNow - (1000 * 60 * 60);
                var mathDateTwoHours = sDateNow - (1000 * 60 * 120);
                var mathDateHoursAgo = new Date(sDateNow.getFullYear(), sDateNow.getMonth(), sDateNow.getDate(), sDateNow.getHours() - 1, sDateNow.getMinutes(), sDateNow.getSeconds());
                // console.log(mathDateHoursAgo.toUTCString());
                console.log(mathDateTwoHours);
                // console.log(moment(mathDateTwoHours).format('DD/MM/YYYY HH:mm:ss'));
                // console.log(moment(mathDateTwoHours).format('DD/MM/YYYY HH:mm:ss'));

                console.log('==================================Hours Ago===================================');

                var dataWithdrawHoursAgo = await withdrawModels.find({ dateCreate: { $gt: mathDateHoursAgo, $lt: sDateNow } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusWithdraw: 1, isWithdraw: 1, dateCreate: 1, status: 1 }).exec();
                console.log('dataWithdrawHoursAgo');
                console.log(dataWithdrawHoursAgo);
                async.forEach(dataWithdrawHoursAgo, (item) => {
                    console.log()
                    arrData.push(item);
                    if (item.statusWithdraw == 2) {
                        sWithdraw += item.amount;
                    }
                    if (item.statusWithdraw == 1) {
                        sPending += item.amount;
                    }
                });
                console.log(sWithdraw);

                var dataOrdersHoursAgo = await orderModels.find({ dateCreate: { $gt: mathDateHoursAgo, $lt: sDateNow } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusOrder: 1, isOrder: 1, dateCreate: 1, status: 1 }).exec();
                console.log('dataOrdersHoursAgo');
                console.log(dataOrdersHoursAgo);
                async.forEach(dataOrdersHoursAgo, (item) => {
                    arrData.push(item);
                    sRevenue += item.amount;
                });
                console.log(sRevenue);
                sProfit = sRevenue - sWithdraw;

                console.log('=================================2 Hours ====================================');
                var dataWithdrawTwoHours = await withdrawModels.find({ dateCreate: { $lt: mathDateHoursAgo, $gt: mathDateTwoHours } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusWithdraw: 1, isWithdraw: 1, dateCreate: 1, status: 1 }).exec();
                console.log(dataWithdrawTwoHours);
                async.forEach(dataWithdrawTwoHours, (item) => {
                    arrDataMath.push(item);
                    if (item.statusWithdraw == 2) {
                        sWithdrawTwoHours += item.amount;
                    }
                    if (item.statusWithdraw == 1) {
                        sPendingTwoHours += item.amount;
                    }
                });

                var dataOrdersTwoHours = await orderModels.find({ $and: [{ dateCreate: { $lt: mathDateHoursAgo } }, { dateCreate: { $gt: mathDateTwoHours } }] }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusOrder: 1, isOrder: 1, dateCreate: 1, status: 1 }).exec();
                async.forEach(dataOrdersTwoHours, (item) => {
                    arrDataMath.push(item);
                    sRevenueTwoHours += item.amount;
                });
                sProfitTwoHours = sRevenueTwoHours - sWithdrawTwoHours;
                console.log('=================================close====================================');
                // console.log(sProfit);
                arrData = arrData.slice(0);
                arrData.sort(function(a, b) {
                    return a.dateCreate - b.dateCreate;
                });
                //////////////////
                if (sRevenue == 0 && sRevenueTwoHours != 0) {
                    checkRevenue = 0;
                    pRevenue = 100;
                } else if (sRevenue != 0 && sRevenueTwoHours == 0) {
                    checkRevenue = 1;
                    pRevenue = 100;
                } else if (sRevenue == 0 && sRevenueTwoHours == 0) {
                    checkRevenue = 0;
                    pRevenue = 0;
                } else if (sRevenue <= sRevenueTwoHours) {
                    checkRevenue = 0;
                    var vTemp = sRevenueTwoHours - sRevenue;
                    pRevenue = (vTemp * 100 / sRevenueTwoHours).toFixed(2);
                } else {
                    checkRevenue = 1;
                    var vTemp = sRevenue - sRevenueTwoHours;
                    pRevenue = (vTemp * 100 / sRevenueTwoHours).toFixed(2);
                }

                //////////////////////
                if (sWithdraw == 0 && sWithdrawTwoHours != 0) {
                    checkWithdraw = 0;
                    pWithdraw = 100;
                } else if (sWithdraw != 0 && sWithdrawTwoHours == 0) {
                    checkWithdraw = 1;
                    pWithdraw = 100;
                } else if (sWithdraw == 0 && sWithdrawTwoHours == 0) {
                    checkWithdraw = 0;
                    pWithdraw = 0;
                } else if (sWithdraw <= sWithdrawTwoHours) {
                    checkWithdraw = 0;
                    var vTemp = sWithdrawTwoHours - sWithdraw;
                    pWithdraw = (vTemp * 100 / sWithdrawTwoHours).toFixed(2);
                } else {
                    checkWithdraw = 1;
                    var vTemp = sWithdraw - sWithdrawTwoHours;
                    pWithdraw = (vTemp * 100 / sWithdrawTwoHours).toFixed(2);
                }

                //////////////////////
                if (sProfit == 0 && sProfitTwoHours != 0) {
                    checkProfit = 0;
                    pProfit = 100;
                } else if (sProfit != 0 && sProfitTwoHours == 0) {
                    checkProfit = 1;
                    pProfit = 100;
                } else if (sProfit == 0 && sProfitTwoHours == 0) {
                    checkProfit = 0;
                    pProfit = 0;
                } else if (sProfit <= sProfitTwoHours) {
                    checkProfit = 0;
                    var vTemp = sProfitTwoHours - sProfit;
                    pProfit = (vTemp * 100 / sProfitTwoHours).toFixed(2);
                } else {
                    checkProfit = 1;
                    var vTemp = sProfit - sProfitTwoHours;
                    if (sProfitTwoHours < 0) {
                        pProfit = (vTemp * 100 / -(sProfitTwoHours)).toFixed(2);
                    } else {
                        pProfit = (vTemp * 100 / sProfitTwoHours).toFixed(2);
                    }
                    // pProfit = (vTemp * 100 / sProfitTwoHours).toFixed(2);
                }
                /////////////////////
                if (sPending == 0 && sPendingTwoHours != 0) {
                    checkPending = 0;
                    pPending = 100;
                } else if (sPending != 0 && sPendingTwoHours == 0) {
                    checkPending = 1;
                    pPending = 100;
                } else if (sPending == 0 && sPendingTwoHours == 0) {
                    checkPending = 0;
                    pPending = 0;
                } else if (sPending <= sPendingTwoHours) {
                    checkPending = 0;
                    var vTemp = sPendingTwoHours - sPending;
                    pPending = (vTemp * 100 / sPendingTwoHours).toFixed(2);
                } else {
                    checkPending = 1;
                    var vTemp = sPending - sPendingTwoHours;
                    pPending = (vTemp * 100 / sPendingTwoHours).toFixed(2);
                }
                /////////////Yesterday////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            } else if (req.query.st == "yesterday") {
                console.log('YesterDay');
                var dateNow = new Date();
                // console.log(moment(dateNow).format())
                var mathDateNow = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
                var mathDateYesterDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 1);
                var mathDateTwoDayAgo = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 2);

                console.log("Ngày hôm nay: " + mathDateNow);
                console.log("Ngày hôm qua: " + mathDateYesterDay);
                console.log("Ngày hôm kia: " + mathDateTwoDayAgo);
                var sRevenueTwoDayAgo = 0,
                    sWithdrawTwoDayAgo = 0,
                    sProfitTwoDayAgo = 0,
                    sPendingTwoDayAgo = 0;

                // var mathDateYesterDay = dateNow.getTime() - dateNow.getHours
                // var mathDateTwoDayAgo = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 2);

                // console.log(moment(mathDateYesterDay).format('DD/MM/YYYY HH:mm:ss'));
                // console.log(moment(mathDateTwoDayAgo).format('DD/MM/YYYY HH:mm:ss'));
                // console.log(mathDateNow.getTime());
                // console.log(mathDateYesterDay.getTime());
                // var datetest = new Date('2018-01-12 03:33:10.407Z').getTime();
                // console.log(datetest);

                // mathDateNow = moment(mathDateNow).format('YYYY-MM-DD HH:mm:ss');
                // mathDateYesterDay = moment(mathDateYesterDay).format('YYYY-MM-DD HH:mm:ss');
                // console.log(mathDateNow);
                // console.log(mathDateYesterDay);
                //////////////////////////////////
                // var startDate = new Date(); 
                // // this is the starting date that looks like ISODate("2014-10-03T04:00:00.188Z")

                // startDate.setSeconds(0);
                // startDate.setHours(0);
                // startDate.setMinutes(0);
                // // console.log(startDate);
                // startDate = (startDate.getDate() + 1);
                // // console.log(startDate);
                // var dateMidnight = new Date(startDate);
                // dateMidnight.setHours(23);
                // dateMidnight.setMinutes(59);
                // dateMidnight.setSeconds(59);
                console.log('==================================Yester Day===================================');
                // var sDateNow = Date.now();
                // console.log(new Date().toISOString());

                var dataWithdrawYesterDay = await withdrawModels.find({ dateCreate: { $gt: mathDateYesterDay, $lt: mathDateNow } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusWithdraw: 1, isWithdraw: 1, dateCreate: 1, status: 1 }).exec();
                console.log('dataWithdrawYesterDay');
                console.log(dataWithdrawYesterDay);
                async.forEach(dataWithdrawYesterDay, (item) => {
                    arrData.push(item);
                    if (item.statusWithdraw == 2) {
                        sWithdraw += item.amount;
                    }
                    if (item.statusWithdraw == 1) {
                        sPending += item.amount;
                    }
                });
                var dataOrdersYesterDay = await orderModels.find({ $and: [{ dateCreate: { $gt: mathDateYesterDay } }, { dateCreate: { $lt: mathDateNow } }] }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusOrder: 1, isOrder: 1, dateCreate: 1, status: 1 }).exec();
                async.forEach(dataOrdersYesterDay, (item) => {
                    arrData.push(item);
                    sRevenue += item.amount;
                });
                console.log(sRevenue);
                sProfit = sRevenue - sWithdraw;
                console.log(sWithdraw);

                console.log('================================= Two Day Ago ====================================');
                var dataWithdrawTwoDayAgo = await withdrawModels.find({ $and: [{ dateCreate: { $lt: mathDateYesterDay } }, { dateCreate: { $gt: mathDateTwoDayAgo } }] }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusWithdraw: 1, isWithdraw: 1, dateCreate: 1, status: 1 }).exec();
                console.log(dataWithdrawTwoDayAgo);
                async.forEach(dataWithdrawTwoDayAgo, (item) => {
                    arrDataMath.push(item);
                    if (item.statusWithdraw == 2) {
                        sWithdrawTwoDayAgo += item.amount;
                    }
                    if (item.statusWithdraw == 1) {
                        sPendingTwoDayAgo += item.amount;
                    }
                });

                var dataOrdersTwoDayAgo = await orderModels.find({ $and: [{ dateCreate: { $lt: mathDateYesterDay } }, { dateCreate: { $gt: mathDateTwoDayAgo } }] }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusOrder: 1, isOrder: 1, dateCreate: 1, status: 1 }).exec();
                async.forEach(dataOrdersTwoDayAgo, (item) => {
                    arrDataMath.push(item);
                    sRevenueTwoDayAgo += item.amount;
                });
                sProfitTwoDayAgo = sRevenueTwoDayAgo - sWithdrawTwoDayAgo;

                console.log('=================================close====================================');
                // console.log(sProfit);
                arrData = arrData.slice(0);
                arrData.sort(function(a, b) {
                    return a.dateCreate - b.dateCreate;
                });
                //////////////////
                if (sRevenue == 0 && sRevenueTwoDayAgo != 0) {
                    checkRevenue = 0;
                    pRevenue = 100;
                } else if (sRevenue != 0 && sRevenueTwoDayAgo == 0) {
                    checkRevenue = 1;
                    pRevenue = 100;
                } else if (sRevenue == 0 && sRevenueTwoDayAgo == 0) {
                    checkRevenue = 0;
                    pRevenue = 0;
                } else if (sRevenue <= sRevenueTwoDayAgo) {
                    checkRevenue = 0;
                    var vTemp = sRevenueTwoDayAgo - sRevenue;
                    pRevenue = (vTemp * 100 / sRevenueTwoDayAgo).toFixed(2);
                } else {
                    checkRevenue = 1;
                    var vTemp = sRevenue - sRevenueTwoDayAgo;
                    pRevenue = (vTemp * 100 / sRevenueTwoDayAgo).toFixed(2);
                }

                //////////////////////
                if (sWithdraw == 0 && sWithdrawTwoDayAgo != 0) {
                    checkWithdraw = 0;
                    pWithdraw = 100;
                } else if (sWithdraw != 0 && sWithdrawTwoDayAgo == 0) {
                    checkWithdraw = 1;
                    pWithdraw = 100;
                } else if (sWithdraw == 0 && sWithdrawTwoDayAgo == 0) {
                    checkWithdraw = 0;
                    pWithdraw = 0;
                } else if (sWithdraw <= sWithdrawTwoDayAgo) {
                    checkWithdraw = 0;
                    var vTemp = sWithdrawTwoDayAgo - sWithdraw;
                    pWithdraw = (vTemp * 100 / sWithdrawTwoDayAgo).toFixed(2);
                } else {
                    checkWithdraw = 1;
                    var vTemp = sWithdraw - sWithdrawTwoDayAgo;
                    pWithdraw = (vTemp * 100 / sWithdrawTwoDayAgo).toFixed(2);
                }

                //////////////////////
                if (sProfit == 0 && sProfitTwoDayAgo != 0) {
                    checkProfit = 0;
                    pProfit = 100;
                } else if (sProfit != 0 && sProfitTwoDayAgo == 0) {
                    checkProfit = 1;
                    pProfit = 100;
                } else if (sProfit == 0 && sProfitTwoDayAgo == 0) {
                    checkProfit = 0;
                    pProfit = 0;
                } else if (sProfit <= sProfitTwoDayAgo) {
                    checkProfit = 0;
                    var vTemp = sProfitTwoDayAgo - sProfit;
                    pProfit = (vTemp * 100 / sProfitTwoDayAgo).toFixed(2);
                } else {
                    checkProfit = 1;
                    var vTemp = sProfit - sProfitTwoDayAgo;
                    if (sProfitTwoDayAgo < 0) {
                        pProfit = (vTemp * 100 / -(sProfitTwoDayAgo)).toFixed(2);
                    } else {
                        pProfit = (vTemp * 100 / sProfitTwoDayAgo).toFixed(2);
                    }
                    // pProfit = (vTemp * 100 / sProfitTwoDayAgo).toFixed(2);
                }
                /////////////////////
                if (sPending == 0 && sPendingTwoDayAgo != 0) {
                    checkPending = 0;
                    pPending = 100;
                } else if (sPending != 0 && sPendingTwoDayAgo == 0) {
                    checkPending = 1;
                    pPending = 100;
                } else if (sPending == 0 && sPendingTwoDayAgo == 0) {
                    checkPending = 0;
                    pPending = 0;
                } else if (sPending <= sPendingTwoDayAgo) {
                    checkPending = 0;
                    var vTemp = sPendingTwoDayAgo - sPending;
                    pPending = (vTemp * 100 / sPendingTwoDayAgo).toFixed(2);
                } else {
                    checkPending = 1;
                    var vTemp = sPending - sPendingTwoDayAgo;
                    pPending = (vTemp * 100 / sPendingTwoDayAgo).toFixed(2);
                }


                /////////////Last Week/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            } else if (req.query.st == "lastweek") {
                console.log('lastweek');
                var sRevenueTwoWeek = 0,
                    sWithdrawTwoWeek = 0,
                    sProfitTwoWeek = 0,
                    sPendingTwoWeek = 0;
                var sDateNow = new Date();
                console.log(moment(sDateNow).format("DD/MM/YYYY HH:mm:ss "));
                console.log(sDateNow.getDate());
                var mathDateNow = new Date(sDateNow.getFullYear(), sDateNow.getMonth(), sDateNow.getDate());
                var mathDateLastWeek = new Date(sDateNow.getFullYear(), sDateNow.getMonth(), sDateNow.getDate() - 7);
                var mathDateTwoWeek = new Date(sDateNow.getFullYear(), sDateNow.getMonth(), sDateNow.getDate() - 14);
                console.log(mathDateNow);
                console.log('Ngay hnay: ' + mathDateNow);
                console.log('Ngay tuan truoc: ' + mathDateLastWeek);
                console.log('Ngay 2 tuan truoc: ' + mathDateTwoWeek);
                // console.log('dateNow: ' + dateNow);
                // var dateLater = dateNow.getTime();
                // console.log('dateLater: ' + dateLater);
                // var hoursNow = dateNow.getHours();
                // var minuteNow = dateNow.getMinutes();
                // var secondNow = dateNow.getSeconds();
                // dateNow = dateNow - 0;

                // var dateYesterDay = dateNow - hoursNow;
                // console.log(moment(dateNow).format('DD/MM/YYYY HH:mm:ss'));
                // console.log(moment(dateYesterDay).format('DD/MM/YYYY HH:mm:ss'));
                // console.log(dateNow);
                // console.log('dateYesterDay: ' + dateYesterDay);

                // var mathDateWeek = Date.now() - (1000 * 60 * 60);
                // var mathDateTwoWeek = Date.now() - (1000 * 60 * 120);
                // console.log(mathDateHoursAgo);

                // console.log(moment(mathDateHoursAgo).format('DD/MM/YYYY 00:00:00'));
                // console.log(moment(mathDateTwoHours).format('DD/MM/YYYY 00:00:00'));

                console.log('==================================LAST WEEK===================================');

                var dataWithdrawLastWeek = await withdrawModels.find({ dateCreate: { $gt: mathDateLastWeek, $lt: mathDateNow } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusWithdraw: 1, isWithdraw: 1, dateCreate: 1, status: 1 }).exec();
                // console.log(dataWithdraw);
                async.forEach(dataWithdrawLastWeek, (item) => {
                    arrData.push(item);
                    if (item.statusWithdraw == 2) {
                        sWithdraw += item.amount;
                    }
                    if (item.statusWithdraw == 1) {
                        sPending += item.amount;
                    }
                });
                console.log(sWithdraw);

                var dataOrdersLastWeek = await orderModels.find({ dateCreate: { $gt: mathDateLastWeek, $lt: mathDateNow } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusOrder: 1, isOrder: 1, dateCreate: 1, status: 1 }).exec();
                async.forEach(dataOrdersLastWeek, (item) => {
                    arrData.push(item);
                    sRevenue += item.amount;
                });
                console.log(sRevenue);
                sProfit = sRevenue - sWithdraw;

                console.log('=================================TWO WEEK ====================================');
                var dataWithdrawTwoWeek = await withdrawModels.find({ dateCreate: { $lt: mathDateLastWeek, $gt: mathDateTwoWeek } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusWithdraw: 1, isWithdraw: 1, dateCreate: 1, status: 1 }).exec();
                // console.log(dataWithdraw);
                async.forEach(dataWithdrawTwoWeek, (item) => {
                    arrDataMath.push(item);
                    if (item.statusWithdraw == 2) {
                        sWithdrawTwoWeek += item.amount;
                    }
                    if (item.statusWithdraw == 1) {
                        sPendingTwoWeek += item.amount;
                    }
                });

                var dataOrdersTwoWeek = await orderModels.find({ dateCreate: { $lt: mathDateLastWeek, $gt: mathDateTwoWeek } }, { idUser: 1, username: 1, amount: 1, content: 1, note: 1, statusOrder: 1, isOrder: 1, dateCreate: 1, status: 1 }).exec();
                async.forEach(dataOrdersTwoWeek, (item) => {
                    arrDataMath.push(item);
                    sRevenueTwoWeek += item.amount;
                });
                console.log(sWithdrawTwoWeek);
                console.log(sRevenueTwoWeek);
                sProfitTwoWeek = sRevenueTwoWeek - sWithdrawTwoWeek;
                // if (sProfitTwoWeek < 0)
                //     sProfitTwoWeek = -sProfitTwoWeek;



                console.log('=================================close====================================');
                // console.log(sProfit);
                arrData = arrData.slice(0);
                arrData.sort(function(a, b) {
                    return a.dateCreate - b.dateCreate;
                });
                //////////////////Renvue//////////
                if (sRevenue == 0 && sRevenueTwoWeek != 0) {
                    checkRevenue = 0;
                    pRevenue = 100;
                } else if (sRevenue != 0 && sRevenueTwoWeek == 0) {
                    checkRevenue = 1;
                    pRevenue = 100;
                } else if (sRevenue == 0 && sRevenueTwoWeek == 0) {
                    checkRevenue = 0;
                    pRevenue = 0;
                } else if (sRevenue <= sRevenueTwoWeek) {
                    checkRevenue = 0;
                    var vTemp = sRevenueTwoWeek - sRevenue;
                    pRevenue = (vTemp * 100 / sRevenueTwoWeek).toFixed(2);
                } else {
                    checkRevenue = 1;
                    var vTemp = sRevenue - sRevenueTwoWeek;
                    pRevenue = (vTemp * 100 / sRevenueTwoWeek).toFixed(2);
                }

                //////////////////////WithDraw//////
                if (sWithdraw == 0 && sWithdrawTwoWeek != 0) {
                    checkWithdraw = 0;
                    pWithdraw = 100;
                } else if (sWithdraw != 0 && sWithdrawTwoWeek == 0) {
                    checkWithdraw = 1;
                    pWithdraw = 100;
                } else if (sWithdraw == 0 && sWithdrawTwoWeek == 0) {
                    checkWithdraw = 0;
                    pWithdraw = 0;
                } else if (sWithdraw <= sWithdrawTwoWeek) {
                    checkWithdraw = 0;
                    var vTemp = sWithdrawTwoWeek - sWithdraw;
                    pWithdraw = (vTemp * 100 / sWithdrawTwoWeek).toFixed(2);
                } else {
                    checkWithdraw = 1;
                    var vTemp = sWithdraw - sWithdrawTwoWeek;
                    pWithdraw = (vTemp * 100 / sWithdrawTwoWeek).toFixed(2);
                }

                //////////////////////Profit//////////////
                if (sProfit == 0 && sProfitTwoWeek != 0) {
                    console.log('1');
                    checkProfit = 0;
                    pProfit = 100;
                } else if (sProfit != 0 && sProfitTwoWeek == 0) {
                    console.log('2');
                    checkProfit = 1;
                    pProfit = 100;
                } else if (sProfit == 0 && sProfitTwoWeek == 0) {
                    console.log('3');
                    checkProfit = 0;
                    pProfit = 0;
                } else if (sProfit <= sProfitTwoWeek) {
                    console.log('4');
                    checkProfit = 0;
                    var vTemp = sProfitTwoWeek - sProfit;
                    pProfit = (vTemp * 100 / sProfitTwoWeek).toFixed(2);
                } else {
                    console.log('5');
                    console.log(sProfit);
                    console.log(sProfitTwoWeek);
                    checkProfit = 1;
                    var vTemp = sProfit - sProfitTwoWeek;
                    if (sProfitTwoWeek < 0) {
                        pProfit = (vTemp * 100 / -(sProfitTwoWeek)).toFixed(2);
                    } else {
                        pProfit = (vTemp * 100 / sProfitTwoWeek).toFixed(2);
                    }

                }
                /////////////////////
                if (sPending == 0 && sPendingTwoWeek != 0) {
                    checkPending = 0;
                    pPending = 100;
                } else if (sPending != 0 && sPendingTwoWeek == 0) {
                    checkPending = 1;
                    pPending = 100;
                } else if (sPending == 0 && sPendingTwoWeek == 0) {
                    checkPending = 0;
                    pPending = 0;
                } else if (sPending <= sPendingTwoWeek) {
                    checkPending = 0;
                    var vTemp = sPendingTwoWeek - sPending;
                    pPending = (vTemp * 100 / sPendingTwoWeek).toFixed(2);
                } else {
                    checkPending = 1;
                    var vTemp = sPending - sPendingTwoWeek;
                    pPending = (vTemp * 100 / sPendingTwoWeek).toFixed(2);
                }



                ////////////Customer/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            } else {
                console.log('Customize');

            }
            res.render('admin/statements/index', {
                data: arrData,
                sRevenue,
                sWithdraw,
                sProfit,
                sPending,
                pRevenue,
                pWithdraw,
                pProfit,
                pPending,
                moment,
                checkRevenue,
                checkWithdraw,
                checkProfit,
                checkPending,
                title: "Statements"
            });
            // console.log(arrData);
            // alert(keysSorted);
        }
        // console.log(arrData);


        // membershipModels.find().sort({ dateCreate: -1 }).then((dataMemberShipModels) => {
        //     res.render('admin/statements/index', { dataMemberShipModels, moment, title: "Statements" });
        // });

    } catch (error) {
        console.log(error);
        return res.render('error', { error, title: 'Page Error' });
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