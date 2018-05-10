let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let withdrawSchema = mongoose.Schema({
    id: String,
    idUser: String,
    codeShare: String,
    bankSend: String,
    bankReceipt: String,
    bank: String,
    bankBranch: String,
    accountHolder: String,
    fee: Number,
    amount: Number,
    blance: Number,
    content: String,
    note: String,
    method: String,
    dateCreate: Date,
    statusWithdraw: Number,
    status: Boolean
});
let withdrawsData = module.exports = mongoose.model("withdraws", withdrawSchema);