let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let withdrawSchema = mongoose.Schema({
    id: String,
    idUser: String,
    username: String,
    email: String,
    codeShare: String,
    bankSend: String,
    bankReceipt: String,
    bank: String,
    bankBranch: String,
    accountNumber: String,
    accountHolder: String,
    fee: Number,
    amount: Number,
    blance: Number,
    content: String,
    note: String,
    method: String,
    dateCreate: Date,
    statusWithdraw: Number,
    isWithdraw: Boolean,
    status: Boolean
});
let withdrawsData = module.exports = mongoose.model("withdraws", withdrawSchema);