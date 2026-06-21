const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  emergencyType: {
    type: String,
    enum: ['Medical', 'Fire', 'Accident', 'Other'],
    required: true
  },
  location: {
    type: String,        // we'll store it as "lat,lng" string, same as your original
    required: true
  },
  description: {
    type: String,
    required: true
  },
  shareLocation: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'    // every new request starts as pending
  },
  username: String,        // we'll fill this in from the session, not from the form
  email: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);