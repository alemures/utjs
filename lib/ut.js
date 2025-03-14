/** @typedef {Record<string, any>} PlainObject */
/** @typedef {string | string[]} Path */

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

const ALPHANUMERIC =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const ESCAPE_REG_EXP = /[-/\\^$*+?.()|[\]{}]/g;
const HEXADECIMAL = /^[0-9a-f]+$/i;
// const MEMOIZE_MAX_SIZE = 500;

// Date

/**
 * Date object to mysql date string.
 * @param {Date} [date=new Date()] The date object.
 * @return {string} The mysql string.
 */
function dateToMysql(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const min = date.getMinutes();
  const ss = date.getSeconds();

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
module.exports.dateToMysql = dateToMysql;

/**
 * Date object to readable date string.
 * @param {Date} [date=new Date()] The date object.
 * @return {string} The date string.
 */
function dateToString(date = new Date()) {
  const dd = numberToString(date.getDate());
  const mm = MONTHS[date.getMonth()];
  const yyyy = numberToString(date.getFullYear());
  const hh = numberToString(date.getHours());
  const min = numberToString(date.getMinutes());
  const ss = numberToString(date.getSeconds());

  return `${paddingLeft(dd, '0', 2)}-${mm}-${yyyy.substring(2)} ${paddingLeft(
    hh,
    '0',
    2,
  )}:${paddingLeft(min, '0', 2)}:${paddingLeft(ss, '0', 2)}`;
}
module.exports.dateToString = dateToString;

/**
 * Get the actual date as a readable string.
 * @return {string} A readable date string.
 */
function now() {
  const date = new Date();
  const string = dateToString(date);
  const millis = numberToString(date.getMilliseconds());
  return `${string}.${paddingLeft(millis, '0', 3)}`;
}
module.exports.now = now;

/**
 * Clone a Date object.
 * @param {Date} date The original Date object.
 * @return {Date} The cloned Date.
 */
function cloneDate(date) {
  return new Date(date.getTime());
}
module.exports.cloneDate = cloneDate;

// Array

/**
 * Split an array into chunks.
 * @param {any[]} array The array.
 * @param {number} chunkSize The chunk size.
 * @return {any[]} An array of chunks.
 */
function arrayChunk(array, chunkSize) {
  const size = array.length;
  const tempArray = new Array(Math.ceil(size / chunkSize));

  for (let i = 0, j = 0; j < size; j += chunkSize, i++) {
    tempArray[i] = copyArray(array, j, j + chunkSize);
  }

  return tempArray;
}
module.exports.arrayChunk = arrayChunk;

/**
 * Recursive quicksort using Hoare partitioning with random pivot and cut off to insertion sort.
 * @param {any[]} array The array to sort.
 * @param {Function|number} [comparator=_numericComparator] An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 * @param {number} [left=0] The left index. Defaults to 0.
 * @param {number} [right=array.length-1] the right index. Defaults to array length - 1.
 */
function sort(array, comparator, left, right) {
  if (isNumber(comparator)) {
    right = left;
    left = comparator;
    comparator = undefined;
  }

  left = left ?? 0;
  right = right ?? array.length - 1;
  comparator = comparator ?? _numericComparator;

  _quickSort(array, comparator, left, right);
}
module.exports.sort = sort;

/**
 * @param {any[]} array
 * @param {Function} comparator
 * @param {number} left
 * @param {number} right
 */
function _quickSort(array, comparator, left, right) {
  if (right - left < 27) {
    _insertionSort(array, comparator, left, right);
    return;
  }

  let leftIndex = left;
  let rightIndex = right;
  const pivot = array[randomNumber(left, right + 1)];

  while (leftIndex <= rightIndex) {
    while (comparator(array[leftIndex], pivot) < 0) {
      leftIndex++;
    }

    while (comparator(array[rightIndex], pivot) > 0) {
      rightIndex--;
    }

    if (leftIndex <= rightIndex) {
      swap(array, leftIndex, rightIndex);
      leftIndex++;
      rightIndex--;
    }
  }

  if (left < rightIndex) {
    _quickSort(array, comparator, left, rightIndex);
  }

  if (right > leftIndex) {
    _quickSort(array, comparator, leftIndex, right);
  }
}

/**
 * @param {any[]} array
 * @param {Function} comparator
 * @param {number} left
 * @param {number} right
 */
function _insertionSort(array, comparator, left, right) {
  for (let i = left; i <= right; i++) {
    for (let j = i; j > left && comparator(array[j], array[j - 1]) < 0; j--) {
      swap(array, j, j - 1);
    }
  }
}

/**
 * @param {number} number1
 * @param {number} number2
 */
function _numericComparator(number1, number2) {
  return number1 - number2;
}

/**
 * Swap the two values in an array.
 * @param {any[]} array The array.
 * @param {number} from From index.
 * @param {number} to To index.
 */
function swap(array, from, to) {
  const aux = array[from];
  array[from] = array[to];
  array[to] = aux;
}
module.exports.swap = swap;

/**
 * Add all the elements in source at the end of dest.
 * @param {any[]} dest The destiny array.
 * @param {any[]} source The source array.
 */
function concatArrays(dest, source) {
  const destLength = dest.length;
  dest.length += source.length;

  for (let i = 0; i < source.length; i++) {
    dest[destLength + i] = source[i];
  }
}
module.exports.concatArrays = concatArrays;

/**
 * Shallow copy of an array.
 * @param {any[]} array The array to copy.
 * @param {number} [start=0] The start inclusive index. Defaults to 0.
 * @param {number} [end=array.length] The end exclusive index. Defaults to array length.
 * @return {any[]} The copied array.
 */
function copyArray(array, start = 0, end = array.length) {
  if (end > array.length) {
    end = array.length;
  }

  const copyLength = end - start;

  if (copyLength === 1) {
    return [array[start]];
  }

  if (copyLength < 50) {
    const copy = new Array(copyLength);
    for (let i = 0; i < copyLength; i++) {
      copy[i] = array[i + start];
    }

    return copy;
  }

  return array.slice(start, end);
}
module.exports.copyArray = copyArray;

/**
 * Empty the content of an array.
 * @param {any[]} array The array to clear.
 */
function clearArray(array) {
  array.length = 0;
}
module.exports.clearArray = clearArray;

/**
 * @param {number} index
 */
// eslint-disable-next-line no-unused-vars
function _defaultDataGenerator(index) {
  return randomNumber(1, 100);
}

/**
 * Return a random array of generated elements by dataGenerator.
 * @param {number} length The length.
 * @param {Function} [dataGenerator=_defaultDataGenerator] The data generator. Defaults to a RNG from 1 to 100.
 * @return {any[]} The array.
 */
function randomArray(length, dataGenerator = _defaultDataGenerator) {
  const array = new Array(length);

  for (let i = 0; i < length; i++) {
    array[i] = dataGenerator(i);
  }

  return array;
}
module.exports.randomArray = randomArray;

/**
 * Intersect two sorted arrays.
 * @param {any[]} array1 The first array.
 * @param {any[]} array2 The second array.
 * @return {any[]} The intersected array.
 * @param {Function} [comparator=_numericComparator] An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 */
function intersectSorted(array1, array2, comparator = _numericComparator) {
  let i1 = 0;
  let i2 = 0;
  const result = [];
  let previous = Infinity;

  while (i1 < array1.length && i2 < array2.length) {
    if (comparator(array1[i1], array2[i2]) < 0) {
      i1++;
    } else if (comparator(array1[i1], array2[i2]) > 0) {
      i2++;
    } else {
      if (array1[i1] !== previous) {
        previous = array1[i1];
        result.push(previous);
      }

      i1++;
      i2++;
    }
  }

  return result;
}
module.exports.intersectSorted = intersectSorted;

/**
 * About 1.5x faster than the two-arg version of Array#splice(). This
 * algorithm was taken from the core of Node.js.
 * @param {any[]} array The array.
 * @param {number} index The element to remove.
 */
function spliceOne(array, index) {
  if (index === 0) {
    array.shift();
    return;
  }

  for (; index + 1 < array.length; index++) {
    array[index] = array[index + 1];
  }

  array.pop();
}
module.exports.spliceOne = spliceOne;

/**
 * Inserts a value into a sorted array using an iterative binary search to find
 * the insertion index. 'rejectDuplicates' defines the behaviour when the value
 * that will be inserted is already in the array.
 * @param {any} value The value to insert.
 * @param {any[]} array The array.
 * @param {Function | boolean} [comparator=_numericComparator] An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 * @param {boolean} [rejectDuplicates=false] Specify if duplicated values will be rejected. Defaults to false.
 */
function binaryInsert(value, array, comparator, rejectDuplicates) {
  if (isBoolean(comparator)) {
    rejectDuplicates = comparator;
    comparator = undefined;
  }

  rejectDuplicates = rejectDuplicates === true;
  comparator = comparator ?? _numericComparator;

  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const middle = (left + right) >>> 1;
    const computed = array[middle];
    const cmpValue = comparator(computed, value);

    if (cmpValue > 0) {
      right = middle - 1;
      continue;
    }

    left = middle + 1;
    if (cmpValue === 0) {
      if (rejectDuplicates) {
        return;
      }
      break;
    }
  }

  array.splice(left, 0, value);
}
module.exports.binaryInsert = binaryInsert;

/**
 * Find a value into a sorted array using an iterative binary search.
 * @param {any} value The value to search.
 * @param {any[]} array The array.
 * @param {Function|number} [comparator=_numericComparator] An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 * @param {number} [left=0] The left index. Defaults to 0.
 * @param {number} [right=array.length-1] The right index. Defaults to array length - 1.
 * @return {number} The index if the value was found or -1.
 */
function binarySearch(value, array, comparator, left, right) {
  if (isNumber(comparator)) {
    right = left;
    left = comparator;
    comparator = undefined;
  }

  left = left ?? 0;
  right = right ?? array.length - 1;
  comparator = comparator ?? _numericComparator;

  while (left <= right) {
    /** @type {number} */
    const middle = (left + right) >>> 1;
    const computed = array[middle];
    const cmpValue = comparator(computed, value);

    if (cmpValue > 0) {
      right = middle - 1;
      continue;
    }

    left = middle + 1;
    if (cmpValue === 0) {
      return middle;
    }
  }

  return -1;
}
module.exports.binarySearch = binarySearch;

/**
 * Returns a random value within the provided array.
 * @param {any[]} array The array.
 * @param {number} [start=0] The start inclusive index. Defaults to 0.
 * @param {number} [end=array.length] The end exclusive index. Defaults to array length.
 * @return {any} A random item.
 */
function randomArrayItem(array, start = 0, end = array.length) {
  if (end > array.length) {
    end = array.length;
  }

  return array[randomNumber(start, end)];
}
module.exports.randomArrayItem = randomArrayItem;

// Arguments

/**
 * Convert arguments to array.
 * @param {arguments} args The arguments object.
 * @return {any[]} The array.
 */
function argumentsToArray(args) {
  const array = new Array(args.length);
  for (let i = 0; i < args.length; i++) {
    array[i] = args[i];
  }
  return array;
}
module.exports.argumentsToArray = argumentsToArray;

// String

/**
 * Return a random alphanumeric string.
 * @param {number} size The size
 * @param {boolean} [caseInsensitive=false] If true, only lower case letters will be returned. Defaults to false.
 * @return {string} The random string.
 */
function randomString(size, caseInsensitive = false) {
  let string = '';
  const limit = caseInsensitive ? 36 : 62;

  for (let i = 0; i < size; i++) {
    string += ALPHANUMERIC[randomNumber(0, limit)];
  }

  return string;
}
module.exports.randomString = randomString;

/**
 * Convert a string to a number.
 * @param {string} string The string.
 * @return {number} The number.
 */
function stringToNumber(string) {
  // @ts-ignore
  return string * 1;
}
module.exports.stringToNumber = stringToNumber;

/**
 * Add a left padding to string.
 * @param {string} string The string.
 * @param {string} pad The pad.
 * @param {number} length The length final length.
 * @return {string} The padded string.
 */
function paddingLeft(string, pad, length) {
  return repeat(pad, length - string.length) + string;
}
module.exports.paddingLeft = paddingLeft;

/**
 * Add a right padding to string.
 * @param {string} string The string.
 * @param {string} pad The pad.
 * @param {number} length The length final length.
 * @return {string} The padded string.
 */
function paddingRight(string, pad, length) {
  return string + repeat(pad, length - string.length);
}
module.exports.paddingRight = paddingRight;

/**
 * Add a left and right padding to string.
 * @param {string} string The string.
 * @param {string} pad The pad.
 * @param {number} length The length final length.
 * @return {string} The padded string.
 */
function paddingBoth(string, pad, length) {
  const right = Math.ceil((length - string.length) / 2);
  const left = length - (right + string.length);
  return repeat(pad, left) + string + repeat(pad, right);
}
module.exports.paddingBoth = paddingBoth;

/**
 * Repeat a string N times.
 * @param {string} string The string to repeat.
 * @param {number} times The times to repeat.
 * @return {string} The repeated string.
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
module.exports.repeat = repeat;

/**
 * Replace all ocurrences in string.
 * @param {string} string The string.
 * @param {string} substr The substring to be replaced.
 * @param {string} newSubstr The string that replaces the substr param.
 * @param {boolean} [ignoreCase=false] If ignore case or not. Defaults to false.
 * @return {string} The final string.
 */
function replaceAll(string, substr, newSubstr, ignoreCase = false) {
  const flags = ignoreCase ? 'gi' : 'g';
  return string.replace(new RegExp(escapeRegExp(substr), flags), newSubstr);
}
module.exports.replaceAll = replaceAll;

/**
 * Check if a string starts by a given prefix.
 * @param {string} string The string.
 * @param {string} prefix The prefix.
 * @return {boolean} If the string starts by prefix of not.
 */
function startsWith(string, prefix) {
  return string.slice(0, prefix.length) === prefix;
}
module.exports.startsWith = startsWith;

/**
 * Check if a string ends by a given suffix.
 * @param {string} string The string.
 * @param {string} suffix The suffix.
 * @return {boolean} If the string ends by suffix of not.
 */
function endsWith(string, suffix) {
  const { length } = suffix;
  return length === 0 || string.slice(-length) === suffix;
}
module.exports.endsWith = endsWith;

/**
 * Escapes a regex expression string.
 * @param {string} string The string to be escaped.
 * @return {string} The escaped string.
 */
function escapeRegExp(string) {
  return string.replace(ESCAPE_REG_EXP, '\\$&');
}
module.exports.escapeRegExp = escapeRegExp;

/**
 * If is a string value representing a date. The string should be in a format
 * recognized by the Date.parse().
 * @param {string} string The string.
 * @return {boolean} If is a valid date string or not.
 */
function isDateString(string) {
  const date = new Date(string);
  return !isNaN(date.getTime());
}
module.exports.isDateString = isDateString;

/**
 * Check whether a string represent a hexadecimal string or not.
 * @param {string} string The string.
 * @return {boolean} If is a valid hexadecimal string or not.
 */
function isHexString(string) {
  return HEXADECIMAL.test(string);
}
module.exports.isHexString = isHexString;

/**
 * Split a string into chunks.
 * @param {string} string The string.
 * @param {number} chunkSize The chunk size.
 * @return {any[]} An array of chunks.
 */
function stringChunk(string, chunkSize) {
  const size = string.length;
  const tempArray = new Array(Math.ceil(size / chunkSize));

  for (let i = 0, j = 0; j < size; j += chunkSize, i++) {
    tempArray[i] = string.substring(j, j + chunkSize);
  }

  return tempArray;
}
module.exports.stringChunk = stringChunk;

/**
 * Splits an object path into an array of tokens.
 * @param {string} path the object path.
 * @return {string[]} The path tokens.
 */
function splitPath(path) {
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
}
module.exports.splitPath = splitPath;

// Number

/**
 * Convert a number to string.
 * @param {number} number The number.
 * @return {string} The string.
 */
function numberToString(number) {
  return `${number}`;
}
module.exports.numberToString = numberToString;

/**
 * Get a random number.
 * @param {number} min The inclusive min value.
 * @param {number} max The exclusive max value.
 * @return {number} The random number.
 */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
module.exports.randomNumber = randomNumber;

/**
 * Get the middle value.
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @param {number} c The third number.
 * @return {number} The middle number.
 */
function getMiddleNumber(a, b, c) {
  if ((a > b && b > c) || (c > b && b > a)) return b;
  if ((b > a && a > c) || (c > a && a > b)) return a;
  return c;
}
module.exports.getMiddleNumber = getMiddleNumber;

/**
 * Get the number of digits in a number. See
 * <a href="http://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript/
 * 28203456#28203456">link</a>.
 * @param {number} integer The integer.
 * @param {number} [base=10] The base of the number. Defaults to 10.
 * @return {number} The number of digits.
 */
function numDigits(integer, base = 10) {
  return Math.max(Math.floor(logN(base, Math.abs(integer))), 0) + 1;
}
module.exports.numDigits = numDigits;

/**
 * Check if a number is an integer or not.
 * @param {number} number The number to check.
 * @return {boolean} If the number is an integer.
 */
function isInteger(number) {
  return number % 1 === 0;
}
module.exports.isInteger = isInteger;

/**
 * Checks if a number is NaN. Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
 * @param {number} number The number to ckeck.
 * @return {boolean} If the number is NaN.
 */
function isNaN(number) {
  return number !== number;
}
module.exports.isNaN = isNaN;

/**
 * Checks if a number is NaN, Infinity or -Infinity.
 * Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
 * @param {number} number The number to ckeck.
 * @return {boolean} If the number is NaN, Infinity or -Infinity.
 */
function isNaNOrInfinity(number) {
  return number * 0 !== 0;
}
module.exports.isNaNOrInfinity = isNaNOrInfinity;

/**
 * Truncates the number. This method is as fast as "number | 0" but it's
 * able to handle correctly numbers greater than 2^31 or lower than -2^31.
 * @param {number} number The number to be truncated.
 * @return {number} The truncated number.
 */
function truncateNumber(number) {
  return number - (number % 1);
}
module.exports.truncateNumber = truncateNumber;

// Object

/**
 * Merge the source object into dest. This function only works for object,
 * arrays and primitive data types, references will be copied.
 * @param {any} dest The destiny object or array.
 * @param {any} source The source object or array.
 */
function mergeObjects(dest, source) {
  if (isPlainObject(source)) {
    for (const i in source) {
      if (!Object.prototype.hasOwnProperty.call(source, i)) continue;
      _mergeObjects(dest, source, i);
    }
  } else if (isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      _mergeObjects(dest, source, i);
    }
  }
}
module.exports.mergeObjects = mergeObjects;

/**
 * @param {any} dest
 * @param {any} source
 * @param {string | number} i
 */
function _mergeObjects(dest, source, i) {
  if (isPlainObject(source[i])) {
    if (!isPlainObject(dest[i])) {
      dest[i] = {};
    }

    mergeObjects(dest[i], source[i]);
  } else if (isArray(source[i])) {
    if (!isArray(dest[i])) {
      dest[i] = new Array(source[i].length);
    }

    mergeObjects(dest[i], source[i]);
  } else {
    dest[i] = source[i];
  }
}

/**
 * Update an object or array using a given path string.
 * @param {Object|any[]} dest The object or array to update.
 * @param {any} value The value to place in path.
 * @param {Path} path The path where to place the new value.
 */
function updateObject(dest, value, path) {
  const keys = isArray(path) ? path : splitPath(path);
  const parentPath = keys.slice(0, keys.length - 1);

  const parent = parentPath.length ? get(dest, parentPath) : dest;
  if (isObject(parent)) {
    const key = keys[keys.length - 1];
    parent[key] = value;
  }
}
module.exports.updateObject = updateObject;

function _defaultKeyGenerator() {
  return randomString(6);
}

function _defaultValueGenerator() {
  return randomNumber(1, 1000000);
}

/**
 * Get a random object.
 * @param {number[]|number} lengths number of items per level.
 * @param {Function} [keyGenerator=_defaultKeyGenerator] The key generator.
 * @param {Function} [valueGenerator=_defaultValueGenerator] The value generator.
 * @return {PlainObject} The random object.
 */
function randomObject(
  lengths,
  keyGenerator = _defaultKeyGenerator,
  valueGenerator = _defaultValueGenerator,
) {
  const lengthArray = isNumber(lengths) ? [lengths] : lengths;

  const object = {};
  _randomObject(lengthArray, keyGenerator, valueGenerator, object, 1);
  return object;
}
module.exports.randomObject = randomObject;

/**
 * @param {number[]} lengths
 * @param {Function} keyGenerator
 * @param {Function} valueGenerator
 * @param {PlainObject} object
 * @param {number} actualDepth
 */
function _randomObject(
  lengths,
  keyGenerator,
  valueGenerator,
  object,
  actualDepth,
) {
  const maxDepth = lengths.length;

  if (actualDepth > maxDepth) {
    return;
  }

  for (let i = 0; i < lengths[actualDepth - 1]; i++) {
    const key = keyGenerator();
    object[key] = actualDepth === maxDepth ? valueGenerator() : {};
    _randomObject(
      lengths,
      keyGenerator,
      valueGenerator,
      object[key],
      actualDepth + 1,
    );
  }
}

/**
 * Divide an object into chunks by keys number.
 * @param {PlainObject} object The object.
 * @param {number} chunkSize The max key number per chunk.
 * @return {PlainObject[]} An array of chunks objects.
 */
function objectChunk(object, chunkSize) {
  const chunks = [];
  let index = 0;
  let counter = 0;

  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue;
    if (chunks[index] === undefined) {
      chunks[index] = /**@type {PlainObject} */ ({});
    }

    chunks[index][key] = object[key];

    if (++counter % chunkSize === 0) {
      index++;
    }
  }

  return chunks;
}
module.exports.objectChunk = objectChunk;

/**
 * Deep copy of object or array.
 * @param {PlainObject|any[]} object The object or array.
 * @return {PlainObject|any[]} The cloned object.
 */
function cloneObject(object) {
  const clone = isArray(object) ? [] : {};
  mergeObjects(clone, object);
  return clone;
}
module.exports.cloneObject = cloneObject;

/**
 * Get the value using a path in an object.
 * @param {PlainObject|any[]} object The object or array.
 * @param {Path} path The path.
 * @param {any} [def] Value to return if no value is found in path.
 * @return {any} The found value in path.
 */
function get(object, path, def) {
  const keys = isArray(path) ? path : splitPath(path);
  let value = keys.length ? object : undefined;
  for (let i = 0; i < keys.length && value !== undefined; i++) {
    // @ts-ignore
    value = value !== null ? value[keys[i]] : undefined;
  }

  return value !== undefined ? value : def;
}
module.exports.get = get;

/**
 * Performs a deep comparison between two values to determine if they are equivalent. Plain
 * objects and arrays will be recursively iterated and primitive values and references
 * will be compared using the identity operator (===). Even though it's still a bit slower than
 * JSON.stringify(), this method works well with unsorted objects.
 * @param {any} value The first value.
 * @param {any} other The other value to compare against.
 * @return {boolean} If the objects are equal or not.
 */
function equals(value, other) {
  if (value === other || (isNaN(value) && isNaN(other))) {
    return true;
  }

  if (!isObject(other)) {
    return false;
  }

  if (isPlainObject(value)) {
    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      if (!equals(value[key], other[key])) {
        return false;
      }
    }

    for (const key in other) {
      if (!Object.prototype.hasOwnProperty.call(other, key)) continue;
      if (value[key] === undefined && other[key] !== undefined) {
        return false;
      }
    }

    return true;
  }
  if (isArray(value)) {
    if (value.length !== other.length) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!equals(value[i], other[i])) {
        return false;
      }
    }

    return true;
  }

  return false;
}
module.exports.equals = equals;

/**
 * Group an array of objects using the values of a list of keys.
 * Usage:
 * <pre>
 *   var array = [{lang:'spanish', age: 2}, {lang:'spanish', age:5}, {lang:'english', age:25}]
 *   ut.groupBy(array, 'lang', function(obj) { return obj.age; })
 *   return -> { spanish: [ 2, 5 ], english: [ 25 ] }
 * </pre>
 * @param {PlainObject[]} array An array of objects.
 * @param {Path} keys The key or keys to group by.
 * @param {Function} [iteratee] A function to modify the final grouped objects.
 * @return {PlainObject} The grouped object.
 */
function groupBy(array, keys, iteratee) {
  const keyArray = isString(keys) ? [keys] : keys;

  /** @type {PlainObject} */
  const result = {};
  const lastKeyIndex = keyArray.length - 1;

  for (let i = 0; i < array.length; i++) {
    const obj = array[i];

    const pointer = obj;
    let resultPointer = result;

    for (let j = 0; j < keyArray.length; j++) {
      const key = keyArray[j];
      const keyValue = pointer[key];

      if (keyValue === undefined) {
        break;
      }

      if (resultPointer[keyValue] === undefined) {
        resultPointer[keyValue] = j < lastKeyIndex ? {} : [];
      }

      if (j === lastKeyIndex) {
        resultPointer[keyValue].push(iteratee ? iteratee(obj) : obj);
      }

      resultPointer = resultPointer[keyValue];
    }
  }

  return result;
}
module.exports.groupBy = groupBy;

/**
 * Counts and returns the length of the given object.
 * @param {PlainObject} object The object.
 * @return {number} The length of the object.
 */
function objectLength(object) {
  let length = 0;

  for (const i in object) {
    if (!Object.prototype.hasOwnProperty.call(object, i)) continue;
    length++;
  }

  return length;
}
module.exports.objectLength = objectLength;

/**
 * Empty the content of an object. It uses "delete" so the object will be converted into a
 * hash table mode (slow properties).
 * @see {@link toFastProperties}
 * @param {PlainObject} object The plain object to clear.
 */
function clearObject(object) {
  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue;
    delete object[key];
  }
}
module.exports.clearObject = clearObject;

/**
 * Converts a deoptimized object (dictionary mode) into an optimized object (fast mode).
 * Objects are deoptimized when you use them like a hash table like deleting properties. You
 * can check it using the native function "%HasFastProperties(object)" running nodejs with
 * the flag "--allow-natives-syntax". This code was taken from the module "bluebird".
 * @param {Object} object The object to optimize.
 * @return {Object} Reference to the same object.
 */
function toFastProperties(object) {
  function FakeConstructor() {}

  FakeConstructor.prototype = object;

  // petkaantonov: v8 slack tracking lasts for 8 constructions
  let l = 8;
  while (l--) {
    // @ts-ignore
    new FakeConstructor();
  }

  return object;

  // Prevent the function from being optimized through dead code elimination
  // or further optimizations. This code is never reached but even using eval
  // in unreachable code causes v8 to not optimize functions.

  // @ts-ignore
  // eslint-disable-next-line no-unreachable
  eval(object);
}
module.exports.toFastProperties = toFastProperties;

// Boolean

/**
 * Returns a random boolean.
 * @return {boolean} The random boolean.
 */
function randomBoolean() {
  return Math.random() < 0.5;
}
module.exports.randomBoolean = randomBoolean;

// Type

/**
 * If value has a numeric value or not. It can be a number or a string.
 * @param {any} value The value.
 * @return {value is number} If has a numeric value or not.
 */
function isNumeric(value) {
  // @ts-ignore
  return !isNaNOrInfinity(parseFloat(value));
}
module.exports.isNumeric = isNumeric;

/**
 * If is a number or not.
 * @param {any} value The value.
 * @return {value is number} If is a number or not.
 */
function isNumber(value) {
  return (
    typeof value === 'number' ||
    (isObject(value) && value.constructor === Number)
  );
}
module.exports.isNumber = isNumber;

/**
 * If is a string or not.
 * @param {any} value The value.
 * @return {value is string} If is a string or not.
 */
function isString(value) {
  return (
    typeof value === 'string' ||
    (isObject(value) && value.constructor === String)
  );
}
module.exports.isString = isString;

/**
 * If is an Array or not.
 * @param {any} value The value.
 * @return {boolean} If is an Array or not.
 * @function
 */
const { isArray } = Array;
module.exports.isArray = isArray;

/**
 * If is an Object or not.
 * @param {any} value The value.
 * @return {value is !Object} If is an Object or not.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null;
}
module.exports.isObject = isObject;

/**
 * If is a plain object (not an array) or not.
 * @param {any} value The value.
 * @return {value is PlainObject} If is an Object and not an Array.
 */
function isPlainObject(value) {
  if (isObject(value)) {
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  return false;
}
module.exports.isPlainObject = isPlainObject;
/**
 * If is a boolean or not.
 * @param {any} value The value.
 * @return {value is boolean} If is a boolean or not.
 */
function isBoolean(value) {
  return (
    typeof value === 'boolean' ||
    (isObject(value) && value.constructor === Boolean)
  );
}
module.exports.isBoolean = isBoolean;

/**
 * If is Function or not.
 * @param {any} value The value.
 * @return {value is Function} If is a Function or not.
 */
function isFunction(value) {
  return typeof value === 'function';
}
module.exports.isFunction = isFunction;

/**
 * If is a RegExp or not.
 * @param {any} value The value.
 * @return {value is RegExp} If is a RegExp or not.
 */
function isRegExp(value) {
  return value instanceof RegExp;
}
module.exports.isRegExp = isRegExp;

/**
 * If is a Date or not.
 * @param {any} value The value.
 * @return {value is Date} If is a Date or not.
 */
function isDate(value) {
  return value instanceof Date;
}
module.exports.isDate = isDate;

/**
 * If is a number or not. NaN, Infinity or -Infinity aren't considered valid numbers.
 * @param {number} value The value.
 * @return {boolean} If is a number or not.
 */
function isValidNumber(value) {
  return isNumber(value) && !isNaNOrInfinity(value);
}
module.exports.isValidNumber = isValidNumber;

// Math

/**
 * Calculate the log using a given base and value.
 * @param {number} base The base.
 * @param {number} value The value.
 * @return {number} The log result.
 */
function logN(base, value) {
  const i = base === 2 ? Math.LN2 : base === 10 ? Math.LN10 : Math.log(base);
  return Math.log(value) / i;
}
module.exports.logN = logN;

// Miscellaneous

/**
 * Execute a function N times and print the execution time.
 * @param {Function} fn The function to execute.
 * @param {number} [times=1] How many times to execute. Defaults to 1.
 * @param {string} [label='Default label']  A label to be used in the log string. Defaults to 'Default label'.
 */
function test(fn, times = 1, label = 'Default label') {
  console.time(label);

  for (let i = 0; i < times; i++) {
    fn(i);
  }

  console.timeEnd(label);
}
module.exports.test = test;

/**
 * Check if a value is inside of a given range.
 * @param {any} val The value.
 * @param {number} [min=-Infinity] Min inclusive value. Defaults to -Infinity.
 * @param {number} [max=Infinity] Max inclusive value. Defaults to Infinity.
 * @return {boolean} If the value is inside of the given range or not.
 */
function inRange(val, min = -Infinity, max = Infinity) {
  if (isNumber(val)) {
    return val >= min && val <= max;
  }
  if (isString(val)) {
    return val.length >= min && val.length <= max;
  }
  if (isArray(val)) {
    return val.length >= min && val.length <= max;
  }
  if (isPlainObject(val)) {
    const length = objectLength(val);
    return length >= min && length <= max;
  }

  return false;
}
module.exports.inRange = inRange;

/**
 * Fast error builder, it doesn't have a real stacktrace but is x10 faster than
 * new Error().
 * @param {string|ErrorConstructor} [message=''] The error message. Default to empty string.
 * @param {ErrorConstructor} [constructor=Error] Optional constructor for custom errors. Defaults to ErrorConstructor.
 * @return {Error} An Error instance.
 */
function error(message, constructor) {
  if (isFunction(message)) {
    constructor = message;
    message = undefined;
  }

  message = message ?? '';
  constructor = constructor ?? Error;

  const object = {
    name: constructor.name,
    message,
    stack: `${constructor.name}: ${message}`,
  };
  Object.setPrototypeOf(object, constructor.prototype);
  return object;
}
module.exports.error = error;

// function memoize(fn, maxSize = MEMOIZE_MAX_SIZE) {
//   function memoize(...args) {
//     if (memoize.cache[args[0]] !== undefined) return memoize.cache[args[0]];
//     const result = fn(...args);
//     if (memoize.size === maxSize) {
//       memoize.cache = {};
//       memoize.size = 0;
//     }
//     memoize.cache[args[0]] = result;
//     memoize.size++;
//     return result;
//   }

//   memoize.cache = {};
//   memoize.size = 0;
//   return memoize;
// }
// module.exports.memoize = memoize;

// Logging

/**
 * A simple logger.
 * @namespace logger
 */
const logger = {
  /**
   * The log level debug.
   * @type {number}
   * @memberOf logger
   */
  DEBUG: 1,

  /**
   * The log level info.
   * @type {number}
   * @memberOf logger
   */
  INFO: 2,

  /**
   * The log level warn.
   * @type {number}
   * @memberOf logger
   */
  WARN: 3,

  /**
   * The log level error.
   * @type {number}
   * @memberOf logger
   */
  ERROR: 4,

  /**
   * Disable all logs.
   * @type {number}
   * @memberOf  logger
   */
  NONE: Number.MAX_VALUE,

  _logLevel: 1,
  _usingDate: true,
  _prettify: false,

  /**
   * Set the log level.
   * @param {number} logLevel The new log level.
   * @memberOf logger
   */
  setLogLevel: function setLogLevel(logLevel) {
    this._logLevel = logLevel;
  },

  /**
   * If date will appear in the log string or not.
   * @param {boolean} usingDate If using date or not.
   * @memberOf logger
   */
  setUsingDate: function setUsingDate(usingDate) {
    this._usingDate = usingDate;
  },

  /**
   * If plain objects should be printed prettified or not.
   * @param {boolean} prettify If prettify plain objects or not.
   * @memberOf logger
   */
  setPrettify: function setPrettify(prettify) {
    this._prettify = prettify;
  },

  /**
   * Print a debug log.
   * @param {...any} args The arguments
   * @memberOf logger
   */
  debug: function debug(...args) {
    if (this._checkLogLevel(1)) {
      process.stdout.write(
        this._createHeader('[DEBUG] ') + this._createbody(args),
      );
    }
  },

  /**
   * Print a info log.
   * @param {...any} args The arguments
   * @memberOf logger
   */
  info: function info(...args) {
    if (this._checkLogLevel(2)) {
      process.stdout.write(
        this._createHeader('[INFO] ') + this._createbody(args),
      );
    }
  },

  /**
   * Print a warn log.
   * @param {...any} args The arguments
   * @memberOf logger
   */
  warn: function warn(...args) {
    if (this._checkLogLevel(3)) {
      process.stdout.write(
        this._createHeader('[WARN] ') + this._createbody(args),
      );
    }
  },

  /**
   * Print a error log.
   * @param {...any} args The arguments
   * @memberOf logger
   */
  error: function loggerError(...args) {
    if (this._checkLogLevel(4)) {
      process.stdout.write(
        this._createHeader('[ERROR] ') + this._createbody(args),
      );
    }
  },

  /**
   * @param {string} label
   * @returns {string}
   */
  _createHeader: function _createHeader(label) {
    if (this._usingDate) {
      return `${now()} ${label}`;
    }

    return label;
  },

  /**
   * @param {any[]} args
   * @returns {string}
   */
  _createbody: function _createbody(args) {
    if (args.length > 0) {
      let data = '';
      const { length } = args;

      for (let i = 0; i < length; i++) {
        const arg = args[i];

        if (isObject(arg)) {
          if (arg instanceof Error) {
            data += arg.stack ? arg.stack : `Error: ${arg.message}`;
          } else if (this._prettify && (isArray(arg) || isPlainObject(arg))) {
            data += JSON.stringify(arg, null, 2);
          } else {
            data += JSON.stringify(arg);
          }
        } else {
          data += arg;
        }

        if (i < length - 1) {
          data += ' ';
        }
      }

      return `${data}\n`;
    }

    return '\n';
  },

  /**
   * @param {number} methodLogLevel
   * @returns {boolean}
   */
  _checkLogLevel: function _checkLogLevel(methodLogLevel) {
    return this._logLevel <= methodLogLevel;
  },
};
module.exports.logger = logger;
