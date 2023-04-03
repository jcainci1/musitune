const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const parse = require('url-parse');
const {google} = require('googleapis');


app.use(express.static(path.join(__dirname, '')));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const oAuth2Client = new google.auth.OAuth2(
  '214405943012-bfifcr839f0inqk5ak6i44isqa6atkeu.apps.googleusercontent.com',
  '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',
  'http://localhost:8080/'
);
  
// Access scopes for read-only Drive activity.
const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly'
];


app.get('/', (req, res) => {
  let code = parse(req.url, true).query.code;
  console.log(code);
  if(code){
    oAuth2Client.getToken(code).then(cred=>{
      console.log(cred.tokens);
      oAuth2Client.setCredentials(cred.tokens);  
    });
  }
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('index.html');
});

app.get('/sign-in', (req, res) => {
  
  // Generate a url that asks permissions for the Drive activity scope
  const authorizationUrl = oAuth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
      * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true
  });

  console.log(authorizationUrl);
  res.writeHead(301, { "Location": authorizationUrl });
  res.end();

});


/**
 * Lists the next events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

app.get('/events', (req, res) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client});
  let es = null;
  calendar.events.list(
    {
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 30,
      singleEvents: true,
      orderBy: 'startTime'
    },
    (err, re) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = re.data.items;
      if (events.length) {
        es = events;
        console.log('Your upcoming events:', es);
        res.send(es);
      } else {
        console.log('No upcoming events found.');
      }
    }
  );
});


// not using this endpoint for the momment - Lu 4/3/2023

app.post('/events', (req, res) => {
  // Require google from googleapis package.
  const { google } = require('googleapis');
  // Require oAuth2 from our google instance.
  const { OAuth2 } = google.auth;

  // Create a new instance of oAuth and set our Client ID & Client Secret.
  const oAuth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
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
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: req.body.to, // Change to your recipient
    from: 'your email goes here', // Change to your verified sender
    subject: req.body.summary,
    text: req.body.description,
    html: req.body.description
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch(error => {
      console.error(error);
    });

  res.render('events.html');
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
