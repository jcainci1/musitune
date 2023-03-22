/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { updateAvailability } from './updateCalendar';
import { updateSettings } from './updateSettings';
import { userAvailability } from './instructorAvailability';

import { bookStudio } from './stripe';
import { showAlert } from './alerts';
import { navExtend } from './accountNav';
import { Console } from 'console';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const loginGOauthForm = document.querySelector('.g-signin2');
const logOutBtn = document.getElementById('logout');
const registerForm = document.querySelector('.form--register');
const availabilitySave = document.querySelector('.availability__update--form');
const phoneLogOutBtn = document.getElementById('phone-logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-studio');
const registerField = document.querySelector('.registration__field-8');
const newLessonFieldset = document.querySelector('.registration__field-7');
const firstStep = document.querySelector('.registration-student__1--p1');

/// ADD LESSON
const row = document.querySelector('#student__table');
const sideBarHover = document.querySelector('.user-view__menu');

/// PROGRESS BAR
const progress = document.querySelector('.progress-bar-step');
const progress_step = document.querySelectorAll('.progress-bar_li-span-number');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

// async function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail());
// googleUser = await gapi.auth2.getAuthInstance().currentUser.get();
// console.log(googleUser);
// const profile = googleUser.getBasicProfile();
// var profile = googleUser.getBasicProfile();
// console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
// console.log('Name: ' + profile.getName());
// console.log('Image URL: ' + profile.getImageUrl());
// console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// var id_token = googleUser.getAuthResponse().id_token;
// // console.log(id_token);
// var xhr = new XMLHttpRequest();
// xhr.open('POST', '/login');
// xhr.setRequestHeader('Content-Type', 'application/json');
// xhr.onload = function() {
//   console.log('Signed in as: ' + xhr.responseText);
//   if (xhr.responseText == 'success') {
//     signOut();
//     location.assign('/profile');
//   }
// };
// xhr.send(JSON.stringify({ token: id_token }));
// }

if (loginGOauthForm)
  loginGOauthForm.addEventListener('click', e => {
    e.preventDefault();
    console.log('uiui');
    onSignIn(googleUser);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (phoneLogOutBtn) phoneLogOutBtn.addEventListener('click', logout);

/// NAVIGATION STEPS PRIVATE LESSONS FORM

document.querySelector('body').addEventListener('click', function(event) {
  if (event.target.matches('.next')) {
    changeStep('next');
    navSteps();
  }
  if (event.target.matches('.previous')) {
    changeStep('previous');
    navSteps();
  }
  if (event.target.matches('.checkout-option')) {
    changeStep('checkout');
    navSteps();
  }

  if (event.target.matches('.addLesson')) {
    addLesson();
    navSteps();
  }
  if (!event.target.innerHTML.includes('studentInfo-1')) {
  } else {
    const info = document.querySelectorAll('.studentInfo-1');
    const infoRemove = document.querySelectorAll('.info__section');
    infoRemove.forEach(e => {
      e.classList.remove('info__active');
    });
  }
  if (event.target.matches('.button__edit')) {
    const editSection = document.querySelectorAll('.info__edit');
    const editBtn = document.querySelectorAll('.button__edit');
    editSection.forEach(e => {
      e.classList.remove('edit__active');
    });
    editBtn.forEach(item => {
      const index = Array.from(editBtn).indexOf(item);
      const editClass = Array.from(document.querySelectorAll('.info__edit'));
      editClass[index].classList.add('edit__active');
    });
  }

  if (
    event.target.matches(
      '.info__student--label-svg, .info__student--label, .info__student--icon'
    )
  ) {
    const info = document.querySelectorAll('.info__student--label-svg');
    const infoRemove = document.querySelectorAll('.info__section');
    infoRemove.forEach(e => {
      e.classList.remove('info__active');
    });
    info.forEach(item => {
      const index = Array.from(info).indexOf(item);
      const infoClass = Array.from(document.querySelectorAll('.info__section'));
      infoClass[index].classList.add('info__active');
    });
  }
  if (
    event.target.matches(
      '.form__label--delete, .form__input--delete, .form__span--delete'
    )
  ) {
    const el = document.querySelectorAll('.info__section');
    var index = [...el].indexOf(
      event.target.outerHTML.classList.contains('info__section')
    );
    const deleteArray = Array.from(
      document.querySelectorAll('.delete-student')
    );
  }
});

let currentActive = 1;

function navSteps() {
  const steps = Array.from(
    document.querySelectorAll('form .registration__field')
  );
  const active_fieldset = document.querySelector('.activeFieldset');
  const submit = document.querySelector('#submit');
  const next = document.querySelector('#next');
  const previous = document.querySelector('#previous');
  const formNav = document.querySelector('.formNav');
  const stepsIndex = steps.indexOf(active_fieldset);
  if (stepsIndex >= 1 && previous === null) {
    next.insertAdjacentHTML(
      'beforebegin',
      '<div class="btn-small btn-small__reg previous" id="previous">Previous</div>'
    );
  }
  if (stepsIndex < 1) {
    previous.remove();
    next.classList.add('.next-alone');
  }
  if (stepsIndex + 1 >= steps.length) {
    next.remove();
    previous.insertAdjacentHTML(
      'afterend',
      '<div class="btn-small btn-small__reg submit" id="submit">Submit</div>'
    );
  }

  if (stepsIndex + 1 < steps.length && next === null) {
    submit.remove();
    previous.insertAdjacentHTML(
      'afterend',
      '<div class="btn-small btn-small__reg next" id="next">Next</div>'
    );
  }

  currentActive = stepsIndex;
  update();
}

function update() {
  progress_step.forEach((step, idx) => {
    if (idx < currentActive) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
    const actives = document.querySelectorAll('.active');

    progress.style.width = ((actives.length - 1) / 7) * 100 + '%';
  });
}

function changeStep(btn) {
  let index = 0;
  const active_fieldset = document.querySelector('.activeFieldset');
  const steps = Array.from(
    document.querySelectorAll('form .registration__field')
  );
  const registration_fieldset = document.getElementsByClassName(
    'registration__field'
  );
  index = steps.indexOf(active_fieldset);
  steps[index].classList.remove('activeFieldset');
  if (btn === 'next') {
    index++;
    registration_fieldset[index].classList.add('activeFieldset');
  } else if (btn === 'previous') {
    index = index - 1;
    registration_fieldset[index].classList.add('activeFieldset');
  } else if (btn === 'checkout') {
    index = 7;
    registerField.classList.add('activeFieldset');
    document
      .querySelector('.registration__field-7')
      .classList.remove('activeFieldset');
  }
}

////// PRIVATE LESSON FORM COOKIES

const info_section = document.querySelectorAll('div .info__section');

function setCook(name, value, exdays) {
  var cookie = [name, '=', JSON.stringify(value)].join('');
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cookie + ';' + expires;
}

function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return JSON.parse(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

var today = new Date();
var expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000); // plus 30 days

const element = document.querySelector('.lesson');
//Get active table
const lessonHeader = document.querySelector('.lesson_header');
function loadCookie() {
  // Get table header
  const lessonCookie = document.querySelector('.lessonCookie');
  //delete current UI elements
  let elements = Array.from(document.querySelectorAll('.lesson'));
  //table
  const tableHeader = `<tr class="lessonCookie"><th>Student</th><th>Instrument</th><th>Instructor</th><th></th></tr>`;

  if (element !== null) {
    element.remove();
    // tableHeader.remove();
  }
  if (elements.length > 0) {
    elements.forEach(elements => {
      elements.remove();
    });
  }

  //remove table
  //Get values from form

  let sFnames = readCookie('student_fname');
  let sLnames = readCookie('student_lname');
  let sRelation = readCookie('student_relation');
  let sDOB = readCookie('student_birthdate');
  let sIntrum = readCookie('student_instrument');
  if (readCookie('student_fname') !== null) {
    if (readCookie('student_fname').length > 0 && lessonCookie === null) {
      row.insertAdjacentHTML('afterbegin', tableHeader);
    }
  }
  if (Array.isArray(sFnames)) {
    var lessons = [];
    const lessonAmount = sFnames.length;
    for (let i = 1; i <= lessonAmount; i++) {
      const input = `
        <tr class="lesson">
      <td>${sFnames[i - 1]}</td>
      <td>${sLnames[i - 1]}</td>
      <td>${sLnames[i - 1]}</td>
      <td class="student__buttons"><button class="student__button button__more"><svg class="info__student--svg"><use class="info__student--icon" xlink:href="/img/icons/icon.svg#icon-more-vertical"></use></svg></button><button class="student__button button__edit"><svg class="info__student--svg"><use class="info__student--icon" xlink:href="/img/icons/icon.svg#icon-edit" viewBox="0 0 1000 1000"></use></svg></button><button class="student__button button__delete"><svg class="info__student--svg"><use class="info__student--icon" xlink:href="/img/icons/icon.svg#icon-delete"></use></svg></button></td></tr>`;
      lessons.push(input);
    }
    row.insertAdjacentHTML('beforeend', lessons.join(''));
  } else if (sFnames !== null) {
    lessonHeader.classList.add('student__table--active');
    if (element !== null) {
      element.remove();
    }
    if (elements.length > 1) {
      elements.forEach(elements => {
        elements.remove();
      });
    }
    row.insertAdjacentHTML(
      'beforeend',
      `
  <tr class="lesson">
<td>${sFnames}</td>
<td>${sLnames}</td>
<td>${sLnames}</td>
<td class="student__buttons"><button class="student__button button__more"><svg class="info__student--svg"><use class="info__student--icon" xlink:href="/img/icons/icon.svg#icon-more-vertical"></use></svg></button><button class="student__button button__edit"><svg class="info__student--svg"><use class="info__student--icon" xlink:href="/img/icons/icon.svg#icon-edit" viewBox="0 0 1000 1000"></use></svg></button><button class="student__button button__delete"><svg class="info__student--svg"><use class="info__student--icon" xlink:href="/img/icons/icon.svg#icon-delete"></use></svg></button></td></tr>`
    );
  }
  if (newLessonFieldset) {
    newLessonFieldset.classList.remove('activeFieldset');
    firstStep.classList.add('activeFieldset');
    var btnDeleteRefresh = document.querySelectorAll('.button__delete');
    btnDeleteRefresh.forEach(function(check) {
      check.addEventListener('click', deleteLesson);
    });
  }
  if (readCookie('student_fname') !== null) {
    if (readCookie('student_fname').length === 0 && lessonCookie !== null) {
      lessonCookie.remove();
    }
  }
}
loadCookie();
function loadListener() {
  var btnrefreshDelete = document.querySelector('.button__delete');
  btnrefreshDelete.addEventListener('click', deleteLesson);
}

function addLesson() {
  //Form values
  const student_firstname = document.querySelector('#student-firstname').value;
  const student_lastname = document.querySelector('#student-lastname').value;
  const student_relationship = document.querySelector('.student-relationship')
    .value;
  const student_birthdate = document.querySelector('#student-birthdate').value;
  const student_instrument = document.querySelector('#student-instrument')
    .value;
  const student_experience = document.querySelector('#student-experience')
    .value;
  const student_experience_description = document.querySelector(
    '#student-experience-description'
  ).value;
  const student_lesson_frequency = document.querySelector('#lesson-frequency')
    .value;
  const student_lesson_duration = document.querySelector('#lesson-duration')
    .value;
  const student_date = document.querySelector('#student-date').value;
  const student_instructor = document.querySelector('.student-instructor')
    .value;
  const student_time = document.querySelector('.student-time').value;

  var fname = readCookie('student_fname');
  if (fname === null || fname === '') {
    setCook('student_fname', student_firstname, 3);
    setCook('student_lname', student_lastname, 3);
    setCook('student_relation', student_relationship, 3);
    setCook('student_birthdate', student_birthdate, 3);
    setCook('student_instrument', student_instrument, 3);
    loadCookie();
  } else {
    if (Array.isArray(fname) && fname.length >= 5) {
      changeStep('checkout');
      showAlert('access-denied', 'Cannot add more than 5 students at a time');
    } else if (Array.isArray(fname) && fname.length > 1) {
      let sFnamesArray = [];
      let sLnamesArray = [];
      let sRelationArray = [];
      let sDOBArray = [];
      let sIntrumArray = [];
      let sFnames = readCookie('student_fname');
      let sLnames = readCookie('student_lname');
      let sRelation = readCookie('student_relation');
      let sDOB = readCookie('student_birthdate');
      let sIntrum = readCookie('student_instrument');
      const fNames = sFnamesArray.push(sFnames, student_firstname);
      const lNames = sLnamesArray.push(sLnames, student_lastname);
      const relations = sRelationArray.push(sRelation, student_relationship);
      const bDates = sDOBArray.push(sDOB, student_birthdate);
      const instrums = sIntrumArray.push(sIntrum, student_instrument);
      setCook('student_fname', sFnamesArray.flat(), 3);
      setCook('student_lname', sLnamesArray.flat());
      setCook('student_relation', sRelationArray.flat(), 3);
      setCook('student_birthdate', sDOBArray.flat(), 3);
      setCook('student_instrument', sIntrumArray.flat(), 3);

      loadCookie();
    } else {
      let sFnamesArray = [];
      let sLnamesArray = [];
      let sRelationArray = [];
      let sDOBArray = [];
      let sIntrumArray = [];
      let sFnames = readCookie('student_fname');
      let sLnames = readCookie('student_lname');
      let sRelation = readCookie('student_relation');
      let sDOB = readCookie('student_birthdate');
      let sIntrum = readCookie('student_instrument');
      const fNames = sFnamesArray.push(sFnames, student_firstname);
      const lNames = sLnamesArray.push(sLnames, student_lastname);
      const relations = sRelationArray.push(sRelation, student_relationship);
      const bDates = sDOBArray.push(sDOB, student_birthdate);
      const instrums = sIntrumArray.push(sIntrum, student_instrument);
      setCook('student_fname', sFnamesArray.flat(), 3);
      setCook('student_lname', sLnamesArray.flat(), 3);
      setCook('student_relation', sRelationArray.flat(), 3);
      setCook('student_birthdate', sDOBArray.flat());
      setCook('student_instrument', sIntrumArray.flat(), 3);

      loadCookie();
      loadListener();
    }
  }
}

var btnDelete = document.querySelectorAll('.button__delete');

btnDelete.forEach(function(check) {
  check.addEventListener('click', deleteLesson);
});

function deleteLesson(event) {
  var btnDelete = document.querySelectorAll('.button__delete');
  const index = Array.from(btnDelete).indexOf(
    event.target.closest('.button__delete')
  );
  const btn = Array.from(btnDelete);
  const length = btnDelete.length;
  if (btn.length > 1) {
    const index = Array.from(btnDelete).indexOf(
      event.target.closest('.button__delete')
    );
    var sFnamesHold = [];
    var sLnamesHold = [];
    var sRelationHold = [];
    var sDOBHold = [];
    var sIntrumHold = [];
    const sFnames = readCookie('student_fname');
    const sLnames = readCookie('student_lname');
    const sRelation = readCookie('student_relation');
    const sDOB = readCookie('student_birthdate');
    const sIntrum = readCookie('student_instrument');
    sFnames.splice(index, 1);
    sLnames.splice(index, 1);
    sRelation.splice(index, 1);
    sDOB.splice(index, 1);
    sIntrum.splice(index, 1);

    sFnamesHold = sFnames;
    sLnamesHold = sLnames;
    sRelationHold = sRelation;
    sDOBHold = sDOB;
    sIntrumHold = sIntrum;
    document.cookie = 'student_fname=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'student_lname=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie =
      'student_relation=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie =
      'student_birthdate=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie =
      'student_instrument=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    setCook('student_fname', sFnamesHold);
    setCook('student_lname', sLnamesHold);
    setCook('student_relation', sRelationHold);
    setCook('student_birthdate', sDOBHold);
    setCook('student_instrument', sIntrumHold);
  } else {
    document.cookie = 'student_fname=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'student_lname=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie =
      'student_relation=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie =
      'student_birthdate=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie =
      'student_instrument=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  }
  loadCookie();
}

// SIGNUP FORM
if (registerForm)
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    let firstName = document.getElementById('first_name').value;
    let lastName = document.getElementById('last_name').value;
    const name = firstName + ' ' + lastName;
    const phone = document.getElementById('phone_number').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('confirm_password').value;
    await signup({ name, email, phone, password, passwordConfirm });
  });

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { studioId } = e.target.dataset;
    bookStudio(studioId);
  });

/// UPDATE AVAILBILITY
if (availabilitySave)
  availabilitySave.addEventListener('submit', async e => {
    e.preventDefault();
    let start_date = document.getElementById('start_date_recurring').value;
    let end_date = document.getElementById('end_date_recurring').value;
    let start_time = document.getElementById('startTime').value;
    let end_time = document.getElementById('endTime').value;
    let recurringOption = document.getElementById('recurring-info');
    let recurringBoolean =
      recurringOption.options[recurringOption.selectedIndex].value;
    const customRecurring = document.getElementById('custom__recurring');
    let recurring = true;

    if (recurringBoolean == 'does_not_repeat') {
      recurring = false;
    }
    //  Time function that calls hours and minutes for a given time value
    let hours;
    let minutes;
    function times(time) {
      let timeArray = time.split(':');
      let timeIdentifier = timeArray[1].match(/[a-zA-Z]+|[0-9]+/g);
      minutes = timeIdentifier[0];
      if (timeIdentifier[1] == 'PM' || 'pm' || 'Pm' || 'pM') {
        hours = parseInt(timeArray[0]) + 12;
      } else {
        hours = timeArray[0];
      }
      return { hours, minutes };
    }
    // Get the start time and end time hours and minutes
    let startTimeValues = times(start_time);
    let endTimeValues = times(end_time);

    let start_hours = startTimeValues.hours,
      start_minutes = startTimeValues.minutes,
      end_hours = endTimeValues.hours,
      end_minutes = endTimeValues.minutes;
    //Get Weekdays
    let weekdays = [];
    //Get Frequency

    let recurringArray = await JSON.parse(localStorage.getItem('recurring'));
    let frequencyCount;
    let occurence_amount;
    let repeat_frequency_type;
    if (recurringBoolean === 'custom_recurring_value') {
      recurringArray.forEach(function(e, index) {
        if (e.includes('occurences' || 'occurence')) {
          occurence_amount = recurringArray[index].split(' ')[0];
          return occurence_amount;
        }
        if (e.includes('Week' || 'Month' || 'Year')) {
          let recurringFreqArray = recurringArray[0].split(' ');
          let recurringFreqArrayCount = recurringArray[0].split(' ');
          frequencyCount = recurringFreqArray[recurringFreqArray.length - 1];
          if (frequencyCount[frequencyCount.length - 1] == 's') {
            frequencyCount = recurringFreqArray[recurringFreqArray.length - 2];
            repeat_frequency_type =
              recurringFreqArray[recurringFreqArray.length - 1].slice(0, -1) +
              'ly';
          } else {
            frequencyCount = 1;
            repeat_frequency_type =
              recurringFreqArray[recurringFreqArray.length - 1] + 'ly';
          }
          console.log(repeat_frequency_type);
          return repeat_frequency_type, parseInt(frequencyCount);
        }
        weekdays.push(recurringArray[index]);
      });
    }
    // if (repeat_frequency_count) {
    //   updateAvailability({
    //     create_availability: {
    //       recurring,
    //       end_date,
    //       start_date,
    //       start_hours,
    //       end_hours,
    //       start_minutes,
    //       end_minutes,
    //       repeat_frequency: {
    //         repeat_frequency_type,
    //         repeat_frequency_count
    //       }
    //     }
    //   });
    // } else {
    //   updateAvailability({
    //     create_availability: {
    //       recurring,
    //       end_date,
    //       start_date,
    //       start_hours,
    //       end_hours,
    //       start_minutes,
    //       end_minutes,
    //       repeat_frequency: {
    //         repeat_frequency_type
    //       }
    //     }
    updateAvailability({
      create_availability: {
        recurring,
        end_date,
        start_date,
        start_hours,
        end_hours,
        start_minutes,
        end_minutes,
        repeat_frequency: {
          repeat_frequency_type: repeat_frequency_type,
          repeat_frequency_day: weekdays,
          repeat_frequency_count: frequencyCount
        },
        occurence_amount
      }
    });
  });
// }
// });

// console.log(currentDate);

// console.log(response.data[0].create_availability.availability_start_date)
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

/// EMPLOYEE PORTAL CALENDAR

let nav = 0;
let clicked = null;
let events = localStorage.getItem('events')
  ? JSON.parse(localStorage.getItem('events'))
  : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

/// Recurring end on

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
var yyyyAdd = today.getFullYear() + 3;

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}

var today = yyyy + '-' + mm + '-' + dd;
var maxDate = yyyyAdd + '-' + mm + '-' + dd;
if (document.getElementById('recurrence-end__on-date')) {
  document.getElementById('recurrence-end__on-date').setAttribute('min', today);
  document
    .getElementById('recurrence-end__on-date')
    .setAttribute('max', maxDate);
}
/// Monthly View Schedule

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

//Monthly Dislay

function openModal(date) {
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

async function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  var data;
  data = await userAvailability().then(data => {
    console.log(data);
    console.log(data.data);
    data = data.data;
    return data;
  });

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
  console.log(firstDayOfMonth);
  console.log(
    firstDayOfMonth.toLocaleDateString('en-us', {
      day: 'numeric'
    })
  );
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById(
    'monthDisplay'
  ).innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  // console.log(dt);
  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      var availabilityForDayStartTimes = [];
      var availabilityForDayEndTimes = [];
      const eventForDay = events.find(e => e.date === dayString);
      availabilityForDayStartTimes = data.forEach(function(element, index) {
        var startDates = element.all_created_availability_start_dates;
        var endDates = element.all_created_availability_end_dates;
        startDates.forEach(function(el, i) {
          let avaiDay = `${month + 1}/${new Date(el).getDate() -
            paddingDays}/${year}`;

          if (avaiDay === dayString) {
            const dayAvailability = document.createElement('div');
            dayAvailability.classList.add('day__availability');
            dayAvailability.innerText = `${getTime(el)} - ${getTime(
              endDates[i]
            )}`;
            daySquare.appendChild(dayAvailability);
            console.log(dayAvailability);
          }
        });
      });
      // availabilityForDayEndTimes = data.forEach(function(element, index) {
      //   console.log(element);
      //   var endDates = element.all_created_availability_end_dates;
      // });
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);
  }

  return dt;
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  if (document.getElementById('nextButton')) {
    document.getElementById('nextButton').addEventListener('click', () => {
      nav++;
      load();
    });
    document.getElementById('backButton').addEventListener('click', () => {
      nav--;
      load();
    });
    document.getElementById('todayDisplay').addEventListener('click', () => {
      nav = 0;
      load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document
      .getElementById('cancelButton')
      .addEventListener('click', closeModal);
    document
      .getElementById('deleteButton')
      .addEventListener('click', deleteEvent);
    document
      .getElementById('closeButton')
      .addEventListener('click', closeModal);
  }
}

// startDate: Date()
// endDate: Date()
// interval: Number() number of days between recurring dates
// function recurringDates(startDate, endDate, interval) {
//   // initialize date variable with start date
//   var date = startDate;
//   // create array to hold result dates
//   var dates = [];

//   // check for dates in range
//   while ((date = addDays(date, interval)) < endDate) {
//     // add new date to array
//     dates.push(date);
//   }

//   // return result dates
//   return dates;
// }

function getTime(date) {
  var newDate = new Date(date);
  var getHours = newDate.getHours();
  var getMinutes = newDate.getMinutes();
  if (getMinutes == 0) {
    getMinutes = '00';
  }

  if (getHours > 12) {
    var time = `${getHours - 12}:${getMinutes} pm`;
    return time;
  } else {
    if (getHours == 0) {
      getHours = '12';
    }
    var time = `${getHours}:${getMinutes} am`;
    return time;
  }
}

console.log(getTime('11/20/2023'));

function addDays(date, days) {
  var newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

// var startDate = new Date(2015, 0, 1);
// var endDate = new Date(2016, 0, 1);
// var interval = 20;
let startDates = '2021-01-28T00:00:00.000Z';
let endDates = '2021-03-01T00:00:00.000Z';
// let dateseses = dateses.split('-');
// new Date(dateseses[0], dateseses[1], dateseses[2]);

function recurringDates(startDate, endDate, interval) {
  // initialize date variable with start date
  var date = new Date(startDate);
  var enddate = new Date(endDate);
  // create array to hold result dates
  var dates = [];

  // check for dates in range
  while ((date = addDays(date, interval)) < enddate) {
    // add new date to array
    dates.push(date);
  }

  // return result dates
  dates.forEach(function(element) {
    dates.push(element.toISOString().split('T')[0]);
  });
  return dates;
}

// function addDays(date, days) {
//   var newDate = new Date(date);
//   newDate.setDate(date.getDate() + days);
//   return newDate;
// }

// return (starts = '2021-12-28'), (ends = '2021-03-01');
// return (this.start_dates = '2021-12-28'), (this.end_dates = '2021-03-01');
// return dates;
// console.log(starts);
// function makeDate(dote) {
//   // let datese = this.start_times;
//   dote.toString();
//   let dateseses = dote.toString().split('-');
//   var result = dateseses.map(function(x) {
//     return parseInt(x, 10);
//   });
//   const results = new Date(result[0], result[1] - 1, result[2]);
//   return results;
// }

// function formatDate(date) {
//   var d = new Date(date),
//     month = '' + (d.getMonth() + 1),
//     day = '' + d.getDate(),
//     year = d.getFullYear();

//   if (month.length < 2) month = '0' + month;
//   if (day.length < 2) day = '0' + day;

//   return [year, month, day].join('-');
// }

// let startDate = makeDate(startDates);
// let endDate = makeDate(endDates);
// console.log(startDate.toISOString().split('T')[0]);
// console.log(formatDate(endDate));
// console.log(recurringDates(startDates, endDates, 7));
// let recurringArray = JSON.parse(localStorage.getItem('recurring'));
// console.log(recurringArray);
// let occurenceAmount;
// let frequencyType;
// let frequencyCount;
// let weekday = [];
// if (recurringArray) {
//   recurringArray.forEach(function(e, index) {
//     if (e.includes('occurences' || 'occurence')) {
//       occurenceAmount = recurringArray[index].split(' ')[0];
//       return occurenceAmount;
//     }
//     if (e.includes('Week' || 'Month' || 'Year')) {
//       let recurringFreqArray = recurringArray[0].split(' ');
//       let recurringFreqArrayCount = recurringArray[0].split(' ');
//       frequencyCount = recurringFreqArray[recurringFreqArray.length - 1];
//       if (frequencyCount[frequencyCount.length - 1] == 's') {
//         frequencyCount = recurringFreqArray[recurringFreqArray.length - 2];
//       } else {
//         frequencyCount = 1;
//       }
//       frequencyType = recurringFreqArray[recurringFreqArray.length - 1] + 'ly';
//       return frequencyType, parseInt(frequencyCount);
//     }
//     weekday.push(recurringArray[1]);
//   });
// }
// console.log(weekday);

const array1 = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const array2 = ['Monday'];

let intersection;
let intersection2 = [];
intersection = array1.filter(element => array2.indexOf(element));
array2.forEach(function(e) {
  intersection2.push(array1.indexOf(e));
});

// load();

// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

// function signOut() {
//   var auth2 = gapi.auth2.getAuthInstance();
//   auth2.signOut().then(function() {
//     console.log('User signed out.');
//   });
// }

// function getGoogleOAuthURL() {
//   console.log('HI');
//   const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

//   const options = {
//     redirect_uri: 'http://localhost:8080/api/v1/users/oauth/google',
//     client_id:
//       '214405943012-1tkr8mfdm3hf2jni3t9to9mbdef0g1cl.apps.googleusercontent.com',
//     access_type: 'offline',
//     response_type: 'code',
//     prompt: 'consent',
//     scope: [
//       'https://www.googleapis.com/auth/userinfo.profile',
//       'https://www.googleapis.com/auth/userinfo.email'
//     ].join(' ')
//   };
//   // console.log({ options });

//   const qs = new URLSearchParams(options);

//   // console.log(qs.toString());

//   return `${rootUrl}?${qs.toString()}`;
// }

// // getGoogleOAuthURL();
// // export default getGoogleOAuthURL;

// if (document.getElementById('googleSignIn')) {
//   document.getElementById('googleSignIn').addEventListener('click', e => {
//     console.log('log');
//     onSignIn();
//   });
// }

// var client;
// var access_token;

// function initClient() {
//   client = google.accounts.oauth2.initTokenClient({
//     client_id:
//       '214405943012-1tkr8mfdm3hf2jni3t9to9mbdef0g1cl.apps.googleusercontent.com',
//     scope:
//       'https://www.googleapis.com/auth/calendar.readonly \
//             https://www.googleapis.com/auth/contacts.readonly',
//     callback: tokenResponse => {
//       access_token = tokenResponse.access_token;
//     }
//   });
// }
// function getToken() {
//   client.requestAccessToken();
// }
// function revokeToken() {
//   google.accounts.oauth2.revoke(access_token, () => {
//     console.log('access token revoked');
//   });
// }
// function loadCalendar() {
//   var xhr = new XMLHttpRequest();
//   xhr.open(
//     'GET',
//     'https://www.googleapis.com/calendar/v3/calendars/primary/events'
//   );
//   xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
//   xhr.send();
// }
