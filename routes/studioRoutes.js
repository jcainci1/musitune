const express = require('express');
const studioController = require('./../controllers/studioController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

router.use('/:studioId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(studioController.aliasTopStudios, studioController.getAllStudios);

router.route('/studio-stats').get(studioController.getStudioStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'intructor', 'owner'),
    studioController.getMonthlyPlan
  );

router
  .route('/studios-within/:distance/center/:latlng/unit/:unit')
  .get(studioController.getStudiosWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router
  .route('/distances/:latlng/unit/:unit')
  .get(studioController.getDistances);

router
  .route('/')
  .get(studioController.getAllStudios)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'owner'),
    studioController.createStudio
  );

router
  .route('/:id')
  .get(studioController.getStudio)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'owner'),
    studioController.uploadStudioImages,
    studioController.resizeStudioImages,
    studioController.updateStudio
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'owner'),
    studioController.deleteStudio
  );

module.exports = router;
