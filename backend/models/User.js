const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    default: '0000000000',
    trim: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
