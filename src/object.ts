import { splitPath } from './string';
import { isArray, isPlainObject, isString } from './type';

/**
 * Merge the source object into dest. This function only works for object,
 * arrays and primitive data types, references will be copied.
 * @param dest The destiny object or array.
 * @param source The source object or array.
 */
function mergeObjects(dest: object | unknown[], source: object | unknown[]) {
  if (isPlainObject(source)) {
    for (const i in source) {
      if (!Object.prototype.hasOwnProperty.call(source, i)) continue;
      _mergeObjects(dest, source, i);
    }
  } else if (isArray(source)) {
    for (let i = 0; i < source.length; i++) {
      _mergeObjects(dest, source, i);
    }
  }
}

function _mergeObjects(
  dest: object | unknown[],
  source: object | unknown[],
  i: string | number
) {
  if (isPlainObject(source[i])) {
    if (!isPlainObject(dest[i])) {
      dest[i] = {};
    }

    mergeObjects(dest[i], source[i]);
  } else if (isArray(source[i])) {
    if (!isArray(dest[i])) {
      dest[i] = new Array(source[i].length);
    }

    mergeObjects(dest[i], source[i]);
  } else {
    dest[i] = source[i];
  }
}

/**
 * Update an object or array using a given path string.
 * @param dest The object or array to update.
 * @param value The value to place in path.
 * @param path The path where to place the new value.
 */
export function updateObject(
  dest: object | unknown[],
  value: unknown,
  path: string | string[]
) {
  const keys = isArray(path) ? path : splitPath(path);
  const parentPath = keys.slice(0, keys.length - 1);

  const parent = parentPath.length ? get(dest, parentPath) : dest;
  if (isObject(parent)) {
    const key = keys[keys.length - 1];
    parent[key] = value;
  }
}

function _defaultKeyGenerator() {
  return randomString(6);
}

function _defaultValueGenerator() {
  return randomNumber(1, 1000000);
}

/**
 * Get a random object.
 * @param {Number[]|Number} lengths Number of items per level.
 * @param {Function} [keyGenerator=_defaultKeyGenerator] The key generator.
 * @param {Function} [valueGenerator=_defaultValueGenerator] The value generator.
 * @return {Object} The random object.
 */
function randomObject(
  lengths: any,
  keyGenerator = _defaultKeyGenerator,
  valueGenerator = _defaultValueGenerator
) {
  lengths = isNumber(lengths) ? [lengths] : lengths;

  const object = {};
  _randomObject(lengths, keyGenerator, valueGenerator, object, 1);
  return object;
}

function _randomObject(
  lengths: string | any[],
  keyGenerator: { (): any; (): any },
  valueGenerator: { (): any; (): any },
  object: { [x: string]: any },
  actualDepth: number
) {
  const maxDepth = lengths.length;

  if (actualDepth > maxDepth) {
    return;
  }

  for (let i = 0; i < lengths[actualDepth - 1]; i++) {
    const key = keyGenerator();
    object[key] = actualDepth === maxDepth ? valueGenerator() : {};
    _randomObject(
      lengths,
      keyGenerator,
      valueGenerator,
      object[key],
      actualDepth + 1
    );
  }
}

/**
 * Divide an object into chunks by keys number.
 * @param {Object} object The object.
 * @param {Number} chunkSize The max key number per chunk.
 * @return {Object[]} An array of chunks objects.
 */
function objectChunk(object: { [x: string]: any }, chunkSize: number) {
  const chunks = [];
  let index = 0;
  let counter = 0;

  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue;
    if (chunks[index] === undefined) {
      chunks[index] = {};
    }

    chunks[index][key] = object[key];

    if (++counter % chunkSize === 0) {
      index++;
    }
  }

  return chunks;
}

/**
 * Deep copy of object or array.
 * @param object The object or array.
 * @return The cloned object.
 */
export function cloneObject(original: object | unknown[]) {
  const clone: object | unknown[] = isArray(original) ? [] : {};
  mergeObjects(clone, original);
  return clone;
}

/**
 * Get the value using a path in an object.
 * @param {Object|Array} object The object or array.
 * @param {String|Array} path The path.
 * @param {*} [def] Value to return if no value is found in path.
 * @return {*} The found value in path.
 */
function get(obj: any, path: any, def: undefined) {
  const keys = isArray(path) ? path : splitPath(path);
  let value = keys.length ? obj : undefined;
  for (let i = 0; i < keys.length && value !== undefined; i++) {
    value = value !== null ? value[keys[i]] : undefined;
  }

  return value !== undefined ? value : def;
}

/**
 * Performs a deep comparison between two values to determine if they are equivalent. Plain
 * objects and arrays will be recursively iterated and primitive values and references
 * will be compared using the identity operator (===). Even though it's still a bit slower than
 * JSON.stringify(), this method works well with unsorted objects.
 * @param {Object|Array} value The first value.
 * @param {Object|Array} other The other value to compare against.
 * @return {Boolean} If the objects are equal or not.
 */
function equals(
  value: string | number | any[],
  other: string | number | any[]
) {
  if (value === other || (isNaN(value) && isNaN(other))) {
    return true;
  }

  if (!isObject(other)) {
    return false;
  }

  if (isPlainObject(value)) {
    for (const key in value) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) continue;
      if (!equals(value[key], other[key])) {
        return false;
      }
    }

    for (const key in other) {
      if (!Object.prototype.hasOwnProperty.call(other, key)) continue;
      if (value[key] === undefined && other[key] !== undefined) {
        return false;
      }
    }

    return true;
  }
  if (isArray(value)) {
    if (value.length !== other.length) {
      return false;
    }

    for (let i = 0; i < value.length; i++) {
      if (!equals(value[i], other[i])) {
        return false;
      }
    }

    return true;
  }

  return false;
}

/**
 * Group an array of objects using the values of a list of keys.
 * Usage:
 * <pre>
 *   var array = [{lang:'spanish', age: 2}, {lang:'spanish', age:5}, {lang:'english', age:25}]
 *   ut.groupBy(array, 'lang', function(obj) { return obj.age; })
 *   return -> { spanish: [ 2, 5 ], english: [ 25 ] }
 * </pre>
 * @param {Object[]} data An array of objects.
 * @param {String|String[]} keys The key or keys to group by.
 * @param {Function} [iteratee] A function to modify the final grouped objects.
 * @return {Object} The grouped object.
 */
function groupBy(
  array: string | any[],
  keys: string | any[],
  iteratee: (arg0: any) => any
) {
  keys = isString(keys) ? [keys] : keys;

  const result = {};
  const lastKeyIndex = keys.length - 1;

  for (let i = 0; i < array.length; i++) {
    const obj = array[i];

    const pointer = obj;
    let resultPointer = result;

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const keyValue = pointer[key];

      if (keyValue === undefined) {
        break;
      }

      if (resultPointer[keyValue] === undefined) {
        resultPointer[keyValue] = j < lastKeyIndex ? {} : [];
      }

      if (j === lastKeyIndex) {
        resultPointer[keyValue].push(iteratee ? iteratee(obj) : obj);
      }

      resultPointer = resultPointer[keyValue];
    }
  }

  return result;
}

/**
 * Counts and returns the length of the given object.
 * @param object The object.
 * @return The length of the object.
 */
export function objectLength(object: object) {
  let length = 0;
  // eslint-disable-next-line no-unused-vars
  for (const i in object) {
    if (!Object.prototype.hasOwnProperty.call(object, i)) continue;
    length++;
  }

  return length;
}

/**
 * Empty the content of an object. It uses "delete" so the object will be converted into a
 * hash table mode (slow properties).
 * @see {@link toFastProperties}
 * @param {Object} object The plain object to clear.
 */
export function clearObject(object: Record<string, unknown>) {
  for (const key in object) {
    if (!Object.prototype.hasOwnProperty.call(object, key)) continue;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete object[key];
  }
}

/**
 * Converts a deoptimized object (dictionary mode) into an optimized object (fast mode).
 * Objects are deoptimized when you use them like a hash table like deleting properties. You
 * can check it using the native function "%HasFastProperties(object)" running nodejs with
 * the flag "--allow-natives-syntax". This code was taken from the module "bluebird".
 * @param object The object to optimize.
 * @return Reference to the same object.
 */
export function toFastProperties(object: object) {
  function FakeConstructor() {}

  FakeConstructor.prototype = object;

  // petkaantonov: v8 slack tracking lasts for 8 constructions
  let l = 8;
  while (l--) {
    // eslint-disable-next-line no-new
    new FakeConstructor();
  }

  return object;

  // Prevent the function from being optimized through dead code elimination
  // or further optimizations. This code is never reached but even using eval
  // in unreachable code causes v8 to not optimize functions.

  // eslint-disable-next-line no-eval, no-unreachable
  eval(object);
}
