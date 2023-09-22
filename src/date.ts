const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Date object to mysql date string.
 * @param date The date object.
 * @return The mysql string.
 */
export function dateToMysql(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const min = date.getMinutes();
  const ss = date.getSeconds();

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

/**
 * Date object to readable date string.
 * @param date The date object.
 * @return The date string.
 */
export function dateToString(date = new Date()) {
  const dd = numberToString(date.getDate());
  const mm = MONTHS[date.getMonth()];
  const yyyy = numberToString(date.getFullYear());
  const hh = numberToString(date.getHours());
  const min = numberToString(date.getMinutes());
  const ss = numberToString(date.getSeconds());

  return `${paddingLeft(dd, '0', 2)}-${mm}-${yyyy.substring(2)} ${paddingLeft(
    hh,
    '0',
    2
  )}:${paddingLeft(min, '0', 2)}:${paddingLeft(ss, '0', 2)}`;
}

/**
 * Get the actual date as a readable string.
 * @return A readable date string.
 */
export function now() {
  const date = new Date();
  const string = dateToString(date);
  const millis = numberToString(date.getMilliseconds());
  return `${string}.${paddingLeft(millis, '0', 3)}`;
}

/**
 * Clone a Date object.
 * @param date The original Date object.
 * @return The cloned Date.
 */
export function cloneDate(date: Date) {
  return new Date(date.getTime());
}
