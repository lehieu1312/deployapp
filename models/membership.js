let mongoose = require('mongoose');

let membershipChema = mongoose.Schema({
    id: String,
    idUser: String,
    lastname: String,
    firstname: String,
    username: String,
    email: String,
    isMember: String,
    amount: Number,
    dateCreate: Date,
    dateUpdate: Date,
    expireDay: Date,
    blocked: Boolean,
    status: Boolean
});

let MemberShip = module.exports = mongoose.model('memberships', membershipChema);