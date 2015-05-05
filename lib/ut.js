/**
 * ut === Utils
 *
 * @author Alejandro Santiago Nieto
 */
(function () {

    var isNode = false,
        global;

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

    var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July',
        'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    function dateToMysql(date) {
        var yyyy = date.getFullYear(),
            mm = date.getMonth() + 1,
            dd = date.getDate(),
            hh = date.getHours(),
            min = date.getMinutes(),
            ss = date.getSeconds();

        return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
    }

    function dateToString(date) {
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' '
            + date.getHours() + ':' + prefix(date.getMinutes(), 2) + ':' + prefix(date.getSeconds(), 2);
    }

    // Utilities for arrays

    function arrayChunk(v, chunkSize) {
        var i, k,
            size = v.length,
            tempArray = [];

        for (i = 0, k = 0; k < size; k += chunkSize, i++) {
            tempArray[i] = v.slice(k, k + chunkSize);
        }
        return tempArray;
    }

    function _swap(arr, i, j) {
        var swapped = arr[i];
        arr[i] = arr[j];
        arr[j] = swapped;
    }

    function _partition(arr, left, right) {
        if (right === left) {
            return;
        }

        var pivotIndex = randomNumber(left, right),
            pivot = arr[pivotIndex],
            i;

        _swap(arr, left, pivotIndex);

        var partitionIndex = left + 1;
        for (i = left + 1; i < right; i++) {
            if (arr[i] < pivot) {
                _swap(arr, partitionIndex, i);
                partitionIndex++;
            }
        }

        _swap(arr, partitionIndex - 1, left);

        _partition(arr, left, partitionIndex - 1);
        _partition(arr, partitionIndex, right);
    }

    function sort(items) {
        _partition(items, 0, items.length);
    }

    function concatArrays(v1, v2) {
        var i,
            length = v2.length;

        for (i = 0; i < length; i++) {
            v1.push(v2[i]);
        }
    }

    function copyArray(v) {
        return v.slice();
    }

    function clearArray(v) {
        //v.splice(0, v.length);
        v.length = 0; // Even faster
    }

    function randomArray(length, isStrings) {
        isStrings = isStrings !== undefined ? isStrings : false;

        var v = [], i;

        if (isStrings) {
            for (i = 0; i < length; i++) {
                v.push(randomString(randomNumber(4, 25)));
            }
        } else {
            for (i = 0; i < length; i++) {
                v.push(randomNumber(0, 1000000));
            }
        }

        return v;
    }

    // Arguments operations

    function argumentsToArray(args) {
        return Array.prototype.slice.call(args);
    }

    // Strings operations

    function randomString(size) {
        var string = '',
            start = 97,
            alphabetLength = 26,
            end = start + alphabetLength,
            i;

        for (i = 0; i < size; i++) {
            string += String.fromCharCode(
                randomNumber(start, end));
        }
        return string;
    }

    function stringToNumber(string) {
        return string * 1;
    }

    function numberToString(n) {
        return '' + n;
    }

    function prefix(num, length) {
        var string =  '000000' + num;
        return string.substring(string.length-length);
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

    function objectChunk(obj, chunkSize) {
        var chunks = [];
        var key, index = 0, counter = 0;

        for(key in obj) {
            if(chunks[index] === undefined) {
                chunks[index] = {};
            }
            chunks[index][key] = obj[key];

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
        return false;    }

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
        _months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
            var d = new Date();
            return prefix(d.getDate(), 2) + ' ' + this._months[d.getMonth()] + ' ' + d.getFullYear() + ' '
                + prefix(d.getHours(), 2) + ':' + prefix(d.getMinutes(), 2) + ':' + prefix(d.getSeconds(), 2);
        }
    };

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
    global.logger = logger;

}());