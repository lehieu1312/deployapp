let mongoose = require('mongoose');

let promocodeSchema = mongoose.Schema({
    idApp: String,
    promoCode: String,
    percentSale: Number,
    dateCreate: Date,
    dateExpiration: Date,
    status: Boolean
});

let PromoCodes = module.exports = mongoose.model('promocodes', promocodeSchema);