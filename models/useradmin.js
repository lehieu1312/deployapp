let mongoose = require('mongoose');

let userAdminChema = mongoose.Schema({
    id: String,
    username: String,
    fullname: String,
    avatar: String,
    email: String,
    password: String,
    dateCreate: Date,
    blocked: Boolean,
    status: Boolean
}, {
    collection: 'useradmins'
});
module.exports = mongoose.model('useradmins', userAdminChema);
// let User = module.exports = mongoose.model('users', userChema);