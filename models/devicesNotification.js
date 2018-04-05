let mongoose = require('mongoose');

let devicenotificationChema = mongoose.Schema({
    idApp: String,
    idUser: String,
    device_os: String,
    device_model: String,
    dateCreate: Date,
    status: Boolean
});

let devicenotification = module.exports = mongoose.model('devicesnotifications', devicenotificationChema);