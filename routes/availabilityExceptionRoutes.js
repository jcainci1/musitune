const express = require('express');
const availabilityExceptionController = require('../controllers/availabilityExceptionController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/get-all')
  .get(availabilityExceptionController.getAllAvailabilityExceptions);
router
  .route('/get/:id')
  .get(availabilityExceptionController.getAvailabilityException);

router.use(authController.protect);

router.use(authController.restrictTo('owner', 'lead-admin'));

router
  .route('/post')
  .post(availabilityExceptionController.createAvailabilityException);

router
  .route('/:id')
  .get(availabilityExceptionController.getAvailabilityException)
  .patch(availabilityExceptionController.updateAvailabilityException)
  .delete(availabilityExceptionController.deleteAvailabilityException);

module.exports = router;
