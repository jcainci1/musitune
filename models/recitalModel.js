const mongoose = require('mongoose');
const slugify = require('slugify');

// const slugify = require('slugify');
const User = require('./userModel');
const validator = require('validator');

const recitalSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.ObjectId,
      ref: 'Registration',
      required: [true, 'Recital must belong to a registration!']
    },
    instructors: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    recital_type: {
      type: [String],
      required: [true, 'A recital must have a type']
    },
    instruments: {
      type: [String]
    },
    slug: String,
    age_group: {
      type: String,
      required: [true, 'A recital must have an age group']
    },
    recital_duration: {
      type: Number,
      required: [true, 'A recital must have a duration']
    },
    max_group_size: {
      type: Number,
      required: [true, 'A recital must have a maximum group size']
    },
    min_group_size: {
      type: Number,
      required: [true, 'A recital must have a minimum group size']
    },
    max_song_length: {
      type: [String]
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratings_average: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
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
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    curriculumDescription: {
      type: String,
      trim: true
    },
    studioPolicy: {
      type: String,
      required: [true, 'A course must have a studio policy']
    },
    tickets: {
      ticket_for_sale: Boolean,
      ticket_price: Number,
      ticket_discount: [
        {
          ticket_discount_percent: Number,
          ticket_discount_amount: Number,
          ticket_discount_until: Date
        }
      ]
    },
    imageCover: {
      type: String,
      required: [true, 'A course must have a cover image']
    },
    images: [String],
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

// // tourSchema.index({ price: 1 });
// courseSchema.index({ price: 1, ratingsAverage: -1 });
// courseSchema.index({ slug: 1 });
// courseSchema.index({ startLocation: '2dsphere' });

// courseSchema.virtual('durationWeeks').get(function() {
//   return this.duration / 7;
// });

// // Virtual populate
// courseSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'studio',
//   localField: '_id'
// });

// // DOCUMENT MIDDLEWARE: runs before .save() and .create()
// courseSchema.pre('save', function(next) {
//   this.slug = slugify(this.courseName, { lower: true });
//   next();
// });

// courseSchema.pre(/^find/, function(next) {
//   this.populate({
//     path: 'instructor',
//     select: '-__v -passwordChangedAt'
//   });

//   next();
// });

const Recital = mongoose.model('Recital', recitalSchema);

module.exports = Recital;
