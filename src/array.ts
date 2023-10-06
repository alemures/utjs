import { randomNumber } from './number';
import { isBoolean, isNumber } from './type';

/**
 * Split an array into chunks.
 * @param array The array.
 * @param chunkSize The chunk size.
 * @return An array of chunks.
 */
export function arrayChunk(array: unknown[], chunkSize: number) {
  const size = array.length;
  const tempArray: unknown[] = new Array(Math.ceil(size / chunkSize));

  for (let i = 0, j = 0; j < size; j += chunkSize, i++) {
    tempArray[i] = copyArray(array, j, j + chunkSize);
  }

  return tempArray;
}

/**
 * Recursive quicksort using Hoare partitioning with random pivot and cut off to insertion sort.
 * @param array The array to sort.
 * @param comparator An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 * @param left The left index. Defaults to 0.
 * @param right The right index. Defaults to array length - 1.
 */
export function sort(
  array: unknown[],
  comparator?: Comparator | number,
  left?: number,
  right?: number
) {
  if (isNumber(comparator)) {
    right = left;
    left = comparator;
    comparator = undefined;
  }

  left = left ?? 0;
  right = right ?? array.length - 1;
  comparator = comparator ?? (_numericComparator as Comparator);

  _quickSort(array, comparator, left, right);
}

function _quickSort(
  array: unknown[],
  comparator: Comparator,
  left: number,
  right: number
) {
  if (right - left < 27) {
    _insertionSort(array, comparator, left, right);
    return;
  }

  let leftIndex = left;
  let rightIndex = right;
  const pivot = array[randomNumber(left, right + 1)];

  while (leftIndex <= rightIndex) {
    while (comparator(array[leftIndex], pivot) < 0) {
      leftIndex++;
    }

    while (comparator(array[rightIndex], pivot) > 0) {
      rightIndex--;
    }

    if (leftIndex <= rightIndex) {
      swap(array, leftIndex, rightIndex);
      leftIndex++;
      rightIndex--;
    }
  }

  if (left < rightIndex) {
    _quickSort(array, comparator, left, rightIndex);
  }

  if (right > leftIndex) {
    _quickSort(array, comparator, leftIndex, right);
  }
}

function _insertionSort(
  array: unknown[],
  comparator: Comparator,
  left: number,
  right: number
) {
  for (let i = left; i <= right; i++) {
    for (let j = i; j > left && comparator(array[j], array[j - 1]) < 0; j--) {
      swap(array, j, j - 1);
    }
  }
}

function _numericComparator(number1: number, number2: number) {
  return number1 - number2;
}

/**
 * Swap the two values in an array.
 * @param array The array.
 * @param from From index.
 * @param to To index.
 */
export function swap(array: unknown[], from: number, to: number) {
  const aux = array[from];
  array[from] = array[to];
  array[to] = aux;
}

/**
 * Add all the elements in source at the end of dest.
 * @param dest The destiny array.
 * @param source The source array.
 */
export function concatArrays(dest: unknown[], source: unknown[]) {
  const destLength = dest.length;
  dest.length += source.length;

  for (let i = 0; i < source.length; i++) {
    dest[destLength + i] = source[i];
  }
}

/**
 * Shallow copy of an array.
 * @param array The array to copy.
 * @param start The start inclusive index. Defaults to 0.
 * @param end The end exclusive index. Defaults to array length.
 * @return The copied array.
 */
export function copyArray(array: unknown[], start = 0, end = array.length) {
  if (end > array.length) {
    end = array.length;
  }

  const copyLength = end - start;

  if (copyLength === 1) {
    return [array[start]];
  }

  if (copyLength < 50) {
    const copy: unknown[] = new Array(copyLength);
    for (let i = 0; i < copyLength; i++) {
      copy[i] = array[i + start];
    }

    return copy;
  }

  return array.slice(start, end);
}

/**
 * Empty the content of an array.
 * @param array The array to clear.
 */
export function clearArray(array: unknown[]) {
  array.length = 0;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _defaultDataGenerator(index: number) {
  return randomNumber(1, 100);
}

/**
 * Return a random array of generated elements by dataGenerator.
 * @param length The length.
 * @param dataGenerator The data generator. Defaults to a RNG from 1 to 100.
 * @return The array.
 */
export function randomArray(
  length: number,
  dataGenerator: DataGenerator = _defaultDataGenerator
) {
  const array: unknown[] = new Array(length);

  for (let i = 0; i < length; i++) {
    array[i] = dataGenerator(i);
  }

  return array;
}

/**
 * Intersect two sorted arrays.
 * @param array1 The first array.
 * @param array2 The second array.
 * @return The intersected array.
 * @param comparator An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 */
export function intersectSorted(
  array1: unknown[],
  array2: unknown[],
  comparator = _numericComparator as Comparator
) {
  let i1 = 0;
  let i2 = 0;
  const result = [];
  let previous = undefined as unknown;

  while (i1 < array1.length && i2 < array2.length) {
    if (comparator(array1[i1], array2[i2]) < 0) {
      i1++;
    } else if (comparator(array1[i1], array2[i2]) > 0) {
      i2++;
    } else {
      if (array1[i1] !== previous) {
        previous = array1[i1];
        result.push(previous);
      }

      i1++;
      i2++;
    }
  }

  return result;
}

/**
 * About 1.5x faster than the two-arg version of Array#splice(). This
 * algorithm was taken from the core of Node.js.
 * @param array The array.
 * @param index The element to remove.
 */
export function spliceOne(array: unknown[], index: number) {
  if (index === 0) {
    array.shift();
    return;
  }

  for (; index + 1 < array.length; index++) {
    array[index] = array[index + 1];
  }

  array.pop();
}

/**
 * Inserts a value into a sorted array using an iterative binary search to find
 * the insertion index. 'rejectDuplicates' defines the behaviour when the value
 * that will be inserted is already in the array.
 * @param value The value to insert.
 * @param array The array.
 * @param comparator An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 * @param rejectDuplicates Specify if duplicated values will be rejected. Defaults to false.
 */
export function binaryInsert(
  value: unknown,
  array: unknown[],
  comparator?: Comparator | boolean,
  rejectDuplicates?: boolean
) {
  if (isBoolean(comparator)) {
    rejectDuplicates = comparator;
    comparator = undefined;
  }

  rejectDuplicates = rejectDuplicates === true;
  comparator = comparator ?? (_numericComparator as Comparator);

  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const middle = (left + right) >>> 1;
    const computed = array[middle];
    const cmpValue = comparator(computed, value);

    if (cmpValue > 0) {
      right = middle - 1;
      continue;
    }

    left = middle + 1;
    if (cmpValue === 0) {
      if (rejectDuplicates) {
        return;
      }
      break;
    }
  }

  array.splice(left, 0, value);
}

/**
 * Find a value into a sorted array using an iterative binary search.
 * @param value The value to search.
 * @param array The array.
 * @param comparator An optional comparator, it will be called
 *   with two values and must return 1 if the first is greater than the second, 0 if they are
 *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
 * @param left The left index. Defaults to 0.
 * @param right The right index. Defaults to array length - 1.
 * @return The index if the value was found or -1.
 */
export function binarySearch(
  value: unknown,
  array: unknown[],
  comparator?: Comparator,
  left?: number,
  right?: number
) {
  if (isNumber(comparator)) {
    right = left;
    left = comparator;
    comparator = undefined;
  }

  left = left ?? 0;
  right = right ?? array.length - 1;
  comparator = comparator ?? (_numericComparator as Comparator);

  while (left <= right) {
    const middle: number = (left + right) >>> 1;
    const computed = array[middle];
    const cmpValue = comparator(computed, value);

    if (cmpValue > 0) {
      right = middle - 1;
      continue;
    }

    left = middle + 1;
    if (cmpValue === 0) {
      return middle;
    }
  }

  return -1;
}

/**
 * Returns a random value within the provided array.
 * @param array The array.
 * @param start The start inclusive index. Defaults to 0.
 * @param end The end exclusive index. Defaults to array length.
 * @return A random item.
 */
export function randomArrayItem(
  array: unknown[],
  start = 0,
  end = array.length
) {
  if (end > array.length) {
    end = array.length;
  }

  return array[randomNumber(start, end)];
}
