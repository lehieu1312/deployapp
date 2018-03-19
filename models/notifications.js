let mongoose = require('mongoose');

let notificationChema = mongoose.Schema({
    idApp: String,
    titleNotification: String,
    contentNotification: String,
    internalLink: String,
    smallIcon: String,
    iconNotification: String,
    bigimagesNotification: String,
    backgroundNotification: String,
    titleColor: String,
    contentColor: String,
    ledColor: String,
    accentColor: String,
    dateCreate: Date,
    status: Boolean
});

let notification = module.exports = mongoose.model('notifications', notificationChema);