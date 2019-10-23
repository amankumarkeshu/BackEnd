var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');


var userschema = new mongoose.Schema({
    username: String,
    password: String
});
userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userschema);