let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let cartShema = mongoose.Schema({
    idApp: String,
    idAppAdmin: String,
    idInforapp: ObjectId,
    appName: String,
    versionAdmin: String,
    dateCreate: Date,
    version: String,
    note: String,
    linkApkDebug: String,
    linkApkSigned: String,
    linkKeyStore: String,
    linkKeyStoreText: String,
    linkIPADebug: String,
    linkInstalliOS: String,
    linkIPAAppStore: String,
    userDeploy: String,
    status: Boolean
})
let carts = module.exports = mongoose.model("carts", cartShema)