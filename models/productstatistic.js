let mongoose = require('mongoose');

let ProductStatisticChema = mongoose.Schema({
    idApp: String,
    nameApp: String,
    codeProduct: String,
    idProduct: String,
    name: String,
    image: String,
    sessionProduct: String,
    dateAccess: Date,
    timeAccess: Number,
    dateOutSession: Date,
    dateCreate: Date,
    status: Boolean
});

let ProductStatistic = module.exports = mongoose.model('productstatistics', ProductStatisticChema);