// Number

/**
 * Convert a number to string.
 * @param {Number} number The number.
 * @return {String} The string.
 */
function numberToString(number) {
  return `${number}`;
}

/**
 * Get a random number.
 * @param {Number} min The inclusive min value.
 * @param {Number} max The exclusive max value.
 * @return {Number} The random number.
 */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Get the middle value.
 * @param {Number} a The first number.
 * @param {Number} b The second number.
 * @param {Number} c The third number.
 * @return {Number} The middle number.
 */
function getMiddleNumber(a, b, c) {
  if ((a > b && b > c) || (c > b && b > a)) return b;
  if ((b > a && a > c) || (c > a && a > b)) return a;
  return c;
}

/**
 * Get the number of digits in a number. See
 * <a href="http://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript/
 * 28203456#28203456">link</a>.
 * @param {Number} integer The integer.
 * @param {Number} [base=10] The base of the number.
 * @return {Number} The number of digits.
 */
function numDigits(integer, base = 10) {
  return Math.max(Math.floor(logN(base, Math.abs(integer))), 0) + 1;
}

/**
 * Check if a number is an integer or not.
 * @param {Number} number The number to check.
 * @return {Boolean} If the number is an integer.
 */
function isInteger(number) {
  return number % 1 === 0;
}

/**
 * Checks if a number is NaN. Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
 * @param {number} number The number to ckeck.
 * @return {Boolean} If the number is NaN.
 */
function isNaN(number) {
  // eslint-disable-next-line no-self-compare
  return number !== number;
}

/**
 * Checks if a number is NaN, Infinity or -Infinity.
 * Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
 * @param {Number} number The number to ckeck.
 * @return {Boolean} If the number is NaN, Infinity or -Infinity.
 */
function isNaNOrInfinity(number) {
  return number * 0 !== 0;
}

/**
 * Truncates the number. This method is as fast as "number | 0" but it's
 * able to handle correctly numbers greater than 2^31 or lower than -2^31.
 * @param {Number} number The number to be truncated.
 * @return {Number} The truncated number.
 */
function truncateNumber(number) {
  return number - (number % 1);
}
