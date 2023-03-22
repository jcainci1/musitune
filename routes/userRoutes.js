const express = require('express');
const session = require('express-session');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
require('./../controllers/gOAuth');
const passport = require('passport');
// var express = require('express');
var app = express();
var cookies = require('cookie-parser');

app.use(cookies());

const router = express.Router();

require('./../controllers/gOAuth');
// const redirectURI = '/api/v1/users/auth/google';

// router.post('/loginGOAuth', authController.gOAuthLogin);
router.post('/signup', authController.signup);
// router.get('/signupGOAuth', authController.gOAuthSignup);
router.post('/login', authController.login);
// router.get('/login/google/oauth', authController.gOAuthRequest);
router.get('/logout', authController.logout);
// router.get('/google-OAuth', authController.gOAuthSignup);
// router.get('/oauth/google', authController.googleOauthHandler);

// router.get(
//   '/auth/google',
//   passport.authenticate('google', { scope: ['email', 'profile'] })
// );

// router.get(
//   '/auth/google/callback',
//   passport.authenticate('google', {
//     successRedirect: '/me',
//     failureRedirect: '/login'
//   }),
//   function(req, res) {
//     createSendToken(user, 200, req, res);
//   }
// );
// router.get('/auth/google/failure', authController.gOAuthFailure);
// router.get('/protected', authController.isLoggedIn);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/google-oauth', authController.oauthPage);
router.post('/google-oauth', authController.oauthPost);
router.post('/events', authController.oauthEvents);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

// router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
