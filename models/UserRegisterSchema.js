// models/UserRegisterSchema.js

const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  email: String,
  password:String
})

module.exports = mongoose.model('users', userSchema);