'use strict';

var describe = require('mocha').describe;
var it = require('mocha').it;
var chai = require('chai');

var ut = require('../lib/ut');

describe('ut', function() {
  describe('getMiddleNumber()', function() {
    it('should be the middle number', function() {
      var a = 44;
      var b = -55;
      var c = 25;
      chai.expect(ut.getMiddleNumber(a, b, c)).to.be.equal(c);
    });
  });
  // TODO...
});
