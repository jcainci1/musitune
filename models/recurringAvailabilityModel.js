const mongoose = require('mongoose');

const recurringAvailabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  recurring_availability: [
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
  availability: {
    type: mongoose.Schema.ObjectId,
    ref: 'Availability'
  }
});

function intervalInterpretation(freq) {
  // console.log(freq);
  if (freq === 'daily') {
    freq = 1;
  } else if (freq === 'every_other_day') {
    freq = 2;
  } else if (freq === 'every_third_day') {
    freq = 3;
  } else if (freq === 'every_fourth_day') {
    freq = 4;
  } else if (freq === 'every_fifth_day') {
    freq = 5;
  } else if (freq === 'every_sixth_day') {
    freq = 6;
  } else if (freq === 'weekly') {
    freq = 7;
  } else if (freq === 'two_weeks') {
    freq = 14;
  } else if (freq === 'three_weeks') {
    freq = 21;
  } else if (freq === 'four_weeks') {
    freq = 28;
  }
  return freq;
}

function recurringDates(startDate, endDate, interval) {
  // initialize date variable with start date
  var date = new Date(startDate);
  var enddate = new Date(endDate);
  enddate.setSeconds(enddate.getSeconds() + 10);
  date.setSeconds(date.getSeconds() - 10);
  console.log(date);
  console.log(enddate);

  // create array to hold result dates
  var dates = [];
  dates.push(startDate);
  // check for dates in range
  while ((date = addDays(date, interval)) < enddate) {
    // add new date to array
    dates.push(date);
  }

  // return result dates
  // dates.forEach(function(element) {
  //   dates.push(element.toISOString().split('T')[0]);
  // });
  return dates;
}

function addDays(date, days) {
  var newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

function getTime(date, hours, minutes) {
  var date = new Date(date);
  date = date.setHours(date.getHours() + parseInt(hours), parseInt(minutes));
  var date = new Date(date);
  return date;
}

//

availabilitySchema.pre('save', async function(next) {
  const current = this.availability.length - 1;
  if (this.availability[current].recurring) {
    const frequency = await intervalInterpretation(
      this.availability[current].repeat_frequency
    );

    var startTime = this.availability[current].start_date;
    var endDate = this.availability[current].end_date;

    var startHours = this.availability[current].start_hours;
    var startMinutes = this.availability[current].start_minutes;

    var dates = [];
    allDates = await recurringDates(startTime, endDate, frequency);

    allDates.forEach(function(element) {
      dates.push(getTime(element, startHours, startMinutes));
      return dates;
    });

    this.availability[current].all_start_dates = dates;
  }

  next();
});

availabilitySchema.pre('save', async function(next) {
  const current = this.availability.length - 1;
  if (this.availability[current].recurring) {
    const frequency = await intervalInterpretation(
      this.availability[current].repeat_frequency
    );
    console.log(frequency);
    var startTime = this.availability[current].start_date;

    var endDate = this.availability[current].end_date;

    var endHours = this.availability[current].end_hours;
    var endMinutes = this.availability[current].end_minutes;

    var dates = [];
    allDates = await recurringDates(startTime, endDate, frequency);

    allDates.forEach(function(element) {
      dates.push(getTime(element, endHours, endMinutes));
      return dates;
    });

    this.availability[current].all_end_dates = dates;
  }
  next();
});

const RecurringAvailability = mongoose.model(
  'RecurringAvailability',
  recurringAvailabilitySchema
);

module.exports = RecurringAvailability;
