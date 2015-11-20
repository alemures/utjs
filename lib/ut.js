'use strict';

/**
 * ut === Utils
 *
 * @author Alejandro Santiago Nieto
 */
(function() {

  var isNode = false;
  var global;

  if (typeof module !== 'undefined' && module.exports) {
    isNode = true;
  }

  if (isNode) {
    global = module.exports;
  } else {
    window.ut = {
      process: {
        stdout: {
          write: function(string) {
            var length = string.length;
            if (string[length - 1] === '\n') {
              string = string.substring(0, length - 1);
            }

            console.log(string);
          }
        }
      }
    };

    global = window.ut;
  }

  // Date

  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function dateToMysql(date) {
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var hh = date.getHours();
    var min = date.getMinutes();
    var ss = date.getSeconds();

    return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
  }

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

  function now() {
    var date = new Date();
    var string = dateToString(date);
    var millis = numberToString(date.getMilliseconds());
    return string + '.' + paddingLeft(millis, '0', 3);
  }

  // Array

  function arrayChunk(array, chunkSize) {
    var size = array.length;
    var tempArray = [];
    var i;
    var j;

    for (i = 0, j = 0; j < size; j += chunkSize, i++) {
      tempArray[i] = array.slice(j, j + chunkSize);
    }

    return tempArray;
  }

  function _swap(array, i, j) {
    var swapped = array[i];
    array[i] = array[j];
    array[j] = swapped;
  }

  function _partition(array, left, right) {
    if (right === left) {
      return;
    }

    var pivotIndex = randomNumber(left, right);
    var pivot = array[pivotIndex];
    var partitionIndex = left + 1;
    var i;

    _swap(array, left, pivotIndex);

    for (i = left + 1; i < right; i++) {
      if (array[i] < pivot) {
        _swap(array, partitionIndex, i);
        partitionIndex++;
      }
    }

    _swap(array, partitionIndex - 1, left);

    _partition(array, left, partitionIndex - 1);
    _partition(array, partitionIndex, right);
  }

  function sort(items) {
    _partition(items, 0, items.length);
  }

  function concatArrays(dest, source) {
    var i;
    var length = source.length;

    for (i = 0; i < length; i++) {
      dest.push(source[i]);
    }
  }

  function copyArray(array) {
    return array.slice();
  }

  function clearArray(array) {
    array.length = 0;
  }

  function _defaultDataGenerator() {
    return randomNumber(1, 100);
  }

  function randomArray(length, dataGenerator) {
    dataGenerator = dataGenerator !== undefined ? dataGenerator : _defaultDataGenerator;

    var array = [];
    var i;

    for (i = 0; i < length; i++) {
      array.push(dataGenerator(i));
    }

    return array;
  }

  function intersectSorted(a, b) {
    var aLength = a.length;
    var bLength = b.length;
    var ai = 0;
    var bi = 0;
    var result = [];
    var last;

    while (ai < aLength && bi < bLength) {
      if (a[ai] < b[bi]) {
        ai++;
      } else if (a[ai] > b[bi]) {
        bi++;
      } else {
        if (a[ai] !== last) {
          last = a[ai];
          result.push(last);
        }

        ai++;
        bi++;
      }
    }

    return result;
  }

  // Arguments

  function argumentsToArray(args) {
    return Array.prototype.slice.call(args);
  }

  // String

  function randomString(size) {
    var string = '';
    var start = 97;
    var alphabetLength = 26;
    var end = start + alphabetLength;
    var i;

    for (i = 0; i < size; i++) {
      string += String.fromCharCode(
        randomNumber(start, end));
    }

    return string;
  }

  function stringToNumber(string) {
    return string * 1;
  }

  function paddingLeft(string, pad, length) {
    return repeat(pad, length - string.length) + string;
  }

  function paddingRight(string, pad, length) {
    return string + repeat(pad, length - string.length);
  }

  function paddingBoth(string, pad, length) {
    var right = Math.ceil((length - string.length) / 2);
    var left = length - (right + string.length);
    return repeat(pad, left) + string + repeat(pad, right);
  }

  function repeat(string, times) {
    var length = times * string.length;
    var n1 = Math.floor(logN(2, string.length));
    var n2 = Math.ceil(logN(2, length));
    var i;

    for (i = n1; i < n2; i++) {
      string += string;
    }

    return string.substring(0, length);
  }

  function replaceAll(string, substr, newSubstr, ignoreCase) {
    ignoreCase = ignoreCase !== undefined ? ignoreCase : false;
    var flags = 'g';

    if (ignoreCase) {
      flags += 'i';
    }

    return string.replace(new RegExp(substr, flags), newSubstr);
  }

  function startsWith(string, prefix) {
    return string.slice(0, prefix.length) === prefix;
  }

  function endsWith(string, suffix) {
    var length = suffix.length;
    return length === 0 || string.slice(-length) === suffix;
  }

  // Number

  function numberToString(number) {
    return '' + number;
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function getMiddleNumber(a, b, c) {
    var max = Math.max(Math.max(a, b), c);
    var min = Math.min(Math.min(a, b), c);
    return a + b + c - max - min;
  }

  function decimalToInt(decimal) {
    return decimal | 0;
  }

  // http://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript/28203456#28203456
  function numDigits(integer, base) {
    base = base !== undefined ? base : 10;
    return (logN(base, (integer ^ (integer >> 31)) - (integer >> 31)) | 0) + 1;
  }

  // Object

  function mergeObjects(dest, source) {
    var key;

    for (key in source) {
      if (isPlainObject(source[key])) {
        if (!isPlainObject(dest[key])) {
          dest[key] = {};
        }

        mergeObjects(dest[key], source[key]);
      } else if (isArray(source[key])) {
        if (!isArray(dest[key])) {
          dest[key] = [];
        }

        mergeObjects(dest[key], source[key]);
      } else {
        dest[key] = source[key];
      }
    }
  }

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

  function objectChunk(object, chunkSize) {
    var chunks = [];
    var index = 0;
    var counter = 0;
    var key;

    for (key in object) {
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

  function cloneObject(object) {
    var clone = {};
    mergeObjects(clone, object);
    return clone;
  }

  function get(object, path, def) {
    def = def !== undefined ? def : undefined;
    var tokens = replaceAll(path, '\\[', '\.\[').split('.');
    var tokensLength = tokens.length;
    var value = object;
    var token;
    var i;
    var index;

    if (path === '') {
      return object;
    }

    for (i = 0; i < tokensLength && value !== undefined; i++) {
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

  // Type

  function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  function isNumber(value) {
    var type = typeof value;
    return type === 'number' || (type === 'object' &&
        Object.prototype.toString.call(value) === '[object Number]');
  }

  function isString(value) {
    var type = typeof value;
    return type === 'string' || (typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object String]');
  }

  var isArray = Array.isArray || function(value) {
    return typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Array]';
  };

  function isObject(value) {
    var type = typeof value;
    return type === 'object';
  }

  function isPlainObject(value) {
    return isObject(value) && !isArray(value);
  }

  function isBoolean(value) {
    var type = typeof value;
    return type === 'boolean' || (typeof value === 'object' &&
        Object.prototype.toString.call(value) === '[object Boolean]');
  }

  function isFunction(value) {
    return typeof value === 'function';
  }

  // Math

  function logN(base, value) {
    var i = base === 2 ? Math.LN2 :
        base === 10 ? Math.LN10 : Math.log(base);
    return Math.log(value) / i;
  }

  // Miscellaneous

  function test(fn, times, name) {
    times = times !== undefined ? times : 1;
    name = name !== undefined ? name : '';

    var start = Date.now();

    for (var i = 0; i < times; i++) {
      fn(i);
    }

    console.log('Test ' + name + ' finished in ' + (Date.now() - start) + 'ms');
  }

  function inRange(val, min, max) {
    max = max !== undefined ? max : Infinity;

    if (isNumber(val)) {
      return val >= min && val <= max;
    } else if (isString(val)) {
      return val.length >= min && val.length <= max;
    } else if (isArray(val)) {
      return val.length >= min && val.length <= max;
    }

    return false;
  }

  // Logging

  var logger = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,

    _out: isNode ? process.stdout : window.ut.process.stdout,
    _logLevel: 1,
    _usingDate: true,

    setLogLevel: function(logLevel) {
      this._logLevel = logLevel;
    },

    setUsingDate: function(usingDate) {
      this._usingDate = usingDate;
    },

    debug: function() {
      if (this._checkLogLevel(1)) {
        this._out.write(this._createHeader('[DEBUG] ') + this._createbody(arguments));
      }
    },

    info: function() {
      if (this._checkLogLevel(2)) {
        this._out.write(this._createHeader('[INFO]  ') + this._createbody(arguments));
      }
    },

    warn: function() {
      if (this._checkLogLevel(3)) {
        this._out.write(this._createHeader('[WARN]  ') + this._createbody(arguments));
      }
    },

    error: function() {
      if (this._checkLogLevel(4)) {
        this._out.write(this._createHeader('[ERROR] ') + this._createbody(arguments));
      }
    },

    _createHeader: function(label) {
      if (this._usingDate) {
        return now() + ' ' + label;
      }

      return label;
    },

    _createbody: function(args) {
      if (args.length > 0) {
        var data = '';
        var length = args.length;
        var i;

        for (i = 0; i < length; i++) {
          if (isObject(args[i])) {
            if (args[i] instanceof Error) {
              data += 'Error: ' + args[i].message;
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

    _checkLogLevel: function(methodLogLevel) {
      return this._logLevel <= methodLogLevel;
    }
  };

  // Functions

  global.dateToMysql = dateToMysql;
  global.dateToString = dateToString;
  global.now = now;

  global.arrayChunk = arrayChunk;
  global.sort = sort;
  global.concatArrays = concatArrays;
  global.copyArray = copyArray;
  global.clearArray = clearArray;
  global.randomArray = randomArray;
  global.intersectSorted = intersectSorted;

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

  global.numberToString = numberToString;
  global.randomNumber = randomNumber;
  global.getMiddleNumber = getMiddleNumber;
  global.decimalToInt = decimalToInt;
  global.numDigits = numDigits;

  global.mergeObjects = mergeObjects;
  global.updateObject = updateObject;
  global.randomObject = randomObject;
  global.objectChunk = objectChunk;
  global.cloneObject = cloneObject;
  global.get = get;
  global.equals = equals;

  global.isNumeric = isNumeric;
  global.isNumber = isNumber;
  global.isString = isString;
  global.isArray = isArray;
  global.isObject = isObject;
  global.isPlainObject = isPlainObject;
  global.isBoolean = isBoolean;
  global.isFunction = isFunction;

  global.logN = logN;

  global.test = test;
  global.inRange = inRange;

  global.logger = logger;

}());
