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

  describe('getMiddleNumber()', function () {
    it('should be the middle number', function () {
      expect(ut.getMiddleNumber(44, -55, 25)).to.be.equal(25);
    });
  });
});
