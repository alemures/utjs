const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ALPHANUMERIC = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y',
  'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const ESCAPE_REG_EXP = /[-/\\^$*+?.()|[\]{}]/g;
const HEXADECIMAL = /^[0-9a-f]+$/i;

// Date

/**
 * Date object to mysql date string.
 * @param  {Date} [date] The date object.
 * @return {String} The mysql string.
 */
function dateToMysql(date) {
  date = date || new Date();

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
 * @param  {Date} [date] The date object.
 * @return {String} The date string.
 */
function dateToString(date) {
  date = date || new Date();

  const dd = numberToString(date.getDate());
  const mm = MONTHS[date.getMonth()];
  const yyyy = numberToString(date.getFullYear());
  const hh = numberToString(date.getHours());
  const min = numberToString(date.getMinutes());
  const ss = numberToString(date.getSeconds());

  return `${paddingLeft(dd, '0', 2)}-${mm}-${yyyy.substring(2)} ${
    paddingLeft(hh, '0', 2)}:${paddingLeft(min, '0', 2)}:${paddingLeft(ss, '0', 2)}`;
}

/**
 * Get the actual date as a readable string.
 * @return {String} A readable date string.
 */
function now() {
  const date = new Date();
  const string = dateToString(date);
  const millis = numberToString(date.getMilliseconds());
  return `${string}.${paddingLeft(millis, '0', 3)}`;
}

/**
 * Clone a Date object.
 * @param  {Date} date The original Date object.
 * @return {Date}      The cloned Date.
 */
function cloneDate(date) {
  return new Date(date.getTime());
}

// Array

/**
 * Split an array into chunks.
 * @param  {Array} array The array.
 * @param  {Number} chunkSize The chunk size.
 * @return {Array} An array of chunks.
 */
function arrayChunk(array, chunkSize) {
  const size = array.length;
  const tempArray = new Array(Math.ceil(size / chunkSize));

  for (let i = 0, j = 0; j < size; j += chunkSize, i++) {
    tempArray[i] = copyArray(array, j, j + chunkSize);
  }

  return tempArray;
}

/**
 * Recursive quicksort using Hoare partitioning with random pivot and cut off to insertion sort.
 * @param {Array} array The array to sort.
 * @param {Function} [comparator=_numericComparator] An optional comparator, it will be called
 *                                with two values and must return 1 if the first is greater
 *                                than the second, 0 if they are equals or -1 if the second
 *                                is greater than the first one.
 * @param {Number} [left=0] The left index.
 * @param {Number} [right=array.length - 1] the right index.
 */
function sort(array, comparator, left, right) {
  if (isNumber(comparator)) {
    right = left;
    left = comparator;
    comparator = undefined;
  }

  left = left || 0;
  right = right || array.length - 1;
  comparator = comparator || _numericComparator;

  _quickSort(array, comparator, left, right);
}

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

function _insertionSort(array, comparator, left, right) {
  for (let i = left; i <= right; i++) {
    for (let j = i; j > left && comparator(array[j], array[j - 1]) < 0; j--) {
      swap(array, j, j - 1);
    }
  }
}

function _numericComparator(number1, number2) {
  return number1 - number2;
}

/**
 * Swap the two values in an array.
 * @param  {Array} array The array.
 * @param  {Number} from From index.
 * @param  {Number} to To index.
 */
function swap(array, from, to) {
  const aux = array[from];
  array[from] = array[to];
  array[to] = aux;
}

/**
 * Add all the elements in source at the end of dest.
 * @param  {Array} dest   The destiny array.
 * @param  {Array} source The source array.
 */
function concatArrays(dest, source) {
  const destLength = dest.length;
  dest.length += source.length;

  for (let i = 0; i < source.length; i++) {
    dest[destLength + i] = source[i];
  }
}

/**
 * Shallow copy of an array.
 * @param  {Array} array The array to copy.
 * @param {Number} [start=0] The start inclusive index.
 * @param {Number} [end=array.length] The end exclusive index.
 * @return {Array}       The copied array.
 */
function copyArray(array, start, end) {
  const arrayLength = array.length;

  start = start || 0;
  end = end !== undefined ? Math.min(end, arrayLength) : arrayLength;

  const copyLength = end - start;

  if (copyLength === 1) {
    return [array[start]];
  }

  const copy = new Array(copyLength);
  for (let i = 0; i < copyLength; i++) {
    copy[i] = array[i + start];
  }

  return copy;
}

/**
 * Empty the content of an array.
 * @param  {Array} array The array to clear.
 */
function clearArray(array) {
  array.length = 0;
}

function _defaultDataGenerator() {
  return randomNumber(1, 100);
}

/**
 * Return a random array of generated elements by dataGenerator.
 * @param  {Number} length        The length.
 * @param  {Function} [dataGenerator] The data generator.
 * @return {Array}               The array.
 */
function randomArray(length, dataGenerator) {
  dataGenerator = dataGenerator || _defaultDataGenerator;

  const array = new Array(length);

  for (let i = 0; i < length; i++) {
    array[i] = dataGenerator(i);
  }

  return array;
}

/**
 * Intersect two sorted arrays.
 * @param  {Array} array1 The first array.
 * @param  {Array} array2 The second array.
 * @return {Array} The interected array.
 * @param {Function} [comparator=_numericComparator] An optional comparator, it will be called
 *                                with two values and must return 1 if the first is greater than
 *                                the second, 0 if they are equals or -1 if the second is greater
 *                                than the first one.
 */
function intersectSorted(array1, array2, comparator) {
  comparator = comparator || _numericComparator;

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

/**
 * About 1.5x faster than the two-arg version of Array#splice(). This
 * algorithm was taken from the core of Node.js.
 * @param  {Array} array  The array.
 * @param  {Number} index The element to remove.
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

/**
 * Inserts a value into a sorted array using an iterative binary search to find
 * the insertion index. 'rejectDuplicates' defines the behaviour when the value
 * that will be inserted is already in the array.
 * @param  {*} value The value to insert.
 * @param  {Array} array The array.
 * @param {Function} [comparator=_numericComparator] An optional comparator, it will be called
 *                                with two values and must return 1 if the first is greater than
 *                                the second, 0 if they are equals or -1 if the second is greater
 *                                than the first one.
 * @param  {Boolean} [rejectDuplicates=false] Specify if duplicated values will be rejected.
 */
function binaryInsert(value, array, comparator, rejectDuplicates) {
  if (isBoolean(comparator)) {
    rejectDuplicates = comparator;
    comparator = undefined;
  }

  rejectDuplicates = rejectDuplicates || false;
  comparator = comparator || _numericComparator;

  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const middle = (left + right) >>> 1;
    const computed = array[middle];
    const cmpValue = comparator(computed, value);

    if (cmpValue > 0) {
      right = middle - 1;
      // eslint-disable-next-line no-continue
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

/**
 * Find a value into a sorted array using an iterative binary search.
 * @param  {*} value The value to search.
 * @param  {Array} array The array.
 * @param {Function} [comparator=_numericComparator] An optional comparator, it will be called
 *                                with two values and must return 1 if the first is greater than
 *                                the second, 0 if they are equals or -1 if the second is greater
 *                                than the first one.
 * @param  {Number} [left=0] The left index.
 * @param  {Number} [right=array.length - 1] The right index.
 * @return {Number} The index if the value was found or -1.
 */
function binarySearch(value, array, comparator, left, right) {
  if (isNumber(comparator)) {
    right = left;
    left = comparator;
    comparator = undefined;
  }

  left = left || 0;
  right = right || array.length - 1;
  comparator = comparator || _numericComparator;

  while (left <= right) {
    const middle = (left + right) >>> 1;
    const computed = array[middle];
    const cmpValue = comparator(computed, value);

    if (cmpValue > 0) {
      right = middle - 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    left = middle + 1;
    if (cmpValue === 0) {
      return middle;
    }
  }

  return -1;
}

/**
 * Returns a random value within the provided array.
 * @param {Array} array The array.
 * @param {Number} [start=0] The start inclusive index.
 * @param {Number} [end=array.length] The end exclusive index.
 * @return {*} A random item.
 */
function randomArrayItem(array, start, end) {
  const arrayLength = array.length;

  start = start || 0;
  end = end !== undefined ? Math.min(end, arrayLength) : arrayLength;

  return array[randomNumber(start, end)];
}

// Arguments

/**
 * Convert arguments to array.
 * @param  {arguments} args The arguments object.
 * @return {Array}      The array.
 */
function argumentsToArray(args) {
  return copyArray(args);
}

// String

/**
 * Return a random alphanumeric string.
 * @param  {Number} size The size
 * @param {Boolean} [caseInsensitive=false] If true, only lower case letters will be returned.
 * @return {String} The random string.
 */
function randomString(size, caseInsensitive) {
  let string = '';
  const limit = caseInsensitive ? 36 : 62;

  for (let i = 0; i < size; i++) {
    string += ALPHANUMERIC[randomNumber(0, limit)];
  }

  return string;
}

/**
 * Convert a string to a number.
 * @param  {String} string The string.
 * @return {Number}        The number.
 */
function stringToNumber(string) {
  return string * 1;
}

/**
 * Add a left padding to string.
 * @param  {String} string The string.
 * @param  {String} pad    The pad.
 * @param  {Number} length The length final length.
 * @return {String}        The padded string.
 */
function paddingLeft(string, pad, length) {
  return repeat(pad, length - string.length) + string;
}

/**
 * Add a right padding to string.
 * @param  {String} string The string.
 * @param  {String} pad    The pad.
 * @param  {Number} length The length final length.
 * @return {String}        The padded string.
 */
function paddingRight(string, pad, length) {
  return string + repeat(pad, length - string.length);
}

/**
 * Add a left and right padding to string.
 * @param  {String} string The string.
 * @param  {String} pad    The pad.
 * @param  {Number} length The length final length.
 * @return {String}        The padded string.
 */
function paddingBoth(string, pad, length) {
  const right = Math.ceil((length - string.length) / 2);
  const left = length - (right + string.length);
  return repeat(pad, left) + string + repeat(pad, right);
}

/**
 * Repeat a string N times.
 * @param  {String} string The string to repeat.
 * @param  {Number} times  The times to repeat.
 * @return {String}        The repeated string.
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
 * @param  {String} string     The string.
 * @param  {String} substr     The substring to be replaced.
 * @param  {String} newSubstr  The String that replaces the substr param.
 * @param  {Boolean} [ignoreCase=false] If ignore case or not.
 * @return {String}            The final string.
 */
function replaceAll(string, substr, newSubstr, ignoreCase) {
  const flags = ignoreCase ? 'gi' : 'g';
  return string.replace(new RegExp(escapeRegExp(substr), flags), newSubstr);
}

/**
 * Check if a string starts by a given prefix.
 * @param  {String} string The string.
 * @param  {String} prefix The prefix.
 * @return {boolean}       If the string starts by prefix of not.
 */
function startsWith(string, prefix) {
  return string.slice(0, prefix.length) === prefix;
}

/**
 * Check if a string ends by a given suffix.
 * @param  {String} string The string.
 * @param  {String} suffix The suffix.
 * @return {boolean}       If the string ends by suffix of not.
 */
function endsWith(string, suffix) {
  const { length } = suffix;
  return length === 0 || string.slice(-length) === suffix;
}

/**
 * Escapes a regex expression string.
 * @param  {String} string The string to be escaped.
 * @return {String}        The escaped string.
 */
function escapeRegExp(string) {
  return string.replace(ESCAPE_REG_EXP, '\\$&');
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
  return HEXADECIMAL.test(string);
}

/**
 * Split a string into chunks.
 * @param  {String} string The string.
 * @param  {Number} chunkSize The chunk size.
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
 * @param {String} path the object path
 * @return {Array} The path tokens
 */
function splitPath(path) {
  const objectPathRegex = /[^.[\]]+/g;
  const pathArr = [];
  let execResult;
  while ((execResult = objectPathRegex.exec(path)) !== null) {
    pathArr.push(execResult[0]);
  }

  return pathArr;
}

// Number

/**
 * Convert a number to string.
 * @param  {Number} number The number
 * @return {String}        The string.
 */
function numberToString(number) {
  return `${number}`;
}

/**
 * Get a random number.
 * @param  {Number} min The inclusive min value.
 * @param  {Number} max The exclusive max value.
 * @return {Number}     The random number.
 */
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Get the middle value.
 * @param  {Number} a The first number.
 * @param  {Number} b The second number.
 * @param  {Number} c The third number.
 * @return {Number}   The middle number.
 */
function getMiddleNumber(a, b, c) {
  const max = Math.max(Math.max(a, b), c);
  const min = Math.min(Math.min(a, b), c);
  return a + b + c - max - min;
}

/**
 * Get the number of digits in a number.
 * http://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript/
 * 28203456#28203456
 *
 * @param  {Number} integer The integer.
 * @param  {Number} [base=10]  The base of the number.
 * @return {Number}         The number of digits.
 */
function numDigits(integer, base) {
  base = base || 10;
  return Math.max(Math.floor(logN(base, Math.abs(integer))), 0) + 1;
}

/**
 * Check if a number is an integer or not.
 * @param  {Number}  number The number to check.
 * @return {Boolean}        If the number is an integer.
 */
function isInteger(number) {
  return number % 1 === 0;
}

/**
 * Checks if a number is NaN. Taken from http://jacksondunstan.com/articles/983
 * @param  {number}  number The number to ckeck.
 * @return {Boolean}        If the number is NaN.
 */
function isNaN(number) {
  // eslint-disable-next-line no-self-compare
  return number !== number;
}

/**
 * Checks if a number is NaN, Infinity or -Infinity.
 * Taken from http://jacksondunstan.com/articles/983
 * @param  {Number}  number The number to ckeck.
 * @return {Boolean}        If the number is NaN, Infinity or -Infinity.
 */
function isNaNOrInfinity(number) {
  return (number * 0) !== 0;
}

/**
 * Truncates the number. This method is as fast as "number | 0" but it's
 * able to handle correctly numbers greater than 2^31 or lower than -2^31.
 * @param  {Number} number The number to be truncated.
 * @return {Number}        The truncated number.
 */
function truncateNumber(number) {
  return number - number % 1;
}

// Object

/**
 * Merge the source object into dest. This function only works for object,
 * arrays and primitive data types, references will be copied.
 * @param  {Object|Array} dest   The destiny object or array.
 * @param  {Object|Array} source The source object or array.
 */
function mergeObjects(dest, source) {
  if (isPlainObject(source)) {
    for (const i in source) {
      _mergeObjects(dest, source, i);
    }
  } else if (isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      _mergeObjects(dest, source, i);
    }
  }
}

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
 * @param  {Object|Array} dest  The object or array to update.
 * @param  {*} value The value to place in path.
 * @param  {String} path  The path where to place the new value.
 */
function updateObject(dest, value, path) {
  const parentPath = _getParentPath(path);
  let key = path.substring(parentPath.length);

  if (key[0] === '[') {
    key = key.substring(1, key.length - 1);
  } else if (key[0] === '.') {
    key = key.substring(1);
  }

  const parent = parentPath !== '' ? get(dest, parentPath) : dest;
  if (isObject(parent)) {
    parent[key] = value;
  }
}

function _getParentPath(path) {
  let end = 0;

  if (path[path.length - 1] === ']') {
    end = path.lastIndexOf('[');
  } else if (path.indexOf('.') > -1) {
    end = path.lastIndexOf('.');
  }

  return path.substring(0, end);
}

function _defaultKeyGenerator() {
  return randomString(6);
}

function _defaultValueGenerator() {
  return randomNumber(1, 1000000);
}

/**
 * Get a random object.
 * @param {Number[]|Number} lengths Number of items per level.
 * @param {Function} [keyGenerator] The key generator.
 * @param {Function} [valueGenerator] The value generator.
 * @return {Object} The random object.
 */
function randomObject(lengths, keyGenerator, valueGenerator) {
  lengths = isNumber(lengths) ? [lengths] : lengths;
  keyGenerator = keyGenerator || _defaultKeyGenerator;
  valueGenerator = valueGenerator || _defaultValueGenerator;

  return _randomObject(lengths, keyGenerator, valueGenerator, {}, 1);
}

function _randomObject(lengths, keyGenerator, valueGenerator, object, actualDepth) {
  const maxDepth = lengths.length;

  if (actualDepth > maxDepth) {
    return;
  }

  for (let i = 0; i < lengths[actualDepth - 1]; i++) {
    const key = keyGenerator();
    object[key] = actualDepth === maxDepth ? valueGenerator() : {};
    _randomObject(lengths, keyGenerator, valueGenerator, object[key], actualDepth + 1);
  }

  return object;
}

/**
 * Divide an object into chunks by keys number.
 * @param  {Object} object    The object.
 * @param  {Number} chunkSize The max key number per chunk.
 * @return {Object[]}           An array of chunks objects.
 */
function objectChunk(object, chunkSize) {
  const chunks = [];
  let index = 0;
  let counter = 0;

  for (const key in object) {
    if (chunks[index] === undefined) {
      chunks[index] = {};
    }

    chunks[index][key] = object[key];

    if (++counter % chunkSize === 0) {
      index++;
    }
  }

  return chunks;
}

/**
 * Deep copy of object or array.
 * @param  {Object|Array} object The object or array.
 * @return {Object|Array}        The cloned object.
 */
function cloneObject(original) {
  const clone = isArray(original) ? [] : {};
  mergeObjects(clone, original);
  return clone;
}

/**
 * Get the value using a path in an object.
 * @param {Object|Array} object The object or array.
 * @param {String} path The path.
 * @param {*} [def=undefined] Value to return if no value is found in path.
 * @return {*} The found value in path.
 */
function get(obj, path, def) {
  const keys = isArray(path) ? path : splitPath(path);
  let value = keys.length ? obj : undefined;
  for (let i = 0; i < keys.length && value !== undefined; i++) {
    value = value !== null ? value[keys[i]] : undefined;
  }

  return value !== undefined ? value : def;
}

/**
 * Performs a deep comparison between two values to determine if they are equivalent. Plain
 * objects and arrays will be recursively iterated and primitive values and references
 * will be compared using the identity operator (===). Even though it's still a bit slower than
 * JSON.stringify(), this method works well with unsorted objects.
 * @param  {Object|Array} value The first value.
 * @param  {Object|Array} other The other value to compare against.
 * @return {Boolean} If the objects are equal or not.
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
      if (!equals(value[key], other[key])) {
        return false;
      }
    }

    for (const key in other) {
      if (value[key] === undefined
          && other[key] !== undefined) {
        return false;
      }
    }

    return true;
  } if (isArray(value)) {
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

/**
 * Group an array of objects using the values of a list of keys.
 * Ej:
 * <pre>
 *   var array = [{lang:'spanish', age: 2}, {lang:'spanish', age:5}, {lang:'english', age:25}]
 *   ut.groupBy(array, 'lang', function(obj) { return obj.age; })
 *   return -> { spanish: [ 2, 5 ], english: [ 25 ] }
 * </pre>
 * @param  {Object[]} data        An array of objects.
 * @param  {String|String[]} keys The key or keys to group by.
 * @param  {Function} [iteratee]  A function to modify the final grouped objects.
 * @return {Object}               The grouped object.
 */
function groupBy(array, keys, iteratee) {
  keys = isString(keys) ? [keys] : keys;

  const result = {};
  const lastKeyIndex = keys.length - 1;

  for (let i = 0; i < array.length; i++) {
    const obj = array[i];

    const pointer = obj;
    let resultPointer = result;

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
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

/**
 * Counts and returns the length of the given object.
 * @param  {Object} object The object.
 * @return {Number}        The length of the object.
 */
function objectLength(object) {
  let length = 0;
  // eslint-disable-next-line no-unused-vars
  for (const i in object) {
    length++;
  }

  return length;
}

/**
 * Empty the content of an object. It uses "delete" so the object will be converted into a
 * hash table mode (slow properties).
 * @see {@link toFastProperties}
 * @param {Object} object The plain object to clear.
 */
function clearObject(object) {
  for (const key in object) {
    delete object[key];
  }
}

/**
 * Converts a deoptimized object (dictionary mode) into an optimized object (fast mode).
 * Objects are deoptimized when you use them like a hash table like deleting properties. You
 * can check it using the native function "%HasFastProperties(object)" running nodejs with
 * the flag "--allow-natives-syntax". This code was taken from the module "bluebird".
 * @param  {Object} object The object to optimize.
 * @return {Object}        Reference to the same object.
 */
function toFastProperties(object) {
  function FakeConstructor() {}

  FakeConstructor.prototype = object;

  // petkaantonov: v8 slack tracking lasts for 8 constructions
  let l = 8;
  while (l--) {
    // eslint-disable-next-line no-new
    new FakeConstructor();
  }

  return object;

  // Prevent the function from being optimized through dead code elimination
  // or further optimizations. This code is never reached but even using eval
  // in unreachable code causes v8 to not optimize functions.

  // eslint-disable-next-line no-eval, no-unreachable
  eval(object);
}

// Boolean

/**
 * Returns a random boolean.
 * @return {Boolean} The random boolean.
 */
function randomBoolean() {
  return Math.random() < 0.5;
}

// Type

/**
 * If value has a numeric value or not. It can be a Number or a String.
 * @param  {*} value The value.
 * @return {Boolean} If has a numeric value or not.
 */
function isNumeric(value) {
  return !isNaNOrInfinity(parseFloat(value));
}

/**
 * If is a Number or not.
 * @param  {*} value The value.
 * @return {Boolean} If is a Number or not.
 */
function isNumber(value) {
  return typeof value === 'number'
      || (isObject(value) && value.constructor === Number);
}

/**
 * If is a String or not.
 * @param  {*} value The value.
 * @return {Boolean} If is a String or not.
 */
function isString(value) {
  return typeof value === 'string'
      || (isObject(value) && value.constructor === String);
}

/**
 * If is an Array or not.
 * @param  {*} value The value.
 * @return {Boolean} If is an Array or not.
 * @function
 */
const { isArray } = Array;

/**
 * If is an Object or not.
 * @param  {*} value The value.
 * @return {Boolean} If is an Object or not.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null;
}

/**
 * If is a plain object (not an array) or not.
 * @param  {*} value The value.
 * @return {Boolean} If is an Object and not an Array.
 */
function isPlainObject(value) {
  if (isObject(value)) {
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  return false;
}

/**
 * If is a Boolean or not.
 * @param  {*} value The value.
 * @return {Boolean} If is a Boolean or not.
 */
function isBoolean(value) {
  return typeof value === 'boolean'
      || (isObject(value) && value.constructor === Boolean);
}

/**
 * If is Function or not.
 * @param  {*} value The value.
 * @return {Boolean} If is a Function or not.
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * If is a RegExp or not.
 * @param  {*} value The value.
 * @return {Boolean} If is a RegExp or not.
 */
function isRegExp(value) {
  return value instanceof RegExp;
}

/**
 * If is a Date or not.
 * @param  {*} value The value.
 * @return {Boolean} If is a Date or not.
 */
function isDate(value) {
  return value instanceof Date;
}

/**
 * If is a Number or not. NaN, Infinity or -Infinity aren't considered valid numbers.
 * @param  {*} value The value.
 * @return {Boolean} If is a Number or not.
 */
function isValidNumber(value) {
  return isNumber(value) && !isNaNOrInfinity(value);
}

// Math

/**
 * Calculate the log using a given base and value.
 * @param  {Number} base  The base.
 * @param  {Number} value The value.
 * @return {Number}       The log result.
 */
function logN(base, value) {
  const i = base === 2 ? Math.LN2
    : base === 10 ? Math.LN10 : Math.log(base);
  return Math.log(value) / i;
}

// Miscellaneous

/**
 * Execute a function N times and print the execution time.
 * @param  {Function} fn    The function to execute.
 * @param  {Number}   [times=1] How many times to execute.
 * @param  {String}   [label='Default label']  A label to be used in the log string.
 */
function test(fn, times, label) {
  times = times !== undefined ? times : 1;
  label = label !== undefined ? label : 'Default label';

  console.time(label);

  for (let i = 0; i < times; i++) {
    fn(i);
  }

  console.timeEnd(label);
}

/**
 * Check if a value is inside of a given range.
 * @param  {Number|String|Array|Object} val The value.
 * @param  {Number} [min=-Infinity] Min inclusive value.
 * @param  {Number} [max=Infinity] Max inclusive value.
 * @return {Boolean}     If the value is inside of the given range or not.
 */
function inRange(val, min, max) {
  min = min !== undefined ? min : -Infinity;
  max = max !== undefined ? max : Infinity;

  if (isNumber(val)) {
    return val >= min && val <= max;
  } if (isString(val)) {
    return val.length >= min && val.length <= max;
  } if (isArray(val)) {
    return val.length >= min && val.length <= max;
  } if (isPlainObject(val)) {
    const length = objectLength(val);
    return length >= min && length <= max;
  }

  return false;
}

/**
 * Fast error builder, it doesn't have a real stacktrace but is x10 faster than
 * new Error().
 * @param {String} [message] The error message.
 * @param {Function} [constructor=Error] Optional constructor for custom errors.
 * @return {Error} An Error instance.
 */
function error(message, constructor) {
  if (isFunction(message)) {
    constructor = message;
    message = undefined;
  }

  message = message || '';
  constructor = constructor || Error;

  const object = {
    name: constructor.name,
    message,
    stack: `${constructor.name}: ${message}`,
  };
  Object.setPrototypeOf(object, constructor.prototype);
  return object;
}

// Logging

/**
 * A simple logger.
 * @namespace logger
 */
const logger = {

  /**
   * The log level debug.
   * @type {Number}
   * @memberOf logger
   */
  DEBUG: 1,

  /**
   * The log level info.
   * @type {Number}
   * @memberOf logger
   */
  INFO: 2,

  /**
   * The log level warn.
   * @type {Number}
   * @memberOf logger
   */
  WARN: 3,

  /**
   * The log level error.
   * @type {Number}
   * @memberOf logger
   */
  ERROR: 4,

  /**
   * Disable all logs.
   * @type {Number}
   * @memberOf  logger
   */
  NONE: Number.MAX_VALUE,

  _logLevel: 1,
  _usingDate: true,
  _prettify: false,

  /**
   * Set the log level.
   * @param {Number} logLevel The new log level.
   * @memberOf logger
   */
  setLogLevel: function setLogLevel(logLevel) {
    this._logLevel = logLevel;
  },

  /**
   * If date will appear in the log string or not.
   * @param {Boolean} usingDate If using date or not.
   * @memberOf logger
   */
  setUsingDate: function setUsingDate(usingDate) {
    this._usingDate = usingDate;
  },

  /**
   * If plain objects should be printed prettified or not.
   * @param {Boolean} prettify If prettify plain objects or not.
   * @memberOf logger
   */
  setPrettify: function setPrettify(prettify) {
    this._prettify = prettify;
  },

  /**
   * Print a debug log.
   * @param {...*} arg The arguments
   * @memberOf logger
   */
  debug: function debug() {
    if (this._checkLogLevel(1)) {
      process.stdout.write(this._createHeader('[DEBUG] ') + this._createbody(arguments));
    }
  },

  /**
   * Print a info log.
   * @param {...*} arg The arguments
   * @memberOf logger
   */
  info: function info() {
    if (this._checkLogLevel(2)) {
      process.stdout.write(this._createHeader('[INFO] ') + this._createbody(arguments));
    }
  },

  /**
   * Print a warn log.
   * @param {...*} arg The arguments
   * @memberOf logger
   */
  warn: function warn() {
    if (this._checkLogLevel(3)) {
      process.stdout.write(this._createHeader('[WARN] ') + this._createbody(arguments));
    }
  },

  /**
   * Print a error log.
   * @param {...*} arg The arguments
   * @memberOf logger
   */
  error: function error() {
    if (this._checkLogLevel(4)) {
      process.stdout.write(this._createHeader('[ERROR] ') + this._createbody(arguments));
    }
  },

  _createHeader: function _createHeader(label) {
    if (this._usingDate) {
      return `${now()} ${label}`;
    }

    return label;
  },

  _createbody: function _createbody(args) {
    if (args.length > 0) {
      let data = '';
      const { length } = args;

      for (let i = 0; i < length; i++) {
        const arg = args[i];

        if (isObject(arg)) {
          if (arg instanceof Error) {
            data += `Error: ${arg.message}`;
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

  _checkLogLevel: function _checkLogLevel(methodLogLevel) {
    return this._logLevel <= methodLogLevel;
  },
};

// Public functions

module.exports.dateToMysql = dateToMysql;
module.exports.dateToString = dateToString;
module.exports.now = now;
module.exports.cloneDate = cloneDate;

module.exports.arrayChunk = arrayChunk;
module.exports.sort = sort;
module.exports.swap = swap;
module.exports.concatArrays = concatArrays;
module.exports.copyArray = copyArray;
module.exports.clearArray = clearArray;
module.exports.randomArray = randomArray;
module.exports.intersectSorted = intersectSorted;
module.exports.spliceOne = spliceOne;
module.exports.binaryInsert = binaryInsert;
module.exports.binarySearch = binarySearch;
module.exports.randomArrayItem = randomArrayItem;

module.exports.argumentsToArray = argumentsToArray;

module.exports.randomString = randomString;
module.exports.stringToNumber = stringToNumber;
module.exports.paddingLeft = paddingLeft;
module.exports.paddingRight = paddingRight;
module.exports.paddingBoth = paddingBoth;
module.exports.repeat = repeat;
module.exports.replaceAll = replaceAll;
module.exports.startsWith = startsWith;
module.exports.endsWith = endsWith;
module.exports.escapeRegExp = escapeRegExp;
module.exports.isDateString = isDateString;
module.exports.isHexString = isHexString;
module.exports.stringChunk = stringChunk;
module.exports.splitPath = splitPath;

module.exports.numberToString = numberToString;
module.exports.randomNumber = randomNumber;
module.exports.getMiddleNumber = getMiddleNumber;
module.exports.numDigits = numDigits;
module.exports.isInteger = isInteger;
module.exports.isNaN = isNaN;
module.exports.isNaNOrInfinity = isNaNOrInfinity;
module.exports.truncateNumber = truncateNumber;

module.exports.mergeObjects = mergeObjects;
module.exports.updateObject = updateObject;
module.exports.randomObject = randomObject;
module.exports.objectChunk = objectChunk;
module.exports.cloneObject = cloneObject;
module.exports.get = get;
module.exports.equals = equals;
module.exports.groupBy = groupBy;
module.exports.objectLength = objectLength;
module.exports.clearObject = clearObject;
module.exports.toFastProperties = toFastProperties;

module.exports.randomBoolean = randomBoolean;

module.exports.isNumeric = isNumeric;
module.exports.isNumber = isNumber;
module.exports.isString = isString;
module.exports.isArray = isArray;
module.exports.isObject = isObject;
module.exports.isPlainObject = isPlainObject;
module.exports.isBoolean = isBoolean;
module.exports.isFunction = isFunction;
module.exports.isRegExp = isRegExp;
module.exports.isDate = isDate;
module.exports.isValidNumber = isValidNumber;

module.exports.logN = logN;

module.exports.test = test;
module.exports.inRange = inRange;
module.exports.error = error;

module.exports.logger = logger;
