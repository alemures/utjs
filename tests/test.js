var isNode = false;

if (typeof module !== 'undefined' && module.exports) {
    isNode = true;
}

if(isNode) {
    var ut = require('../lib/ut');
} else {
    // ut is accessible in the browser through window.ut
}


var length = 10;
function stringGenerator() {
    return ut.randomString(ut.randomNumber(4, 25));
}
function numberGenerator() {
    return ut.randomNumber(1, 1000000);
}


// Tests

var times = 1;
var printResult = true;

var date1 = new Date();
ut.test(function() {
    if(printResult) {
        console.log(ut.dateToMysql(date1));
    } else {
        ut.dateToMysql(date1);
    }
}, times, 'dateToMysql()');

var date2 = new Date();
ut.test(function() {
    if(printResult) {
        console.log(ut.dateToString(date2));
    } else {
        ut.dateToString(date2);
    }
},times, 'dateToString()');

var v0 = ut.randomArray(length, numberGenerator);
var chunkSize = 5;
ut.test(function(){
    if(printResult) {
        console.log(ut.arrayChunk(v0, chunkSize));
    } else {
        ut.arrayChunk(v0, chunkSize);
    }
},times, 'arrayChunk()');

var v1 = ut.randomArray(length, numberGenerator);
ut.test(function(){
    if(printResult) {
        ut.sort(v1);
        console.log(v1);
    } else {
        ut.sort(v1);
    }
},times, 'sort()');

var v2 = ut.randomArray(length, numberGenerator);
var v3 = ut.randomArray(length, numberGenerator);
ut.test(function(){
    if(printResult) {
        ut.concatArrays(v2, v3);
        console.log(v2);
    } else {
        ut.concatArrays(v2, v3);
    }
},times, 'concatArrays()');

var v4 = ut.randomArray(length, numberGenerator);
ut.test(function(){
    if(printResult) {
        console.log(ut.copyArray(v4));
    } else {
        ut.copyArray(v4);
    }
},times, 'copyArray()');

var v5 = ut.randomArray(length, numberGenerator);
ut.test(function(){
    if(printResult) {
        ut.clearArray(v5)
        console.log(v5);
    } else {
        ut.clearArray(v5)
    }

},times, 'clearArray()');

function generator() {
    return ut.randomNumber(1, 100);
}
ut.test(function(){
    if(printResult) {
        console.log(ut.randomArray(length, generator));
    } else {
        ut.randomArray(length, generator)
    }

},times, 'randomArray()');


ut.test(function(){
    if(printResult) {
        (function(a,b,c){
            var v = ut.argumentsToArray(arguments);
            console.log('v[' + v + '], length = ' + v.length);
        }(1,2,3));
    } else {
        (function(a,b,c){
            var v = ut.argumentsToArray(arguments);
        }(1,2,3));
    }
},times, 'argumentsToArray()');

var stringLength = 100;
ut.test(function(){
    if(printResult) {
        console.log(ut.randomString(stringLength));
    } else {
        ut.randomString(stringLength);
    }
},times, 'randomString()');

var randomString = ut.numberToString(ut.randomNumber(100, 1000000) / 2);
ut.test(function(){
    if(printResult) {
        console.log(ut.stringToNumber(randomString));
    } else {
        ut.stringToNumber(randomString);
    }
},times, 'stringToNumber()');

var randomNumber = ut.randomNumber(1, 1000);
var finalLength = 5;
ut.test(function(){
    if(printResult) {
        console.log(ut.paddingLeft(randomNumber, '-', finalLength));
    } else {
        ut.paddingLeft(randomNumber, '-', finalLength);
    }
},times, 'paddingLeft()');

var randomNumber2 = ut.randomNumber(100, 1000000);
ut.test(function(){
    if(printResult) {
        console.log(ut.numberToString(randomNumber2));
    } else {
        ut.numberToString(randomNumber2);
    }
},times, 'numberToString()');

var min = 25, max = 125;
ut.test(function(){
    if(printResult) {
        console.log(ut.randomNumber(min, max));
    } else {
        ut.randomNumber(min, max);
    }
},times, 'randomNumber()');

var n1 = 5, n2 = 1, n3 = -1;
ut.test(function(){
    if(printResult) {
        console.log('# All numbers ', n1, n2, n3);
        console.log(ut.getMiddleNumber(n1, n2, n3));
    } else {
        ut.getMiddleNumber(n1, n2, n3);
    }
},times, 'getMiddleNumber()');

ut.test(function(){
    if(printResult) {
        console.log(ut.randomObject([5,5,5]));
    } else {
        ut.randomObject(5,5,5);
    }
},times, 'randomObject()');

var randomObject = ut.randomObject([50]);
ut.test(function(){
    if(printResult) {
        console.log(ut.objectChunk(randomObject, 10));
    } else {
        ut.objectChunk(randomObject, 10);
    }
},times, 'objectChunk()');

var object1 = {a:1, b: '2', c: false, d: [5,4,2], e: {f:5}};
var object2 = {a:1, b: '2', c: false, d: [5,4,2], e: {f:6}};
ut.test(function(){
    if(printResult) {
        console.log(ut.compareObject(object1, object2));
    } else {
        ut.compareObject(object1, object2);
    }
},times, 'compareObject()');

ut.test(function(){
    if(printResult) {
        console.log(ut.isNumeric('1.23'));
    } else {
        ut.isNumeric('1.23');
    }
},times, 'isNumeric()');

ut.test(function() {
    if(printResult) {
        console.log(ut.isNumber(4.23));
    } else {
        ut.isNumber(4.23);
    }
},times, 'isNumber()');

ut.test(function() {
    if(printResult) {
        console.log(ut.isString('Alejandro'));
    } else {
        ut.isString('Alejandro');
    }
},times, 'isString()');

var v7 = ut.randomArray(length, numberGenerator);
ut.test(function() {
    if(printResult) {
        console.log(ut.isArray(v7));
    } else {
        ut.isArray(v7);
    }
},times, 'isArray()');

ut.test(function() {
    if(printResult) {
        console.log(ut.isObject({}));
    } else {
        ut.isObject({});
    }
},times, 'isObject()');

ut.test(function() {
    if(printResult) {
        console.log(ut.logN(2, 256));
    } else {
        ut.logN(2, 256);
    }
},times, 'logN()');

var v8 = ut.randomArray(length, numberGenerator);
ut.test(function() {
    if(printResult) {
        console.log(ut.inRange(v8, 800, 1200));
    } else {
        ut.inRange(v8, 800, 1200);
    }
},times, 'inRange()');

ut.test(function() {
    ut.logger.debug('hello');
    ut.logger.info({a:2,b:'true'});
    ut.logger.warn('Hello', 2, 'World');
    ut.logger.error(new Error('This is an error'));
},times, 'logger');