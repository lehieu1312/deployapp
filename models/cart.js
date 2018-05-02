let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let cartShema = mongoose.Schema({
    idApp: String,
    idAppAdmin: String,
    idInforapp: ObjectId
})
let carts = module.exports = mongoose.model("carts", cartShema)