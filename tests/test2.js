var ut = require("../lib/ut");

var arr = ut.randomArray(1000000);
ut.test(function() {
    ut.sort(arr);
}, 1);