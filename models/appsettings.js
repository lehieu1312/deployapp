let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
let appsettingschema = new Schema({
    idApp: String,
    packageIDApp: String,
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
    oneSignalUserID: String,
    oneSignalAppID: String,
    oneSignalAPIKey: String,
    ggAnalytic: String,
    adModAndroidBanner: String,
    adModeAndroidInterstitial: String,
    adModeIosBaner: String,
    adModeIosInterstitial: String,
    dateCreate: Date,
    dateUpdate: Date,
    status: Boolean
}, {
    collection: 'appsettings'
});


module.exports = mongoose.model('appsettings', appsettingschema);