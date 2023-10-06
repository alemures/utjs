import { logN } from './math';

/**
 * Convert a number to string.
 * @param number The number.
 * @return The string.
 */
export function numberToString(number: number) {
  return `${number}`;
}

/**
 * Get a random number.
 * @param min The inclusive min value.
 * @param max The exclusive max value.
 * @return The random number.
 */
export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Get the middle value.
 * @param a The first number.
 * @param b The second number.
 * @param c The third number.
 * @return The middle number.
 */
export function getMiddleNumber(a: number, b: number, c: number) {
  if ((a > b && b > c) || (c > b && b > a)) return b;
  if ((b > a && a > c) || (c > a && a > b)) return a;
  return c;
}

/**
 * Get the number of digits in a number. See
 * <a href="http://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript/
 * 28203456#28203456">link</a>.
 * @param integer The integer.
 * @param base The base of the number. Defaults to 10.
 * @return The number of digits.
 */
export function numDigits(integer: number, base = 10) {
  return Math.max(Math.floor(logN(base, Math.abs(integer))), 0) + 1;
}

/**
 * Check if a number is an integer or not.
 * @param number The number to check.
 * @return If the number is an integer.
 */
export function isInteger(number: number) {
  return number % 1 === 0;
}

/**
 * Checks if a number is NaN. Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
 * @param number The number to ckeck.
 * @return If the number is NaN.
 */
export function isNaN(number: number) {
  // eslint-disable-next-line no-self-compare
  return number !== number;
}

/**
 * Checks if a number is NaN, Infinity or -Infinity.
 * Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
 * @param number The number to ckeck.
 * @return If the number is NaN, Infinity or -Infinity.
 */
export function isNaNOrInfinity(number: number) {
  return number * 0 !== 0;
}

/**
 * Truncates the number. This method is as fast as "number | 0" but it's
 * able to handle correctly numbers greater than 2^31 or lower than -2^31.
 * @param number The number to be truncated.
 * @return The truncated number.
 */
export function truncateNumber(number: number) {
  return number - (number % 1);
}
