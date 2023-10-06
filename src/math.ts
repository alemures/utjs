/**
 * Calculate the log using a given base and value.
 * @param base The base.
 * @param value The value.
 * @return The log result.
 */
export function logN(base: number, value: number) {
  const i = base === 2 ? Math.LN2 : base === 10 ? Math.LN10 : Math.log(base);
  return Math.log(value) / i;
}
