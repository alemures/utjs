ut
==

ut is a high performance library with some common functions like sort, concatArrays, randomString, stringToNumber, etc.

#### Functions
```
// Date
function dateToMysql(date)
function dateToString(date)
function now()

// Array
function arrayChunk(array, chunkSize)
function sort(items)
function concatArrays(dest, source)
function copyArray(array)
function clearArray(array)
function randomArray(length, dataGenerator)
function intersectSorted(a, b)

// Arguments
function argumentsToArray(args)

// String
function randomString(size)
function stringToNumber(string)
function paddingLeft(string, pad, length)
function paddingRight(string, pad, length)
function paddingBoth(string, pad, length)
function repeat(string, times)
function replaceAll(string, substr, newSubstr, ignoreCase)

// Number
function numberToString(number)
function randomNumber(min, max)
function getMiddleNumber(a, b, c)

// Object
function mergeObjects(dest, source)
function updateObject(dest, value, path)
function randomObject(lengths, keyGenerator, valueGenerator)
function objectChunk(object, chunkSize)
function cloneObject(object)
function get(object, path, def)
function equals(x, y, strict)

// Type
function isNumeric(value)
function isNumber(value)
function isString(value)
function isObject(value)
function isPlainObject(value)
function isBoolean(value)
function isFunction(value)

// Math
function logN(base, value)

// Miscellaneous
function test(fn, times, name)
function inRange(val, min, max)
```

#### Objects
```
// Logging
var logger = {}
```