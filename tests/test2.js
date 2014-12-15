var ut = require("../lib/ut");

var object1 = {
    a: [1,2,3],
    b: { c: 4, d: [5,6]},
    e: 'Hello, World!',
    f: [true, false],
    g: { h: 2.332, i: 6e-4 }
};

var object2 = {
    a: [1,2,3],
    b: { c: 4, d: [5,6]},
    e: 'Hello, World!',
    f: [true, false],
    g: { h: 2.332, i: 6e-4 }
};

ut.test(function() {
    console.log(ut.compareObject(object1, object2, true))
}, 1, 'CompareObject');
