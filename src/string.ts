import { logN } from './math';
import { randomNumber } from './number';

const ALPHANUMERIC =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ESCAPE_REGEX = /[-/\\^$*+?.()|[\]{}]/g;
const HEXADECIMAL_REGEX = /^[0-9a-f]+$/i;
const MEMOIZE_MAX_SIZE = 500;

/**
 * Return a random alphanumeric string.
 * @param size The size.
 * @param caseInsensitive If true, only lower case letters will be returned. Defaults to false.
 * @return The random string.
 */
export function randomString(size: number, caseInsensitive = false) {
  let string = '';
  const limit = caseInsensitive ? 36 : 62;

  for (let i = 0; i < size; i++) {
    string += ALPHANUMERIC[randomNumber(0, limit)];
  }

  return string;
}

/**
 * Convert a string to a number.
 * @param string The string.
 * @return The number.
 */
export function stringToNumber(string: number) {
  return string * 1;
}

/**
 * Add a left padding to string.
 * @param string The string.
 * @param pad The pad.
 * @param length The length final length.
 * @return The padded string.
 */
export function paddingLeft(string: string, pad: string, length: number) {
  return repeat(pad, length - string.length) + string;
}

/**
 * Add a right padding to string.
 * @param string The string.
 * @param pad The pad.
 * @param length The length final length.
 * @return The padded string.
 */
export function paddingRight(string: string, pad: string, length: number) {
  return string + repeat(pad, length - string.length);
}

/**
 * Add a left and right padding to string.
 * @param string The string.
 * @param pad The pad.
 * @param length The length final length.
 * @return The padded string.
 */
export function paddingBoth(string: string, pad: string, length: number) {
  const right = Math.ceil((length - string.length) / 2);
  const left = length - (right + string.length);
  return repeat(pad, left) + string + repeat(pad, right);
}

/**
 * Repeat a string N times.
 * @param string The string to repeat.
 * @param times The times to repeat.
 * @return The repeated string.
 */
export function repeat(string: string, times: number) {
  const length = times * string.length;
  const n1 = Math.floor(logN(2, string.length));
  const n2 = Math.ceil(logN(2, length));

  for (let i = n1; i < n2; i++) {
    string += string;
  }

  return string.substring(0, length);
}

/**
 * Replace all ocurrences in string.
 * @param string The string.
 * @param substr The substring to be replaced.
 * @param newSubstr The String that replaces the substr param.
 * @param ignoreCase If ignore case or not. Defaults to false.
 * @return The final string.
 */
export function replaceAll(
  string: string,
  substr: string,
  newSubstr: string,
  ignoreCase = false
) {
  const flags = ignoreCase ? 'gi' : 'g';
  return string.replace(new RegExp(escapeRegExp(substr), flags), newSubstr);
}

/**
 * Check if a string starts by a given prefix.
 * @param string The string.
 * @param prefix The prefix.
 * @return If the string starts by prefix of not.
 */
export function startsWith(string: string, prefix: string) {
  // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
  return string.slice(0, prefix.length) === prefix;
}

/**
 * Check if a string ends by a given suffix.
 * @param string The string.
 * @param suffix The suffix.
 * @return If the string ends by suffix of not.
 */
export function endsWith(string: string, suffix: string) {
  const { length } = suffix;
  // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
  return length === 0 || string.slice(-length) === suffix;
}

/**
 * Escapes a regex expression string.
 * @param string The string to be escaped.
 * @return The escaped string.
 */
export function escapeRegExp(string: string) {
  return string.replace(ESCAPE_REGEX, '\\$&');
}

/**
 * If is a string value representing a date. The string should be in a format
 * recognized by the Date.parse().
 * @param string The string.
 * @return If is a valid date string or not.
 */
export function isDateString(string: string) {
  const date = new Date(string);
  return !isNaN(date.getTime());
}

/**
 * Check whether a string represent a hexadecimal string or not.
 * @param string The string.
 * @return If is a valid hexadecimal string or not.
 */
export function isHexString(string: string) {
  return HEXADECIMAL_REGEX.test(string);
}

/**
 * Split a string into chunks.
 * @param string The string.
 * @param chunkSize The chunk size.
 * @return An array of chunks.
 */
export function stringChunk(string: string, chunkSize: number) {
  const size = string.length;
  const tempArray = new Array(Math.ceil(size / chunkSize)) as string[];

  for (let i = 0, j = 0; j < size; j += chunkSize, i++) {
    tempArray[i] = string.substring(j, j + chunkSize);
  }

  return tempArray;
}

/**
 * Splits an object path into an array of tokens.
 * @param path the object path.
 * @return The path tokens.
 * @function
 */
export const splitPath = _memoize<string, string[]>((path: string) => {
  const arr = [];
  let first = 0;
  let last = 0;
  for (; last < path.length; last++) {
    if (path[last] === '[' || path[last] === '.') {
      if (first < last) {
        arr.push(path.substring(first, last));
      }

      first = last + 1;
    } else if (path[last] === ']') {
      arr.push(path.substring(first, last));
      first = last + 1;
    }
  }

  if (first < last) {
    arr.push(path.substring(first, last));
  }

  return arr;
});

function _memoize<T, R>(fn: (...args: T[]) => R, maxSize = MEMOIZE_MAX_SIZE) {
  function memoize(...args: T[]): R {
    const firstArg = args[0] as string;
    if (memoize.cache[firstArg] !== undefined) {
      return memoize.cache[firstArg] as R;
    }
    const result = fn(...args);
    if (memoize.size === maxSize) {
      memoize.cache = {};
      memoize.size = 0;
    }
    memoize.cache[firstArg] = result;
    memoize.size++;
    return result;
  }

  memoize.cache = {} as PlainObject;
  memoize.size = 0;
  return memoize;
}
