const mongoose = require('mongoose');
const slugify = require('slugify');

// const slugify = require('slugify');
const User = require('./userModel');
const validator = require('validator');

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, 'A course must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A course name must have less or equal then 40 characters'
      ],
      minlength: [1, 'A course name must have more or equal then 10 characters']
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    courseType: {
      type: String,
      required: [true, 'A course must have a course type']
    },
    instrument: {
      type: [String]
    },
    slug: String,
    ageGroup: {
      type: String,
      required: [true, 'A course must have an age group']
    },
    courseDuration: {
      type: Number,
      required: [true, 'A course must have a duration']
    },
    courseFrequency: {
      type: String,
      enum: ['weekly', 'bi-weekly', 'monthly', 'individual'],
      required: [true, 'A course must have a frequency']
    },
    individual_lesson_amount: Number,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    default_price_per_lesson: Number,
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price'
      }
    },
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
    courseTimePeriod: String,
    startDates: [Date],
    endDates: [Date],
    courseTime: Date,
    courseTimes: [Date],
    instructor: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    virtual: {
      type: Boolean
    },
    courseLocation: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    recital: {
      type: Boolean
    },
    recitals: Number,
    recitalDate: {
      type: [Date]
    },
    finalExam: Boolean,
    finalExam: Number,
    finalExamDate: [Date],
    new_course: Date,
    recitalLocation: [
      {
        type: {
          type: [String],
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    instructor: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ],
    active: Boolean
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

const Studio = mongoose.model('Studio', courseSchema);

module.exports = Studio;
