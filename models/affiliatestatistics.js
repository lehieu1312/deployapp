let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let affiliateStatisticShema = mongoose.Schema({
    id: String,
    idUser: String,
    codeShare: String,
    dateCreate: Date,
    dateOut: Date,
    page: [{
        pageText: String,
        dateCreate: Date,
        dateOut: Date
    }],
    isOnePage: Boolean,
    status: Boolean
});
let AffiliateStatistic = module.exports = mongoose.model("affiliatestatistics", affiliateStatisticShema);