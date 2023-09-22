// Math

/**
 * Calculate the log using a given base and value.
 * @param {Number} base The base.
 * @param {Number} value The value.
 * @return {Number} The log result.
 */
function logN(base, value) {
  const i = base === 2 ? Math.LN2 : base === 10 ? Math.LN10 : Math.log(base);
  return Math.log(value) / i;
}
