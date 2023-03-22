const express = require('express');
const formController = require('./../controllers/formController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/private-lessons/').post(formController.createPrivateLessonForm);

router
  .route('/private-lessons/:registrationId')
  .get(formController.getPrivateLessonForm)
  .patch(formController.updatePrivateLessonForm)
  .delete(formController.deletePrivateLessonForm);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/private-lessons/all')
  .get(formController.getAllPrivateLessonForms);

module.exports = router;
