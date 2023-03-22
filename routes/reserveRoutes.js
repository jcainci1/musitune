const express = require('express');
const reserveController = require('./../controllers/reserveController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/technician-availability').get(reserveController.getAllAvailability)
// router.route('/technician-availability/:id').get(reserveController.getAllAvailability)

router.use(authController.protect);

router
  .route('/')
  .get(reserveController.getAllReserveMaintenance)
  .post(reserveController.createReserveMaintenance);

router
  .route('/:id')
  .get(reserveController.getReserveMaintenance)
  .patch(reserveController.updateReserveMaintenance)
  .delete(reserveController.deleteReserveMaintenance);

module.exports = router;
