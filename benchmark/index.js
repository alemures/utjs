const Benchmark = require('benchmark');
const _ = require('lodash');
const ut = require('../index');

const suite = new Benchmark.Suite();

// splitPath(suite);
// stringToNumber(suite);
// startsWith(suite);
// getMiddleNumber(suite);
// objectLength(suite);
// objectLengthFastProperties(suite);
// get(suite);
// updateObject(suite);
// copyArray(suite);
// sort(suite);
// concatArrays(suite);

suite.on('cycle', (event) => {
  console.log(String(event.target));
}).on('complete', () => {
  console.log(`Fastest is ${suite.filter('fastest').map('name')}`);
}).run({ async: true });

function splitPath(suite) {
  const path = 'a.b[2][2223332].zzxcsdf.ff[0].asf.ww[1][2][551].xx';
  function splitPath(path) {
    const objs = path.split('.');
    let tokens = [];

    for (let j = 0; j < objs.length; j++) {
      const o = objs[j]
      if (o.endsWith(']')) {
        const i = o.indexOf('[');
        const initialToken = o.substring(0, i)
        tokens.push(initialToken)
        const token = o.substring(i + 1, o.length - 1).split('][');
        tokens = tokens.concat(token);
      } else {
        tokens.push(o)
      }
    }

    return tokens;
  }

  suite.add('ut.splitPath', () => {
    ut.splitPath(path);
  }).add('custom splitPath', () => {
    splitPath(path);
  });
}

function stringToNumber(suite) {
  const string = '25532';
  suite.add('ut.stringToNumber', () => {
    ut.stringToNumber(string);
  }).add('custom stringToNumber', () => {
    Number(string);
  });
}

function startsWith(suite) {
  const string = 'the beautiful string';
  suite.add('ut.startsWith', () => {
    ut.startsWith(string, 'the');
  }).add('custom startsWith', () => {
    string.startsWith('the');
  });
}

function getMiddleNumber(suite) {
  const a = 5, b = 3, c = 6;

  function getMiddleNumber(a, b, c) {
    if (a > b && b > c || c > b && b > a) return b;
    if (b > a && a > c || c > a && a > b) return a;
    return c;
  }

  suite.add('ut.getMiddleNumber', () => {
    ut.getMiddleNumber(a, b, c);
  }).add('custom getMiddleNumber', () => {
    getMiddleNumber(a, b, c);
  });
}

function objectLength(suite) {
  const obj = ut.randomObject(125);

  function objectLength(obj) {
    return Object.keys(obj).length;
  }

  suite.add('ut.objectLength', () => {
    ut.objectLength(obj);
  }).add('custom objectLength', () => {
    objectLength(obj);
  });
}

function objectLengthFastProperties(suite) {
  const obj = ut.toFastProperties(ut.randomObject(125));

  function objectLength(obj) {
    return Object.keys(obj).length;
  }

  suite.add('ut.objectLength', () => {
    ut.objectLength(obj);
  }).add('custom objectLength', () => {
    objectLength(obj);
  });
}

function get(suite) {
  const obj = { a: { b: [1, 2, { c: true }] } };
  const path = 'a.b[2].c';
  const pathArr = ['a', 'b', '2', 'c'];

  suite.add('ut.get string', () => {
    ut.get(obj, path);
  }).add('ut.get array', () => {
    ut.get(obj, pathArr);
  }).add('lodash get string', () => {
    _.get(obj, path);
  }).add('lodash get array', () => {
    _.get(obj, pathArr);
  });
}

function updateObject(suite) {
  const obj = { a: { b: [1, 2, { c: true }] } };
  const path = 'a.b[2].c';
  const pathArr = ['a', 'b', '2', 'c'];

  suite.add('ut.updateObject string', () => {
    ut.updateObject(ut.cloneObject(obj), false, path);
  }).add('ut.updateObject array', () => {
    ut.updateObject(ut.cloneObject(obj), false, pathArr);
  }).add('lodash set string', () => {
    _.set(ut.cloneObject(obj), path, false);
  }).add('lodash set array', () => {
    _.set(ut.cloneObject(obj), pathArr, false);
  });
}

function copyArray(suite) {
  const arr = ut.randomArray(125);

  suite.add('ut.copyArray', () => {
    ut.copyArray(arr);
  }).add('custom copyArray', () => {
    arr.slice();
  });
}

function sort(suite) {
  const arr = ut.randomArray(125);

  function _numericComparator(number1, number2) {
    return number1 - number2;
  }

  suite.add('ut.sort', () => {
    ut.sort(arr.slice());
  }).add('custom sort', () => {
    arr.slice().sort(_numericComparator);
  });
}

function concatArrays(suite) {
  const arr = ut.randomArray(125);

  suite.add('ut.concatArrays', () => {
    ut.concatArrays(arr.slice(), arr);
  }).add('custom concatArrays', () => {
    arr.slice().concat(arr);
  });
}
