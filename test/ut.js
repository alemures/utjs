const { expect } = require('chai');

const ut = require('../lib/ut');

describe('utjs', () => {
  // Date

  describe('dateToMysql()', () => {
    const regex = /\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/;

    it('should match the regex', () => {
      expect(ut.dateToMysql()).to.match(regex);
    });

    it('should match the regex with provided date', () => {
      expect(ut.dateToMysql(new Date())).to.match(regex);
    });
  });

  describe('dateToString()', () => {
    const regex = /\d{2}-\w{3}-\d{2}\s\d{2}:\d{2}:\d{2}/;

    it('should match the regex', () => {
      expect(ut.dateToString()).to.match(regex);
    });

    it('should match the regex with provided date', () => {
      expect(ut.dateToString(new Date())).to.match(regex);
    });
  });

  describe('now()', () => {
    it('should match the regex', () => {
      expect(ut.now()).to.match(/\d{2}-\w{3}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}/);
    });
  });

  describe('cloneDate', () => {
    it('should clone a date object', () => {
      const orig = new Date('2016-01-01');
      const cloned = ut.cloneDate(orig);
      orig.setDate(2);

      expect(cloned).to.be.deep.equal(new Date('2016-01-01'));
    });
  });

  // Array

  describe('arrayChunk()', () => {
    it('should return the correct number of arrays', () => {
      expect(ut.arrayChunk(new Array(0), 2)).to.have.lengthOf(0);
      expect(ut.arrayChunk(new Array(1), 2)).to.have.lengthOf(1);
      expect(ut.arrayChunk(new Array(2), 2)).to.have.lengthOf(1);
      expect(ut.arrayChunk(new Array(3), 2)).to.have.lengthOf(2);
    });
  });

  describe('sort()', () => {
    it('should sort the array', () => {
      let numberArray = [4, 2, 5, 1];
      ut.sort(numberArray);
      expect(numberArray).to.be.deep.equal([1, 2, 4, 5]);
      const stringArray = ['b', 'ttt', 'c', 'bb', 'aa', 'tt'];
      ut.sort(stringArray, (a, b) => (a > b ? 1 : b > a ? -1 : 0));
      expect(stringArray).to.be.deep.equal(['aa', 'b', 'bb', 'c', 'tt', 'ttt']);
      const randomArray = ut.randomArray(100);
      const sorted = randomArray.slice().sort((n1, n2) => n1 - n2);
      ut.sort(randomArray);
      expect(randomArray).to.be.deep.equal(sorted);
    });

    it('should sort the array of objects', () => {
      const arr = [{ age: 25 }, { age: 22 }, { age: 26 }, { age: 18 }];
      ut.sort(arr, (a, b) => a.age - b.age);
      expect(arr).to.be.deep.equal([
        { age: 18 },
        { age: 22 },
        { age: 25 },
        { age: 26 },
      ]);
    });

    it('should sort only the given range in the array', () => {
      let arr = [4, 2, 5, 1];
      ut.sort(arr, 2);
      expect(arr).to.be.deep.equal([4, 2, 1, 5]);
      arr = [4, 2, 5, 1];
      ut.sort(arr, 1, arr.length - 1);
      expect(arr).to.be.deep.equal([4, 1, 2, 5]);
    });
  });

  describe('swap()', () => {
    it('should swap the array indexes', () => {
      const arr = [4, 2, 5, 1];
      ut.swap(arr, 1, 3);
      expect(arr).to.be.deep.equal([4, 1, 5, 2]);
    });
  });

  describe('concatArrays()', () => {
    it('should concat two arrays', () => {
      const arr1 = [1, 2, 3, 4];
      const arr2 = [5, 6, 7, 8];
      ut.concatArrays(arr1, arr2);
      expect(arr1).to.be.deep.equal([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });

  describe('copyArray()', () => {
    it('should copy the array', () => {
      const arr = [1, 2, 3, 4];
      const copy = ut.copyArray(arr);
      expect(arr).to.not.be.equal(copy);
      expect(arr).to.be.deep.equal(copy);
    });

    it('should copy the array with ranges', () => {
      const arr = [1, 2, 3, 4];
      const copy = ut.copyArray(arr, 1, 3);
      expect(copy).to.not.be.equal(arr);
      expect(copy).to.be.deep.equal([2, 3]);
    });
  });

  describe('clearArray()', () => {
    it('should clear the array', () => {
      const arr = [1, 2, 3, 4];
      ut.clearArray(arr);
      expect(arr).to.have.lengthOf(0);
    });
  });

  describe('randomArray()', () => {
    it('should create a random array of numbers', () => {
      const arr = ut.randomArray(10);
      expect(arr[0]).to.be.a('number');
      expect(arr).to.have.lengthOf(10);
    });

    it('should create a random array of strings', () => {
      const arr = ut.randomArray(10, () => ut.randomString(10));

      expect(arr[0]).to.be.a('string');
      expect(arr).to.have.lengthOf(10);
    });
  });

  describe('intersectSorted()', () => {
    it('should intersect two sorted arrays of numbers', () => {
      const arr1 = [2, 6, 7, 9, 10];
      const arr2 = [5, 7, 8, 10, 12];
      const intersection = ut.intersectSorted(arr1, arr2);
      expect(intersection).to.be.deep.equal([7, 10]);
    });

    it('should intersect two sorted arrays of objects', () => {
      const arr1 = [{ a: 2 }, { a: 6 }, { a: 7 }, { a: 9 }, { a: 10 }];
      const arr2 = [{ a: 5 }, { a: 7 }, { a: 8 }, { a: 10 }, { a: 12 }];

      const intersection = ut.intersectSorted(arr1, arr2, (a, b) => a.a - b.a);

      expect(intersection).to.be.deep.equal([{ a: 7 }, { a: 10 }]);
    });
  });

  describe('spliceOne()', () => {
    it('should remove one element', () => {
      const arr = [1, 2, 3, 4];
      ut.spliceOne(arr, 2);
      expect(arr).to.be.deep.equal([1, 2, 4]);
      ut.spliceOne(arr, 0);
      expect(arr).to.be.deep.equal([2, 4]);
    });
  });

  describe('binaryInsert()', () => {
    it('should insert 10 numbers in a sorted array', () => {
      const arr = ut.randomArray(100);
      const copy = ut.copyArray(arr);
      const toInsert = ut.randomArray(10);

      ut.sort(arr);
      ut.concatArrays(copy, toInsert);
      ut.sort(copy);

      for (let i = 0; i < 10; i++) {
        ut.binaryInsert(toInsert[i], arr);
      }

      expect(arr).to.have.lengthOf(110);
      expect(arr).to.be.deep.equal(copy);
    });

    it('should insert 10 numbers in a sorted array rejecting duplicates', () => {
      const arr = [1, 2, 3, 4, 5];
      const toInsert = [0, 2, 4, 6];

      for (let i = 0; i < toInsert.length; i++) {
        ut.binaryInsert(toInsert[i], arr, true);
      }

      expect(arr).to.be.deep.equal([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should insert 1 object in a sorted array of objects', () => {
      const arr = [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 9 }];
      ut.binaryInsert({ a: 8 }, arr, (a, b) => a.a - b.a);

      expect(arr).to.be.deep.equal([
        { a: 1 },
        { a: 4 },
        { a: 5 },
        { a: 8 },
        { a: 9 },
      ]);
    });
  });

  describe('binarySearch()', () => {
    it('should find an item in a sorted array', () => {
      const arr = ut.randomArray(100);
      const item = arr[0];
      ut.sort(arr);

      expect(ut.binarySearch(item, arr)).to.be.above(-1);
    });

    it("shouldn't find a missing item in a sorted array", () => {
      const arr = ut.randomArray(100);
      const missingItem = 1000;
      ut.sort(arr);

      expect(ut.binarySearch(missingItem, arr)).to.be.equal(-1);
    });

    it('should find an object in a sorted array of objects', () => {
      const arr = [{ a: 1 }, { a: 4 }, { a: 5 }, { a: 9 }];
      expect(ut.binarySearch({ a: 5 }, arr, (a, b) => a.a - b.a)).to.be.above(
        -1,
      );
    });

    it('should work using a default numeric comparator if omitted', () => {
      const arr = ut.randomArray(100);
      const item = arr[0];
      ut.sort(arr);

      expect(ut.binarySearch(item, arr, 0, arr.length - 1)).to.be.above(-1);
    });
  });

  describe('randomArrayItem()', () => {
    it('should return a random value within the array', () => {
      const array = [1, 5, 66, 100];
      expect(ut.randomArrayItem(array)).to.be.oneOf(array);
    });

    it('should return a random value within the array within the sliced bounds', () => {
      const array = [1, 5, 66, 100, 101];
      expect(ut.randomArrayItem(array, 2, array.length)).to.be.oneOf(
        array.slice(2, array.length),
      );
      expect(ut.randomArrayItem(array, 2, 100)).to.be.oneOf(
        array.slice(2, array.length),
      );
    });
  });

  // Arguments

  describe('argumentsToArray()', () => {
    it('should return an array', () => {
      function test() {
        const args = ut.argumentsToArray(arguments);
        expect(args).to.be.an('array');
        expect(args).to.be.deep.equal([1, 2, 3]);
      }
      test(1, 2, 3);
    });
  });

  // String

  describe('randomString()', () => {
    it('should return a random case sensitive alphanumeric string', () => {
      expect(ut.randomString(10)).to.match(/[a-zA-Z0-9]{10}/);
    });

    it('should return a random case insensitive alphanumeric string', () => {
      expect(ut.randomString(10, true)).to.match(/[a-z0-9]{10}/);
    });
  });

  describe('stringToNumber()', () => {
    it('should return a number', () => {
      expect(ut.stringToNumber('3.14')).to.be.equal(3.14);
    });

    it('should return a number', () => {
      expect(ut.stringToNumber('not a number')).to.be.NaN;
    });
  });

  describe('paddingLeft()', () => {
    it('should return a string with a left padding', () => {
      expect(ut.paddingLeft('TITLE', '=', 8)).to.be.equal('===TITLE');
    });
  });

  describe('paddingRight()', () => {
    it('should return a string with a right padding', () => {
      expect(ut.paddingRight('TITLE', '=', 8)).to.be.equal('TITLE===');
    });
  });

  describe('paddingBoth()', () => {
    it('should return a string with a padding in both sides', () => {
      expect(ut.paddingBoth('TITLE', '=', 11)).to.be.equal('===TITLE===');
    });
  });

  describe('repeat()', () => {
    it('should return a string repeated 3 times', () => {
      expect(ut.repeat('asd', 3)).to.be.equal('asdasdasd');
    });
  });

  describe('replaceAll()', () => {
    it('should replace all ocurrences of + by -', () => {
      expect(ut.replaceAll('15 + 5 + 5 = 5', '+', '-')).to.be.equal(
        '15 - 5 - 5 = 5',
      );
    });

    it('should replace all ocurrences of a ignoring the case by *', () => {
      expect(ut.replaceAll(' = aaAAaa = ', 'a', 'b', true)).to.be.equal(
        ' = bbbbbb = ',
      );
    });
  });

  describe('startsWith()', () => {
    it('should return true if string starts by The', () => {
      expect(ut.startsWith('The car', 'The')).to.be.true;
    });
  });

  describe('endsWith()', () => {
    it('should return true if string ends by the', () => {
      expect(ut.endsWith('Car the', 'the')).to.be.true;
    });
  });

  describe('escapeRegExp()', () => {
    it('should return a escaped regex expression string', () => {
      expect(ut.escapeRegExp('^[a-z]+$')).to.be.equal('\\^\\[a\\-z\\]\\+\\$');
    });
  });

  describe('isDateString', () => {
    it('should return true for valid date strings', () => {
      expect(ut.isDateString('2016-01-01')).to.be.true;
      expect(ut.isDateString('2016/01/01')).to.be.true;
      expect(ut.isDateString('')).to.be.false;
    });
  });

  describe('isHexString', () => {
    it('should return true for valid hexadecimal strings', () => {
      expect(ut.isHexString('426E2C11')).to.be.true;
      expect(ut.isHexString('426e2c11')).to.be.true;
      expect(ut.isHexString('426e2c11x')).to.be.false;
      expect(ut.isHexString('426exc111')).to.be.false;
      expect(ut.isHexString('x426e2c11')).to.be.false;
      expect(ut.isHexString('')).to.be.false;
    });
  });

  describe('stringChunk()', () => {
    it('should return the correct number of strings', () => {
      expect(ut.stringChunk('', 2)).to.have.lengthOf(0);
      expect(ut.stringChunk('A', 2)).to.have.lengthOf(1);
      expect(ut.stringChunk('AA', 2)).to.have.lengthOf(1);
      expect(ut.stringChunk('AAA', 2)).to.have.lengthOf(2);
    });
  });

  describe('splitPath()', () => {
    it('should return an array of tokens from a path', () => {
      expect(ut.splitPath('')).to.deep.equal([]);
      expect(ut.splitPath('name')).to.deep.equal(['name']);
      expect(ut.splitPath('name.subname')).to.deep.equal(['name', 'subname']);
      expect(ut.splitPath('[122].name.subname[11][22]')).to.deep.equal([
        '122',
        'name',
        'subname',
        '11',
        '22',
      ]);
    });
  });

  // Number

  describe('getMiddleNumber()', () => {
    it('should be the middle number', () => {
      expect(ut.getMiddleNumber(44, -55, 25)).to.be.equal(25);
      expect(ut.getMiddleNumber(44, 25, -55)).to.be.equal(25);
      expect(ut.getMiddleNumber(25, -55, 44)).to.be.equal(25);
    });
  });

  describe('numDigits()', () => {
    it('should get the number of digits of an integer', () => {
      expect(ut.numDigits(50000)).to.be.equal(5);
    });

    it('should get the number of digits of an integer in a different base', () => {
      expect(ut.numDigits(50000, 8)).to.be.equal(6);
    });
  });

  describe('isInteger()', () => {
    it('should return true for valid integers', () => {
      expect(ut.isInteger(25)).to.be.true;
    });

    it('should return false for decimal numbers', () => {
      expect(ut.isInteger(25.02)).to.be.false;
    });
  });

  describe('isNaN()', () => {
    it('should return true for NaN values', () => {
      expect(ut.isNaN(NaN)).to.be.true;
      expect(ut.isNaN(Infinity)).to.be.false;
      expect(ut.isNaN(-Infinity)).to.be.false;
      expect(ut.isNaN(1)).to.be.false;
      expect(ut.isNaN(0)).to.be.false;
      expect(ut.isNaN(-1)).to.be.false;
    });
  });

  describe('isNaNOrInfinity()', () => {
    it('should return true for NaN or infinity values', () => {
      expect(ut.isNaNOrInfinity(NaN)).to.be.true;
      expect(ut.isNaNOrInfinity(Infinity)).to.be.true;
      expect(ut.isNaNOrInfinity(-Infinity)).to.be.true;
      expect(ut.isNaNOrInfinity(1)).to.be.false;
      expect(ut.isNaNOrInfinity(0)).to.be.false;
      expect(ut.isNaNOrInfinity(-1)).to.be.false;
    });
  });

  describe('truncateNumber()', () => {
    it('should truncate the number', () => {
      expect(ut.truncateNumber(3.14)).to.be.equal(3);
      expect(ut.truncateNumber(3000000000.14)).to.be.equal(3000000000);
      expect(ut.truncateNumber(-3.14)).to.be.equal(-3);
      expect(ut.truncateNumber(-3000000000.14)).to.be.equal(-3000000000);
    });
  });

  describe('mergeObjects()', () => {
    it('should merge two objects replacing duplicates keys', () => {
      const dest = { a: 1, b: '2', c: false };
      const source = { c: true, d: null };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({
        a: 1,
        b: '2',
        c: true,
        d: null,
      });
    });

    it('should merge two objects with arrays', () => {
      const dest = { a: [2, 4, 6, 8] };
      const source = { a: [1, 3, 5] };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({ a: [1, 3, 5, 8] });
    });

    it('should merge two objects with inner objects', () => {
      const dest = { a: { b: { d: 'Hello', f: 'Bye' } } };
      const source = { a: { b: { d: [{ e: 15 }], f: { g: 'Hello' } } } };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({
        a: { b: { d: [{ e: 15 }], f: { g: 'Hello' } } },
      });
    });

    it('should merge two objects with dates', () => {
      const dest = { a: 'a', b: new Date('2015-01-01') };
      const source = { a: 'a', b: new Date('2016-06-06'), c: false };
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal({
        a: 'a',
        b: new Date('2016-06-06'),
        c: false,
      });
    });

    it('should merge two arrays', () => {
      const dest = [1, 2, 3];
      const source = [9, 2, 8, 3];
      ut.mergeObjects(dest, source);
      expect(dest).to.be.deep.equal([9, 2, 8, 3]);
    });
  });

  describe('updateObject()', () => {
    it('should update a number in an inner object', () => {
      const dest = { a: { b: 0 } };
      ut.updateObject(dest, 1, 'a.b');
      expect(dest.a.b).to.be.equals(1);
    });

    it('should update a full array', () => {
      const dest = { a: { b: [1, 2, 3] } };
      ut.updateObject(dest, [4, 5], 'a.b');
      expect(dest.a.b).to.be.deep.equal([4, 5]);
    });

    it('should update an item array', () => {
      const dest = { a: { b: [1, 2, 3] } };
      ut.updateObject(dest, 25, 'a.b[1]');
      expect(dest.a.b).to.be.deep.equal([1, 25, 3]);
    });

    it('should update a single array', () => {
      const dest = [1, 2, 3];
      ut.updateObject(dest, 25, '[1]');
      expect(dest).to.be.deep.equal([1, 25, 3]);
    });

    it('should update with an array path', () => {
      const dest = { a: { b: [1, 2, 3] } };
      ut.updateObject(dest, 25, ['a', 'b', '1']);
      expect(dest.a.b).to.be.deep.equal([1, 25, 3]);
    });
  });

  describe('randomObject()', () => {
    it('should return a random object using default generators', () => {
      const rand = ut.randomObject([5, 5]);
      const keys = Object.keys(rand);
      expect(rand).to.be.an('object');
      expect(keys.length).to.be.equal(5);
      expect(Object.keys(rand[keys[0]]).length).to.be.equal(5);
    });
  });

  describe('objectChunk()', () => {
    it('should return an array with the chunked object', () => {
      const object = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5,
        f: 6,
        g: 7,
      };
      const { length } = Object.keys(object);

      for (let i = 1; i <= length; i++) {
        const chunks = ut.objectChunk(object, i);
        expect(chunks).to.be.an('array');
        expect(chunks).to.have.lengthOf(
          Math.ceil(Object.keys(object).length / i),
        );
      }
    });
  });

  describe('cloneObject()', () => {
    it('should return a deeply cloned object', () => {
      const orig = { a: 1, b: 2, c: { d: 3, e: [4] } };
      const clone = ut.cloneObject(orig);
      expect(clone).to.not.be.equal(orig);
      expect(clone).to.be.deep.equal(orig);
    });

    it('should return a deeply cloned array', () => {
      const orig = [
        { d: 3, e: [4] },
        { d: 5, e: [6] },
      ];
      const clone = ut.cloneObject(orig);
      expect(clone).to.not.be.equal(orig);
      expect(clone).to.be.deep.equal(orig);
    });
  });

  describe('get()', () => {
    it('should return the value in the path', () => {
      const object = { a: 1, b: 2, c: { d: 3, e: [4] } };
      expect(ut.get(object, '')).to.be.undefined;
      expect(ut.get(object, 'c')).to.be.deep.equal({ d: 3, e: [4] });
      expect(ut.get(object, 'c.d')).to.be.equal(3);
      expect(ut.get(object, 'c.e[0]')).to.be.equal(4);
      expect(ut.get([1, 2, 3], '[1]')).to.be.equal(2);
    });

    it('should return the value in the path as array', () => {
      const object = { a: 1, b: 2, c: { d: 3, e: [4] } };
      expect(ut.get(object, [])).to.be.undefined;
      expect(ut.get(object, ['c'])).to.be.deep.equal({ d: 3, e: [4] });
      expect(ut.get(object, ['c', 'd'])).to.be.equal(3);
      expect(ut.get(object, ['c', 'e', '0'])).to.be.equal(4);
      expect(ut.get([1, 2, 3], ['1'])).to.be.equal(2);
    });

    it('should return the default value', () => {
      const object = {
        a: 1,
        b: 2,
        c: { d: 3, e: [4] },
        f: null,
      };
      expect(ut.get(object, 'a.d')).to.be.undefined;
      expect(ut.get(object, 'a.f', null)).to.be.null;
      expect(ut.get(object, 'a.h', false)).to.be.false;
      expect(ut.get(object, 'f.a')).to.be.undefined;
      expect(ut.get(object, 'f.a', null)).to.be.null;
    });
  });

  describe('equals()', () => {
    it('should return true validating cloned objects', () => {
      const o1 = {};
      const o2 = {
        a: 1,
        b: '2',
        c: true,
        d: null,
        e: undefined,
        f: NaN,
      };
      const o3 = { a: { b: [{ c: 1 }, { c: 2 }] } };
      /** @type {any[]} */
      const o4 = [];
      const o5 = [1, 2, 3];

      expect(ut.equals(o1, ut.cloneObject(o1))).to.be.true;
      expect(ut.equals(o2, ut.cloneObject(o2))).to.be.true;
      expect(ut.equals(o3, ut.cloneObject(o3))).to.be.true;
      expect(ut.equals(o4, ut.cloneObject(o4))).to.be.true;
      expect(ut.equals(o5, ut.cloneObject(o5))).to.be.true;
    });

    it('should return true validating primitives and references', () => {
      const number = 1;
      const string = '2';
      const date = new Date();
      const regex = /a/;

      expect(ut.equals(number, 1)).to.be.true;
      expect(ut.equals(string, '2')).to.be.true;
      expect(ut.equals(date, date)).to.be.true;
      expect(ut.equals(regex, regex)).to.be.true;
    });

    it('should return false validating different objects', () => {
      expect(ut.equals({}, { a: 1 })).to.be.false;
      expect(ut.equals({ a: 1, b: '2' }, { a: 1, b: '3' })).to.be.false;
      expect(
        ut.equals(
          { a: { b: [{ c: 1 }, { c: 2 }] } },
          { a: { b: [{ c: 3 }, { c: 2 }] } },
        ),
      ).to.be.false;
      expect(ut.equals(new Date(), new Date())).to.be.false;
      expect(ut.equals([1, 2, 3], [1, 2, 3, 4])).to.be.false;
    });
  });

  describe('groupBy', () => {
    const people = [
      {
        name: 'alex',
        age: 24,
        lang: 'spanish',
        country: 'spain',
      },
      {
        name: 'fran',
        age: 23,
        lang: 'english',
        country: 'france',
      },
      {
        name: 'alex',
        age: 30,
        lang: 'english',
        country: 'spain',
      },
      { name: 'james', age: 35, country: 'france' },
    ];

    it('should group the objects by a single key', () => {
      const grouped = ut.groupBy(people, 'country');
      expect(grouped.spain).to.have.lengthOf(2);
      expect(grouped.france).to.have.lengthOf(2);
    });

    it('should group the objects with a custom iteratee', () => {
      const grouped = ut.groupBy(people, 'country', (person) => person.age);

      expect(grouped.spain).to.have.be.deep.equal([24, 30]);
      expect(grouped.france).to.have.be.deep.equal([23, 35]);
    });

    it('should group the objects with multiple keys', () => {
      const grouped = ut.groupBy(people, ['country', 'lang']);
      expect(grouped.spain.spanish).to.have.lengthOf(1);
      expect(grouped.spain.english).to.have.lengthOf(1);
      expect(grouped.france.english).to.have.lengthOf(1);
    });
  });

  describe('objectLength', () => {
    it('should return the number of keys of the given object', () => {
      expect(ut.objectLength({})).to.be.equal(0);
      expect(
        ut.objectLength({
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: 5,
        }),
      ).to.be.equal(5);
    });
  });

  describe('clearObject', () => {
    it('should clear the object', () => {
      const object = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      };
      ut.clearObject(object);
      expect(ut.objectLength(object)).to.be.equal(0);
    });
  });

  describe('toFastProperties', () => {
    // Requires nodejs to run with flag --allow-natives-syntax but its not possible at the moment
    it('should convert an object in dictionary mode into fast mode', () => {
      /** @type {{a?: number, b: number}} */
      const object = { a: 1, b: 2 };
      /* expect(eval('%HasFastProperties(object)')).to.be.true; */
      delete object.a;
      /* expect(eval('%HasFastProperties(object)')).to.be.false; */
      ut.toFastProperties(object);
      /* expect(eval('%HasFastProperties(object)')).to.be.true; */
    });
  });

  describe('randomBoolean', () => {
    it('should return a random boolean with chances of 50%', () => {
      expect(ut.randomBoolean()).to.be.a('boolean');
    });
  });

  describe('isNumeric', () => {
    it('should return true for valid numbers even if they are in strings', () => {
      expect(ut.isNumeric(1)).to.be.true;
      expect(ut.isNumeric(1e1)).to.be.true;
      expect(ut.isNumeric(1.25)).to.be.true;
      expect(ut.isNumeric(new Number(25))).to.be.true;
      expect(ut.isNumeric('1')).to.be.true;
      expect(ut.isNumeric('1e+1')).to.be.true;
      expect(ut.isNumeric('1.25')).to.be.true;
      expect(ut.isNumeric(Infinity)).to.be.false;
      expect(ut.isNumeric(NaN)).to.be.false;
    });
  });

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(ut.isNumber(1)).to.be.true;
      expect(ut.isNumber(1e1)).to.be.true;
      expect(ut.isNumber(1.25)).to.be.true;
      expect(ut.isNumber(new Number(25))).to.be.true;
    });
  });

  describe('isString', () => {
    it('should return true for valid strings', () => {
      expect(ut.isString('')).to.be.true;
      expect(ut.isString('Hello')).to.be.true;
      expect(ut.isString(new String('Hello, World!'))).to.be.true;
    });
  });

  describe('isArray', () => {
    it('should return true for valid arrays', () => {
      expect(ut.isArray([])).to.be.true;
      expect(ut.isArray([1, 2, 3])).to.be.true;
    });
  });

  describe('isObject', () => {
    it('should return true for valid objects', () => {
      expect(ut.isObject({})).to.be.true;
      expect(ut.isObject([])).to.be.true;
      expect(ut.isObject(new Date())).to.be.true;
      expect(ut.isObject(null)).to.be.false;
    });
  });

  describe('isPlainObject', () => {
    it('should return true for valid plain objects', () => {
      expect(ut.isPlainObject({})).to.be.true;
      expect(ut.isPlainObject([])).to.be.false;
      expect(ut.isPlainObject(new Date())).to.be.false;
      expect(ut.isPlainObject(null)).to.be.false;
    });
  });

  describe('isBoolean', () => {
    it('should return true for valid booleans', () => {
      expect(ut.isBoolean(true)).to.be.true;
      expect(ut.isBoolean(new Boolean(false))).to.be.true;
    });
  });

  describe('isFunction', () => {
    it('should return true for valid functions', () => {
      expect(ut.isFunction(() => {})).to.be.true;
      expect(ut.isFunction(new Function())).to.be.true;
    });
  });

  describe('isRegExp', () => {
    it('should return true for valid RegExp objects', () => {
      expect(ut.isRegExp(/a/)).to.be.true;
      expect(ut.isRegExp(/a/)).to.be.true;
    });
  });

  describe('isDate', () => {
    it('should return true for valid Date objects', () => {
      expect(ut.isDate(new Date())).to.be.true;
    });
  });

  describe('isValidNumber', () => {
    it('should return true for valid numbers', () => {
      expect(ut.isValidNumber(1.25)).to.be.true;
      expect(ut.isValidNumber(Infinity)).to.be.false;
      expect(ut.isValidNumber(NaN)).to.be.false;
    });
  });

  describe('logN', () => {
    it('should return the log n value', () => {
      expect(ut.logN(10, 25)).to.be.closeTo(Math.log10(25), 0.0000000000000005);
      expect(ut.logN(Math.E, 25)).to.be.closeTo(
        Math.log(25),
        0.0000000000000005,
      );
      expect(ut.logN(2, 1024)).to.be.equal(10);
    });
  });

  describe('inRange', () => {
    it('should return true if the value is within the provided range', () => {
      expect(ut.inRange(3, 1, 5)).to.be.true;
      expect(ut.inRange('abc', 1, 5)).to.be.true;
      expect(ut.inRange([1, 2, 3], 1, 5)).to.be.true;
      expect(ut.inRange({ a: 1, b: 2, c: 3 }, 1, 5)).to.be.true;
      expect(ut.inRange(new RegExp(''))).to.be.false;
    });
  });

  describe('error', () => {
    it('should return Error instances', () => {
      const error = ut.error('snap');
      expect(error).to.be.instanceOf(Error);
      expect(error.name).to.be.equal('Error');
      expect(error.message).to.be.equal('snap');
      expect(error.stack).to.exist;
    });

    it('should return custom Error instances', () => {
      /**
       * @param {string} [message]
       * @this {CouchbaseError}
       */
      function CouchbaseError(message) {
        Error.call(this, message);
      }

      Object.setPrototypeOf(CouchbaseError.prototype, Error.prototype);

      const cbError = ut.error(
        'snap',
        /** @type {ErrorConstructor} */ (CouchbaseError),
      );
      expect(cbError).to.be.instanceOf(CouchbaseError);
      expect(cbError.name).to.be.equal('CouchbaseError');
      expect(cbError.message).to.be.equal('snap');
      expect(cbError.stack).to.exist;
    });

    it('should return a TypeError without message', () => {
      const typeError = ut.error(TypeError);
      expect(typeError).to.be.instanceOf(TypeError);
    });
  });

  describe('logger.setLogLevel', () => {
    it('should set the log level', () => {
      ut.logger.setLogLevel(ut.logger.WARN);
      expect(ut.logger._logLevel).to.be.equal(ut.logger.WARN);
    });
  });

  describe('logger.setUsingDate', () => {
    it('should enable or disable the date in logs', () => {
      ut.logger.setUsingDate(true);
      expect(ut.logger._usingDate).to.be.true;
    });
  });

  describe('logger.setPrettify', () => {
    it('should enable or disable the prettifying in logs', () => {
      ut.logger.setPrettify(true);
      expect(ut.logger._prettify).to.be.true;
    });
  });
});
