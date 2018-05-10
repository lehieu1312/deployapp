let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let orderShema = mongoose.Schema({
    id: String,
    codeOrder: String,
    idUser: String,
    firstName: String,
    lastName: String,
    company: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    promoCode: String,
    // country: String,
    codeCountry: String,
    phoneNumber: String,
    email: String,
    productInformation: [{
        idProduct: String,
        countProduct: Number,
        nameProduct: String,
        imageProduct: String,
        price: Number,
        amount: Number,
        intoMoney: Number
    }],
    totalMoney: Number,
    paymentMethod: String,
    statusOrder: String,
    status: Boolean
})
let orders = module.exports = mongoose.model("orders", orderShema)