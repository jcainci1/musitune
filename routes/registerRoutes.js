const express = require('express');
const registerController = require('./../controllers/registerController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:studioId',
  registerController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(registerController.getAllRegistrations)
  .post(registerController.createRegistration);

router
  .route('/:id')
  .get(registerController.getRegistration)
  .patch(registerController.updateRegistration)
  .delete(registerController.deleteRegistration);

module.exports = router;
