const InstructorSettings = require('../models/instructorSettingsModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createInstructorSettings = factory.createOne(InstructorSettings);
exports.getInstructorSettings = factory.getOne(InstructorSettings);
exports.getAllInstructorSettings = factory.getAll(InstructorSettings);
exports.updateInstructorSettings = factory.updateOne(InstructorSettings);
exports.deleteInstructorSettings = factory.deleteOne(InstructorSettings);
