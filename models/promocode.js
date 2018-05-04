let mongoose = require('mongoose');

let promocodeSchema = mongoose.Schema({
    idApp: String,
    promoCode: String,
    dateCreate: Date,
    status: Boolean
});

let InforappAdmin = module.exports = mongoose.model('promocodes', promocodeSchema);