'use strict';

var describe = require('mocha').describe;
var it = require('mocha').it;
var expect = require('chai').expect;

var ut = require('../lib/ut');

describe('utjs', function () {

  // Date

  describe('dateToMysql()', function () {
    it('should match the regex', function () {
      expect(ut.dateToMysql(new Date())).to
          .match(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/);
    });
  });

  describe('dateToString()', function () {
    it('should match the regex', function () {
      expect(ut.dateToString(new Date())).to
          .match(/\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('now()', function () {
    it('should match the regex', function () {
      expect(ut.now()).to
          .match(/\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}\.\d{3}/);
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
      ut.sort(arr);
      expect(arr).to.be.eql(['aa', 'b', 'bb', 'c', 'tt', 'ttt']);
    });

    it('should sort the array of objects', function () {
      var arr = [{ age: 25 }, { age: 22 }, { age: 26 }, { age: 18 }];
      ut.sort(arr, function (a, b) { return a.age - b.age; });

      expect(arr).to.be.eql([{ age: 18 }, { age: 22 }, { age: 25 }, { age: 26 }]);
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
      var arr = ut.removeDuplicates(ut.randomArray(100));
      var copy = ut.copyArray(arr);
      var toInsert = ut.randomArray(10);

      ut.sort(arr);
      ut.concatArrays(copy, toInsert);
      copy = ut.removeDuplicates(copy);
      ut.sort(copy);

      for (var i = 0; i < 10; i++) {
        ut.binaryInsert(toInsert[i], arr, true);
      }

      expect(arr).to.be.eql(copy);
    });
  });

  describe('binarySearch()', function () {
    it('should find a item in a sorted array', function () {
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
  });

  describe('removeDuplicates()', function () {
    it('should return a new array without duplicated values', function () {
      var arr = [1, 2, 5, 1, 6, 7, 1, 5];
      expect(ut.removeDuplicates(arr)).to.have.eql([1, 2, 5, 6, 7]);
    });
  });

  // Number

  describe('getMiddleNumber()', function () {
    it('should be the middle number', function () {
      expect(ut.getMiddleNumber(44, -55, 25)).to.be.equal(25);
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
