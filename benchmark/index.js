const Benchmark = require('benchmark');
const _ = require('lodash');
const ut = require('../index');
const oldut = require('./ut');

const suite = new Benchmark.Suite();
const benchName = process.argv[2];

const benchmarks = {
  splitPath,
  stringToNumber,
  startsWith,
  getMiddleNumber,
  objectLength,
  objectLengthFastProperties,
  get,
  updateObject,
  copyArray,
  sort,
  concatArrays,
  paddingBoth,
};

if (benchmarks[benchName] !== undefined) {
  benchmarks[benchName](suite);
} else {
  console.error(`Invalid benchmark name, valid names: ${Object.keys(benchmarks)}`);
  process.exit(1);
}

suite.on('cycle', (event) => {
  console.log(String(event.target));
}).on('complete', () => {
  console.log(`Fastest is ${suite.filter('fastest').map('name')}`);
}).run();

function splitPath(suite) {
  const path = 'a.b[2][2223332].zzxcsdf.ff[0].asf.ww[1][2][551].xx';
  function splitPath(path) {
    const objs = path.split('.');
    let tokens = [];

    for (let j = 0; j < objs.length; j++) {
      const o = objs[j];
      if (o.endsWith(']')) {
        const i = o.indexOf('[');
        const initialToken = o.substring(0, i);
        tokens.push(initialToken);
        const token = o.substring(i + 1, o.length - 1).split('][');
        tokens = tokens.concat(token);
      } else {
        tokens.push(o);
      }
    }

    return tokens;
  }

  function splitPath2(path) {
    const objectPathRegex = /[^.[\]]+/g;
    const pathArr = [];
    let execResult;
    while ((execResult = objectPathRegex.exec(path)) !== null) {
      pathArr.push(execResult[0]);
    }

    return pathArr;
  }

  function splitPath3(origPath) {
    const sep = '.';
    let path = origPath.replace(/[.[]/g, sep);
    path = path.replace(/\]/g, '');
    path = path.startsWith(sep) ? path.substring(sep.length) : path;
    return path.split(sep);
  }

  const rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  const reEscapeChar = /\\(\\)?/g;
  function lodashSplitPath(string) {
    const result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, (match, number, quote, subString) => {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  }

  suite.add('current splitPath', () => {
    ut.splitPath(path);
  }).add('custom splitPath', () => {
    splitPath(path);
  }).add('custom splitPath2', () => {
    splitPath2(path);
  }).add('custom splitPath3', () => {
    splitPath3(path);
  })
    .add('lodashSplitPath', () => {
      lodashSplitPath(path);
    });
}

function stringToNumber(suite) {
  const string = '25532';
  suite.add('current stringToNumber', () => {
    ut.stringToNumber(string);
  }).add('custom stringToNumber', () => {
    Number(string);
  });
}

function startsWith(suite) {
  const string = 'the beautiful string';
  suite.add('current startsWith', () => {
    ut.startsWith(string, 'the');
  }).add('custom startsWith', () => {
    string.startsWith('the');
  });
}

function getMiddleNumber(suite) {
  const a = 5;
  const b = 3;
  const c = 6;

  function getMiddleNumber(a, b, c) {
    const max = Math.max(Math.max(a, b), c);
    const min = Math.min(Math.min(a, b), c);
    return a + b + c - max - min;
  }

  suite.add('current getMiddleNumber', () => {
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

  suite.add('current objectLength', () => {
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

  suite.add('current objectLength', () => {
    ut.objectLength(obj);
  }).add('custom objectLength', () => {
    objectLength(obj);
  });
}

function get(suite) {
  const obj = { a: { b: [1, 2, { c: true }] } };
  const path = 'a.b[2].c';
  const pathArr = ['a', 'b', '2', 'c'];

  suite.add('current get string', () => {
    ut.get(obj, path);
  }).add('current get array', () => {
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

  suite.add('current updateObject string', () => {
    ut.updateObject(ut.cloneObject(obj), false, path);
  }).add('current updateObject array', () => {
    ut.updateObject(ut.cloneObject(obj), false, pathArr);
  }).add('old updateObject string', () => {
    oldut.updateObject(ut.cloneObject(obj), false, path);
  })
    .add('lodash set string', () => {
      _.set(ut.cloneObject(obj), path, false);
    })
    .add('lodash set array', () => {
      _.set(ut.cloneObject(obj), pathArr, false);
    });
}

function copyArray(suite) {
  const arr = ut.randomArray(125);

  suite.add('current copyArray', () => {
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

  suite.add('current sort', () => {
    ut.sort(arr.slice());
  }).add('custom sort', () => {
    arr.slice().sort(_numericComparator);
  });
}

function concatArrays(suite) {
  const arr = ut.randomArray(125);

  suite.add('current concatArrays', () => {
    ut.concatArrays(arr.slice(), arr);
  }).add('custom concatArrays', () => {
    arr.slice().concat(arr);
  });
}

function paddingBoth(suite) {
  suite.add('current paddingBoth', () => {
    ut.paddingBoth('string', '.', 19);
  }).add('lodash pad', () => {
    _.pad('string', 19, '.');
  });
}
