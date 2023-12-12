const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {type: String, required: true, unique: true},
  role: {type: String, enum: ['admin', 'user'], default: 'user'}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
