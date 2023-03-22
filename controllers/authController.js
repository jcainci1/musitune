const crypto = require('crypto');
const { promisify } = require('util');
const passport = require('passport');
const session = require('express-session');
const axios = require('axios');

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const urlParse = require('url-parse');
const queryParse = require('query-string');
const { google } = require('googleapis');
const request = require('request');
const bodyParser = require('body-parser');

const User = require('./../models/userModel');
const GoogleUser = require('./../models/googleUserModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');
// require('./gOAuth');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
// require('./authController');
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  console.log('nknk');
  const token = signToken(user._id);
  console.log(token);
  console.log(user);
  // console.log(user);
  // console.log(req);

  res.cookie('jwt', token, {
    secure: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'None'
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  // console.log(user);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// const createSendTokenGOAuth = (user, statusCode, req, res) => {
//   // console.log(req.body);
//   console.log('FOFO');
//   const token = signToken(user._id);

//   // console.log(token);
//   // console.log(res);
//   res.cookie('jwt', token, {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     )
//   });
//   // Remove password from output

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user
//     }
//   });
// };

// exports.gOAuthRequest = (req, res) => {
//   const oauth2Client = new google.auth.OAuth2(
//     GOOGLE_CLIENT_ID,
//     GOOGLE_SECRET,
//     'http://localhost:8080/api/v1/users/signupGOAuth'
//   );
//   const scopes = [
//     'https://www.googleapis.com/auth/fitness.activity.read profile email openid'
//   ];
//   const url = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: scopes,
//     state: JSON.stringify({
//       callbackUrl: req.body.callbackUrl,
//       userID: req.body.userID
//     })
//   });
//   console.log(url);

//   request(url, (err, response, body) => {
//     console.log('error', err);
//     console.log('statusCode', response && response.statusCode);
//     res.send({ url });
//   });
// };

// exports.gOAuthSignup = async (req, res) => {
//   // console.log('HJHJ');
//   const queryURL = new urlParse(req.url);
//   const code = queryParse.parse(queryURL.query).code;
//   const oauth2Client = new google.auth.OAuth2(
//     GOOGLE_CLIENT_ID,
//     GOOGLE_SECRET,
//     'http://localhost:8080/api/v1/users/signupGOAuth'
//   );
//   const tokens = await oauth2Client.getToken(code);
//   console.log(tokens);
// };
// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm
//   });

//   const url = `${req.protocol}://${req.get('host')}/me`;
//   // console.log(url);
//   // await new Email(newUser, url).sendWelcome();

//   createSendToken(newUser, 201, req, res);
// });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, req, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password } = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    passwordConfirm: req.body.passwordConfirm
  };

  const newUser = await User.create(req.body);

  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(url);
  // await new Email(newUser, url).sendWelcome();
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 201, req, res);
});

function isLoggedIngOAuth(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// exports.gOAuthLogin = (req, res) => {
//   const tkn = req.body.token;
//   const fs = require('fs');
// const { google } = require('googleapis');
// const {google} = require('googleapis');
// const OAuth2Client = google.auth.OAuth2;

exports.logoutgOAuth = (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, req, res);
});

/// GOOGLE CALENDAR AUTH FOR EMPLOYEES AND OWNER

exports.oauthPage = (req, res) => {
  res.status(200).render('googleOAuth', {
    title: 'Register your account'
  });
};

var var_arr = ['Refresh the browser'];

exports.oauthPost = (req, res) => {
  console.log(req.body.token);
  const tkn = req.body.token;
  const fs = require('fs');
  const { google } = require('googleapis');

  const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'token.json';

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    // const { GOOGLE_SECRET, GOOGLE_CLIENT_ID, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_SECRET,
      'http://localhost:8080/api/v1/users/events'
    );

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    oAuth2Client.getToken(tkn, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      console.log(tkn);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  }

  /**
   * Lists the next events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    // var var_arr = [];
    async function fun() {
      const calendar = await google.calendar({ version: 'v3', auth });
      calendar.events.list(
        {
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          maxResults: 30,
          singleEvents: true,
          orderBy: 'startTime'
        },
        (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const events = res.data.items;
          if (events.length) {
            console.log('Your upcoming events:', events);
            events.map((event, i) => {
              console.log(event);
              var_arr.push(event);
            });
          } else {
            console.log('No upcoming events found.');
          }
        }
      );
    }
    fun();
  }
  res.send(var_arr);
  res.render('googleOAuth');
};

exports.oauthEvents = (req, res) => {
  // Require google from googleapis package.
  const { google } = require('googleapis');
  // Require oAuth2 from our google instance.
  const { OAuth2 } = google.auth;

  // Create a new instance of oAuth and set our Client ID & Client Secret.
  const oAuth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_SECRET
  );

  // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  // Create a new calender instance.
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  // Create a new event start date instance for temp uses in our calendar.
  const eventStartTime = new Date();
  eventStartTime.setDate(eventStartTime.getDay() + 2);

  // Create a new event end date instance for temp uses in our calendar.
  const eventEndTime = new Date();
  eventEndTime.setDate(eventEndTime.getDay() + 2);
  eventEndTime.setMinutes(eventEndTime.getMinutes() + 60);

  // Create a dummy event for temp uses in our calendar
  const event = {
    summary: `${req.body.summary}`,
    description: `${req.body.description}`,
    colorId: 6,
    start: {
      dateTime: eventStartTime
    },
    end: {
      dateTime: eventEndTime
    }
  };

  // Check if we a busy and have an event on our calendar for the same time.
  calendar.freebusy.query(
    {
      resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        items: [{ id: 'primary' }]
      }
    },
    (err, res) => {
      // Check for errors in our query and log them if they exist.
      if (err) return console.error('Free Busy Query Error: ', err);

      // Create an array of all events on our calendar during that time.
      const eventArr = res.data.calendars.primary.busy;

      // Check if event array is empty which means we are not busy
      if (eventArr.length === 0) {
        // If we are not busy create a new calendar event.
        return calendar.events.insert(
          { calendarId: 'primary', resource: event },
          err => {
            // Check for errors and log them if they exist.
            if (err)
              return console.error('Error Creating Calender Event:', err);
            // Else log that the event was created.
            return console.log('Event created successfully.');
          }
        );
      }
      // If event array is not empty log that we are busy.
      return console.log(`Sorry I'm busy for that time...`);
    }
  );
  console.log(req.body);
  //   const sgMail = require('@sendgrid/mail');
  //   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //   const msg = {
  //     to: req.body.to, // Change to your recipient
  //     from: 'your email goes here', // Change to your verified sender
  //     subject: req.body.summary,
  //     text: req.body.description,
  //     html: req.body.description
  //   };
  //   sgMail
  //     .send(msg)
  //     .then(() => {
  //       console.log('Email sent');
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });

  //   res.render('googleOAuthEvents');
};
