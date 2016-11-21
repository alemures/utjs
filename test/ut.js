/* jshint expr: true */

'use strict';

var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;

var ut = require('../lib/ut');

describe('utjs', function () {

  // Date

  describe('dateToMysql()', function () {
    var regex = /\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/;

    it('should match the regex', function () {
      expect(ut.dateToMysql()).to.match(regex);
    });

    it('should match the regex with provided date', function () {
      expect(ut.dateToMysql(new Date())).to.match(regex);
    });
  });

  describe('dateToString()', function () {
    var regex = /\d{2}-\w{3}-\d{2}\s\d{2}:\d{2}:\d{2}/;

    it('should match the regex', function () {
      expect(ut.dateToString()).to.match(regex);
    });

    it('should match the regex with provided date', function () {
      expect(ut.dateToString(new Date())).to.match(regex);
    });
  });

  describe('now()', function () {
    it('should match the regex', function () {
      expect(ut.now()).to.match(/\d{2}-\w{3}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}/);
    });
  });

  describe('cloneDate', function () {
    it('should clone a date object', function () {
      var orig = new Date('2016-01-01');
      var cloned = ut.cloneDate(orig);
      orig.setDate(2);

      expect(cloned).to.be.deep.equal(new Date('2016-01-01'));
    });
  });

  // Array

  describe('arrayChunk()', function () {
    it('should return the correct number of arrays', function () {
      expect(ut.arrayChunk(new Array(0), 2)).to.have.lengthOf(0);
      expect(ut.arrayChunk(new Array(1), 2)).to.have.lengthOf(1);
      expect(ut.arrayChunk(new Array(2), 2)).to.have.lengthOf(1);
      expect(ut.arrayChunk(new Array(3), 2)).to.have.lengthOf(2);
    });
  });

  describe('sort()', function () {
    it('should sort the array', function () {
      var arr = [4, 2, 5, 1];
      ut.sort(arr);
      expect(arr).to.be.deep.equal([1, 2, 4, 5]);
      arr = ['b', 'ttt', 'c', 'bb', 'aa', 'tt'];
      ut.sort(arr, function (a, b) { return a > b ? 1 : b > a ? -1 : 0; });

      expect(arr).to.be.deep.equal(['aa', 'b', 'bb', 'c', 'tt', 'ttt']);
    });

    it('should sort the array of objects', function () {
      var arr = [{ age: 25 }, { age: 22 }, { age: 26 }, { age: 18 }];
      ut.sort(arr, function (a, b) { return a.age - b.age; });

      expect(arr).to.be.deep.equal([{ age: 18 }, { age: 22 }, { age: 25 }, { age: 26 }]);
    });

    it('should sort only the given range in the array', function () {
      var arr = [4, 2, 5, 1];
      ut.sort(arr, 2);
      expect(arr).to.be.deep.equal([4, 2, 1, 5]);
      arr = [4, 2, 5, 1];
      ut.sort(arr, 1, arr.length - 1);
      expect(arr).to.be.deep.equal([4, 1, 2, 5]);
    });
  });

  describe('swap()', function () {
    it('should swap the array indexes', function () {
      var arr = [4, 2, 5, 1];
      ut.swap(arr, 1, 3);
      expect(arr).to.be.deep.equal([4, 1, 5, 2]);
    });
  });

  describe('concatArrays()', function () {
    it('should concat two arrays', function () {
      var arr1 = [1, 2, 3, 4];
      var arr2 = [5, 6, 7, 8];
      ut.concatArrays(arr1, arr2);
      expect(arr1).to.be.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('copyArray()', function () {
    it('should copy the array', function () {
      var arr = [1, 2, 3, 4];
      var copy = ut.copyArray(arr);
      expect(arr).to.not.be.equal(copy);
      expect(arr).to.be.deep.equal(copy);
    });
  });

  describe('clearArray()', function () {
    it('should clear the array', function () {
      var arr = [1, 2, 3, 4];
      ut.clearArray(arr);
      expect(arr).to.have.lengthOf(0);
    });
  });

  describe('randomArray()', function () {
    it('should create a random array of numbers', function () {
      var arr = ut.randomArray(10);
      expect(arr[0]).to.be.a('number');
      expect(arr).to.have.lengthOf(10);
    });

    it('should create a random array of strings', function () {
      var arr = ut.randomArray(10, function () { return ut.randomString(10); });

      expect(arr[0]).to.be.a('string');
      expect(arr).to.have.lengthOf(10);
    });
  });

  describe('intersectSorted()', function () {
    it('should intersect two sorted arrays of numbers', function () {
      var arr1 = [2, 6, 7, 9, 10];
      var arr2 = [5, 7, 8, 10, 12];
      var intersection = ut.intersectSorted(arr1, arr2);
      expect(intersection).to.be.deep.equal([7, 10]);
    });

    it('should intersect two sorted arrays of objects', function () {
      var arr1 = [{ a: 2 }, { a: 6 }, { a: 7 }, { a: 9 }, { a: 10 }];
      var arr2 = [{ a: 5 }, { a: 7 }, { a: 8 }, { a: 10 }, { a: 12 }];

      var intersection = ut.intersectSorted(arr1, arr2, function (a, b) { return a.a - b.a; });

      expect(intersection).to.be.deep.equal([{ a: 7 }, { a: 10 }]);
    });
  });

  describe('spliceOne()', function () {
    it('should remove one element', function () {
      var arr = [1, 2, 3, 4];
      ut.spliceOne(arr, 2);
      expect(arr).to.be.deep.equal([1, 2, 4]);
    });
  });

  describe('binaryInsert()', function () {
    it('should insert 10 numbers in a sorted array', function () {
      var arr = ut.randomArray(100);
      var copy = ut.copyArray(arr);
      var toInsert = ut.randomArray(10);

      ut.sort(arr);
      ut.concatArrays(copy, toInsert);
      ut.sort(copy);

      for (var i = 0; i < 10; i++) {
        ut.binaryInsert(toInsert[i], arr);
      }

      expect(arr).to.have.lengthOf(110);
      expect(arr).to.be.deep.equal(copy);
    });

    it('should insert 10 numbers in a sorted array rejecting duplicates', function () {
      var arr = [1, 2, 3, 4, 5];
      var toInsert = [0, 2, 4, 6];

      for (var i = 0; i < toInsert.length; i++) {
        ut.binaryInsert(toInsert[i], arr, true);
      }

      expect(arr).to.be.deep.equal([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should insert 1 object in a sorted array of objects', function () {
      var arr = [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 9 }];
      ut.binaryInsert({ a: 8 }, arr, function (a, b) { return a.a - b.a; });

      expect(arr).to.be.deep.equal([{ a: 1 }, { a: 4 }, { a: 5 }, { a: 8 }, { a: 9 }]);
    });
  });

  describe('binarySearch()', function () {
    it('should find an item in a sorted array', function () {
      var arr = ut.randomArray(100);
      var item = arr[0];
      ut.sort(arr);

      expect(ut.binarySearch(item, arr)).to.be.above(-1);
    });

    it('shouldn\'t find a missing item in a sorted array', function () {
      var arr = ut.randomArray(100);
      var missingItem = 1000;
      ut.sort(arr);

      expect(ut.binarySearch(missingItem, arr)).to.be.equal(-1);
    });

    it('should find an object in a sorted array of objects', function () {
      var arr = [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 9 }];
      expect(ut.binarySearch({ a: 5 }, arr, function (a, b) { return a.a - b.a; })).to.be.above(-1);
    });

    it('should work using a default numeric comparator if omitted', function () {
      var arr = ut.randomArray(100);
      var item = arr[0];
      ut.sort(arr);

      expect(ut.binarySearch(item, arr, 0, arr.length - 1)).to.be.above(-1);
    });
  });

  describe('randomArrayItem()', function () {
    it('should return a random value within the array', function () {
      var array = [1, 5, 66, 100];
      expect(ut.randomArrayItem(array)).to.be.oneOf(array);
    });

    it('should return a random value within the array within the sliced bounds', function () {
      var array = [1, 5, 66, 100, 101];
      expect(ut.randomArrayItem(array, 2, array.length)).to.be.oneOf(array.slice(2, array.length));
    });
  });

  // Arguments

  describe('argumentsToArray()', function () {
    it('should return an array', function () {
      test(1, 2, 3);
      function test() {
        expect(ut.argumentsToArray(arguments)).to.be.deep.equal([1, 2, 3]);
      }
    });
  });

  // String

  describe('randomString()', function () {
    it('should return a random case sensitive alphanumeric string', function () {
      expect(ut.randomString(10)).to.match(/[a-zA-Z0-9]{10}/);
    });

    it('should return a random case insensitive alphanumeric string', function () {
      expect(ut.randomString(10, true)).to.match(/[a-z0-9]{10}/);
    });
  });

  describe('stringToNumber()', function () {
    it('should return a number', function () {
      expect(ut.stringToNumber('3.14')).to.be.equal(3.14);
    });

    it('should return a number', function () {
      expect(ut.stringToNumber('not a number')).to.be.NaN;
    });
  });

  describe('paddingLeft()', function () {
    it('should return a string with a left padding', function () {
      expect(ut.paddingLeft('TITLE', '=', '8')).to.be.equal('===TITLE');
    });
  });

  describe('paddingRight()', function () {
    it('should return a string with a right padding', function () {
      expect(ut.paddingRight('TITLE', '=', '8')).to.be.equal('TITLE===');
    });
  });

  describe('paddingBoth()', function () {
    it('should return a string with a padding in both sides', function () {
      expect(ut.paddingBoth('TITLE', '=', '11')).to.be.equal('===TITLE===');
    });
  });

  describe('repeat()', function () {
    it('should return a string repeated 3 times', function () {
      expect(ut.repeat('asd', 3)).to.be.equal('asdasdasd');
    });
  });

  describe('replaceAll()', function () {
    it('should replace all ocurrences of + by -', function () {
      expect(ut.replaceAll('15 + 5 + 5 = 5', '+', '-')).to.be.equal('15 - 5 - 5 = 5');
    });

    it('should replace all ocurrences of a ignoring the case by *', function () {
      expect(ut.replaceAll(' = aaAAaa = ', 'a', 'b', true)).to.be.equal(' = bbbbbb = ');
    });
  });

  describe('startsWith()', function () {
    it('should return true if string starts by The', function () {
      expect(ut.startsWith('The car', 'The')).to.be.true;
    });
  });

  describe('endsWith()', function () {
    it('should return true if string ends by the', function () {
      expect(ut.endsWith('Car the', 'the')).to.be.true;
    });
  });

  describe('escapeRegExp()', function () {
    it('should return a escaped regex expression string', function () {
      expect(ut.escapeRegExp('^[a-z]+$')).to.be.equal('\\^\\[a\\-z\\]\\+\\$');
    });
  });

  // Number

  describe('getMiddleNumber()', function () {
    it('should be the middle number', function () {
      expect(ut.getMiddleNumber(44, -55, 25)).to.be.equal(25);
    });
  });

  describe('numDigits()', function () {
    it('should get the number of digits of an integer', function () {
      expect(ut.numDigits(50000)).to.be.equal(5);
    });

    it('should get the number of digits of an integer in a different base', function () {
      expect(ut.numDigits(50000, 8)).to.be.equal(6);
    });
  });

  describe('isInteger()', function () {
    it('should return true for valid integers', function () {
      expect(ut.isInteger(25)).to.be.true;
    });

    it('should return false for decimal numbers', function () {
      expect(ut.isInteger(25.02)).to.be.false;
    });
  });

  describe('isNaN()', function () {
    it('should return true for NaN values', function () {
      expect(ut.isNaN(NaN)).to.be.true;
      expect(ut.isNaNOrInfinity(ut.stringToNumber('a'))).to.be.true;
    });
  });

  describe('isNaNOrInfinity()', function () {
    it('should return true for NaN or undefined values', function () {
      expect(ut.isNaNOrInfinity(NaN)).to.be.true;
      expect(ut.isNaNOrInfinity(undefined)).to.be.true;
      expect(ut.isNaNOrInfinity(ut.stringToNumber('a'))).to.be.true;
    });
  });

  describe('truncateNumber()', function () {
    it('should truncate the number', function () {
      expect(ut.truncateNumber(3.14)).to.be.equal(3);
      expect(ut.truncateNumber(3000000000.14)).to.be.equal(3000000000);
      expect(ut.truncateNumber(-3.14)).to.be.equal(-3);
      expect(ut.truncateNumber(-3000000000.14)).to.be.equal(-3000000000);
    });
  });

  describe('mergeObjects()', function () {
    it('should merge two objects replacing duplicates keys', function () {
      var dest = { a: 1, b: '2', c: false };
      var source = { c: true, d: null };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({ a: 1, b: '2', c: true, d: null });
    });

    it('should merge two objects with arrays', function () {
      var dest = { a: [2, 4, 6, 8] };
      var source = { a: [1, 3, 5] };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({ a: [1, 3, 5, 8] });
    });

    it('should merge two objects with inner objects', function () {
      var dest = { a: { b: { d: 'Hello', f: 'Bye' } } };
      var source = { a: { b: { d: [{ e: 15 }], f: { g: 'Hello' } } } };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({ a: { b: { d: [{ e: 15 }], f: { g: 'Hello' } } } });
    });

    it('should merge two objects with dates', function () {
      var dest = { a: 'a', b: new Date('2015-01-01') };
      var source = { a: 'a', b: new Date('2016-06-06'), c: false };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({ a: 'a', b: new Date('2016-06-06'), c: false });
    });
  });

  describe('updateObject()', function () {
    it('should update a number in an inner object', function () {
      var dest = { a: { b: 0 } };
      ut.updateObject(dest, 1, 'a.b');
      expect(dest.a.b).to.be.equals(1);
    });

    it('should update a full array', function () {
      var dest = { a: { b: [1, 2, 3] } };
      ut.updateObject(dest, [4, 5], 'a.b');
      expect(dest.a.b).to.be.deep.equal([4, 5]);
    });

    it('should update an item array', function () {
      var dest = { a: { b: [1, 2, 3] } };
      ut.updateObject(dest, 25, 'a.b[1]');
      expect(dest.a.b).to.be.deep.equal([1, 25, 3]);
    });
  });

  describe('randomObject()', function () {
    it('should return a random object using default generators', function () {
      var rand = ut.randomObject([5, 5]);
      var keys = Object.keys(rand);
      expect(rand).to.be.an('object');
      expect(keys.length).to.be.equal(5);
      expect(Object.keys(rand[keys[0]]).length).to.be.equal(5);
    });
  });

  describe('objectChunk()', function () {
    it('should return an array with the chunked object', function () {
      var object = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 };
      var length = Object.keys(object).length;

      for (var i = 1; i <= length; i++) {
        var chunks = ut.objectChunk(object, i);
        expect(chunks).to.be.an('array');
        expect(chunks).to.have.lengthOf(Math.ceil(Object.keys(object).length / i));
      }
    });
  });

  describe('cloneObject()', function () {
    it('should return a deeply cloned object', function () {
      var orig = { a: 1, b: 2, c: { d: 3, e: [4] } };
      var clone = ut.cloneObject(orig);
      expect(clone).to.not.be.equal(orig);
      expect(clone).to.be.deep.equal(orig);
    });

    it('should return a deeply cloned array', function () {
      var orig = [{ d: 3, e: [4] }, { d: 5, e: [6] }];
      var clone = ut.cloneObject(orig);
      expect(clone).to.not.be.equal(orig);
      expect(clone).to.be.deep.equal(orig);
    });
  });

  describe('get()', function () {
    it('should return the value in the path', function () {
      var object = { a: 1, b: 2, c: { d: 3, e: [4] } };
      expect(ut.get(object, '')).to.be.equal(object);
      expect(ut.get(object, 'c')).to.be.deep.equal({ d: 3, e: [4] });
      expect(ut.get(object, 'c.d')).to.be.equal(3);
      expect(ut.get(object, 'c.e[0]')).to.be.equal(4);
    });

    it('should return the default value', function () {
      var object = { a: 1, b: 2, c: { d: 3, e: [4] } };
      expect(ut.get(object, 'a.d')).to.be.undefined;
      expect(ut.get(object, 'a.f', null)).to.be.null;
      expect(ut.get(object, 'a.h', false)).to.be.equal(false);
    });
  });

  describe('equals()', function () {
    it('should return true validating cloned objects', function () {
      var o1 = { };
      var o2 = { a: 1, b: '2', c: true, d: null, e: undefined, f: NaN };
      var o3 = { a: { b: [{ c: 1 }, { c: 2 }] } };

      expect(ut.equals(o1, ut.cloneObject(o1))).to.be.true;
      expect(ut.equals(o2, ut.cloneObject(o2))).to.be.true;
      expect(ut.equals(o3, ut.cloneObject(o3))).to.be.true;
    });

    it('should return true validating primitives and references', function () {
      var number = 1;
      var string = '2';
      var date = new Date();
      var regex = new RegExp('a');

      expect(ut.equals(number, 1)).to.be.true;
      expect(ut.equals(string, '2')).to.be.true;
      expect(ut.equals(date, date)).to.be.true;
      expect(ut.equals(regex, regex)).to.be.true;
    });

    it('should return false validating different objects', function () {
      expect(ut.equals({ }, { a: 1 })).to.be.false;
      expect(ut.equals({ a: 1, b: '2' }, { a: 1, b: '3' })).to.be.false;
      expect(ut.equals({ a: { b: [{ c: 1 }, { c: 2 }] } },
                       { a: { b: [{ c: 3 }, { c: 2 }] } })).to.be.false;
      expect(ut.equals(new Date(), new Date())).to.be.false;
      expect(ut.equals([1, 2, 3], [1, 2, 3, 4])).to.be.false;
    });
  });

  describe('groupBy', function () {
    var people = [{ name: 'alex', age: 24, lang: 'spanish', country: 'spain' },
        { name: 'fran', age: 23, lang: 'english', country: 'france' },
        { name: 'alex', age: 30, lang: 'english', country: 'spain' },
        { name: 'james', age: 35, country: 'france' }];

    it('should group the objects by a single key', function () {
      var grouped = ut.groupBy(people, 'country');
      expect(grouped.spain).to.have.lengthOf(2);
      expect(grouped.france).to.have.lengthOf(2);
    });

    it('should group the objects with a custom iteratee', function () {
      var grouped = ut.groupBy(people, 'country', function (person) { return person.age; });

      expect(grouped.spain).to.have.be.deep.equal([24, 30]);
      expect(grouped.france).to.have.be.deep.equal([23, 35]);
    });

    it('should group the objects with multiple keys', function () {
      var grouped = ut.groupBy(people, ['country', 'lang']);
      expect(grouped.spain.spanish).to.have.lengthOf(1);
      expect(grouped.spain.english).to.have.lengthOf(1);
      expect(grouped.france.english).to.have.lengthOf(1);
    });
  });

  describe('objectLength', function () {
    it('should return the number of keys of the given object', function () {
      expect(ut.objectLength({})).to.be.equal(0);
      expect(ut.objectLength({ a: 1, b: 2, c: 3, d: 4, e: 5 })).to.be.equal(5);
    });
  });

  describe('randomBoolean', function () {
    it('should return a random boolean with chances of 50%', function () {
      expect(ut.randomBoolean()).to.be.a('boolean');
    });
  });

  describe('isNumeric', function () {
    it('should return true for valid numbers even if they are in strings', function () {
      expect(ut.isNumeric(1)).to.be.true;
      expect(ut.isNumeric(1e+1)).to.be.true;
      expect(ut.isNumeric(1.25)).to.be.true;
      /* jshint -W053 */
      expect(ut.isNumeric(new Number(25))).to.be.true;
      expect(ut.isNumeric('1')).to.be.true;
      expect(ut.isNumeric('1e+1')).to.be.true;
      expect(ut.isNumeric('1.25')).to.be.true;
      expect(ut.isNumeric(Infinity)).to.be.false;
      expect(ut.isNumeric(NaN)).to.be.false;
    });
  });

  describe('isNumber', function () {
    it('should return true for valid numbers', function () {
      expect(ut.isNumber(1)).to.be.true;
      expect(ut.isNumber(1e+1)).to.be.true;
      expect(ut.isNumber(1.25)).to.be.true;
      /* jshint -W053 */
      expect(ut.isNumber(new Number(25))).to.be.true;
    });
  });

  describe('isString', function () {
    it('should return true for valid strings', function () {
      expect(ut.isString('')).to.be.true;
      expect(ut.isString('Hello')).to.be.true;
      /* jshint -W053 */
      expect(ut.isString(new String('Hello, World!'))).to.be.true;
    });
  });

  describe('isArray', function () {
    it('should return true for valid arrays', function () {
      expect(ut.isArray([])).to.be.true;
      expect(ut.isArray([1, 2, 3])).to.be.true;
    });
  });

  describe('isObject', function () {
    it('should return true for valid objects', function () {
      expect(ut.isObject({})).to.be.true;
      expect(ut.isObject([])).to.be.true;
      expect(ut.isObject(new Date())).to.be.true;
      expect(ut.isObject(null)).to.be.false;
    });
  });

  describe('isPlainObject', function () {
    it('should return true for valid plain objects', function () {
      expect(ut.isPlainObject({})).to.be.true;
      expect(ut.isPlainObject([])).to.be.false;
      expect(ut.isPlainObject(new Date())).to.be.false;
      expect(ut.isPlainObject(null)).to.be.false;
    });
  });

  describe('isBoolean', function () {
    it('should return true for valid booleans', function () {
      expect(ut.isBoolean(true)).to.be.true;
      /* jshint -W053 */
      expect(ut.isBoolean(new Boolean(false))).to.be.true;
    });
  });

  describe('isFunction', function () {
    it('should return true for valid functions', function () {
      expect(ut.isFunction(function () {})).to.be.true;
      /* jshint evil: true */
      expect(ut.isFunction(new Function())).to.be.true;
    });
  });

  describe('isRegExp', function () {
    it('should return true for valid RegExp objects', function () {
      expect(ut.isRegExp(/a/)).to.be.true;
      expect(ut.isRegExp(new RegExp('a'))).to.be.true;
    });
  });

  describe('isDate', function () {
    it('should return true for valid Date objects', function () {
      expect(ut.isDate(new Date())).to.be.true;
    });
  });

  describe('isDateString', function () {
    it('should return true for valid date strings', function () {
      expect(ut.isDateString('2016-01-01')).to.be.true;
      expect(ut.isDateString('2016/01/01')).to.be.true;
      expect(ut.isDateString('')).to.be.false;
      expect(ut.isDateString(1)).to.be.false;
    });
  });

  describe('isValidNumber', function () {
    it('should return true for valid numbers', function () {
      expect(ut.isValidNumber(1.25)).to.be.true;
      expect(ut.isValidNumber(Infinity)).to.be.false;
      expect(ut.isValidNumber(NaN)).to.be.false;
    });
  });

  describe('logN', function () {
    it('should return the log n value', function () {
      expect(ut.logN(10, 25)).to.be.closeTo(Math.log10(25), 0.0000000000000005);
      expect(ut.logN(Math.E, 25)).to.be.closeTo(Math.log(25), 0.0000000000000005);
      expect(ut.logN(2, 1024)).to.be.equal(10);
    });
  });

  describe('inRange', function () {
    it('should return true if the value is within the provided range', function () {
      expect(ut.inRange(3, 1, 5)).to.be.true;
      expect(ut.inRange('abc', 1, 5)).to.be.true;
      expect(ut.inRange([1, 2, 3], 1, 5)).to.be.true;
      expect(ut.inRange({ a: 1, b: 2, c: 3 }, 1, 5)).to.be.true;
      expect(ut.inRange(new RegExp())).to.be.false;
    });
  });

  describe('logger.setLogLevel', function () {
    it('should set the log level', function () {
      ut.logger.setLogLevel(ut.logger.WARN);
      expect(ut.logger._logLevel).to.be.equal(ut.logger.WARN);
    });
  });

  describe('logger.setUsingDate', function () {
    it('should enable or disable the date in logs', function () {
      ut.logger.setUsingDate(true);
      expect(ut.logger._usingDate).to.be.equal(true);
    });
  });

  describe('logger.setPrettify', function () {
    it('should enable or disable the prettifying in logs', function () {
      ut.logger.setPrettify(true);
      expect(ut.logger._prettify).to.be.equal(true);
    });
  });
});
