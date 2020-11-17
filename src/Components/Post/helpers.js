const MONTHES = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
}

const getFormattedDay = string => string[0] === '0' ? string[1] : string;

const getFormattedDate = string => {
  const arrFromDate = string.split('-');
  const month = MONTHES[arrFromDate[1]];
  const day = getFormattedDay(arrFromDate[2].slice(0,2));
  const year = arrFromDate[0];
  return `${month} ${day}, ${year}`;
};

export { getFormattedDate };