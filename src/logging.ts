/**
 * A simple logger.
 * @namespace logger
 */
const logger = {
  /**
   * The log level debug.
   * @type {Number}
   * @memberOf logger
   */
  DEBUG: 1,

  /**
   * The log level info.
   * @type {Number}
   * @memberOf logger
   */
  INFO: 2,

  /**
   * The log level warn.
   * @type {Number}
   * @memberOf logger
   */
  WARN: 3,

  /**
   * The log level error.
   * @type {Number}
   * @memberOf logger
   */
  ERROR: 4,

  /**
   * Disable all logs.
   * @type {Number}
   * @memberOf  logger
   */
  NONE: Number.MAX_VALUE,

  _logLevel: 1,
  _usingDate: true,
  _prettify: false,

  /**
   * Set the log level.
   * @param {Number} logLevel The new log level.
   * @memberOf logger
   */
  setLogLevel: function setLogLevel(logLevel) {
    this._logLevel = logLevel;
  },

  /**
   * If date will appear in the log string or not.
   * @param {Boolean} usingDate If using date or not.
   * @memberOf logger
   */
  setUsingDate: function setUsingDate(usingDate) {
    this._usingDate = usingDate;
  },

  /**
   * If plain objects should be printed prettified or not.
   * @param {Boolean} prettify If prettify plain objects or not.
   * @memberOf logger
   */
  setPrettify: function setPrettify(prettify) {
    this._prettify = prettify;
  },

  /**
   * Print a debug log.
   * @param {...*} args The arguments
   * @memberOf logger
   */
  debug: function debug(...args) {
    if (this._checkLogLevel(1)) {
      process.stdout.write(
        this._createHeader('[DEBUG] ') + this._createbody(args)
      );
    }
  },

  /**
   * Print a info log.
   * @param {...*} args The arguments
   * @memberOf logger
   */
  info: function info(...args) {
    if (this._checkLogLevel(2)) {
      process.stdout.write(
        this._createHeader('[INFO] ') + this._createbody(args)
      );
    }
  },

  /**
   * Print a warn log.
   * @param {...*} args The arguments
   * @memberOf logger
   */
  warn: function warn(...args) {
    if (this._checkLogLevel(3)) {
      process.stdout.write(
        this._createHeader('[WARN] ') + this._createbody(args)
      );
    }
  },

  /**
   * Print a error log.
   * @param {...*} args The arguments
   * @memberOf logger
   */
  error: function loggerError(...args) {
    if (this._checkLogLevel(4)) {
      process.stdout.write(
        this._createHeader('[ERROR] ') + this._createbody(args)
      );
    }
  },

  _createHeader: function _createHeader(label) {
    if (this._usingDate) {
      return `${now()} ${label}`;
    }

    return label;
  },

  _createbody: function _createbody(args) {
    if (args.length > 0) {
      let data = '';
      const { length } = args;

      for (let i = 0; i < length; i++) {
        const arg = args[i];

        if (isObject(arg)) {
          if (arg instanceof Error) {
            data += arg.stack ? arg.stack : `Error: ${arg.message}`;
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

  _checkLogLevel: function _checkLogLevel(methodLogLevel) {
    return this._logLevel <= methodLogLevel;
  },
};
