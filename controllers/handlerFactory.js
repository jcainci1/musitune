const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.studioId) filter = { studio: req.params.studioId };

    const features = new APIFeatures(Model.find(filter), req.query)
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

exports.getAllAvailability = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.studioId) filter = { studio: req.params.studioId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    // Require google from googleapis package.
    const { google } = require('googleapis');

    // Require oAuth2 from our google instance.
    const { OAuth2 } = google.auth;

    // Create a new instance of oAuth and set our Client ID & Client Secret.
    const oAuth2Client = new OAuth2(
      '214405943012-bfifcr839f0inqk5ak6i44isqa6atkeu.apps.googleusercontent.com',
      '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'
    );

    // Call the setCredentials method on our oAuth2Client instance and set our refresh token.
    oAuth2Client.setCredentials({
      refresh_token:
        '1//045WwB2RNZ3ccCgYIARAAGAQSNwF-L9Ir9rWzsJPD3uP1tjaVIalS029ESkida5fsFFdhEd5mpqBCwHkuv9wkCqkFZHpTwrsLVOE'
    });

    // Create a new calender instance.
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

    // Create a new event start date instance for temp uses in our calendar.
    const eventStartTime = new Date();
    eventStartTime.setDate(eventStartTime.getDay() + 2);

    // Create a new event end date instance for temp uses in our calendar.
    const eventEndTime = new Date();
    eventEndTime.setDate(eventEndTime.getDay() + 4);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

    // // Create a dummy event for temp uses in our calendar
    // const event = {
    //   summary: `Meeting with David`,
    //   location: `3595 California St, San Francisco, CA 94118`,
    //   description: `Meet with David to talk about the new client project and how to integrate the calendar for booking.`,
    //   colorId: 1,
    //   start: {
    //     dateTime: eventStartTime,
    //     timeZone: 'America/Denver'
    //   },
    //   end: {
    //     dateTime: eventEndTime,
    //     timeZone: 'America/Denver'
    //   }
    // };

    // // Check if we a busy and have an event on our calendar for the same time.
    // calendar.freebusy.query(
    //   {
    //     resource: {
    //       timeMin: eventStartTime,
    //       timeMax: eventEndTime,
    //       timeZone: 'America/Denver',
    //       items: [{ id: 'primary' }]
    //     }
    //   },
    //   (err, res) => {
    //     // Check for errors in our query and log them if they exist.
    //     if (err) return console.error('Free Busy Query Error: ', err);

    //     // Create an array of all events on our calendar during that time.
    //     const eventArr = res.data.calendars.primary.busy;
    //     console.log(res.data.calendars.primary.busy);
    //     // Check if event array is empty which means we are not busy
    //     if (eventArr.length === 0)
    //       // If we are not busy create a new calendar event.
    //       return calendar.events.insert(
    //         { calendarId: 'primary', resource: event },
    //         err => {
    //           // Check for errors and log them if they exist.
    //           if (err)
    //             return console.error('Error Creating Calender Event:', err);
    //           // Else log that the event was created.
    //           return console.log('Calendar event successfully created.');
    //         }
    //       );

    //     // If event array is not empty log that we are busy.
    //     return console.log(`Sorry I'm busy...`);
    //   }
    // );
    var data1 = [];
    const listCalendarEvents = () => {
      calendar.events.list(
        {
          calendarId: 'primary',
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime'
        },
        (error, result) => {
          if (error) {
            console.log('Something went wrong: ', error); // If there is an error, log it to the console
          } else {
            // var eventsList = result.data.items
            const events = result.data.items;

            if (result.data.items.length > 0) {
              // console.log('Your upcoming events:', events);

              events.map((event, i) => {
                data1.push(event);
                // console.log(data1);
              });
              // data1.push(result.data.items);
            } else {
              console.log('No upcoming events found.'); // If no events are found
            }
          }
        }
      );
    };
    listCalendarEvents();
    // const calendar = google.calendar({version: 'v3', auth});
    const re = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime'
    });
    console.log(re.data);
    console.log(re.data);
    res.send(re.data);

    // console.log('List of upcoming events: ', data1); // If there are events, print them out
    // data1 = JSON.stringify(data1);
    // SEND RESPONSE
    // res.send(data1);
    // res.status(200).json({
    //   status: 'success',
    //   results: doc.length,
    //   data: {
    //     data2
    //   }
    // });
    // var var_arr = [
    //   'Extracting finished. Refresh the browser to see your Google events'
    // ];
    // function listEvents(auth) {
    //   async function fun() {
    //     const calendar = await google.calendar({ version: 'v3', auth });
    //     calendar.events.list(
    //       {
    //         calendarId: 'primary',
    //         timeMin: new Date().toISOString(),
    //         maxResults: 30,
    //         singleEvents: true,
    //         orderBy: 'startTime'
    //       },
    //       (err, res) => {
    //         if (err) return console.log('The API returned an error: ' + err);
    //         const events = res.data.items;
    //         if (events.length) {
    //           console.log('Your upcoming events:', events);
    //           events.map((event, i) => {
    //             var_arr.push(event);
    //           });
    //         } else {
    //           console.log('No upcoming events found.');
    //         }
    //       }
    //     );
    //   }
    //   fun();
    // }
    // res.send(var_arr);
    // res.render('index.html');
  });
