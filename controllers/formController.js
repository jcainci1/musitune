const Form = require('../models/formModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createPrivateLessonForm = factory.createOne(Form);
exports.getPrivateLessonForm = factory.getOne(Form);
exports.getAllPrivateLessonForms = factory.getAll(Form);
exports.updatePrivateLessonForm = factory.updateOne(Form);
exports.deletePrivateLessonForm = factory.deleteOne(Form);
