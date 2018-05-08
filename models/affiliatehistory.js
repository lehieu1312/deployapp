let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let affiliateHistoryShema = mongoose.Schema({
    idUser: String,
    codeShare: String,
    bankSend: String,
    bankReceipt: String,
    blank: String,
    blankBranch: String,
    accountHolder: String,
    Free: Number,
    amount: Number,
    blance: Number,
    content: String,
    note: String,
    method: String,
    dateCreate: Date,
    statusWithdraw: String,
    status: Boolean
});
let AffiliateHistory = module.exports = mongoose.model("affiliatehistorys", affiliateHistoryShema);