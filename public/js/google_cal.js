// Require google from googleapis package.
const express = require('express');

// const { google } = require('googleapis');

// Require oAuth2 from our google instance.
// const { OAuth2 } = google.auth;

// Create a new instance of oAuth and set our Client ID & Client Secret.
// const oAuth2Client = new OAuth2(
//   '214405943012-bfifcr839f0inqk5ak6i44isqa6atkeu.apps.googleusercontent.com',
//   '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'
// );

// // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
// oAuth2Client.setCredentials({
//   refresh_token:
//     '1//045WwB2RNZ3ccCgYIARAAGAQSNwF-L9Ir9rWzsJPD3uP1tjaVIalS029ESkida5fsFFdhEd5mpqBCwHkuv9wkCqkFZHpTwrsLVOE'
// });

const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
async function printDocTitle(auth) {
  const docs = google.docs({ version: 'v1', auth });
  const res = await docs.documents.get({
    documentId: '195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE'
  });
  console.log(`The title of the document is: ${res.data.title}`);
}

authorize()
  .then(printDocTitle)
  .catch(console.error);

// // Create a new calender instance.
// const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// // Create a new event start date instance for temp uses in our calendar.
// const eventStartTime = new Date();
// eventStartTime.setDate(eventStartTime.getDay() + 2);

// // Create a new event end date instance for temp uses in our calendar.
// const eventEndTime = new Date();
// eventEndTime.setDate(eventEndTime.getDay() + 4);
// eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

// // Create a dummy event for temp uses in our calendar
// const event = {
//   summary: `Meeting with David`,
//   location: `3595 California St, San Francisco, CA 94118`,
//   description: `Meet with David to talk about the new client project and how to integrate the calendar for booking.`,
//   colorId: 1,
//   start: {
//     dateTime: eventStartTime,
//     timeZone: "America/Denver",
//   },
//   end: {
//     dateTime: eventEndTime,
//     timeZone: "America/Denver",
//   },
// };

// // Check if we a busy and have an event on our calendar for the same time.
// calendar.freebusy.query(
//   {
//     resource: {
//       timeMin: eventStartTime,
//       timeMax: eventEndTime,
//       timeZone: "America/Denver",
//       items: [{ id: "primary" }],
//     },
//   },
//   (err, res) => {
//     // Check for errors in our query and log them if they exist.
//     if (err) return console.error("Free Busy Query Error: ", err);

//     // Create an array of all events on our calendar during that time.
//     const eventArr = res.data.calendars.primary.busy;
//     console.log(res.data.calendars.primary.busy);
//     // Check if event array is empty which means we are not busy
//     if (eventArr.length === 0)
//       // If we are not busy create a new calendar event.
//       return calendar.events.insert(
//         { calendarId: "primary", resource: event },
//         (err) => {
//           // Check for errors and log them if they exist.
//           if (err) return console.error("Error Creating Calender Event:", err);
//           // Else log that the event was created.
//           return console.log("Calendar event successfully created.");
//         }
//       );

//     // If event array is not empty log that we are busy.
//     return console.log(`Sorry I'm busy...`);
//   }
// );

// const listCalendarEvents = () => {
//   calendar.events.list(
//     {
//       calendarId: "primary",
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: "startTime",
//     },
//     (error, result) => {
//       if (error) {
//         console.log("Something went wrong: ", error); // If there is an error, log it to the console
//       } else {
//         if (result.data.items.length > 0) {
//           console.log("List of upcoming events: ", result.data.items); // If there are events, print them out
//         } else {
//           console.log("No upcoming events found."); // If no events are found
//         }
//       }
//     }
//   );
// };
// listCalendarEvents();
