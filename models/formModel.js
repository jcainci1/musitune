const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, 'Please give your name to save this registration form!']
  },
  user_email: {
    type: String
  },
  user_phone: {
    type: String
  },
  student_info: [
    {
      student_name: {
        type: String
      },
      student_experience_time: {
        type: String
      },
      student_experience_description: {
        type: String
      },
      student_dob: {
        type: Date
      },
      student_relationship: {
        type: String
      },
      student_instrument: {
        type: String
      },
      student_instructor: {
        type: String
      },
      student_lesson_frequency: {
        type: String
      },
      student_lesson_duration: {
        type: String
      },
      student_lesson_date: {
        type: Date
      }
    }
  ]
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
