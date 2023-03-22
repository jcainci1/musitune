const mongoose = require('mongoose');

const reserveMaintenanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  registration: {
    type: mongoose.Schema.ObjectId,
    ref: 'Registration'
  },
  attendance: {
    course_date: {
      type: [Date]
    },
    attended_course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Registration'
    },
    attended_user: {
      type: [mongoose.Schema.ObjectId],
      ref: 'User'
    },
    attended: {
      enum: [
        'attended',
        'attendance not taken',
        'pending',
        "class hasn't occurred",
        'abscent'
      ]
    },
    subject: {
      type: String
    },
    description: {
      type: String
    }
  },
  reschedule: {
    rescheduling: {
      type: Boolean
    },
    reschedule_date: {
      type: Date
    }
  },
  absence_information: {
    absence_purpose: {
      enum: [
        'holiday',
        'user-cancel',
        'instructor-cancel',
        'instructor-noshow',
        'user-noshow'
      ]
    }
  },
  paid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const ReserveMaintenance = mongoose.model(
  'ReserveMaintenance',
  reserveMaintenanceSchema
);

module.exports = ReserveMaintenance;
