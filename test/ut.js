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
      expect(arr).to.be.eql([1, 2, 4, 5]);
      arr = ['b', 'ttt', 'c', 'bb', 'aa', 'tt'];
      ut.sort(arr, function (a, b) { return a > b ? 1 : b > a ? -1 : 0; });

      expect(arr).to.be.eql(['aa', 'b', 'bb', 'c', 'tt', 'ttt']);
    });

    it('should sort the array of objects', function () {
      var arr = [{ age: 25 }, { age: 22 }, { age: 26 }, { age: 18 }];
      ut.sort(arr, function (a, b) { return a.age - b.age; });

      expect(arr).to.be.eql([{ age: 18 }, { age: 22 }, { age: 25 }, { age: 26 }]);
    });

    it('should sort only the given range in the array', function () {
      var arr = [4, 2, 5, 1];
      ut.sort(arr, 2);
      expect(arr).to.be.eql([4, 2, 1, 5]);
      arr = [4, 2, 5, 1];
      ut.sort(arr, 1, arr.length - 1);
      expect(arr).to.be.eql([4, 1, 2, 5]);
    });
  });

  describe('swap()', function () {
    it('should swap the array indexes', function () {
      var arr = [4, 2, 5, 1];
      ut.swap(arr, 1, 3);
      expect(arr).to.be.eql([4, 1, 5, 2]);
    });
  });

  describe('concatArrays()', function () {
    it('should concat two arrays', function () {
      var arr1 = [1, 2, 3, 4];
      var arr2 = [5, 6, 7, 8];
      ut.concatArrays(arr1, arr2);
      expect(arr1).to.be.eql([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('copyArray()', function () {
    it('should copy the array', function () {
      var arr = [1, 2, 3, 4];
      var copy = ut.copyArray(arr);
      expect(arr).to.not.be.equal(copy);
      expect(arr).to.be.eql(copy);
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
      expect(intersection).to.be.eql([7, 10]);
    });

    it('should intersect two sorted arrays of objects', function () {
      var arr1 = [{ a: 2 }, { a: 6 }, { a: 7 }, { a: 9 }, { a: 10 }];
      var arr2 = [{ a: 5 }, { a: 7 }, { a: 8 }, { a: 10 }, { a: 12 }];

      var intersection = ut.intersectSorted(arr1, arr2, function (a, b) { return a.a - b.a; });

      expect(intersection).to.be.eql([{ a: 7 }, { a: 10 }]);
    });
  });

  describe('spliceOne()', function () {
    it('should remove one element', function () {
      var arr = [1, 2, 3, 4];
      ut.spliceOne(arr, 2);
      expect(arr).to.be.eql([1, 2, 4]);
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
      expect(arr).to.be.eql(copy);
    });

    it('should insert 10 numbers in a sorted array rejecting duplicates', function () {
      var arr = [1, 2, 3, 4, 5];
      var toInsert = [0, 2, 4, 6];

      for (var i = 0; i < toInsert.length; i++) {
        ut.binaryInsert(toInsert[i], arr, true);
      }

      expect(arr).to.be.eql([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should insert 1 object in a sorted array of objects', function () {
      var arr = [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 9 }];
      ut.binaryInsert({ a: 8 }, arr, function (a, b) { return a.a - b.a; });

      expect(arr).to.be.eql([{ a: 1 }, { a: 4 }, { a: 5 }, { a: 8 }, { a: 9 }]);
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

  // Arguments

  describe('argumentsToArray()', function () {
    it('should return an array', function () {
      test(1, 2, 3);
      function test() {
        expect(ut.argumentsToArray(arguments)).to.be.eql([1, 2, 3]);
      }
    });
  });

  // String

  describe('randomString()', function () {
    it('should return a random string', function () {
      expect(ut.randomString(10)).to.match(/[a-z]{10}/);
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

  describe('mergeObjects()', function () {
    it('should merge two objects replacing duplicates keys', function () {
      var dest = { a: 1, b: '2', c: false };
      var source = { c: true, d: null };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.eql({ a: 1, b: '2', c: true, d: null });
    });

    it('should merge two objects with arrays', function () {
      var dest = { a: [2, 4, 6, 8] };
      var source = { a: [1, 3, 5] };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.eql({ a: [1, 3, 5, 8] });
    });

    it('should merge two objects with inner objects', function () {
      var dest = { a: { b: { d: 'Hello', f: 'Bye' } } };
      var source = { a: { b: { d: [{ e: 15 }], f: { g: 'Hello' } } } };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.eql({ a: { b: { d: [{ e: 15 }], f: { g: 'Hello' } } } });
    });

    it('should merge two objects with dates', function () {
      var dest = { a: 'a', b: new Date('2015-01-01') };
      var source = { a: 'a', b: new Date('2016-06-06'), c: false };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.eql({ a: 'a', b: new Date('2016-06-06'), c: false });
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
});
