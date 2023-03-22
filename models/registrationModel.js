const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
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
  student: {
    student_name: {
      type: String,
      required: [true, 'Booking must belong to a Student!']
    },
    student_account: [
      {
        student_account_active: Boolean,
        student_account_active_date: Date,
        student_account_inactive_date: Date,
        student_account_creation_user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: [true, 'Student account activity must belong to an user!']
        }
      }
    ]
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to an instructor!']
  },
  price_per_lesson: {
    type: Number,
    require: [true, 'Booking must have a price.']
  },
  course_type: {
    enum: ['group', 'individual', 'user']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
  lesson_payment_frequency: {
    enum: ['monthly', 'package'],
    require: ['package', 'Bill must have a payment frequency.']
  },
  Lesson_information: {
    Lesson_start_date: {
      type: Date
    },
    Lesson_end_date: {
      type: Date
    },
    Lesson_first_payment_deadline: Date,
    recurring: {
      type: Boolean
    },
    Lesson_frequency: {
      type: String
    },
    Lesson_day: {
      type: String
    },
    lesson_length: {
      type: Number
    },
    original_lesson_dates: [Date],
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
    },
    recital_availability: {
      recital: [{ type: mongoose.Schema.ObjectId, ref: 'Recital' }]
    }
  },
  recurring_registration: [
    {
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
      // availability_data: [
      //   {
      recurring: Boolean,
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
          'four_weeks'
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
      start_hours: {
        type: [Number],
        min: 0,
        max: 23
      },
      start_minutes: {
        type: [Number],
        enum: [0, 15, 30, 45]
      },
      end_hours: {
        type: [Number],
        min: 0,
        max: 23
      },
      end_minutes: {
        type: [Number],
        enum: [0, 15, 30, 45]
      },
      start_date: [Date],
      end_date: [Date],
      all_start_dates: [Date],
      all_end_dates: [Date]
      //   }
      // ]
    }
  ],
  all_registration_lessons: [
    {
      available: Boolean,
      attendance: {
        attended: Boolean,
        instructor_attended_timestamp: Date,
        student_attended_timestamp: Date,
        reschedule_id: [String]
      },
      unavailable: {
        unavailable_user: [String],
        unavailable_description: [String],
        reschedule: [Boolean],
        unavailable_timestamp: [Date],
        available_timestamp: [Date],
        charge_on_schedule: Boolean,
        student_needs_refund: Boolean,
        instructor_paid: Boolean,
        instructor_needs_correction: Boolean,
        student_refund_amount: Number,
        instuctor_pay_amount: Number,
        student_refund_status: {
          type: String,
          enum: ['pending', 'action-required', 'cancelled', 'paid', 'refunded']
        },
        instructor_payment_status: {
          type: String,
          enum: [
            'pending',
            'action-required',
            'cancelled',
            'paid',
            'reversed',
            'settled'
          ]
        }
      },
      payment: {
        student_expected_charge: Number,
        instructor_expected_charge: Number,
        musiwork_expected_charge: Number,
        student_charge: Number,
        instructor_charge: Number,
        musiwork_charge: Number,
        student_payment_ratio: {
          type: String,
          enum: ['full', 'partial', 'none']
        },
        instructor_payment_ratio: {
          type: String,
          enum: ['full', 'partial', 'none']
        },
        musiwork_payment_ratio: {
          type: String,
          enum: ['full', 'partial', 'none']
        },
        student_payment_status: {
          type: String,
          enum: [
            'pending',
            'action-required',
            'cancelled',
            'paid',
            'refunded',
            'approved'
          ]
        },
        instructor_payment_status: {
          type: String,
          enum: [
            'pending',
            'action-required',
            'cancelled',
            'paid',
            'reversed',
            'settled',
            'approved',
            'settled_for_prior_charge',
            'partial_payment_settled_for_prior_charge'
          ]
        }
      },
      attended: {
        type: [String],
        enum: [
          'No information',
          'No attendance',
          'instructor-cancel',
          'user-cancel',
          'instructor-noshow',
          'user-noshow',
          'instructor-unavailable',
          'user-unavailable'
        ]
      },
      recurring: Boolean,
      recurring_reference_id: String,
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

      start_hours: {
        type: Number,
        min: 0,
        max: 23
      },
      start_minutes: {
        type: Number,
        enum: [0, 15, 30, 45]
      },
      end_hours: {
        type: Number,
        min: 0,
        max: 23
      },
      end_minutes: {
        type: Number,
        enum: [0, 15, 30, 45]
      },
      date: Date,
      updates: {
        updated: [Date],
        update: [String],
        instrcutor_confirm: [Boolean],
        student_confirm: [Boolean],
        student_update: Boolean,
        instructor_update: Boolean,
        admin_updated: [Date],
        admin_update: [String]
      },
      reschedule_information: [
        {
          reschedule_user: String,
          reschedule_reason: [String],
          reschedule_timestamp: Date
        }
      ],
      reschedule_options: [
        {
          instructor_schedule_availability: Boolean,
          week_of_schedule_availability: [Date],
          user_availability: String,
          confirmation: [
            {
              instructor_confirmed: Boolean,
              student_confirmed: Boolean,
              instructor_confirmed_timestamp: [Date],
              instructor_confirmed_timestamp: [Date]
            }
          ],
          reschedule_user: String,
          reschedule_start_hours: {
            type: Number,
            min: 0,
            max: 23
          },
          reschedule_start_minutes: {
            type: Number,
            enum: [0, 15, 30, 45]
          },
          reschedule_end_hours: {
            type: Number,
            min: 0,
            max: 23
          },
          reschedule_end_minutes: {
            type: Number,
            enum: [0, 15, 30, 45]
          },
          reschedule_date: Date
        }
      ],
      reschedule: [
        {
          confirmation: [
            {
              instructor_confirmed: Boolean,
              student_confirmed: Boolean,
              instructor_confirmed_timestamp: [Date],
              instructor_confirmed_timestamp: [Date]
            }
          ],
          attendance: {
            student_attended: Boolean,
            instructor_attended: Boolean,
            instructor_attended_timestamp: Date,
            student_attended_timestamp: Date
          },
          reschedule_start_hours: {
            type: [Number],
            min: 0,
            max: 23
          },
          reschedule_start_minutes: {
            type: [Number],
            enum: [0, 15, 30, 45]
          },
          reschedule_end_hours: {
            type: [Number],
            min: 0,
            max: 23
          },
          reschedule_end_minutes: {
            type: [Number],
            enum: [0, 15, 30, 45]
          },
          reschedule_date: Date
        }
      ]
    }
  ],
  availability_exception: {
    type: mongoose.Schema.ObjectId,
    ref: 'availabilityException'
  },
  lesson_attendance: {
    type: mongoose.Schema.ObjectId,
    ref: 'lessonAttendance'
  }
});

registrationSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'studio',
    select: 'courseName'
  });
  next();
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
