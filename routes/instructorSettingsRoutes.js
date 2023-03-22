const express = require('express');
const instructorSettingsController = require('../controllers/instructorSettingsController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/get-all')
  .get(instructorSettingsController.getAllInstructorSettings);

router
  .route('/get/:id')
  .get(instructorSettingsController.getInstructorSettings);

router.use(authController.protect);

router.use(authController.restrictTo('owner', 'lead-admin'));

router
  .route('/post')
  .post(instructorSettingsController.createInstructorSettings);

router
  .route('/:id')
  .get(instructorSettingsController.getInstructorSettings)
  .patch(instructorSettingsController.updateInstructorSettings)
  .delete(instructorSettingsController.deleteInstructorSettings);

module.exports = router;
