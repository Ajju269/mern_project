const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['volunteer', 'user'],   // only these two values are allowed
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true                  // MongoDB will reject a second user with the same email
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true                // this will store the HASHED password, never plain text
  }
}, { timestamps: true });          // auto-adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);