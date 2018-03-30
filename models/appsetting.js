let mongoose = require('mongoose');

let appsettingschema = mongoose.Schema({
    idApp: String,
    idUser: String,
    version: String,
    nameApp: String,
    description: String,
    emailApp: String,
    authHref: String,
    auth: String,
    wpUrl: String,
    wpPerPage: Number,
    requestTimeout: Number,
    targetBlank: Boolean,
    dateFormat: String,
    oneSignalID: String,
    oneSignalAppID: String,
    oneSignalAPIKey: String,
    ggAnalytic: String,
    adModAndroidBanner: String,
    adModeAndroidInterstitial: String,
    adModeIosBaner: String,
    adModeIosInterstitial: String,
    dateCreate: Date,
    status: Boolean
});


let appsetting = module.exports = mongoose.model('appsettings', appsettingschema);