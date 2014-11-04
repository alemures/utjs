var ut = require("../lib/ut");

var lengthArr = 2000000;
var times = 1000000;
var n = "23";
ut.test(function(){
    ut.stringToNumber(n);
},times)