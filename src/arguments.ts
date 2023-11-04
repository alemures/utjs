/**
 * Convert arguments to array.
 * @param args The arguments object.
 * @return The array.
 */
export function argumentsToArray(args: IArguments) {
  const array: unknown[] = new Array(args.length);
  for (let i = 0; i < args.length; i++) {
    array[i] = args[i];
  }
  return array;
}
