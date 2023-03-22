document.getElementById('start_date_recurring').value = formatDate(new Date());
document.getElementById('end_date_recurring').value = formatFutureDate(
  new Date()
);
var timeValue = document.querySelector('.time');
var time = document.querySelector('.time');
var startTime = document.getElementById('startTime');
var endTime = document.getElementById('endTime');

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

function formatFutureDate(date) {
  var d = new Date(date),
    month = '6',
    day = '15';
  var year = d.getMonth() > 6 ? d.getFullYear() + 1 : d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  //   if (month.length > 7) year = d.getFullYear() + 1;
  //   if (month.length > 7) year = d.getFullYear();

  return [year, month, day].join('-');
}

var endTimeValue = document.getElementById('endTime');
var startTimeValue = document.getElementById('startTime');

function validate(inputValue) {
  //   var re = /^([6-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

  //   |([1-9]|0[1-9]|12:"'0'|'00'|'15'|'30'|'45'|'60'")((PM)|(pm)))|(10:"'0'|'00'")((PM)|(pm)))(1[0-1]|0[6-9]|[6-9]:"'0'|'00'|'15'|'30'|'45'|'60'")((AM)|(am)))

  var reg = /^((0?[1-9]|1[2]):(0|0[0]|1[5]|3[0]|4[5]|6[0])\s?((?:P)\.?M\.?))|^((0?[6-9]|1[0-1]):(0|0[0]|1[5]|3[0]|4[5]|6[0])\s?((?:A)\.?M\.?))|^((1[0]):(0|0[0])\s?((?:P)\.?M\.?))$/gim.test(
    inputValue.value
  );
  if (reg) {
    inputValue.style.border = 'none';
  } else {
    inputValue.style.border = 'thick solid #fba';
  }

  console.log(inputValue.value);
  console.log(reg);

  return reg;
}

// validate(startTimeValue);
// validate(endTimeValue);

startTimeValue.addEventListener('keyup', event => {
  validate(startTimeValue);
});
