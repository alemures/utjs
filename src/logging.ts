import { now } from './date';
import { isArray, isObject, isPlainObject } from './type';

/**
 * A simple logger.
 * @namespace logger
 */
export const logger = {
  /**
   * The log level debug.
   * @memberOf logger
   */
  DEBUG: 1,

  /**
   * The log level info.
   * @memberOf logger
   */
  INFO: 2,

  /**
   * The log level warn.
   * @memberOf logger
   */
  WARN: 3,

  /**
   * The log level error.
   * @memberOf logger
   */
  ERROR: 4,

  /**
   * Disable all logs.
   * @memberOf logger
   */
  NONE: Number.MAX_VALUE,

  _logLevel: 1,
  _usingDate: true,
  _prettify: false,

  /**
   * Set the log level.
   * @param logLevel The new log level.
   * @memberOf logger
   */
  setLogLevel: function setLogLevel(logLevel: number) {
    this._logLevel = logLevel;
  },

  /**
   * If date will appear in the log string or not.
   * @param usingDate If using date or not.
   * @memberOf logger
   */
  setUsingDate: function setUsingDate(usingDate: boolean) {
    this._usingDate = usingDate;
  },

  /**
   * If plain objects should be printed prettified or not.
   * @param prettify If prettify plain objects or not.
   * @memberOf logger
   */
  setPrettify: function setPrettify(prettify: boolean) {
    this._prettify = prettify;
  },

  /**
   * Print a debug log.
   * @param args The arguments
   * @memberOf logger
   */
  debug: function debug(...args: unknown[]) {
    if (this._checkLogLevel(1)) {
      process.stdout.write(
        this._createHeader('[DEBUG] ') + this._createbody(args)
      );
    }
  },

  /**
   * Print a info log.
   * @param args The arguments
   * @memberOf logger
   */
  info: function info(...args: unknown[]) {
    if (this._checkLogLevel(2)) {
      process.stdout.write(
        this._createHeader('[INFO] ') + this._createbody(args)
      );
    }
  },

  /**
   * Print a warn log.
   * @param args The arguments
   * @memberOf logger
   */
  warn: function warn(...args: unknown[]) {
    if (this._checkLogLevel(3)) {
      process.stdout.write(
        this._createHeader('[WARN] ') + this._createbody(args)
      );
    }
  },

  /**
   * Print a error log.
   * @param args The arguments
   * @memberOf logger
   */
  error: function loggerError(...args: unknown[]) {
    if (this._checkLogLevel(4)) {
      process.stdout.write(
        this._createHeader('[ERROR] ') + this._createbody(args)
      );
    }
  },

  _createHeader: function _createHeader(label: string) {
    if (this._usingDate) {
      return `${now()} ${label}`;
    }

    return label;
  },

  _createbody: function _createbody(args: unknown[]) {
    if (args.length > 0) {
      let data = '';
      const { length } = args;

      for (let i = 0; i < length; i++) {
        const arg = args[i];

        if (isObject(arg)) {
          if (arg instanceof Error) {
            data += arg.stack ?? `Error: ${arg.message}`;
          } else if (this._prettify && (isArray(arg) || isPlainObject(arg))) {
            data += JSON.stringify(arg, null, 2);
          } else {
            data += JSON.stringify(arg);
          }
        } else {
          data += arg;
        }

        if (i < length - 1) {
          data += ' ';
        }
      }

      return `${data}\n`;
    }

    return '\n';
  },

  _checkLogLevel: function _checkLogLevel(methodLogLevel: number) {
    return this._logLevel <= methodLogLevel;
  },
};
