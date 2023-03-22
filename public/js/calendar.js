const customRecurrence = document.getElementById('custom_recurrence');
const availabilityModal = document.getElementById('availability__modal');
const recurringDone = document.getElementById('recurring--done');
const recurringCancel = document.getElementById('recurring--cancel');
const recurringInfo = document.getElementById('recurring-info');
const availabilityCancel = document.getElementById('availability__cancel');
const availabilityRecurring = document.querySelector(
  '.availability__recurring'
);
const availabilityNotRecurring = document.querySelector(
  '.availability__not-recurring'
);
const endDateRecurring = document.getElementById('end_date_recurring');
const frequencyNumber = document.querySelector('#repeat_number');
const frequencyTerm = document.querySelector('#recurring_frequency');
///Calendar

///Update availability functionality

recurringCancel.addEventListener('click', () => {
  customRecurrence.classList.remove('custom_recurrence--active');
  recurringInfo.selectedIndex = 1;
});

availabilityCancel.addEventListener('click', () => {
  availabilityModal.classList.remove('availability__modal--active');
});

availability__update.addEventListener('click', () => {
  availabilityModal.classList.add('availability__modal--active');
});

recurringInfo.addEventListener('input', function(e) {
  if (e.target.value === 'custom') {
    customRecurrence.classList.add('custom_recurrence--active');
  }
});

recurringInfo.addEventListener('change', function(e) {
  if (
    e.target.value === 'custom' &&
    !customRecurrence.classList.contains('custom_recurrence--active')
  ) {
    customRecurrence.classList.add('custom_recurrence--active');
  }
});

window.addEventListener('click', event => {
  const customRecurrenceClick = document.getElementById('custom_recurrence');
  if (
    event.target.innerHTML.includes('recurring--fieldset') &&
    customRecurrence.classList.contains('custom_recurrence--active')
  ) {
    customRecurrence.classList.remove('custom_recurrence--active');
    recurringInfo.value = 'weekly_day';
  }
  if (
    event.target.innerHTML.includes('update__availability') &&
    !customRecurrence.classList.contains('custom_recurrence--active') &&
    availabilityModal.classList.contains('availability__modal--active')
  ) {
    availabilityModal.classList.remove('availability__modal--active');
  }
});

recurringInfo.addEventListener('input', function(e) {
  if (
    e.target.value === 'does_not_repeat' &&
    !availabilityNotRecurring.classList.contains('availability__active')
  ) {
    availabilityRecurring.classList.remove('availability__active');
    availabilityNotRecurring.classList.add('availability__active');
  } else if (
    e.target.value !== 'does_not_repeat' &&
    !availabilityRecurring.classList.contains('availability__active')
  ) {
    availabilityNotRecurring.classList.remove('availability__active');
    availabilityRecurring.classList.add('availability__active');
  }
});

/// Submit recurring availability

const customRecurringSubmit = document.querySelector('#recurring--done');

function addRecurringItems() {
  const frequencyNumber = document.querySelector('#repeat_number').value;
  const frequencyTerm = document.querySelector('#recurring_frequency');
  const daysChecked = Array.from(
    document.querySelectorAll('.checkbox--input__recurring-day')
  );
  const recurringEndOn = document.querySelector('#recurring__end--on');
  const occurenceAfter = document.querySelector('#recurring__end--after');
  var elements = [];
  if (frequencyNumber > 0) {
    const numberIf = frequencyNumber > 1 ? frequencyNumber + ' ' : '';
    elements.push(
      `Repeats Every ${numberIf}${
        frequencyTerm.options[frequencyTerm.selectedIndex].text
      }`
    );
  }
  if (recurringEndOn.checked) {
    endDateRecurring.value = document.querySelector(
      '#recurrence-end__on-date'
    ).value;
  }

  if (occurenceAfter.checked) {
    const occurenceAmount = document.querySelector(
      '#recurring__end--after-occurances'
    ).value;
    if (occurenceAmount > 1) {
      elements.push(`${occurenceAmount} occurences`);
    }
    if (occurenceAmount == 1) {
      elements.push(`${occurenceAmount} occurence`);
    }
  }
  daysChecked.forEach(function(el) {
    if (el.checked) {
      elements.push(el.name);
      console.log(elements);
      // elements = el.push;
      if (elements.length > 1) {
        localStorage.setItem('recurring', JSON.stringify(elements));
      } else if (elements.length === 1) {
        localStorage.setItem('recurring', elements);
      }
    }
  });
  recurringInfo.selectedIndex = 1;
  customRecurrence.classList.remove('custom_recurrence--active');
}

for (var i = 0, len = localStorage.length; i < len; ++i) {
  console.log(localStorage.getItem(localStorage.key(i)));
}

customRecurringSubmit.addEventListener('click', addRecurringItems);

frequencyNumber.addEventListener('input', function(e) {
  const freqTermChange = document.querySelectorAll('.freq__term');
  var lastLetters = Array.from(freqTermChange).map(i => i.innerHTML.slice(-1));
  // var nodes = document.querySelectorAll('.freq__term');
  // var list = [].slice.call(nodes);
  if (
    (e.target.value > 1 || e.target.value == '0' || e.target.value == '') &&
    lastLetters[0] != 's'
  ) {
    Array.from(freqTermChange).map(e => (e.innerHTML += 's'));
  }
  if (e.target.value <= 1 && lastLetters[0] == 's') {
    Array.from(freqTermChange).map(
      e => (e.innerHTML = e.innerHTML.slice(0, -1))
    );
  }
});

const occurenceName = document.getElementById('occurence__name');
const occurenceNumber = document.getElementById(
  'recurring__end--after-occurances'
);

occurenceNumber.addEventListener('input', function(e) {
  if (e.target.value == 1) {
    occurenceName.textContent = 'occurence';
  } else if (
    e.target.value > 1 ||
    e.target.value == '0' ||
    e.target.value == ''
  ) {
    occurenceName.textContent = 'occurences';
  }
});

const doesNotRepeat = document.getElementById('does-not-repeat__option');

// console.log(JSON.parse(localStorage.getItem('recurring')));

function getRecurringOptions() {
  var getCustomRecurring = JSON.parse(localStorage.getItem('recurring'));
  var daysAbbreviated = [];
  var repeatIndex;
  var occurenceIndex;
  var recurringArrayLength = getCustomRecurring.length;
  getCustomRecurring.forEach((element, index) => {
    if (element.includes('occurence')) {
      return (occurenceIndex = index);
    }
    if (element.includes('Repeats')) {
      console.log(index);
      return (repeatIndex = index);
      x;
    }
  });
  // console.log(daysOfWeekRecurring);
  if (typeof occurenceIndex !== 'undefined') {
    var daysOfWeekRecurring = getCustomRecurring.slice(
      occurenceIndex + 1,
      recurringArrayLength
    );
  } else {
    var daysOfWeekRecurring = getCustomRecurring.slice(
      repeatIndex + 1,
      recurringArrayLength
    );
  }
  daysOfWeekRecurring.forEach((element, index) => {
    if (
      element.includes('Tuesday') ||
      element.includes('Thursday') ||
      element.includes('Saturday') ||
      element.includes('Sunday')
    ) {
      daysAbbreviated.push(element.slice(0, 2));
      console.log(daysAbbreviated);
    } else {
      daysAbbreviated.push(element.slice(0, 1));
    }
    return daysAbbreviated;
  });
  console.log(daysAbbreviated);

  if (daysOfWeekRecurring.length === 7) {
    daysAbbreviated = 'Daily';
  }
  const templateStringName =
    getCustomRecurring[repeatIndex] +
    (typeof occurenceIndex !== 'undefined'
      ? ', ' + getCustomRecurring[occurenceIndex]
      : '') +
    ': ' +
    daysAbbreviated.join(', ');
  console.log(templateStringName);
  if (getCustomRecurring) {
    var option = `
      <option id="custom__recurring" value="custom_recurring_value">
        ${templateStringName}
      </option>`;

    doesNotRepeat.insertAdjacentHTML('afterend', option);
  }
}

getRecurringOptions();
