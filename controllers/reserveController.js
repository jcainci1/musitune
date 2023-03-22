const ReserveMaintenance = require('../models/reserveMaintenanceModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createReserveMaintenance = factory.createOne(ReserveMaintenance);
exports.getReserveMaintenance = factory.getOne(ReserveMaintenance);
exports.getAllReserveMaintenance = factory.getAll(ReserveMaintenance);
exports.getAllAvailability = factory.getAllAvailability(ReserveMaintenance);
exports.updateReserveMaintenance = factory.updateOne(ReserveMaintenance);
exports.deleteReserveMaintenance = factory.deleteOne(ReserveMaintenance);
