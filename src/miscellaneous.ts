import { objectLength } from './object';
import { isArray, isFunction, isNumber, isPlainObject, isString } from './type';

const MEMOIZE_MAX_SIZE = 500;

/**
 * Execute a function N times and print the execution time.
 * @param fn The function to execute.
 * @param times How many times to execute. Defaults to 1.
 * @param label A label to be used in the log string. Defaults to 'Default label'.
 */
export function test(fn: DataGenerator, times = 1, label = 'Default label') {
  // eslint-disable-next-line no-console
  console.time(label);

  for (let i = 0; i < times; i++) {
    fn(i);
  }

  // eslint-disable-next-line no-console
  console.timeEnd(label);
}

/**
 * Check if a value is inside of a given range.
 * @param val The value.
 * @param min Min inclusive value. Defaults to -Infinity.
 * @param max Max inclusive value. Defaults to Infinity.
 * @return If the value is inside of the given range or not.
 */
export function inRange(
  val: string | number | unknown[] | object,
  min = -Infinity,
  max = Infinity
) {
  if (isNumber(val)) {
    return val >= min && val <= max;
  }
  if (isString(val)) {
    return val.length >= min && val.length <= max;
  }
  if (isArray(val)) {
    return val.length >= min && val.length <= max;
  }
  if (isPlainObject(val)) {
    const length = objectLength(val);
    return length >= min && length <= max;
  }

  return false;
}

/**
 * Fast error builder, it doesn't have a real stacktrace but is x10 faster than
 * new Error().
 * @param message The error message. Default to empty string.
 * @param constructor Optional constructor for custom errors. Defaults to ErrorConstructor.
 * @return An Error instance.
 */
export function error(
  message?: string | ErrorConstructor,
  constructor?: ErrorConstructor
) {
  if (isFunction(message)) {
    constructor = message;
    message = undefined;
  }

  message = message ?? '';
  constructor = constructor ?? Error;

  const object: Error = {
    name: constructor.name,
    message,
    stack: `${constructor.name}: ${message}`,
  };
  Object.setPrototypeOf(object, constructor.prototype);
  return object;
}

/**
 * Memoizes a function using the first received argument as cache key coerced to string.
 * @param fn The function to memoize.
 * @param maxSize Max size for the internal cache. Defaults to 500.
 * @returns The memoized function.
 */
export function memoize<T, R>(
  fn: (...args: T[]) => R,
  maxSize = MEMOIZE_MAX_SIZE
) {
  function memoize(...args: T[]): R {
    const firstArg = String(args[0]);
    if (memoize.cache[firstArg] !== undefined) {
      return memoize.cache[firstArg] as R;
    }
    const result = fn(...args);
    if (memoize.size === maxSize) {
      memoize.cache = {};
      memoize.size = 0;
    }
    memoize.cache[firstArg] = result;
    memoize.size++;
    return result;
  }

  memoize.cache = {} as PlainObject;
  memoize.size = 0;
  return memoize;
}
