'use strict';

var ut = require('./ut');

var TIMES = 100000;
var obj = {
	a: {
		b: {
			c: [
				[1,2,3],
				{ d: 'hello' }
			]
		}
	}
};
var path = 'a.b.c[1].d';
// var path = ['a', 'b', 'c', '1', 'd'];


// console.log(ut.get(obj, path));
// console.log(ut.get2(obj, path));

console.time('test');
for (var i = 0; i < TIMES; i++) {
	// ut.get(obj, path);
	ut.get2(obj, path);

}
console.timeEnd('test');
