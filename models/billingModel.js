const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  registration: {
    type: mongoose.Schema.ObjectId,
    ref: 'Registration',
    required: [true, 'Booking must belong to Registration!']
  },
  //   user: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'User',
  //     required: [true, 'Booking must belong to a User!']
  //   },
  //   student: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'User',
  //     required: [true, 'Booking must belong to a User!']
  //   },
  //   instructor: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'User',
  //     required: [true, 'Booking must belong to an instructor!']
  //   },
  price_per_lesson: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  number_of_lessons: Number,
  lesson_payment_dates: [Date],
  lesson_transaction_date: [Date],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    enum: ['paid', 'pending', 'cancelled', 'reversed']
  },
  lesson_information: {
    course_start_date: {
      type: Date
    },
    course_end_date: {
      type: Date
    },
    recurring: {
      type: Boolean
    },
    course_frequency: {
      type: String
    },
    course_day: {
      type: String
    },
    course_length: {
      type: Number
    },
    auto_renew: {
      type: Boolean,
      default: false
    },
    free_lesson: {
      free_lesson_quantity: {
        type: Number,
        default: 0
      },
      free_lessons_attended: {
        type: Number,
        default: 0
      },
      free_lesson_schedule: {
        type: [Date]
        ///**default should be course start date */
      },
      free_lesson_length: {
        type: Number,
        default: 30
      }
    }
  },
  availability_exception: {
    type: mongoose.Schema.ObjectId,
    ref: 'availabilityException'
  },
  course_attendance: {
    type: mongoose.Schema.ObjectId,
    ref: 'courseAttendance'
  }
});

billingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'studio',
    select: 'courseName'
  });
  next();
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
