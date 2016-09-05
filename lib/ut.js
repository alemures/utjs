'use strict';

/**
 * ut === Utils
 *
 * @author Alejandro Santiago Nieto
 */
(function () {

  var isNode = false;
  var global;

  if (typeof module !== 'undefined' && module.exports) {
    isNode = true;
  }

  if (isNode) {
    global = module.exports;
  } else {
    window.ut = {};
    global = window.ut;
  }

  // Date

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /**
   * Date object to mysql date string.
   * @param  {Date} date The date object.
   * @return {String} The mysql string.
   * @global
   */
  function dateToMysql(date) {
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var hh = date.getHours();
    var min = date.getMinutes();
    var ss = date.getSeconds();

    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
  }

  /**
   * Date object to readable date string.
   * @param  {Date} date The date object.
   * @return {String} The date string.
   * @global
   */
  function dateToString(date) {
    var dd = numberToString(date.getDate());
    var mm = months[date.getMonth()];
    var yyyy = numberToString(date.getFullYear());
    var hh = numberToString(date.getHours());
    var min = numberToString(date.getMinutes());
    var ss = numberToString(date.getSeconds());

    return paddingLeft(dd, '0', 2) + ' ' + mm + ' ' + yyyy + ' ' +
        paddingLeft(hh, '0', 2) + ':' + paddingLeft(min, '0', 2) + ':' + paddingLeft(ss, '0', 2);
  }

  /**
   * Get the actual date as a readable string.
   * @return {String} A readable date string.
   * @global
   */
  function now() {
    var date = new Date();
    var string = dateToString(date);
    var millis = numberToString(date.getMilliseconds());
    return string + '.' + paddingLeft(millis, '0', 3);
  }

  // Array

  /**
   * Split an array into chunks.
   * @param  {Array} array The array.
   * @param  {Number} chunkSize The chunk size.
   * @return {Array} An array of chunks.
   * @global
   */
  function arrayChunk(array, chunkSize) {
    var size = array.length;
    var tempArray = new Array(Math.ceil(size / chunkSize));

    for (var i = 0, j = 0; j < size; j += chunkSize, i++) {
      tempArray[i] = copyArray(array, j, j + chunkSize);
    }

    return tempArray;
  }

  /**
   * Iterative quick sort using a random pivot.
   * Benchmarks with 1.000.000 items:
   *   Random strings 10 characters:
   *     ut.sort(array) = 736ms, array.sort() = 1483ms
   *   Random numbers:
   *     ut.sort(array) = 131ms, array.sort() = 324ms
   *   Ascending sorted numbers:
   *     ut.sort(array) = 85ms, array.sort() = 297ms
   *   Descending sorted numbers:
   *     ut.sort(array) = 92ms, array.sort() = 294ms
   * @param {Array} array The array to sort.
   * @param {Function} [comparator] An optional comparator, it will be called with two values
   *                                and must return 1 if the first is greater than the second,
   *                                0 if they are equals or -1 if the second is greater than
   *                                the first one.
   * @global
   */
  function sort(array, comparator) {
    var beg = [];
    var end = [];
    var i = 0;
    var left;
    var right;
    var piv;

    beg[0] = 0;
    end[0] = array.length;
    while (i >= 0) {
      left = beg[i];
      right = end[i] - 1;
      if (left < right) {
        swap(array, left, randomNumber(left, right));
        piv = array[left];
        while (left < right) {
          while ((comparator ? comparator(array[right], piv) >= 0 : array[right] >= piv) &&
              left < right) {
            right--;
          }

          if (left < right) { array[left++] = array[right]; }

          while ((comparator ? comparator(array[left], piv) <= 0 : array[left] <= piv) &&
              left < right) {
            left++;
          }

          if (left < right) { array[right--] = array[left]; }
        }

        array[left] = piv;
        beg[i + 1] = left + 1;
        end[i + 1] = end[i];
        end[i++] = left;
        if (end[i] - beg[i] > end[i - 1] - beg[i - 1]) {
          swap(beg, i, i - 1);
          swap(end, i, i - 1);
        }
      } else {
        i--;
      }
    }
  }

  /**
   * Swap the two values in an array.
   * @param  {Array} array The array.
   * @param  {Number} from From index.
   * @param  {Number} to To index.
   * @global
   */
  function swap(array, from, to) {
    var aux = array[from];
    array[from] = array[to];
    array[to] = aux;
  }

  /**
   * Add all the elements in source at the end of dest.
   * @param  {Array} dest   The destiny array.
   * @param  {Array} source The source array.
   * @global
   */
  function concatArrays(dest, source) {
    var destLength = dest.length;
    dest.length += source.length;

    for (var i = 0; i < source.length; i++) {
      dest[destLength + i] = source[i];
    }
  }

  /**
   * Shallow copy of an array.
   * @param  {Array} array The array to copy.
   * @param {Number} [start=0] The start inclusive index.
   * @param {Number} [end=array.length] The end exclusive index.
   * @return {Array}       The copied array.
   * @global
   */
  function copyArray(array, start, end) {
    var arrayLength = array.length;

    start = start !== undefined ? start : 0;
    end = end !== undefined ? Math.min(end, arrayLength) : arrayLength;

    var copyLength = end - start;

    if (copyLength === 1) {
      return [array[start]];
    } else if (copyLength < 27) {
      var copy = new Array(copyLength);
      for (var i = 0; i < copyLength; i++) {
        copy[i] = array[i + start];
      }

      return copy;
    }

    return array.slice(start, end);
  }

  /**
   * Empty the content of an array.
   * @param  {Array} array The array to clear.
   * @global
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
   * @global
   */
  function randomArray(length, dataGenerator) {
    dataGenerator = dataGenerator !== undefined ? dataGenerator : _defaultDataGenerator;

    var array = new Array(length);

    for (var i = 0; i < length; i++) {
      array[i] = dataGenerator(i);
    }

    return array;
  }

  /**
   * Intersect two sorted arrays.
   * @param  {Array} array1 The first array.
   * @param  {Array} array2 The second array.
   * @return {Array} The interected array.
   * @param {Function} [comparator] An optional comparator, it will be called with two values
   *                                and must return 1 if the first is greater than the second,
   *                                0 if they are equals or -1 if the second is greater than
   *                                the first one.
   * @global
   */
  function intersectSorted(array1, array2, comparator) {
    var i1 = 0;
    var i2 = 0;
    var result = [];
    var last;

    while (i1 < array1.length && i2 < array2.length) {
      if (comparator ? comparator(array1[i1], array2[i2]) < 0 : array1[i1] < array2[i2]) {
        i1++;
      } else if (comparator ? comparator(array1[i1], array2[i2]) > 0 : array1[i1] > array2[i2]) {
        i2++;
      } else {
        if (array1[i1] !== last) {
          last = array1[i1];
          result.push(last);
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
   * @global
   */
  function spliceOne(array, index) {
    for (var i = index, k = i + 1, n = array.length; k < n; i += 1, k += 1) {
      array[i] = array[k];
    }

    array.pop();
  }

  /**
   * Inserts a value into a sorted array using an iterative binary search to find
   * the insertion index. 'rejectDuplicates' defines the behaviour when the value
   * that will be inserted is already in the array.
   * @param  {Number|String} value                   The value to insert.
   * @param  {Array}         array                   The array.
   * @param {Function} [comparator] An optional comparator, it will be called with two values
   *                                and must return 1 if the first is greater than the second,
   *                                0 if they are equals or -1 if the second is greater than
   *                                the first one.
   * @param  {Boolean} [rejectDuplicates=false] Specify if duplicated values will be rejected.
   * @global
   */
  function binaryInsert(value, array, comparator, rejectDuplicates) {
    /*jshint bitwise: false*/
    rejectDuplicates = typeof comparator === 'boolean' ? comparator : rejectDuplicates || false;
    comparator = typeof comparator === 'function' ? comparator : undefined;

    var left = 0;
    var right = array.length - 1;
    var middle;

    while (left <= right) {
      middle = (left + right) / 2 | 0;
      if (comparator ? comparator(array[middle], value) > 0 : array[middle] > value) {
        right = middle - 1;
        continue;
      }

      left = middle + 1;
      if (comparator ? comparator(array[middle], value) === 0 : array[middle] === value) {
        if (rejectDuplicates) {
          return;
        } else {
          break;
        }
      }
    }

    array.splice(left, 0, value);
  }

  /**
   * Find a value into a sorted array using an iterative binary search.
   * @param  {Number|String} value The value.
   * @param  {Array} array The array.
   * @param {Function} [comparator] An optional comparator, it will be called with two values
   *                                and must return 1 if the first is greater than the second,
   *                                0 if they are equals or -1 if the second is greater than
   *                                the first one.
   * @param  {Number} [left=0] The left index.
   * @param  {Number} [right=array.length - 1] The right index.
   * @return {Number} The index if the value was found or -1.
   * @global
   */
  function binarySearch(value, array, comparator, left, right) {
    /*jshint bitwise: false*/
    if (typeof comparator === 'number') {
      right = left;
      left = comparator;
      comparator = undefined;
    }

    if (left === undefined) {
      left = 0;
    } else {
      left = left | 0;
      if (left < 0 || left >= array.length) {
        throw new RangeError('Invalid left index');
      }
    }

    if (right === undefined) {
      right = array.length - 1;
    } else {
      right = right | 0;
      if (right < left || right >= array.length) {
        throw new RangeError('Invalid right index');
      }
    }

    comparator = typeof comparator === 'function' ? comparator : undefined;

    var middle;

    while (left <= right) {
      middle = (left + right) / 2 | 0;
      if (comparator ? comparator(array[middle], value) > 0 : array[middle] > value) {
        right = middle - 1;
        continue;
      }

      left = middle + 1;
      if (comparator ? comparator(array[middle], value) === 0 : array[middle] === value) {
        return middle;
      }
    }

    return -1;
  }

  /**
   * Removes all duplicated values within a sorted array. Even if the array isn't sorted,
   * calling ut.sort(arr) and ut.removeDuplicatesSorted(arr) is faster than other algorithms
   * like hash table or binary inserts.
   * @param  {Array} array The array with duplications.
   * @param {Function} [comparator] An optional comparator, it will be called with two values
   *                                and must return 1 if the first is greater than the second,
   *                                0 if they are equals or -1 if the second is greater than
   *                                the first one.
   * @global
   */
  function removeDuplicatesSorted(array, comparator) {
    if (array.length < 2) { return; }

    var last = array[0];
    var start;
    var size;

    for (var i = 1; i < array.length; i++) {
      if (comparator ? comparator(array[i], last) === 0 : array[i] === last) {
        start = i;
        size = 1;
        while (++i < array.length && comparator ? comparator(array[i], last) === 0 :
            array[i] === last) {
          size++;
        }

        array.splice(start, size);
        last = array[start];
        i = start;
      } else {
        last = array[i];
      }
    }
  }

  // Arguments

  /**
   * Convert arguments to array.
   * @param  {arguments} args The arguments object.
   * @return {Array}      The array.
   * @global
   */
  function argumentsToArray(args) {
    var copy = new Array(args.length);
    for (var i = 0; i < args.length; i++) {
      copy[i] = args[i];
    }

    return copy;
  }

  // String

  /**
   * Return a random string.
   * @param  {Number} size The size
   * @return {String}      The random string.
   * @global
   */
  function randomString(size) {
    var string = '';
    var start = 97;
    var alphabetLength = 26;
    var end = start + alphabetLength;

    for (var i = 0; i < size; i++) {
      string += String.fromCharCode(
        randomNumber(start, end));
    }

    return string;
  }

  /**
   * Convert a string to a number.
   * @param  {String} string The string.
   * @return {Number}        The number.
   * @global
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
   * @global
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
   * @global
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
   * @global
   */
  function paddingBoth(string, pad, length) {
    var right = Math.ceil((length - string.length) / 2);
    var left = length - (right + string.length);
    return repeat(pad, left) + string + repeat(pad, right);
  }

  /**
   * Repeat a string N times.
   * @param  {String} string The string to repeat.
   * @param  {Number} times  The times to repeat.
   * @return {String}        The repeated string.
   * @global
   */
  function repeat(string, times) {
    var length = times * string.length;
    var n1 = Math.floor(logN(2, string.length));
    var n2 = Math.ceil(logN(2, length));

    for (var i = n1; i < n2; i++) {
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
   * @global
   */
  function replaceAll(string, substr, newSubstr, ignoreCase) {
    var flags = ignoreCase ? 'gi' : 'g';
    return string.replace(new RegExp(escapeRegExp(substr), flags), newSubstr);
  }

  /**
   * Check if a string starts by a given prefix.
   * @param  {String} string The string.
   * @param  {String} prefix The prefix.
   * @return {boolean}       If the string starts by prefix of not.
   * @global
   */
  function startsWith(string, prefix) {
    return string.slice(0, prefix.length) === prefix;
  }

  /**
   * Check if a string ends by a given suffix.
   * @param  {String} string The string.
   * @param  {String} suffix The suffix.
   * @return {boolean}       If the string ends by suffix of not.
   * @global
   */
  function endsWith(string, suffix) {
    var length = suffix.length;
    return length === 0 || string.slice(-length) === suffix;
  }

  /**
   * Escapes a regex expresion string.
   * @param  {String} string The string to be escaped.
   * @return {String}        The escaped string.
   * @global
   */
  function escapeRegExp(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  // Number

  /**
   * Convert a number to string.
   * @param  {Number} number The number
   * @return {String}        The string.
   * @global
   */
  function numberToString(number) {
    return '' + number;
  }

  /**
   * Get a random number.
   * @param  {Number} min The inclusive min value.
   * @param  {Number} max The exclusive max value.
   * @return {Number}     The random number.
   * @global
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
   * @global
   */
  function getMiddleNumber(a, b, c) {
    var max = Math.max(Math.max(a, b), c);
    var min = Math.min(Math.min(a, b), c);
    return a + b + c - max - min;
  }

  /**
   * Get the number of digits in a number.
   * http://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript/
   * 28203456#28203456
   *
   * @param  {Number} integer The integer.
   * @param  {Number} base    The base of the number.
   * @return {Number}         The number of digits.
   * @global
   */
  function numDigits(integer, base) {
    base = base !== undefined ? base : 10;
    return Math.max(Math.floor(logN(base, Math.abs(integer))), 0) + 1;
  }

  /**
   * Check if a number is an integer or not.
   * @param  {Number}  number The number to check.
   * @return {Boolean}        If the number is an integer.
   * @global
   */
  function isInteger(number) {
    return number % 1 === 0;
  }

  /**
   * Checks if a number is NaN. Taken from http://jacksondunstan.com/articles/983
   * @param  {number}  number The number to ckeck.
   * @return {Boolean}        If the number is NaN.
   * @global
   */
  function isNaN(number) {
    return number !== number;
  }

  /**
   * Checks if a number is NaN, Infinity or -Infinity.
   * Taken from http://jacksondunstan.com/articles/983
   * @param  {Number}  number The number to ckeck.
   * @return {Boolean}        If the number is NaN, Infinity or -Infinity.
   * @global
   */
  function isNaNOrInfinity(number) {
    return (number * 0) !== 0;
  }

  /**
   * Truncates the number. This method is as fast as "number | 0" but it's
   * able to handle correctly numbers greater than 2^31 or lower than -2^31.
   * @param  {Number} number The number to be truncated.
   * @return {Number}        The truncated number.
   * @global
   */
  function truncateNumber(number) {
    return number - number % 1;
  }

  // Object

  /**
   * Merge the source object into dest.
   * @param  {Object|Array} dest   The destiny object or array.
   * @param  {Object|Array} source The source object or array.
   * @global
   */
  function mergeObjects(dest, source) {
    var i;

    if (isPlainObject(source)) {
      for (i in source) {
        _mergeObjects(dest, source, i);
      }
    } else if (isArray(source)) {
      for (i = 0; i < source.length; i++) {
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
    } else if (isDate(source[i])) {
      dest[i] = cloneDate(source[i]);
    } else {
      dest[i] = source[i];
    }
  }

  /**
   * Update an object key using a given path string.
   * @param  {Object} dest  The object to update.
   * @param  {*} value The value to place in path.
   * @param  {String} path  The path where to place the new value.
   * @global
   */
  function updateObject(dest, value, path) {
    var parentPath = _getParentPath(path);
    var key = path.substring(parentPath.length);

    if (key[0] === '[') {
      key = key.substring(1, key.length - 1);
    } else if (key[0] === '.') {
      key = key.substring(1);
    }

    var parent = get(dest, parentPath);
    if (isObject(parent)) {
      parent[key] = value;
    }
  }

  function _getParentPath(path) {
    var end = 0;

    if (path[path.length - 1] === ']') {
      end = path.lastIndexOf('[');
    } else if (path.indexOf('.') > -1) {
      end = path.lastIndexOf('.');
    }

    return path.substring(0, end);
  }

  function _defaultKeyGenerator() {
    return randomString(3);
  }

  function _defaultValueGenerator() {
    return randomNumber(1, 100);
  }

  /**
   * Get a random object.
   * @param  {Number[]} lengths        An array of lengths.
   * @param  {Function} [keyGenerator]   The key generator.
   * @param  {Function} [valueGenerator] The value generator.
   * @return {Object}                The random object.
   * @global
   */
  function randomObject(lengths, keyGenerator, valueGenerator) {
    keyGenerator = keyGenerator !== undefined ? keyGenerator : _defaultKeyGenerator;
    valueGenerator = valueGenerator !== undefined ? valueGenerator : _defaultValueGenerator;

    return _randomObject(lengths, keyGenerator, valueGenerator, {}, 1);
  }

  function _randomObject(lengths, keyGenerator, valueGenerator, object, actualDepth) {
    var depth = lengths.length;
    var i;
    var key;

    if (actualDepth > depth) {
      return;
    } else if (actualDepth === depth) {
      for (i = 0; i < lengths[actualDepth - 1]; i++) {
        key = keyGenerator();
        object[key] = valueGenerator();
        _randomObject(lengths, keyGenerator, valueGenerator,
            object[key], actualDepth + 1);
      }
    } else {
      for (i = 0; i < lengths[actualDepth - 1]; i++) {
        key = keyGenerator();
        object[key] = {};
        _randomObject(lengths, keyGenerator, valueGenerator,
            object[key], actualDepth + 1);
      }
    }

    return object;
  }

  /**
   * Divide an object into chunks by keys number.
   * @param  {Object} object    The object.
   * @param  {Number} chunkSize The max key number per chunk.
   * @return {Object[]}           An array of chunks objects.
   * @global
   */
  function objectChunk(object, chunkSize) {
    var chunks = [];
    var index = 0;
    var counter = 0;

    for (var key in object) {
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
   * @global
   */
  function cloneObject(original) {
    var clone = isArray(original) ? [] : {};
    mergeObjects(clone, original);
    return clone;
  }

  /**
   * Get the value using a path in an object.
   * @param  {Object} object The object.
   * @param  {String} path   The path.
   * @param  {*} [def=undefined] Value to return if no value is found in path.
   * @return {*} The found value in path.
   * @global
   */
  function get(object, path, def) {
    def = def !== undefined ? def : undefined;
    var tokens = path.replace(/\[/g, '.[').split('.');
    var tokensLength = tokens.length;
    var value = object;
    var token;
    var index;

    if (path === '') {
      return object;
    }

    for (var i = 0; i < tokensLength && value !== undefined; i++) {
      token = tokens[i];

      if (value === null) {
        value = undefined;
      } else if (token[0] === '[') {
        index = token.substring(1, token.length - 1);
        value = value[stringToNumber(index)];
      } else {
        value = value[tokens[i]];
      }
    }

    return value !== undefined ? value : def;
  }

  /**
   * Compare two objects structures if strict is false or
   * compare the structure and values if string is true.
   * @param  {Object} x      The first object.
   * @param  {Object} y      The second object.
   * @param  {Boolean} [strict=false] If strict comparation or not.
   * @return {Boolean}        If the objects are equal or not.
   * @global
   */
  function equals(x, y, strict) {
    strict = strict !== undefined ? strict : false;

    if (x === y) {
      return true;
    }

    if (!strict && _noStrictComparation(x, y)) {
      return true;
    }

    if (!isObject(x) || !isObject(y)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    for (var prop in x) {
      if (!x.hasOwnProperty(prop)) {
        continue;
      }

      if (!y.hasOwnProperty(prop)) {
        return false;
      }

      if (x[prop] === y[prop]) {
        continue;
      }

      if (!strict && _noStrictComparation(x[prop], y[prop])) {
        continue;
      }

      if (!isObject(x[prop])) {
        return false;
      }

      if (!equals(x[prop], y[prop], strict)) {
        return false;
      }
    }

    for (prop in y) {
      if (y.hasOwnProperty(prop) && !x.hasOwnProperty(prop)) {
        return false;
      }
    }

    return true;
  }

  function _noStrictComparation(x, y) {
    if ((isString(x) || isNumber(x) || isBoolean(x)) && typeof x === typeof y) {
      return true;
    }

    return false;
  }

  /**
   * Group an array of objects using the values of a list of keys.
   * Ej:
   * <pre>
   *   var array = [{lang:'spanish', age: 2}, {lang:'spanish', age:5}, {lang:'english', age:25}]
   *   ut.groupBy(array, ['lang'], function(obj) { return obj.age; })
   *   return -> { spanish: [ 2, 5 ], english: [ 25 ] }
   * </pre>
   * @param  {Object[]} data    An array of objects.
   * @param  {String[]} keys    An array of keys to group by.
   * @param  {Function} [iteratee] A function to modify the final grouped objects.
   * @return {Object}          The grouped object.
   * @global
   */
  function groupBy(array, keys, iteratee) {
    var result = {};
    var lastKeyIndex = keys.length - 1;
    var obj;
    var key;
    var pointer;
    var keyValue;
    var resultPointer;

    for (var i = 0; i < array.length; i++) {
      obj = array[i];

      pointer = obj;
      resultPointer = result;

      for (var j = 0; j < keys.length; j++) {
        key = keys[j];
        keyValue = pointer[key];

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
   * @global
   */
  function objectLength(object) {
    /*jshint unused: false*/
    var length = 0;
    for (var i in object) {
      length++;
    }

    return length;
  }

  /**
   * Clone a Date object.
   * @param  {Date} date The original Date object.
   * @return {Date}      The cloned Date.
   */
  function cloneDate(date) {
    return new Date(date.getTime());
  }

  // Type

  /**
   * If value has a numeric value or not. It can be a Number or a String.
   * @param  {*} value The value.
   * @return {Boolean} If has a numeric value or not.
   * @global
   */
  function isNumeric(value) {
    return !isNaNOrInfinity(parseFloat(value));
  }

  /**
   * If is a Number or not.
   * @param  {*} value The value.
   * @return {Boolean} If is a Number or not.
   * @global
   */
  function isNumber(value) {
    return typeof value === 'number' ||
        (isObject(value) && value.constructor === Number);
  }

  /**
   * If is a String or not.
   * @param  {*} value The value.
   * @return {Boolean} If is a String or not.
   * @global
   */
  function isString(value) {
    return typeof value === 'string' ||
        (isObject(value) && value.constructor === String);
  }

  /**
   * If is an Array or not.
   * @param  {*} value The value.
   * @return {Boolean} If is an Array or not.
   * @function
   * @global
   */
  var isArray = Array.isArray;

  /**
   * If is an Object or not.
   * @param  {*} value The value.
   * @return {Boolean} If is an Object or not.
   * @global
   */
  function isObject(value) {
    return typeof value === 'object' && value !== null;
  }

  /**
   * If is a plain object (not an array) or not.
   * @param  {*} value The value.
   * @return {Boolean} If is an Object and not an Array.
   * @global
   */
  function isPlainObject(value) {
    if (isObject(value)) {
      var proto = Object.getPrototypeOf(value);
      return proto === Object.prototype || proto === null;
    }

    return false;
  }

  /**
   * If is a Boolean or not.
   * @param  {*} value The value.
   * @return {Boolean} If is a Boolean or not.
   * @global
   */
  function isBoolean(value) {
    return typeof value === 'boolean' ||
        (isObject(value) && value.constructor === Boolean);
  }

  /**
   * If is Function or not.
   * @param  {*} value The value.
   * @return {Boolean} If is a Function or not.
   * @global
   */
  function isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * If is a RegExp or not.
   * @param  {*} value The value.
   * @return {Boolean} If is a RegExp or not.
   * @global
   */
  function isRegExp(value) {
    return value instanceof RegExp;
  }

  /**
   * If is a Date or not.
   * @param  {*} value The value.
   * @return {Boolean} If is a Date or not.
   * @global
   */
  function isDate(value) {
    return value instanceof Date;
  }

  /**
   * If is a string value representing a date. The string should be in a format
   * recognized by the Date.parse().
   * @param  {*} value The value.
   * @return {Boolean} If is a valid date string or not.
   * @global
   */
  function isDateString(value) {
    if (!isString(value)) {
      return false;
    }

    var date = new Date(value);
    return !isNaN(date.getTime());
  }

  /**
   * If is a Number or not. NaN, Infinity or -Infinity aren't considered valid numbers.
   * @param  {*} value The value.
   * @return {Boolean} If is a Number or not.
   * @global
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
   * @global
   */
  function logN(base, value) {
    var i = base === 2 ? Math.LN2 :
        base === 10 ? Math.LN10 : Math.log(base);
    return Math.log(value) / i;
  }

  // Miscellaneous

  /**
   * Execute a function N times and print the execution time.
   * @param  {Function} fn    The function to execute.
   * @param  {Number}   [times=1] How many times to execute.
   * @param  {String}   [name='']  A name to be used in the log string.
   * @global
   */
  function test(fn, times, name) {
    times = times !== undefined ? times : 1;
    name = name !== undefined ? name : '';

    var start = Date.now();

    for (var i = 0; i < times; i++) {
      fn(i);
    }

    console.log('Test ' + name + ' finished in ' + (Date.now() - start) + 'ms');
  }

  /**
   * Check if a value is inside of a given range.
   * @param  {Number|String|Array|Object} val The value.
   * @param  {Number} [min=-Infinity] Min inclusive value.
   * @param  {Number} [max=Infinity] Max inclusive value.
   * @return {Boolean}     If the value is inside of the given range or not.
   * @global
   */
  function inRange(val, min, max) {
    min = isNumber(min) ? min : -Infinity;
    max = isNumber(max) ? max : Infinity;

    if (isNumber(val)) {
      return val >= min && val <= max;
    } else if (isString(val)) {
      return val.length >= min && val.length <= max;
    } else if (isArray(val)) {
      return val.length >= min && val.length <= max;
    } else if (isObject(val)) {
      var length = objectLength(val);
      return length >= min && length <= max;
    }

    return false;
  }

  // Logging

  /**
   * A simple logger.
   * @namespace logger
   */
  var logger = {

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

    _out: isNode ? process.stdout : {
      write: function (string) {
        var length = string.length;
        if (string[length - 1] === '\n') {
          string = string.substring(0, length - 1);
        }

        console.log(string);
      }
    },
    _logLevel: 1,
    _usingDate: true,

    /**
     * Set the log level.
     * @param {Number} logLevel The new log level.
     * @memberOf logger
     */
    setLogLevel: function (logLevel) {
      this._logLevel = logLevel;
    },

    /**
     * If date will appear in the log string or not.
     * @param {Boolean} usingDate If using date or not.
     * @memberOf logger
     */
    setUsingDate: function (usingDate) {
      this._usingDate = usingDate;
    },

    /**
     * If plain objects should be printed prettified or not.
     * @param {Boolean} prettify If prettify plain objects or not.
     * @memberOf logger
     */
    setPrettify: function (prettify) {
      this._prettify = prettify;
    },

    /**
     * Print a debug log.
     * @param {...*} arg The arguments
     * @memberOf logger
     */
    debug: function () {
      if (this._checkLogLevel(1)) {
        this._out.write(this._createHeader('[DEBUG] ') + this._createbody(arguments));
      }
    },

    /**
     * Print a info log.
     * @param {...*} arg The arguments
     * @memberOf logger
     */
    info: function () {
      if (this._checkLogLevel(2)) {
        this._out.write(this._createHeader('[INFO]  ') + this._createbody(arguments));
      }
    },

    /**
     * Print a warn log.
     * @param {...*} arg The arguments
     * @memberOf logger
     */
    warn: function () {
      if (this._checkLogLevel(3)) {
        this._out.write(this._createHeader('[WARN]  ') + this._createbody(arguments));
      }
    },

    /**
     * Print a error log.
     * @param {...*} arg The arguments
     * @memberOf logger
     */
    error: function () {
      if (this._checkLogLevel(4)) {
        this._out.write(this._createHeader('[ERROR] ') + this._createbody(arguments));
      }
    },

    _createHeader: function (label) {
      if (this._usingDate) {
        return now() + ' ' + label;
      }

      return label;
    },

    _createbody: function (args) {
      if (args.length > 0) {
        var data = '';
        var length = args.length;

        for (var i = 0; i < length; i++) {
          if (isObject(args[i])) {
            if (args[i] instanceof Error) {
              data += 'Error: ' + args[i].message;
            } else if (this._prettify && isPlainObject(args[i])) {
              data += JSON.stringify(args[i], null, 2);
            } else {
              data += JSON.stringify(args[i]);
            }
          } else {
            data += args[i];
          }

          if (i < length - 1) {
            data += ' ';
          }
        }

        return data + '\n';
      }

      return '\n';
    },

    _checkLogLevel: function (methodLogLevel) {
      return this._logLevel <= methodLogLevel;
    }
  };

  // Functions

  global.dateToMysql = dateToMysql;
  global.dateToString = dateToString;
  global.now = now;

  global.arrayChunk = arrayChunk;
  global.sort = sort;
  global.swap = swap;
  global.concatArrays = concatArrays;
  global.copyArray = copyArray;
  global.clearArray = clearArray;
  global.randomArray = randomArray;
  global.intersectSorted = intersectSorted;
  global.spliceOne = spliceOne;
  global.binaryInsert = binaryInsert;
  global.binarySearch = binarySearch;
  global.removeDuplicatesSorted = removeDuplicatesSorted;

  global.argumentsToArray = argumentsToArray;

  global.randomString = randomString;
  global.stringToNumber = stringToNumber;
  global.paddingLeft = paddingLeft;
  global.paddingRight = paddingRight;
  global.paddingBoth = paddingBoth;
  global.repeat = repeat;
  global.replaceAll = replaceAll;
  global.startsWith = startsWith;
  global.endsWith = endsWith;
  global.escapeRegExp = escapeRegExp;

  global.numberToString = numberToString;
  global.randomNumber = randomNumber;
  global.getMiddleNumber = getMiddleNumber;
  global.numDigits = numDigits;
  global.isInteger = isInteger;
  global.isNaN = isNaN;
  global.isNaNOrInfinity = isNaNOrInfinity;
  global.truncateNumber = truncateNumber;

  global.mergeObjects = mergeObjects;
  global.updateObject = updateObject;
  global.randomObject = randomObject;
  global.objectChunk = objectChunk;
  global.cloneObject = cloneObject;
  global.get = get;
  global.equals = equals;
  global.groupBy = groupBy;
  global.objectLength = objectLength;
  global.cloneDate = cloneDate;

  global.isNumeric = isNumeric;
  global.isNumber = isNumber;
  global.isString = isString;
  global.isArray = isArray;
  global.isObject = isObject;
  global.isPlainObject = isPlainObject;
  global.isBoolean = isBoolean;
  global.isFunction = isFunction;
  global.isRegExp = isRegExp;
  global.isDate = isDate;
  global.isDateString = isDateString;
  global.isValidNumber = isValidNumber;

  global.logN = logN;

  global.test = test;
  global.inRange = inRange;

  global.logger = logger;

}());
