let mongoose = require('mongoose');

let SchemaMethod = mongoose.Schema({
    idMethod: String,
    idUser: String,
    method: String,
    accountHolder: String,
    accountNumber: String,
    bankSend: String,
    bankReceipt: String,
    bank: String,
    bankBranch: String,
    dateUpdate: Date,
    dateCreate: Date,
    status: Boolean
});

let paymentmethod = module.exports = mongoose.model('paymentmethods', SchemaMethod);