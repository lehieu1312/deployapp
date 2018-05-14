var express = require("express");
var router = express.Router();
var md5 = require('md5');
router.get("/getbody", (req, res) => {
    res.render('testbody');
});

router.post("/getbody", (req, res) => {
    console.log(req.body);
    res.json({ status: 1, content: req.body });
});



module.exports = router;