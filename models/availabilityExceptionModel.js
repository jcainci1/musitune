const mongoose = require('mongoose');

const availabilityExceptionSchema = new mongoose.Schema({
  user_created: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  all_day_unavailablility: {
    type: Boolean,
    default: false
  },
  exception_type: {
    type: String,
    enum: [
      'user-unavailable',
      'instructor-unavailable',
      'admin-unavailable',
      'owner-unavailable',
      'lead-admin-unavailable'
    ]
  },
  created_availability_exception: {
    created_availability: {
      type: mongoose.Schema.ObjectId,
      ref: 'Availability'
    },
    extended: Boolean,
    location_type: {
      type: String,
      enum: [
        'virtual',
        'location',
        'location_vender',
        'student_home',
        'teacher_home'
      ],
      default: 'virtual'
    },
    location: [String],
    commute_time_to: [Number],
    commute_time_from: [Number],
    exception_start_hours: {
      type: [Number],
      min: 0,
      max: 23
    },
    exception_start_minutes: {
      type: [Number],
      enum: [0, 15, 30, 45]
    },
    exception_end_hours: {
      type: [Number],
      min: 0,
      max: 23
    },
    exception_end_minutes: {
      type: [Number],
      enum: [0, 15, 30, 45]
    },
    exception_start_date: [Date],
    exception_end_date: [Date]
  },
  exception_start_dates: [Date],
  exception_end_dates: [Date],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

// availabilityExceptionSchema.pre(/^find/, function(next) {
//   this.populate('user').populate({
//     path: 'studio',
//     select: 'courseName'
//   });
//   next();
// });

// availabilityExceptionSchema.pre(/^find/, function(next) {
//   this.populate('allUsers').populate({
//     path: 'user',
//     select: 'name'
//   });
//   next();
// });

const AvailabilityException = mongoose.model(
  'AvailabilityException',
  availabilityExceptionSchema
);

module.exports = AvailabilityException;
