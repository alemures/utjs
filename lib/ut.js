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

    // Utilities for date object

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
        return prefix(date.getDate(), 2) + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' '
            + prefix(date.getHours(), 2) + ':' + prefix(date.getMinutes(), 2) + ':' + prefix(date.getSeconds(), 2);
    }

    // Utilities for arrays

    function arrayChunk(array, chunkSize) {
        var i, j;
        var size = array.length;
        var tempArray = [];

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

    function concatArrays(array1, array2) {
        var i;
        var length = array2.length;

        for (i = 0; i < length; i++) {
            array1.push(array2[i]);
        }
    }

    function copyArray(array) {
        return array.slice();
    }

    function clearArray(array) {
        array.length = 0;
    }

    function randomArray(length, isStrings) {
        isStrings = isStrings !== undefined ? isStrings : false;

        var array = [];
        var i;

        if (isStrings) {
            for (i = 0; i < length; i++) {
                array.push(randomString(randomNumber(4, 25)));
            }
        } else {
            for (i = 0; i < length; i++) {
                array.push(randomNumber(0, 1000000));
            }
        }

        return array;
    }

    // Arguments operations

    function argumentsToArray(args) {
        return Array.prototype.slice.call(args);
    }

    // Strings operations

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

    function numberToString(number) {
        return '' + number;
    }

    function prefix(number, length) {
        var string =  '000000' + number;
        return string.substring(string.length - length);
    }

    // Number operations

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function getMiddleNumber(a, b, c) {
        var mx = Math.max(Math.max(a, b), c);
        var mn = Math.min(Math.min(a, b), c);
        return a ^ b ^ c ^ mx ^ mn;
    }

    // Types checker

    function isNumeric(value) {
        return !isNaN(stringToNumber(value));
    }

    function isNumber(value) {
        var type = typeof value;
        return type === 'number' || (type === 'object'
            && Object.prototype.toString.call(value) === '[object Number]');
    }

    function isString(value) {
        var type = typeof value;
        return type === 'string' || (typeof value === 'object'
            && Object.prototype.toString.call(value) === '[object String]');
    }

    /**
     * Try to use the native isArray function if available
     */
    var isArray = Array.isArray || function (value) {
        return typeof value === 'object'
            && Object.prototype.toString.call(value) === '[object Array]';
    };

    // Miscellaneous

    function objectChunk(object, chunkSize) {
        var chunks = [];
        var index = 0;
        var counter = 0;
        var key;

        for(key in object) {
            if(chunks[index] === undefined) {
                chunks[index] = {};
            }
            chunks[index][key] = object[key];

            if(++counter % chunkSize === 0) {
                index++;
            }
        }
        return chunks;
    }

    function compareObject(x, y, strict) {
        strict = strict !== undefined ? strict : false;

        // if both x and y are null or undefined and exactly the same
        if (x === y) return true;

        // For primitive values just check the type NO STRICT
        if (!strict && _noStrictComparation(x, y)) return true;

        // if they are not strictly equal, they both need to be Objects
        if (!( x instanceof Object ) || !( y instanceof Object )) return false;

        // they must have the exact same prototype chain, the closest we can do is
        // test there constructor.
        if (x.constructor !== y.constructor) return false;

        for (var p in x) {
            // other properties were tested using x.constructor === y.constructor
            if (!x.hasOwnProperty(p)) continue;

            // allows to compare x[ p ] and y[ p ] when set to undefined
            if (!y.hasOwnProperty(p)) {
                if(strict) {
                    return false;
                }
                continue;
            }

            // if they have the same strict value or identity then they are equal
            if (x[ p ] === y[ p ]) continue;

            // For primitive values just check the type NO STRICT
            if (!strict && _noStrictComparation(x[p], y[p])) continue;

            // Numbers, Strings, Functions, Booleans must be strictly equal
            if (typeof( x[ p ] ) !== 'object')
                return false;

            // Objects and Arrays must be tested recursively
            if (!compareObject(x[ p ], y[ p ], strict)) return false;
        }

        for (p in y) {
            // allows x[ p ] to be set to undefined
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        }
        return true;
    }

    function _noStrictComparation(x, y) {
        if ((typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean')
            && typeof x === typeof y) {
            return true;
        }
        return false;
    }

    function test(fn, times, name) {
        times = times !== undefined ? times : 1;
        name = name !== undefined ? name : '';

        var start = Date.now();

        for (var i = 0; i < times; i++) {
            fn(i);
        }
        console.log('Test ' + name + ' finished in ' + (Date.now() - start));
    }

    function inRange(val, min, max) {
        if (isNumber(val)) {
            return val >= min && val <= max;
        } else if (isString(val)) {
            return val.length >= min && val.length <= max;
        } else if (isArray(val)) {
            return val.length >= min && val.length <= max;
        }
        return false;
    }

    // Utilities for print logs
    var logger = {
        _out: process.stdout,

        debug: function() {
            this._out.write(this._createHeader(' [DEBUG] ') + this._createbody(arguments));
        },
        info: function() {
            this._out.write(this._createHeader(' [INFO]  ') + this._createbody(arguments));
        },
        warn: function() {
            this._out.write(this._createHeader(' [WARN]  ') + this._createbody(arguments));
        },
        error: function() {
            this._out.write(this._createHeader(' [ERROR] ') + this._createbody(arguments));
        },
        _createHeader: function(label) {
            return this._getDate() + label;
        },
        _createbody: function(args) {
            if(args.length > 0 ) {
                var data = '';
                var length = args.length;
                var i;
                var type;

                for(i = 0; i < length; i++) {
                    type = typeof args[i];

                    if(type === 'object') {
                        if(args[i] instanceof Error) {
                            data += args[i].message;
                        } else {
                            data += JSON.stringify(args[i]);
                        }
                    } else if(type === 'array') {
                        data += JSON.stringify(args[i]);
                    } else {
                        data += args[i];
                    }

                    if(i < length - 1) data += ' ';
                }
                return data + '\n';
            }
            return '\n';
        },
        _getDate: function() {
            return dateToString(new Date());
        }
    };

    // Functions

    global.dateToMysql = dateToMysql;
    global.dateToString = dateToString;
    global.arrayChunk = arrayChunk;
    global.sort = sort;
    global.concatArrays = concatArrays;
    global.copyArray = copyArray;
    global.clearArray = clearArray;
    global.randomString = randomString;
    global.randomNumber = randomNumber;
    global.argumentsToArray = argumentsToArray;
    global.stringToNumber = stringToNumber;
    global.getMiddleNumber = getMiddleNumber;
    global.inRange = inRange;
    global.numberToString = numberToString;
    global.prefix = prefix;
    global.test = test;
    global.isNumber = isNumber;
    global.isString = isString;
    global.isArray = isArray;
    global.randomArray = randomArray;
    global.isNumeric = isNumeric;
    global.compareObject = compareObject;
    global.objectChunk = objectChunk;

    // Objects

    global.logger = logger;

}());