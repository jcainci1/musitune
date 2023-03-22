const Studio = require('../models/studioModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Availability = require('../models/availabilityModel');
const catchAsync = require('../utils/catchAsync');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const studios = await Studio.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('studio-overview', {
    title: 'All Studios',
    studios
  });
});

exports.getStudio = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const studio = await Studio.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!studio) {
    return next(new AppError('There is no studio with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('studio', {
    title: `${studio.courseName}, Studio`,
    studio
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Register your account'
  });
};

exports.getDashboard = (req, res) => {
  res.status(200).render('dashboard', {
    title: 'Dashboard'
  });
};

exports.getCalendar = catchAsync(async (req, res, next) => {
  const availabilities = await Availability.find({ user: req.user.id });
  // console.log(availabilities);

  res.status(200).render('calendar', {
    title: 'Calendar',
    availabilities: availabilities
  });
  // return availabilities;
});

exports.getCalendarData = catchAsync(async (req, res, next) => {
  const availabilities = await Availability.find({ user: req.user.id });
  res.send(availabilities);
});

exports.getSettings = (req, res) => {
  res.status(200).render('settings', {
    title: 'Settings'
  });
};

exports.getMyStudios = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const studioIDs = bookings.map(el => el.studio);
  const studios = await Studio.find({ _id: { $in: studioIDs } });

  res.status(200).render('studio-overview', {
    title: 'My Studios',
    studios
  });
});

exports.privateRegistration = (req, res) => {
  res.status(200).render('registration', {
    title: 'Private Lessons'
  });
};

/// RESERVATION FORM
exports.reserve = (req, res) => {
  res.status(200).render('reserveTechnician', {
    title: 'Reserve your piano maintenance'
  });
};

exports.reserveTechnician = (req, res) => {
  res.status(200).render('reserveTechnician', {
    title: 'Reserve a Technician'
  });
};

exports.reserveSignIn = (req, res) => {
  res.status(200).render('reserve_sign-in', {
    title: 'Create Account or Sign in'
  });
};

exports.about = (req, res) => {
  res.status(200).render('about', {
    title: 'About MusiTune'
  });
};

exports.protectedRoute = (req, res) => {
  res.status(200).render('protectedRoute', {
    title: 'Welcome!'
  });
};

exports.getBilling = (req, res) => {
  res.status(200).render('billing', {
    title: 'Billing'
  });
};

exports.getReviews = (req, res) => {
  res.status(200).render('reviews', {
    title: 'Reviews'
  });
};

exports.getAllReviews = (req, res) => {
  res.status(200).render('manageReviews', {
    title: 'Your settings'
  });
};

exports.getAllBookings = (req, res) => {
  res.status(200).render('manageBookings', {
    title: 'Your settings'
  });
};

exports.getAllUsers = (req, res) => {
  res.status(200).render('manageUsers', {
    title: 'Your settings'
  });
};

exports.getAllStudios = (req, res) => {
  res.status(200).render('manageStudios', {
    title: 'Your settings'
  });
};

exports.getAllBilling = (req, res) => {
  res.status(200).render('manageBilling', {
    title: 'Your settings'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
