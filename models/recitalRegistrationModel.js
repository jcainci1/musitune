const mongoose = require('mongoose');
const slugify = require('slugify');

// const slugify = require('slugify');
const User = require('./userModel');
const validator = require('validator');

const recitalRegistrationSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.ObjectId,
      ref: 'Registration',
      required: [
        true,
        'Recital registration must belong to a lesson registration!'
      ]
    },
    recital: {
      type: mongoose.Schema.ObjectId,
      ref: 'RecitalRegistration',
      required: [true, 'Recital registration must belong to a recital!']
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'Recital registration must belong to an instructor!']
    },
    instrument: String,
    slug: String,
    age_group: String,
    enrollment: {
      paid: Boolean,
      enrollment_price: Number,
      enrollment_deadline: Date
    },
    enrollment_discount: [
      {
        enrollment_dicount_amount: {
          type: Number,
          validate: {
            validator: function(val) {
              // this only points to current doc on NEW document creation
              return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
          }
        },
        enrollment_dicount_percent: Number,
        enrollment_discount_code: String,
        enrollment_discount_deadline: Date
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    recital_information: [
      {
        virtal: Boolean,
        live_stream: Boolean,
        virtual_url_address: String,
        live_stream_url_address: String,
        on_location: Boolean,
        description: String,
        date: [Date],
        length: Number
      }
    ],
    recital_location: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        company: String,
        number_of_locations: Number,
        coordinates: [Number],
        address: String,
        description: String,
        date: [Date],
        length: Number
      }
    ],
    recitals: Number
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 });
courseSchema.index({ price: 1, ratingsAverage: -1 });
courseSchema.index({ slug: 1 });
courseSchema.index({ startLocation: '2dsphere' });

courseSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate
courseSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'studio',
  localField: '_id'
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
courseSchema.pre('save', function(next) {
  this.slug = slugify(this.courseName, { lower: true });
  next();
});

courseSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'instructor',
    select: '-__v -passwordChangedAt'
  });

  next();
});

const RecitalRegistration = mongoose.model(
  'recitalRegistration',
  recitalRegistrationSchema
);

module.exports = RecitalRegistration;
