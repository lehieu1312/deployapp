let mongoose = require('mongoose');

let inforappChema = mongoose.Schema({
    id: String,
    idApp: String,
    idUser: [{
        idUser: String,
        email: String,
        picture: String,
        dateAdded: Date,
        role: Number,
        status: Boolean
    }],
    idAppAdmin: String,
    nameApp: String,
    onlineCurrent: Number,
    dateCreate: Date,
    useToday: String,
    useIos: String,
    useAndroid: String,
    status: Boolean
});

let Inforapp = module.exports = mongoose.model('inforapps', inforappChema);