let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let affiliateShema = mongoose.Schema({
    id: String,
    idUser: String,
    codeShare: String,
    idOrder: String,
    codeOrder: String,
    orderMoney: Number,
    percentSale: Number,
    money: Number,
    blance: Number,
    idUserOroder: String,
    nameUserOrder: String,
    paymentMethodOrder: String,
    note: String,
    dateCreate: Date,
    status: Boolean
});
let Affiliate = module.exports = mongoose.model("affiliates", affiliateShema);