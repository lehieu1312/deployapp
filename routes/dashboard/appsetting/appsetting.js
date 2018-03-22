var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var md5 = require('md5');
var User = require('../../../models/user');
var Appversion = require('../../../models/appversionadmin');
var inforappModels = require('../../../models/inforapp');
var appsettingModels = require('../../../models/appsetting');
var fs = require('fs');

function checkAdmin(req, res, next) {
    if (req.session.iduser) {
        next();
    } else {
        res.redirect('/login');
    }
}
router.get("/appsettings/:idapp", checkAdmin, (req, res) => {
    try {
        console.log(req.params.idapp);
        inforappModels.findOne({ idApp: req.params.idapp }).then((data) => {
            appsettingModels.findOne({ idApp: req.params.idapp }).then((dataSettings) => {
                console.log(data);
                res.render("./dashboard/appsetting/appsetting", {
                    title: "App Setting",
                    appuse: {
                        idApp: req.params.idapp,
                        nameApp: data.nameApp
                    },
                    appSetting: dataSettings
                });
            })

        });
    } catch (error) {
        res.render('error', { error, title: "Data Error" });
    }
});
router.post("/appsettings/:idapp", checkAdmin, (req, res) => {
    try {

    } catch (error) {
        res.render('error', { error, title: "Data Error" });
    }
});
module.exports = router;