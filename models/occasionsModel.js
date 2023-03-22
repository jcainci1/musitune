const mongoose = require('mongoose');

const occasionsSchema = new mongoose.Schema({
  occasion_name: {
    type: String
  },
  occasion_Description: {
    type: String
  },
  occasion_Message: {
    type: String
  },
  user_created: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  all_users: {
    type: Boolean
  },
  all_day: {
    type: Boolean,
    default: false
  },
  exception_type: {
    type: String,
    enum: [
      'holiday',
      'religious-holiday',
      'national-holiday',
      'international-holiday',
      'ethnic-holiday',
      'custom-holiday'
    ]
  },
  created_occasion_event: {
    recurring_occasion: Boolean,
    repeat_frequency: {
      type: String,
      enum: [
        'daily',
        'every_other_day',
        'every_third_day',
        'every_fourth-day',
        'every_fifth_day',
        'every_sixth_day',
        'weekly',
        'two_weeks',
        'three_weeks',
        'four_weeks',
        'quarterly',
        'semi-annually',
        'annually',
        'lunar_calendar'
      ]
    },
    day: {
      type: [String],
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ]
    },
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

const Occasions = mongoose.model('Occasions', occasionsSchema);

module.exports = Occasions;
