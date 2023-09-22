/**
 * If value has a numeric value or not. It can be a Number or a String.
 * @param {*} value The value.
 * @return {Boolean} If has a numeric value or not.
 */
function isNumeric(value) {
  return !isNaNOrInfinity(parseFloat(value));
}

/**
 * If is a Number or not.
 * @param {*} value The value.
 * @return {Boolean} If is a Number or not.
 */
function isNumber(value) {
  return (
    typeof value === 'number' ||
    (isObject(value) && value.constructor === Number)
  );
}

/**
 * If is a String or not.
 * @param {*} value The value.
 * @return {Boolean} If is a String or not.
 */
function isString(value) {
  return (
    typeof value === 'string' ||
    (isObject(value) && value.constructor === String)
  );
}

/**
 * If is an Array or not.
 * @param {*} value The value.
 * @return {Boolean} If is an Array or not.
 * @function
 */
const { isArray } = Array;

/**
 * If is an Object or not.
 * @param {*} value The value.
 * @return {Boolean} If is an Object or not.
 */
function isObject(value) {
  return typeof value === 'object' && value !== null;
}

/**
 * If is a plain object (not an array) or not.
 * @param {*} value The value.
 * @return {Boolean} If is an Object and not an Array.
 */
function isPlainObject(value) {
  if (isObject(value)) {
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
  }

  return false;
}
/**
 * If is a Boolean or not.
 * @param {*} value The value.
 * @return {Boolean} If is a Boolean or not.
 */
function isBoolean(value) {
  return (
    typeof value === 'boolean' ||
    (isObject(value) && value.constructor === Boolean)
  );
}

/**
 * If is Function or not.
 * @param {*} value The value.
 * @return {Boolean} If is a Function or not.
 */
function isFunction(value) {
  return typeof value === 'function';
}

/**
 * If is a RegExp or not.
 * @param {*} value The value.
 * @return {Boolean} If is a RegExp or not.
 */
function isRegExp(value) {
  return value instanceof RegExp;
}

/**
 * If is a Date or not.
 * @param {*} value The value.
 * @return {Boolean} If is a Date or not.
 */
function isDate(value) {
  return value instanceof Date;
}

/**
 * If is a Number or not. NaN, Infinity or -Infinity aren't considered valid numbers.
 * @param {*} value The value.
 * @return {Boolean} If is a Number or not.
 */
function isValidNumber(value) {
  return isNumber(value) && !isNaNOrInfinity(value);
}
