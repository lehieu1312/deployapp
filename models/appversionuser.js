let mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let appversionuserschema = mongoose.Schema({
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
let apversionuser = module.exports = mongoose.model("appversionusers", appversionuserschema)