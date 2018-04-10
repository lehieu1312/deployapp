let mongoose = require('mongoose');

let notificationChema = mongoose.Schema({
    idApp: String,
    idNotification: String,
    titleNotification: Object,
    contentNotification: Object,
    internalLink: [{
        typeUrl: String,
        url: String
    }],
    smallIcon: String,
    iconNotification: String,
    bigimagesNotification: String,
    backgroundNotification: String,
    titleColor: String,
    contentColor: String,
    ledColor: String,
    accentColor: String,
    sendToUser: Array,
    excludesendToUser: Array,
    isAdroid: Boolean,
    isIos: Boolean,
    successful: Number,
    failed: Number,
    converted: Number,
    remaining: Number,
    dateCreate: Date,
    statusNotification: String,
    status: Boolean
});

let notification = module.exports = mongoose.model('notifications', notificationChema);