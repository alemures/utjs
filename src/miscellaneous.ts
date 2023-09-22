// Miscellaneous

/**
 * Execute a function N times and print the execution time.
 * @param {Function} fn The function to execute.
 * @param {Number} [times=1] How many times to execute.
 * @param {String} [label='Default label']  A label to be used in the log string.
 */
function test(fn, times = 1, label = 'Default label') {
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
 * @param {Number|String|Array|Object} val The value.
 * @param {Number} [min=-Infinity] Min inclusive value.
 * @param {Number} [max=Infinity] Max inclusive value.
 * @return {Boolean} If the value is inside of the given range or not.
 */
function inRange(val, min = -Infinity, max = Infinity) {
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
 * @param {String} [message=''] The error message.
 * @param {Function} [constructor=Error] Optional constructor for custom errors.
 * @return {Error} An Error instance.
 */
function error(message, constructor) {
  if (isFunction(message)) {
    constructor = message;
    message = undefined;
  }

  message = message || '';
  constructor = constructor || Error;

  const object = {
    name: constructor.name,
    message,
    stack: `${constructor.name}: ${message}`,
  };
  Object.setPrototypeOf(object, constructor.prototype);
  return object;
}
