import moment from 'moment'

function isADayAgo(input: Date) {
  let yesterday = moment().subtract(1, 'd');
  return moment(input).isBefore(yesterday);
}

export default function setDate(timestamp: number) {
  var date = new Date(timestamp);

  if (isADayAgo(date)) {
    return date.toLocaleString();
  }

  return moment(date).fromNow();
}