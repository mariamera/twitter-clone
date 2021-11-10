import moment from 'moment'

function isADayAgo(input: Date) {
  const yesterday = moment().subtract(1, 'd');

  return moment(input).isBefore(yesterday);
}

export default function setDate(timestamp: number) {
  const date = new Date(timestamp);

  if (isADayAgo(date)) {
    return date.toLocaleString();
  }

  return moment(date).fromNow();
}
