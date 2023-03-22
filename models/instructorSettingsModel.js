const mongoose = require('mongoose');

const instructorSettingsSchema = new mongoose.Schema({
  instructor_setting: [
    {
      studio: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'Studio',
          required: [true, 'Setting must belong to a Studio!'],
          price_per_lesson: {
            type: Number,
            require: [true, 'Setting must have a price.']
          }
        }
      ],
      lesson_location: [
        { type: String, enum: ['virtual', 'on_location'], default: 'virtual' }
      ],
      location: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String
        }
      ]
    }
  ],
  primary_instrument: String,
  secondary_instrument: String,
  tertiary_instrument: String,
  offering_instruction: {
    type: [String],
    enum: ['primary_instrument', 'secondary_instrument', 'tertiary_instrument']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    unique: true,
    required: [true, 'Setting must belong to a User!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  availability_exception: {
    type: mongoose.Schema.ObjectId,
    ref: 'availabilityException'
  },
  lesson_attendance: {
    type: mongoose.Schema.ObjectId,
    ref: 'lessonAttendance'
  }
});

instructorSettingsSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'studio',
    select: 'courseName'
  });
  next();
});

const InstructorSettings = mongoose.model(
  'InstructorSettings',
  instructorSettingsSchema
);

module.exports = InstructorSettings;
