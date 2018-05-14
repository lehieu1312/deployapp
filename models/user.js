let mongoose = require('mongoose');

let userChema = mongoose.Schema({
    id: String,
    idfb: String,
    idgg: String,
    idtw: String,
    lastname: String,
    firstname: String,
    username: String,
    gender: String,
    birthday: String,
    picture: String,
    agerange: String,
    email: String,
    password: String,
    dateCreate: Date,
    address: String,
    locale: String,
    country: String,
    zipcode: String,
    verifycode: String,
    codeShare: String,
    myapp: [{
        id: String,
        idApp: String,
        nameApp: String,
        status: String
    }],
    membership: [{
        isMembership: Boolean,
        amount: Number,
        dateCreate: Date,
        dateUpdate: Date,
        expireDay: Date
    }],
    blocked: Boolean,
    status: Boolean
});

let User = module.exports = mongoose.model('users', userChema);