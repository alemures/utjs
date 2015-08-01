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
        window.ut = {
            process: {
                stdout: {
                    write: function(string) {
                        var length = string.length;
                        if(string[length - 1] === '\n') {
                            string = string.substring(0, length - 1);
                        }
                        console.log(string);
                    }
                }
            }
        };
        global = window.ut;
    }

    // Date utilities

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
        return paddingLeft(date.getDate(), '0', 2) + ' ' + months[date.getMonth()] + ' ' + date.getFullYear() + ' '
            + paddingLeft(date.getHours(), '0', 2) + ':' + paddingLeft(date.getMinutes(), '0', 2) + ':' + paddingLeft(date.getSeconds(), '0', 2);
    }

    // Array utilities

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

    // Arguments utilities

    function argumentsToArray(args) {
        return Array.prototype.slice.call(args);
    }

    // String utilities

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

    function paddingLeft(string, pad, finalLength) {
        return createPadding(pad, finalLength - string.length) + string;
    }

    function paddingRight(string, pad, finalLength) {
        return string + createPadding(pad, finalLength - string.length);
    }

    function createPadding(string, finalLength) {
        var n1 = Math.floor(logN(2, string.length));
        var n2 = Math.ceil(logN(2, finalLength));
        var i;

        for(i = n1; i < n2; i++) {
            string += string;
        }

        return string.substring(0, finalLength);
    }

    // Number operations

    function numberToString(number) {
        return '' + number;
    }

    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function getMiddleNumber(a, b, c) {
        var mx = Math.max(Math.max(a, b), c);
        var mn = Math.min(Math.min(a, b), c);
        return a ^ b ^ c ^ mx ^ mn;
    }

    // Object utilities

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
        var levelLength;
        var key;

        if(actualDepth > depth) {
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

    // Type checker

    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
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

    var isArray = Array.isArray || function (value) {
        return typeof value === 'object'
            && Object.prototype.toString.call(value) === '[object Array]';
    };

    function isObject(value) {
        var type = typeof value;
        return type === 'object';
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
        if (isNumber(val)) {
            return val >= min && val <= max;
        } else if (isString(val)) {
            return val.length >= min && val.length <= max;
        } else if (isArray(val)) {
            return val.length >= min && val.length <= max;
        }
        return false;
    }

    // Logging utilities

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
            if(this._checkLogLevel(1)) {
                this._out.write(this._createHeader('[DEBUG] ') + this._createbody(arguments));
            }
        },
        info: function() {
            if(this._checkLogLevel(2)) {
                this._out.write(this._createHeader('[INFO]  ') + this._createbody(arguments));
            }
        },
        warn: function() {
            if(this._checkLogLevel(3)) {
                this._out.write(this._createHeader('[WARN]  ') + this._createbody(arguments));
            }
        },
        error: function() {
            if(this._checkLogLevel(4)) {
                this._out.write(this._createHeader('[ERROR] ') + this._createbody(arguments));
            }
        },
        _createHeader: function(label) {
            if(this._usingDate) {
                return this._getDate() + ' ' + label;
            }
            return label;
        },
        _createbody: function(args) {
            if(args.length > 0 ) {
                var data = '';
                var length = args.length;
                var i;
                var type;

                for(i = 0; i < length; i++) {
                    if(isObject(args[i])) {
                        if(args[i] instanceof Error) {
                            data += 'Error: ' + args[i].message;
                        } else {
                            data += JSON.stringify(args[i]);
                        }
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
        },
        _checkLogLevel: function(methodLogLevel) {
            return this._logLevel <= methodLogLevel;
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
    global.randomArray = randomArray;

    global.argumentsToArray = argumentsToArray;

    global.randomString = randomString;
    global.stringToNumber = stringToNumber;
    global.paddingLeft = paddingLeft;
    global.paddingRight = paddingRight;
    global.createPadding = createPadding;

    global.numberToString = numberToString;
    global.randomNumber = randomNumber;
    global.getMiddleNumber = getMiddleNumber;

    global.randomObject = randomObject;
    global.objectChunk = objectChunk;
    global.compareObject = compareObject;

    global.isNumeric = isNumeric;
    global.isNumber = isNumber;
    global.isString = isString;
    global.isArray = isArray;
    global.isObject = isObject;

    global.logN = logN;

    global.test = test;
    global.inRange = inRange;

    global.logger = logger;

}());