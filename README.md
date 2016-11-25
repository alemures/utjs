utjs
==

utjs is a high performance library with some common functions like sort, concatArrays, randomString, stringToNumber, etc.

#### Install
```
npm install utjs
```

#### Usage
```
var ut = require('utjs');
var number = ut.randomNumber(1, 10);
console.log(number);
```

#### Functions
```
// Date
function dateToMysql([date])
function dateToString([date])
function now()
function cloneDate(date)

// Array
function arrayChunk(array, chunkSize)
function sort(array, [comparator=_numericComparator], [left=0], [right=array.length-1])
function swap(array, from, to)
function concatArrays(dest, source)
function copyArray(array, [start=0], [end=array.length])
function clearArray(array)
function randomArray(length, [dataGenerator=_defaultDataGenerator])
function intersectSorted(array1, array2, [comparator=_numericComparator])
function spliceOne(array, index)
function binaryInsert(value, array, [comparator=_numericComparator], [rejectDuplicates=false])
function binarySearch(value, array, [comparator=_numericComparator], [left=0], [right=array.length-1])
function randomArrayItem(array, [start=0], [end=array.length])

// Arguments
function argumentsToArray(args)

// String
function randomString(size, [caseInsensitive=false])
function stringToNumber(string)
function paddingLeft(string, pad, length)
function paddingRight(string, pad, length)
function paddingBoth(string, pad, length)
function repeat(string, times)
function replaceAll(string, substr, newSubstr, [ignoreCase=false])
function startsWith(string, prefix)
function endsWith(string, suffix)
function escapeRegExp(string)
function isDateString(string)
function isHexString(string)

// Number
function numberToString(number)
function randomNumber(min, max)
function getMiddleNumber(a, b, c)
function numDigits(integer, [base=10])
function isInteger(number)
function isNaN(number)
function isNaNOrInfinity(number)
function truncateNumber(number)

// Object
function mergeObjects(dest, source)
function updateObject(dest, value, path)
function randomObject(lengths, [keyGenerator=_defaultKeyGenerator],
                      [valueGenerator=_defaultValueGenerator])
function objectChunk(object, chunkSize)
function cloneObject(original)
function get(object, path, [def=undefined])
function equals(value, other)
function groupBy(array, keys, [iteratee])
function objectLength(object)
function clearObject(object)
function toFastProperties(object)

// Boolean
function randomBoolean()

// Type
function isNumeric(value)
function isNumber(value)
function isString(value)
function isArray(value)
function isObject(value)
function isPlainObject(value)
function isBoolean(value)
function isFunction(value)
function isRegExp(value)
function isDate(value)
function isValidNumber(value)

// Math
function logN(base, value)

// Miscellaneous
function test(fn, [times=1], [label='Default label'])
function inRange(val, [min=-Infinity], [max=Infinity])
function error([message], [constructor])
```

#### Objects
```
// Logging
var logger = {
  DEBUG: 1
  INFO: 2
  WARN: 3
  ERROR: 4
  NONE: Number.MAX_VALUE

  setLogLevel: function(logLevel)
  setUsingDate: function(usingDate)
  setPrettify: function (prettify)

  debug: function(/* arg1, arg2, argN */)
  info: function(/* arg1, arg2, argN */)
  warn: function(/* arg1, arg2, argN */)
  error: function(/* arg1, arg2, argN */)
}
```

## jsdoc
http://alemures.github.io/utjs/