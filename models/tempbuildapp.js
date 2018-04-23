let mongoose = require("mongoose");

let tempBuildAppSchema = mongoose.Schema({
    idApp: String,
    idUser: String,
    appName: String,
    version: String,
    platform: String,
    linkFileZipProject: String,
    linkZipIPA: String,
    provisionFileAdHoc: String,
    provisionFileAppStore: String,
    certificateFileAdHoc: String,
    certificateFileAppStore: String,
    logError: String,
    dateCreate: Date,
    status: Boolean
});

let tempBuild = module.exports = mongoose.model('tempbuildapps', tempBuildAppSchema);