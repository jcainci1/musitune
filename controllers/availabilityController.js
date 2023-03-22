const Availability = require('../models/availabilityModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

exports.createAvailability = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  const doc = await Availability.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      data: doc
    }
  });
});

exports.getAllUserAvailabilities = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  let filter = {};
  // console.log(req.user.id);
  if (req.user.id) filter = { user: req.user.id };

  const features = new APIFeatures(Availability.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc
    }
  });
});

// exports.createAvailability = factory.createOne(Availability);
exports.getAvailability = factory.getOne(Availability, {
  path: 'availability_exceptions'
});
exports.getAllAvailabilities = factory.getAll(Availability);
exports.updateAvailability = factory.updateOne(Availability);
exports.deleteAvailability = factory.deleteOne(Availability);
