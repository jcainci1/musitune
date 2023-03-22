const mongoose = require('mongoose');
const slugify = require('slugify');

// const slugify = require('slugify');
// const User = require('./userModel');
// const InstructorSettings = require('./instructorSettingsModel');
const AvailabilityException = require('./availabilityExceptionModel');
// const Recital = require('./recitalModel');
const validator = require('validator');

const availabilitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Availability must belong to a User!']
  },
  create_availability: {
    recurring: {
      type: Boolean,
      required: [true, 'Availability must have a frequency!']
    },
    repeat_frequency: {
      repeat_frequency_type: {
        type: String,
        enum: ['Weekly', 'Monthly', 'Yearly']
      },
      repeat_frequency_day: {
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
      repeat_frequency_count: {
        type: Number,
        min: 0,
        max: 8
      }
    },
    occurence: Boolean,
    occurence_amount: Number,
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
    location: [
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
    commute_time_to: Number,
    commute_time_from: Number,
    start_date: [Date],
    end_date: [Date],
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
    date: Date,
    created: Date,
    updated: Date
  },
  all_created_availability_start_dates: [Date],
  all_created_availability_end_dates: [Date],
  availability_exceptions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'AvailabilityException'
    }
  ],
  all_unavailabile_start_dates: [Date],
  all_unavailabile_end_dates: [Date],
  registrations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Registration'
    }
  ],
  reg_availability_start_dates: [Date],
  reg_availability_end_dates: [Date],
  // calc_availability_start_dates: [Date],
  // calc_availability_end_dates: [Date],
  instructorSetting: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'InstructorSettings'
    }
  ],
  recital: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Recital'
    }
  ],
  all_availability_start_dates: [Date],
  all_availability_end_dates: [Date],
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

availabilitySchema.pre(/^find/, function(next) {
  this.populate('').populate({
    path: 'availability_exceptions',
    select: ''
  });
  next();
});

availabilitySchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'User',
    select: '_id'
  });
  next();
});

// function intervalInterpretation(freq) {
//   // console.log(freq);
//   if (freq === 'Weekly') {
//     freq = 7;
//   } else if (freq === 'yearly') {
//     freq = 365;
//   }
//   return freq;
// };

function recurringIntervalDates(startDate, endDate, interval, days, count) {
  // initialize date variable with start date
  var date = new Date(startDate);
  var endDate = new Date(endDate);
  var newDate;
  endDate.setSeconds(endDate.getSeconds() + 10);
  date.setSeconds(date.getSeconds() - 10);
  var sDate = new Date(startDate);

  // create array to hold result dates
  var dates = [];
  let startDays = [];
  let startDateDays = [];
  var startDates = [];
  // check if days exist, if so assign start date for each day
  if (days) {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];
    // push index of days array to startDays
    days.forEach(e => startDays.push(weekday.indexOf(e)));
    // get the index of the startDate day
    var submittedStartDay = date.getDay();

    // calculate each startDate based on days array and push to startDate array
    startDays.forEach(function(e) {
      var dayNumber = 6 - submittedStartDay + e;
      var date2 = new Date(startDate);

      var day = date2.setDate(date.getDate() + dayNumber);
      day = new Date(day);
      startDateDays.push(day);
    });
    if (interval !== 30) {
      // loop through startDateDays add the interval of days and push that to the array if it is on or before the end date
      startDateDays.forEach(function(e) {
        dates.push(e);
        var h = new Date(e);
        if (e < endDate) {
          h.setDate(e.getDate() + interval);
          dates.push(h);
        }
      });
    } else if (interval == 30) {
      var firstDayOfStartMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );
      const startDayOfMonth = sDate.getUTCDate();
      const startWeekdayDayOfMonth = sDate.toLocaleDateString('en-us', {
        weekday: 'long'
      });
      //get the number week that each availability day will apply to in a month
      var numberWeek;
      if (startDayOfMonth < 7) {
        numberWeek = 1;
      } else if (startDayOfMonth < 14) {
        numberWeek = 8;
      } else if (startDayOfMonth < 21) {
        numberWeek = 15;
      } else {
        numberWeek = 22;
      }
      // get the week of start date for the start date month

      var h = sDate.setDate(sDate.getDate(numberWeek));
      h = new Date(h);

      function convertDateToUTC(date) {
        return new Date(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          date.getUTCMinutes(),
          date.getUTCSeconds()
        );
      }
      var i = convertDateToUTC(h);
      if (h < endDate) {
        var d = h.getDate();
        h.setDate(d);
        h = new Date(h);
        h = convertDateToUTC(h);
        startDays.forEach(function(e) {
          var dayNum = h.getDay();
          var dayNumber = 6 - dayNum + e;
          if (dayNum > e) {
            dayNumber = dayNumber + 1;
          } else if (dayNum => dayNumber) {
            dayNumber = dayNumber - 6;
          }
          var dayOfMonth = new Date(h);
          dayOfMonth = dayOfMonth.setDate(dayOfMonth.getDate() + dayNumber);
          if (dayOfMonth < endDate && dayOfMonth > sDate) {
            dates.push(new Date(dayOfMonth));
          }
        });
      }
      console.log('startDays', startDays);
      // loop to push each month of days to the date array
      while (i < endDate) {
        var d = i.getDate();
        i.setMonth(i.getMonth() + count);
        if (i.getDate() != d) {
          i.setDate(d);
        }
        i = new Date(i);
        console.log(i);
        // i = convertDateToUTC(i);

        startDays.forEach(function(e) {
          // var trueE = e;
          // if (h.getDay() > 2 && h.getDay() !== e) {
          //   e = e + 1;
          // } else if (e == i.getDay() - 1) {
          //   e = 5;
          // }
          var dayNum = i.getDay();
          console.log('dayNumber', dayNum, e);

          var dayNumber = 6 - dayNum + e;
          if (dayNum > e) {
            dayNumber = dayNumber + 1;
          } else if (dayNum => dayNumber) {
            dayNumber = dayNumber - 6;
          }
          console.log('dayNumber', dayNumber);

          var dayOfMonth = new Date(i);
          console.log('dayOfMonth.getDate()', dayOfMonth.getDate());
          dayOfMonth = dayOfMonth.setDate(dayOfMonth.getDate() + dayNumber);
          console.log('dayOfMonth', new Date(dayOfMonth));

          if (dayOfMonth < endDate) {
            dates.push(new Date(dayOfMonth));
          }
        });
      }

      //push the day for that week that are in the days array into dates array
    } else {
      dates.push(startDate);
      // check for dates in range
      while ((newDate = addDays(date, interval)) < endDate) {
        // add new date to array
        dates.push(newDate);
      }
    }
  }
  // console.log(dates);
  return dates;
}

function addDays(date, days) {
  var newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

function getTime(date, hours, minutes) {
  var date = new Date(date);
  date = date.setUTCHours(parseInt(hours), parseInt(minutes), 0);
  var date = date.toString();
  return date;
}

//

availabilitySchema.pre('save', async function(next) {
  // const current = this.availability.length - 1;
  var startTime = this.create_availability.start_date;
  var endDate = this.create_availability.end_date;
  var startHours = this.create_availability.start_hours;
  var startMinutes = this.create_availability.start_minutes;
  let repeatFrequencyInterval;
  let repeatDays;
  let allDates;
  var dates = [];
  if (this.create_availability.recurring) {
    repeatDays = this.create_availability.repeat_frequency.repeat_frequency_day;
    let frequencyCount = this.create_availability.repeat_frequency
      .repeat_frequency_count;

    // If frequency is weekly, use this function to calculate dates
    if (
      this.create_availability.repeat_frequency.repeat_frequency_type ==
      'Weekly'
    ) {
      repeatFrequencyInterval = 7;
    }
    if (
      this.create_availability.repeat_frequency.repeat_frequency_type ==
      'Yearly'
    ) {
      repeatFrequencyInterval = 365;
    }
    if (
      this.create_availability.repeat_frequency.repeat_frequency_type ==
      'Monthly'
    ) {
      repeatFrequencyInterval = 30;
    }
    allDates = await recurringIntervalDates(
      startTime,
      endDate,
      repeatFrequencyInterval,
      repeatDays,
      frequencyCount
    );

    allDates.forEach(function(element) {
      dates.push(getTime(element, startHours, startMinutes));
      return dates;
    });

    this.all_created_availability_start_dates = dates;
  }

  next();
});

availabilitySchema.pre('save', async function(next) {
  var startTime = this.create_availability.start_date;
  var endDate = this.create_availability.end_date;
  let repeatFrequencyInterval;
  let repeatDays;
  var dates = [];
  let allDates;
  if (this.create_availability.recurring) {
    repeatDays = this.create_availability.repeat_frequency.repeat_frequency_day;
    let frequencyCount = this.create_availability.repeat_frequency
      .repeat_frequency_count;
    // If frequency is weekly, use this function to calculate dates
    if (
      this.create_availability.repeat_frequency.repeat_frequency_type ==
      'Weekly'
    ) {
      repeatFrequencyInterval = 7;
    }
    if (
      this.create_availability.repeat_frequency.repeat_frequency_type ==
      'Yearly'
    ) {
      repeatFrequencyInterval = 365;
    }
    if (
      this.create_availability.repeat_frequency.repeat_frequency_type ==
      'Monthly'
    ) {
      repeatFrequencyInterval = 30;
    }
    var endHours = this.create_availability.end_hours;
    var endMinutes = this.create_availability.end_minutes;

    allDates = await recurringIntervalDates(
      startTime,
      endDate,
      repeatFrequencyInterval,
      repeatDays,
      frequencyCount
    );

    allDates.forEach(function(element) {
      dates.push(getTime(element, endHours, endMinutes));
      return dates;
    });

    // console.log(dates);
    this.all_created_availability_end_dates = dates;
  }
  next();
});

// availabilitySchema.pre('save', next => {
//   this.end_times = this.availability;
//   next();
// });

const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;

// const deleteData = async () => {
//   try {
//     await Availability.deleteMany();
//   } catch (err) {
//     console.log(err);
//   }
// };
// deleteData();
