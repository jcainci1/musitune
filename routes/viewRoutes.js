const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get(
  '/private-lessons-registration',
  authController.isLoggedIn,
  viewsController.privateRegistration
);

router.get('/reserve', authController.isLoggedIn, viewsController.reserve);
router.get(
  '/reserve/technician',
  authController.isLoggedIn,
  viewsController.reserveTechnician
);
router.get(
  '/reserve/signup',
  authController.isLoggedIn,
  viewsController.reserveSignIn
);

router.get('/about', authController.isLoggedIn, viewsController.about);

router.get(
  '/studio/:slug',
  authController.isLoggedIn,
  viewsController.getStudio
);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);

router.get('/me', authController.protect, viewsController.getDashboard);

router.get('/my-bookings', authController.protect, viewsController.getReviews);
router.get('/my-calendar', authController.protect, viewsController.getCalendar);
router.get(
  '/my-calendar-data',
  authController.protect,
  viewsController.getCalendarData
);
router.get('/my-settings', authController.protect, viewsController.getSettings);
router.get('/my-billing', authController.protect, viewsController.getBilling);
router.get('/my-reviews', authController.protect, viewsController.getReviews);

router.get(
  '/manage-studios',
  authController.protect,
  viewsController.getAllStudios
);
router.get(
  '/manage-bookings',
  authController.protect,
  viewsController.getAllBookings
);
router.get(
  '/manage-users',
  authController.protect,
  viewsController.getAllUsers
);
router.get(
  '/manage-reviews',
  authController.protect,
  viewsController.getAllReviews
);
router.get(
  '/manage-billing',
  authController.protect,
  viewsController.getAllBilling
);

router.get('/my-studios', authController.protect, viewsController.getMyStudios);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
