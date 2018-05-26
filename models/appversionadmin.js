let mongoose = require('mongoose');

let appversionschema = mongoose.Schema({
    id: String,
    idApp: String,
    nameApp: String,
    inforAppversion: [{
        id: String,
        version: String,
        changeLog: String,
        createDate: Date,
        updatedDate: Date,
        nameFile: String,
        isDeployed: Boolean,
        status: Boolean
    }],
    image: String,
    dateCreate: Date,
    status: Boolean
});


let Appversionadmin = module.exports = mongoose.model('appversionadmins', appversionschema);