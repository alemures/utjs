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
        var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July',
            'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];


        return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " "
            + date.getHours() + ":" + prefix(date.getMinutes(), 2) + ":" + prefix(date.getSeconds(), 2);
    }

    // Utilities for arrays

    function arrayChunk(v, chunksSize) {
        var i, k,
            size = v.length,
            tempArray = [];

        for (i = 0, k = 0; k < size; k += chunksSize, i++) {
            tempArray[i] = v.slice(k, k + chunksSize);
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
        return Number(string);
    }

    function numberToString(n) {
        return '' + n;
    }

    function prefix(num, length) {
        var string =  "000000" + num;
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

    function isNumber(value) {
        var type = typeof value;
        return type === 'number' || (type === 'object'
            && Object.prototype.toString.call(value) === "[object Number]");
    }

    function isString(value) {
        var type = typeof value;
        return type === 'string' || (typeof value === 'object'
            && Object.prototype.toString.call(value) === "[object String]");
    }

    /**
     * Try to use the native isArray function if available
     */
    var isArray = Array.isArray || function (value) {
        return typeof value === 'object'
            && Object.prototype.toString.call(value) === "[object Array]";
    };

    // Miscellaneous

    function test(fn, times, name) {
        times = times !== undefined ? times : 1;
        name = name !== undefined ? name : "";

        var start = Date.now();

        for (var i = 0; i < times; i++) {
            fn(i);
        }
        console.log("Test " + name + " finished in " + (Date.now() - start));
    }

    /**
     *
     * @param val {Number|String|Array}
     * @param min {Number}
     * @param max {Number}
     * @returns {boolean}
     */
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
}());