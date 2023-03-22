const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const googleUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  googleId: String,
  accessToken: {
    type: String,
    unique: true
  },
  password: String,
  provider: String,
  isVerified: Boolean
});

googleUserSchema.pre(/^find/, function(next) {
  this.populate('').populate({
    path: 'User',
    select: ''
  });
  next();
});

const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

module.exports = GoogleUser;
