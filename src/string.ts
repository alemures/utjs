const ALPHANUMERIC =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ESCAPE_REGEX = /[-/\\^$*+?.()|[\]{}]/g;
const HEXADECIMAL_REGEX = /^[0-9a-f]+$/i;
const MEMOIZE_MAX_SIZE = 500;

/**
 * Return a random alphanumeric string.
 * @param {Number} size The size
 * @param {Boolean} [caseInsensitive=false] If true, only lower case letters will be returned.
 * @return {String} The random string.
 */
function randomString(size, caseInsensitive = false) {
  let string = '';
  const limit = caseInsensitive ? 36 : 62;

  for (let i = 0; i < size; i++) {
    string += ALPHANUMERIC[randomNumber(0, limit)];
  }

  return string;
}

/**
 * Convert a string to a number.
 * @param {String} string The string.
 * @return {Number} The number.
 */
function stringToNumber(string) {
  return string * 1;
}

/**
 * Add a left padding to string.
 * @param {String} string The string.
 * @param {String} pad The pad.
 * @param {Number} length The length final length.
 * @return {String} The padded string.
 */
function paddingLeft(string, pad, length) {
  return repeat(pad, length - string.length) + string;
}

/**
 * Add a right padding to string.
 * @param {String} string The string.
 * @param {String} pad The pad.
 * @param {Number} length The length final length.
 * @return {String} The padded string.
 */
function paddingRight(string, pad, length) {
  return string + repeat(pad, length - string.length);
}

/**
 * Add a left and right padding to string.
 * @param {String} string The string.
 * @param {String} pad The pad.
 * @param {Number} length The length final length.
 * @return {String} The padded string.
 */
function paddingBoth(string, pad, length) {
  const right = Math.ceil((length - string.length) / 2);
  const left = length - (right + string.length);
  return repeat(pad, left) + string + repeat(pad, right);
}

/**
 * Repeat a string N times.
 * @param {String} string The string to repeat.
 * @param {Number} times The times to repeat.
 * @return {String} The repeated string.
 */
function repeat(string, times) {
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
 * @param {String} string The string.
 * @param {String} substr The substring to be replaced.
 * @param {String} newSubstr The String that replaces the substr param.
 * @param {Boolean} [ignoreCase=false] If ignore case or not.
 * @return {String} The final string.
 */
function replaceAll(string, substr, newSubstr, ignoreCase = false) {
  const flags = ignoreCase ? 'gi' : 'g';
  return string.replace(new RegExp(escapeRegExp(substr), flags), newSubstr);
}

/**
 * Check if a string starts by a given prefix.
 * @param {String} string The string.
 * @param {String} prefix The prefix.
 * @return {boolean} If the string starts by prefix of not.
 */
function startsWith(string, prefix) {
  return string.slice(0, prefix.length) === prefix;
}

/**
 * Check if a string ends by a given suffix.
 * @param {String} string The string.
 * @param {String} suffix The suffix.
 * @return {boolean} If the string ends by suffix of not.
 */
function endsWith(string, suffix) {
  const { length } = suffix;
  return length === 0 || string.slice(-length) === suffix;
}

/**
 * Escapes a regex expression string.
 * @param {String} string The string to be escaped.
 * @return {String} The escaped string.
 */
function escapeRegExp(string) {
  return string.replace(ESCAPE_REGEX, '\\$&');
}

/**
 * If is a string value representing a date. The string should be in a format
 * recognized by the Date.parse().
 * @param {String} string The string.
 * @return {Boolean} If is a valid date string or not.
 */
function isDateString(string) {
  const date = new Date(string);
  return !isNaN(date.getTime());
}

/**
 * Check whether a string represent a hexadecimal string or not.
 * @param {String} string The string.
 * @return {Boolean} If is a valid hexadecimal string or not.
 */
function isHexString(string) {
  return HEXADECIMAL_REGEX.test(string);
}

/**
 * Split a string into chunks.
 * @param {String} string The string.
 * @param {Number} chunkSize The chunk size.
 * @return {Array} An array of chunks.
 */
function stringChunk(string, chunkSize) {
  const size = string.length;
  const tempArray = new Array(Math.ceil(size / chunkSize));

  for (let i = 0, j = 0; j < size; j += chunkSize, i++) {
    tempArray[i] = string.substring(j, j + chunkSize);
  }

  return tempArray;
}

/**
 * Splits an object path into an array of tokens.
 * @param {String} path the object path.
 * @return {Array} The path tokens.
 * @function
 */
const splitPath = _memoize((path) => {
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

function _memoize(fn, maxSize = MEMOIZE_MAX_SIZE) {
  function memoize(...args) {
    if (memoize.cache[args[0]] !== undefined) return memoize.cache[args[0]];
    const result = fn(...args);
    if (memoize.size === maxSize) {
      memoize.cache = {};
      memoize.size = 0;
    }
    memoize.cache[args[0]] = result;
    memoize.size++;
    return result;
  }

  memoize.cache = {};
  memoize.size = 0;
  return memoize;
}
