let mongoose = require("mongoose");

let userStatisticSchema = mongoose.Schema({
    idApp: String,
    nameApp: String,
    idUser: String,
    email: String,
    firstName: String,
    lastName: String,
    userName: String,
    address: String,
    city: String,
    zipCode: String,
    company: String,
    phoneNumber: String,
    sessionUser: String,
    dateAccess: Date,
    timeAccess: Number,
    dateOutSession: Date,
    status: Boolean
});

let userstatistic = module.exports = mongoose.model('userstatistics', userStatisticSchema);