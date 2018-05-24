let mongoose = require('mongoose');

let inforAppAdminChema = mongoose.Schema({
    idApp: String,
    idUser: [{
        idUser: String,
        email: String,
        picture: String,
        dateAdded: Date,
        role: Number,
        status: Boolean
    }],
    nameApp: String,
    image: String,
    installed: Number,
    lastVersion: String,
    cost: Number,
    price: Number,
    dateCreate: Date,
    dateUpdate: Date,
    status: Boolean
});

let InforappAdmin = module.exports = mongoose.model('inforappadmins', inforAppAdminChema);