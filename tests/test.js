var isNode = false;

if (typeof module !== 'undefined' && module.exports) {
    isNode = true;
}

if(isNode) {
    var ut = require("../lib/ut");
} else {
    // ut is accessible in the browser through window.ut
}

var lengthArr = 1000000;
var times = 1;
var printResult = false;

var date1 = new Date();
var date2 = new Date();

var v0 = randomArr(lengthArr, false);
var v1 = randomArr(lengthArr, false);
var v2 = randomArr(lengthArr, false), v3 = randomArr(lengthArr, false);
var v4 = randomArr(lengthArr, false);
var v5 = randomArr(lengthArr, false);
var v6 = randomArr(lengthArr, true);
var v7 = randomArr(lengthArr, false);
var v8 = randomArr(lengthArr, false);



function randomArr(length, strings) {
    strings = strings !== undefined ? strings : false;
    var v = [], i;

    for(i = 0; i < length; i++) {
        if(strings) {
            v.push(ut.randomString(ut.randomNumber(4, 25)));
        } else {
            v.push(ut.randomNumber(1, 1000000));
        }
    }
    return v;
}

ut.test(function(){
    if(printResult) {
        console.log(ut.dateToMysql(date1));
    } else {
        ut.dateToMysql(date1);
    }
},times, "dateToMysql()");


ut.test(function(){
    if(printResult) {
        console.log(ut.dateToString(date2));
    } else {
        ut.dateToString(date2);
    }
},times, "dateToString()");

ut.test(function(){
    if(printResult) {
        console.log(ut.arrayChunk(v0, ut.randomNumber(1, 15)));
    } else {
        ut.arrayChunk(v0, ut.randomNumber(1, 15));
    }
},times, "arrayChunk()");

ut.test(function(){
    if(printResult) {
        ut.sort(v1);
        console.log(v1);
    } else {
        ut.sort(v1);
    }
},times, "sort()");

ut.test(function(){
    if(printResult) {
        ut.concatArrays(v2, v3);
        console.log(v2);
    } else {
        ut.concatArrays(v2, v3);
    }
},times, "concatArrays()");

ut.test(function(){
    if(printResult) {
        console.log(ut.copyArray(v4));
    } else {
        ut.copyArray(v4);
    }
},times, "copyArray()");

ut.test(function(){
    if(printResult) {
        ut.clearArray(v5)
        console.log(v5);
    } else {
        ut.clearArray(v5)
    }

},times, "clearArray()");

ut.test(function(){
    if(printResult) {
        (function(a,b,c){
            var v = ut.argumentsToArray(arguments);
            console.log("v[" + v + "], length = " + v.length);
        }(1,2,3));
    } else {
        (function(a,b,c){
            var v = ut.argumentsToArray(arguments);
        }(1,2,3));
    }
},times, "argumentsToArray()");

ut.test(function(){
    if(printResult) {
        console.log(ut.randomString(ut.randomNumber(10, 100)));
    } else {
        ut.randomString(ut.randomNumber(10, 100));
    }
},times, "randomString()");

ut.test(function(){
    if(printResult) {
        console.log(ut.stringToNumber(ut.numberToString(ut.randomNumber(100, 1000000))));
    } else {
        ut.stringToNumber(ut.numberToString(ut.randomNumber(100, 1000000)));
    }
},times, "stringToNumber()");

ut.test(function(){
    if(printResult) {
        console.log(ut.numberToString(ut.randomNumber(100, 1000000)));
    } else {
        ut.numberToString(ut.randomNumber(100, 1000000));
    }
},times, "numberToString()");

ut.test(function(){
    if(printResult) {
        console.log(ut.prefix(ut.randomNumber(1, 10000), 5));
    } else {
        ut.prefix(ut.randomNumber(1, 10000), 5);
    }
},times, "prefix()");

ut.test(function(){
    if(printResult) {
        console.log(ut.randomNumber(24, 1120));
    } else {
        ut.randomNumber(24, 1120);
    }
},times, "randomNumber()");

ut.test(function(){
    if(printResult) {
        console.log(ut.getMiddleNumber(ut.randomNumber(100, 1000000), ut.randomNumber(100, 1000000), ut.randomNumber(100, 1000000)));
    } else {
        ut.getMiddleNumber(ut.randomNumber(100, 1000000), ut.randomNumber(100, 1000000), ut.randomNumber(100, 1000000));
    }
},times, "getMiddleNumber()");

ut.test(function(){
    if(printResult) {
        console.log(ut.isNumber(ut.randomNumber(100, 1000000)));
    } else {
        ut.isNumber(ut.randomNumber(100, 1000000));
    }
},times, "isNumber()");

ut.test(function(){
    if(printResult) {
        console.log(ut.isString(ut.randomString(ut.randomNumber(6, 100))));
    } else {
        ut.isString(ut.randomString(ut.randomNumber(6, 100)));
    }
},times, "isString()");

ut.test(function(){
    if(printResult) {
        console.log(ut.isArray(v7));
    } else {
        ut.isArray(v7);
    }
},times, "isArray()");

ut.test(function(){
    if(printResult) {
        console.log(ut.inRange(v8, 800, 1200));
    } else {
        ut.inRange(v8, 800, 1200);
    }
},times, "inRange()");