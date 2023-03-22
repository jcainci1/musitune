const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  studio: {
    type: mongoose.Schema.ObjectId,
    ref: 'Studio',
    required: [true, 'Booking must belong to a Studio!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a Instructor!']
  },
  price: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'studio',
    select: 'courseName'
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
