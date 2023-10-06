import { isNaNOrInfinity } from './number';

/**
 * If value has a numeric value or not. It can be a Number or a String.
 * @param value The value.
 * @return If has a numeric value or not.
 */
export function isNumeric(value: unknown) {
  return !isNaNOrInfinity(parseFloat(value as string));
}

/**
 * If is a Number or not.
 * @param value The value.
 * @return If is a Number or not.
 */
export function isNumber(value: unknown): value is number {
  return (
    typeof value === 'number' ||
    (isObject(value) && value.constructor === Number)
  );
}

/**
 * If is a String or not.
 * @param value The value.
 * @return If is a String or not.
 */
export function isString(value: unknown): value is string {
  return (
    typeof value === 'string' ||
    (isObject(value) && value.constructor === String)
  );
}

/**
 * If is an Array or not.
 * @param value The value.
 * @return If is an Array or not.
 * @function
 */
export const { isArray } = Array;

/**
 * If is an Object or not.
 * @param value The value.
 * @return If is an Object or not.
 */
export function isObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * If is a plain object (not an array) or not.
 * @param value The value.
 * @return If is an Object and not an Array.
 */
export function isPlainObject(value: unknown): value is object {
  if (isObject(value)) {
    const proto = Object.getPrototypeOf(value) as unknown;
    return proto === Object.prototype || proto === null;
  }

  return false;
}
/**
 * If is a Boolean or not.
 * @param {*} value The value.
 * @return {Boolean} If is a Boolean or not.
 */
export function isBoolean(value: unknown): value is boolean {
  return (
    typeof value === 'boolean' ||
    (isObject(value) && value.constructor === Boolean)
  );
}

/**
 * If is Function or not.
 * @param value The value.
 * @return If is a Function or not.
 */
export function isFunction(value: unknown): value is CallableFunction {
  return typeof value === 'function';
}

/**
 * If is a RegExp or not.
 * @param value The value.
 * @return If is a RegExp or not.
 */
export function isRegExp(value: unknown) {
  return value instanceof RegExp;
}

/**
 * If is a Date or not.
 * @param value The value.
 * @return If is a Date or not.
 */
export function isDate(value: unknown) {
  return value instanceof Date;
}

/**
 * If is a Number or not. NaN, Infinity or -Infinity aren't considered valid numbers.
 * @param value The value.
 * @return If is a Number or not.
 */
export function isValidNumber(value: unknown) {
  return isNumber(value) && !isNaNOrInfinity(value);
}
