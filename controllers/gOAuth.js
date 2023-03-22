const passport = require('passport');
const express = require('express');

const { promisify } = require('util');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();

app.use(cookieParser());

const axios = require('axios');
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_SECRET = process.env.GOOGLE_SECRET;
// require('./authController');

// const signToken = id => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN
//   });
// };

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       callbackURL: 'http://localhost:8080/api/v1/users/auth/google/callback',
//       passReqToCallback: true
//     },
//     async function(
//       request,
//       accessToken,
//       refreshToken,
//       profile,
//       done,
//       req,
//       res
//     ) {
//       console.log(profile.email);
//       console.log(accessToken);
//       const name = profile.name;
//       const email = profile.email;
//       if (!email || !accessToken) {
//         return next(new AppError('No credentials came through!', 400));
//       }
//       // 2) Check if user exists && password is correct
//       const user = await User.findOne({ email });
//       if (!user) {
//         return next(new AppError('No account with these credentials', 401));
//       }

//       // 3) If everything ok, send token to client
//       const token = signToken(user._id);

//       console.log(token);
//       res.cookie('jwt', token, {
//         expires: new Date(
//           Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//         )
//       });
//       // Remove password from output

//       res.status(statusCode).json({
//         status: 'success',
//         token,
//         data: {
//           user
//         }
//       });
//     }
//   )
// );

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
// const cors = require('cors');
// const { promisify } = require('util');

// const querystring = require('querystring');
// const cookieParser = require('cookie-parser');
// import {
//   SERVER_ROOT_URI,
//   GOOGLE_CLIENT_ID,
//   JWT_SECRET,
//   GOOGLE_CLIENT_SECRET,
//   COOKIE_NAME,
//   UI_ROOT_URI,
// } from "./config";

// const port = 4000;

// const app = express();

// app.use(
//   cors({
//     // Sets Access-Control-Allow-Origin to the UI URI
//     origin: UI_ROOT_URI,
//     // Sets Access-Control-Allow-Credentials to true
//     credentials: true
//   })
// );

// app.use(cookieParser());

// const redirectURI = 'auth/google';

// function getGoogleAuthURL() {
//   const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
//   const options = {
//     redirect_uri: `${SERVER_ROOT_URI}/${redirectURI}`,
//     client_id: GOOGLE_CLIENT_ID,
//     access_type: 'offline',
//     response_type: 'code',
//     prompt: 'consent',
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email'
//     ].join(' ')
//   };

//   return `${rootUrl}?${querystring.stringify(options)}`;
// }

// exports.googleOAuth = (req, res) => {
//     return res.send(getGoogleAuthURL());
//   };

// function getTokens({
//   code,
//   clientId,
//   clientSecret,
//   redirectUri,
// }: {
//   code: string;
//   clientId: string;
//   clientSecret: string;
//   redirectUri: string;
// }): Promise<{
//   access_token: string;
//   expires_in: Number;
//   refresh_token: string;
//   scope: string;
//   id_token: string;
// }> {
//   /*
//    * Uses the code to get tokens
//    * that can be used to fetch the user's profile
//    */
//   const url = "https://oauth2.googleapis.com/token";
//   const values = {
//     code,
//     client_id: clientId,
//     client_secret: clientSecret,
//     redirect_uri: redirectUri,
//     grant_type: "authorization_code",
//   };

//   return axios
//     .post(url, querystring.stringify(values), {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     })
//     .then((res) => res.data)
//     .catch((error) => {
//       console.error(`Failed to fetch auth tokens`);
//       throw new Error(error.message);
//     });
// }

// // Getting the user from Google with the code
// app.get(`/${redirectURI}`, async (req, res) => {
//   const code = req.query.code as string;

//   const { id_token, access_token } = await getTokens({
//     code,
//     clientId: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     redirectUri: `${SERVER_ROOT_URI}/${redirectURI}`,
//   });

//   // Fetch the user's profile with the access token and bearer
//   const googleUser = await axios
//     .get(
//       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
//       {
//         headers: {
//           Authorization: `Bearer ${id_token}`,
//         },
//       }
//     )
//     .then((res) => res.data)
//     .catch((error) => {
//       console.error(`Failed to fetch user`);
//       throw new Error(error.message);
//     });

//   const token = jwt.sign(googleUser, JWT_SECRET);

//   res.cookie(COOKIE_NAME, token, {
//     maxAge: 900000,
//     httpOnly: true,
//     secure: false,
//   });

//   res.redirect(UI_ROOT_URI);
// });

// // Getting the current user
// app.get("/auth/me", (req, res) => {
//   console.log("get me");
//   try {
//     const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
//     console.log("decoded", decoded);
//     return res.send(decoded);
//   } catch (err) {
//     console.log(err);
//     res.send(null);
//   }
// });
