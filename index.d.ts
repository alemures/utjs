declare module "lib/ut" {
    export type Comparator = (value1: any, value2: any) => number;
    export type DataGenerator = (index: number) => any;
    export type PlainObject = Record<string, any>;
    export type Path = string | string[];
    /**
     * Date object to mysql date string.
     * @param {Date} [date=new Date()] The date object.
     * @return {string} The mysql string.
     */
    export function dateToMysql(date?: Date): string;
    /**
     * Date object to readable date string.
     * @param {Date} [date=new Date()] The date object.
     * @return {string} The date string.
     */
    export function dateToString(date?: Date): string;
    /**
     * Get the actual date as a readable string.
     * @return {string} A readable date string.
     */
    export function now(): string;
    /**
     * Clone a Date object.
     * @param {Date} date The original Date object.
     * @return {Date} The cloned Date.
     */
    export function cloneDate(date: Date): Date;
    /**
     * Split an array into chunks.
     * @param {any[]} array The array.
     * @param {number} chunkSize The chunk size.
     * @return {any[]} An array of chunks.
     */
    export function arrayChunk(array: any[], chunkSize: number): any[];
    /**
     * Recursive quicksort using Hoare partitioning with random pivot and cut off to insertion sort.
     * @param {any[]} array The array to sort.
     * @param {Comparator|number} [comparator=_numericComparator] An optional comparator, it will be called
     *   with two values and must return 1 if the first is greater than the second, 0 if they are
     *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
     * @param {number} [left=0] The left index. Defaults to 0.
     * @param {number} [right=array.length-1] the right index. Defaults to array length - 1.
     */
    export function sort(array: any[], comparator?: Comparator | number, left?: number, right?: number): void;
    /**
     * Swap the two values in an array.
     * @param {any[]} array The array.
     * @param {number} from From index.
     * @param {number} to To index.
     */
    export function swap(array: any[], from: number, to: number): void;
    /**
     * Add all the elements in source at the end of dest.
     * @param {any[]} dest The destiny array.
     * @param {any[]} source The source array.
     */
    export function concatArrays(dest: any[], source: any[]): void;
    /**
     * Shallow copy of an array.
     * @param {any[]} array The array to copy.
     * @param {number} [start=0] The start inclusive index. Defaults to 0.
     * @param {number} [end=array.length] The end exclusive index. Defaults to array length.
     * @return {any[]} The copied array.
     */
    export function copyArray(array: any[], start?: number, end?: number): any[];
    /**
     * Empty the content of an array.
     * @param {any[]} array The array to clear.
     */
    export function clearArray(array: any[]): void;
    /**
     * Return a random array of generated elements by dataGenerator.
     * @param {number} length The length.
     * @param {DataGenerator} [dataGenerator=_defaultDataGenerator] The data generator. Defaults to a RNG from 1 to 100.
     * @return {any[]} The array.
     */
    export function randomArray(length: number, dataGenerator?: DataGenerator): any[];
    /**
     * Intersect two sorted arrays.
     * @param {any[]} array1 The first array.
     * @param {any[]} array2 The second array.
     * @return {any[]} The intersected array.
     * @param {Comparator} [comparator=_numericComparator] An optional comparator, it will be called
     *   with two values and must return 1 if the first is greater than the second, 0 if they are
     *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
     */
    export function intersectSorted(array1: any[], array2: any[], comparator?: Comparator): any[];
    /**
     * About 1.5x faster than the two-arg version of Array#splice(). This
     * algorithm was taken from the core of Node.js.
     * @param {any[]} array The array.
     * @param {number} index The element to remove.
     */
    export function spliceOne(array: any[], index: number): void;
    /**
     * Inserts a value into a sorted array using an iterative binary search to find
     * the insertion index. 'rejectDuplicates' defines the behaviour when the value
     * that will be inserted is already in the array.
     * @param {any} value The value to insert.
     * @param {any[]} array The array.
     * @param {Comparator | boolean} [comparator=_numericComparator] An optional comparator, it will be called
     *   with two values and must return 1 if the first is greater than the second, 0 if they are
     *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
     * @param {boolean} [rejectDuplicates=false] Specify if duplicated values will be rejected. Defaults to false.
     */
    export function binaryInsert(value: any, array: any[], comparator?: Comparator | boolean, rejectDuplicates?: boolean): void;
    /**
     * Find a value into a sorted array using an iterative binary search.
     * @param {any} value The value to search.
     * @param {any[]} array The array.
     * @param {Comparator|number} [comparator=_numericComparator] An optional comparator, it will be called
     *   with two values and must return 1 if the first is greater than the second, 0 if they are
     *   equals or -1 if the second is greater than the first one. Defaults to a numerical comparator.
     * @param {number} [left=0] The left index. Defaults to 0.
     * @param {number} [right=array.length-1] The right index. Defaults to array length - 1.
     * @return {number} The index if the value was found or -1.
     */
    export function binarySearch(value: any, array: any[], comparator?: Comparator | number, left?: number, right?: number): number;
    /**
     * Returns a random value within the provided array.
     * @param {any[]} array The array.
     * @param {number} [start=0] The start inclusive index. Defaults to 0.
     * @param {number} [end=array.length] The end exclusive index. Defaults to array length.
     * @return {any} A random item.
     */
    export function randomArrayItem(array: any[], start?: number, end?: number): any;
    /**
     * Convert arguments to array.
     * @param {IArguments} args The arguments object.
     * @return {any[]} The array.
     */
    export function argumentsToArray(args: IArguments): any[];
    /**
     * Return a random alphanumeric string.
     * @param {number} size The size
     * @param {boolean} [caseInsensitive=false] If true, only lower case letters will be returned. Defaults to false.
     * @return {string} The random string.
     */
    export function randomString(size: number, caseInsensitive?: boolean): string;
    /**
     * Convert a string to a number.
     * @param {string} string The string.
     * @return {number} The number.
     */
    export function stringToNumber(string: string): number;
    /**
     * Add a left padding to string.
     * @param {string} string The string.
     * @param {string} pad The pad.
     * @param {number} length The length final length.
     * @return {string} The padded string.
     */
    export function paddingLeft(string: string, pad: string, length: number): string;
    /**
     * Add a right padding to string.
     * @param {string} string The string.
     * @param {string} pad The pad.
     * @param {number} length The length final length.
     * @return {string} The padded string.
     */
    export function paddingRight(string: string, pad: string, length: number): string;
    /**
     * Add a left and right padding to string.
     * @param {string} string The string.
     * @param {string} pad The pad.
     * @param {number} length The length final length.
     * @return {string} The padded string.
     */
    export function paddingBoth(string: string, pad: string, length: number): string;
    /**
     * Repeat a string N times.
     * @param {string} string The string to repeat.
     * @param {number} times The times to repeat.
     * @return {string} The repeated string.
     */
    export function repeat(string: string, times: number): string;
    /**
     * Replace all ocurrences in string.
     * @param {string} string The string.
     * @param {string} substr The substring to be replaced.
     * @param {string} newSubstr The string that replaces the substr param.
     * @param {boolean} [ignoreCase=false] If ignore case or not. Defaults to false.
     * @return {string} The final string.
     */
    export function replaceAll(string: string, substr: string, newSubstr: string, ignoreCase?: boolean): string;
    /**
     * Check if a string starts by a given prefix.
     * @param {string} string The string.
     * @param {string} prefix The prefix.
     * @return {boolean} If the string starts by prefix of not.
     */
    export function startsWith(string: string, prefix: string): boolean;
    /**
     * Check if a string ends by a given suffix.
     * @param {string} string The string.
     * @param {string} suffix The suffix.
     * @return {boolean} If the string ends by suffix of not.
     */
    export function endsWith(string: string, suffix: string): boolean;
    /**
     * Escapes a regex expression string.
     * @param {string} string The string to be escaped.
     * @return {string} The escaped string.
     */
    export function escapeRegExp(string: string): string;
    /**
     * If is a string value representing a date. The string should be in a format
     * recognized by the Date.parse().
     * @param {string} string The string.
     * @return {boolean} If is a valid date string or not.
     */
    export function isDateString(string: string): boolean;
    /**
     * Check whether a string represent a hexadecimal string or not.
     * @param {string} string The string.
     * @return {boolean} If is a valid hexadecimal string or not.
     */
    export function isHexString(string: string): boolean;
    /**
     * Split a string into chunks.
     * @param {string} string The string.
     * @param {number} chunkSize The chunk size.
     * @return {any[]} An array of chunks.
     */
    export function stringChunk(string: string, chunkSize: number): any[];
    /**
     * Splits an object path into an array of tokens.
     * @param {string} path the object path.
     * @return {string[]} The path tokens.
     */
    export function splitPath(path: string): string[];
    /**
     * Convert a number to string.
     * @param {number} number The number.
     * @return {string} The string.
     */
    export function numberToString(number: number): string;
    /**
     * Get a random number.
     * @param {number} min The inclusive min value.
     * @param {number} max The exclusive max value.
     * @return {number} The random number.
     */
    export function randomNumber(min: number, max: number): number;
    /**
     * Get the middle value.
     * @param {number} a The first number.
     * @param {number} b The second number.
     * @param {number} c The third number.
     * @return {number} The middle number.
     */
    export function getMiddleNumber(a: number, b: number, c: number): number;
    /**
     * Get the number of digits in a number. See
     * <a href="http://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript/
     * 28203456#28203456">link</a>.
     * @param {number} integer The integer.
     * @param {number} [base=10] The base of the number. Defaults to 10.
     * @return {number} The number of digits.
     */
    export function numDigits(integer: number, base?: number): number;
    /**
     * Check if a number is an integer or not.
     * @param {number} number The number to check.
     * @return {boolean} If the number is an integer.
     */
    export function isInteger(number: number): boolean;
    /**
     * Checks if a number is NaN. Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
     * @param {number} number The number to ckeck.
     * @return {boolean} If the number is NaN.
     */
    export function isNaN(number: number): boolean;
    /**
     * Checks if a number is NaN, Infinity or -Infinity.
     * Taken from <a href="http://jacksondunstan.com/articles/983">link</a>.
     * @param {number} number The number to ckeck.
     * @return {boolean} If the number is NaN, Infinity or -Infinity.
     */
    export function isNaNOrInfinity(number: number): boolean;
    /**
     * Truncates the number. This method is as fast as "number | 0" but it's
     * able to handle correctly numbers greater than 2^31 or lower than -2^31.
     * @param {number} number The number to be truncated.
     * @return {number} The truncated number.
     */
    export function truncateNumber(number: number): number;
    /**
     * Merge the source object into dest. This function only works for object,
     * arrays and primitive data types, references will be copied.
     * @param {any} dest The destiny object or array.
     * @param {any} source The source object or array.
     */
    export function mergeObjects(dest: any, source: any): void;
    /**
     * Update an object or array using a given path string.
     * @param {Object|any[]} dest The object or array to update.
     * @param {any} value The value to place in path.
     * @param {Path} path The path where to place the new value.
     */
    export function updateObject(dest: any | any[], value: any, path: Path): void;
    /**
     * Get a random object.
     * @param {number[]|number} lengths number of items per level.
     * @param {() => string} [keyGenerator=_defaultKeyGenerator] The key generator.
     * @param {Function} [valueGenerator=_defaultValueGenerator] The value generator.
     * @return {PlainObject} The random object.
     */
    export function randomObject(lengths: number[] | number, keyGenerator?: () => string, valueGenerator?: Function): PlainObject;
    /**
     * Divide an object into chunks by keys number.
     * @param {PlainObject} object The object.
     * @param {number} chunkSize The max key number per chunk.
     * @return {PlainObject[]} An array of chunks objects.
     */
    export function objectChunk(object: PlainObject, chunkSize: number): PlainObject[];
    /**
     * Deep copy of object or array.
     * @param {PlainObject|any[]} object The object or array.
     * @return {PlainObject|any[]} The cloned object.
     */
    export function cloneObject(object: PlainObject | any[]): PlainObject | any[];
    /**
     * Get the value using a path in an object.
     * @param {PlainObject|any[]} object The object or array.
     * @param {Path} path The path.
     * @param {any} [def] Value to return if no value is found in path.
     * @return {any} The found value in path.
     */
    export function get(object: PlainObject | any[], path: Path, def?: any): any;
    /**
     * Performs a deep comparison between two values to determine if they are equivalent. Plain
     * objects and arrays will be recursively iterated and primitive values and references
     * will be compared using the identity operator (===). Even though it's still a bit slower than
     * JSON.stringify(), this method works well with unsorted objects.
     * @param {any} value The first value.
     * @param {any} other The other value to compare against.
     * @return {boolean} If the objects are equal or not.
     */
    export function equals(value: any, other: any): boolean;
    /**
     * Group an array of objects using the values of a list of keys.
     * Usage:
     * <pre>
     *   var array = [{lang:'spanish', age: 2}, {lang:'spanish', age:5}, {lang:'english', age:25}]
     *   ut.groupBy(array, 'lang', function(obj) { return obj.age; })
     *   return -> { spanish: [ 2, 5 ], english: [ 25 ] }
     * </pre>
     * @param {PlainObject[]} array An array of objects.
     * @param {Path} keys The key or keys to group by.
     * @param {(item: PlainObject) => any} [iteratee] A function to modify the final grouped objects.
     * @return {PlainObject} The grouped object.
     */
    export function groupBy(array: PlainObject[], keys: Path, iteratee?: (item: PlainObject) => any): PlainObject;
    /**
     * Counts and returns the length of the given object.
     * @param {PlainObject} object The object.
     * @return {number} The length of the object.
     */
    export function objectLength(object: PlainObject): number;
    /**
     * Empty the content of an object. It uses "delete" so the object will be converted into a
     * hash table mode (slow properties).
     * @see {@link toFastProperties}
     * @param {PlainObject} object The plain object to clear.
     */
    export function clearObject(object: PlainObject): void;
    /**
     * Converts a deoptimized object (dictionary mode) into an optimized object (fast mode).
     * Objects are deoptimized when you use them like a hash table like deleting properties. You
     * can check it using the native function "%HasFastProperties(object)" running nodejs with
     * the flag "--allow-natives-syntax". This code was taken from the module "bluebird".
     * @param {Object} object The object to optimize.
     * @return {Object} Reference to the same object.
     */
    export function toFastProperties(object: any): any;
    /**
     * Returns a random boolean.
     * @return {boolean} The random boolean.
     */
    export function randomBoolean(): boolean;
    /**
     * If value has a numeric value or not. It can be a number or a string.
     * @param {any} value The value.
     * @return {value is number} If has a numeric value or not.
     */
    export function isNumeric(value: any): value is number;
    /**
     * If is a number or not.
     * @param {any} value The value.
     * @return {value is number} If is a number or not.
     */
    export function isNumber(value: any): value is number;
    /**
     * If is a string or not.
     * @param {any} value The value.
     * @return {value is string} If is a string or not.
     */
    export function isString(value: any): value is string;
    export const isArray: (arg: any) => arg is any[];
    /**
     * If is an Object or not.
     * @param {any} value The value.
     * @return {value is !Object} If is an Object or not.
     */
    export function isObject(value: any): value is any;
    /**
     * If is a plain object (not an array) or not.
     * @param {any} value The value.
     * @return {value is PlainObject} If is an Object and not an Array.
     */
    export function isPlainObject(value: any): value is PlainObject;
    /**
     * If is a boolean or not.
     * @param {any} value The value.
     * @return {value is boolean} If is a boolean or not.
     */
    export function isBoolean(value: any): value is boolean;
    /**
     * If is Function or not.
     * @param {any} value The value.
     * @return {value is Function} If is a Function or not.
     */
    export function isFunction(value: any): value is Function;
    /**
     * If is a RegExp or not.
     * @param {any} value The value.
     * @return {value is RegExp} If is a RegExp or not.
     */
    export function isRegExp(value: any): value is RegExp;
    /**
     * If is a Date or not.
     * @param {any} value The value.
     * @return {value is Date} If is a Date or not.
     */
    export function isDate(value: any): value is Date;
    /**
     * If is a number or not. NaN, Infinity or -Infinity aren't considered valid numbers.
     * @param {number} value The value.
     * @return {boolean} If is a number or not.
     */
    export function isValidNumber(value: number): boolean;
    /**
     * Calculate the log using a given base and value.
     * @param {number} base The base.
     * @param {number} value The value.
     * @return {number} The log result.
     */
    export function logN(base: number, value: number): number;
    /**
     * Execute a function N times and print the execution time.
     * @param {DataGenerator} fn The function to execute.
     * @param {number} [times=1] How many times to execute. Defaults to 1.
     * @param {string} [label='Default label']  A label to be used in the log string. Defaults to 'Default label'.
     */
    export function test(fn: DataGenerator, times?: number, label?: string): void;
    /**
     * Check if a value is inside of a given range.
     * @param {any} val The value.
     * @param {number} [min=-Infinity] Min inclusive value. Defaults to -Infinity.
     * @param {number} [max=Infinity] Max inclusive value. Defaults to Infinity.
     * @return {boolean} If the value is inside of the given range or not.
     */
    export function inRange(val: any, min?: number, max?: number): boolean;
    /**
     * Fast error builder, it doesn't have a real stacktrace but is x10 faster than
     * new Error().
     * @param {string|ErrorConstructor} [message=''] The error message. Default to empty string.
     * @param {ErrorConstructor} [constructor=Error] Optional constructor for custom errors. Defaults to ErrorConstructor.
     * @return {Error} An Error instance.
     */
    export function error(message?: string | ErrorConstructor, constructor?: ErrorConstructor): Error;
    /**
     * A simple logger.
     * @namespace logger
     * @type {{DEBUG:number, INFO: number, WARN: number, ERROR:number, NONE: number}}
     */
    export const logger: {
        DEBUG: number;
        INFO: number;
        WARN: number;
        ERROR: number;
        NONE: number;
    };
}
declare module "utjs" {
    const _exports: typeof import("lib/ut");
    export = _exports;
}
