/**
 * config/winston.js
 *
 * Available logging levels:
 *
 * error: 0,
 * warn: 1,
 * info: 2,
 * verbose: 3,
 * debug: 4,
 * silly: 5
 *
 * Example of logging:
 *
 * const logger = require('../config/winston');
 *
 * logger.log({
 *   level: 'debug',
 *   message: 'Testing INFO log.',
 *   additional: { test1: 'hello', test2: 'goodbye' },
 *   // more: 'passed along'
 * });
 *
 */
const _ = require('lodash');
const appRoot = require('app-root-path');
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');
const config = require('config');

// winston options
var options = {

    // default formatting options
    format: format.combine(

        // format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf(info => `[${info.level}]: ${info.timestamp} ${info.message} ${JSON.stringify(info.additional)}`)
        // format.splat(),
        // format.simple(),
        // format.json(),
        // format.prettyPrint(),
    ),


    file: {
        level: 'silly', // silly will accept all other logging levels
        filename: `${appRoot}/logs/errors.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,

    },

    console: {
        level: 'silly',
        handleExceptions: true,
        json: false,
        colorize: true
    },

    mongodb: {
        level: 'silly',
        db: config.get('mongodb')
    }

};

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
    level: 'info',
    format: options.format,
    transports: [
        new transports.File(options.file),
        new transports.MongoDB(options.mongodb)
        // see environment conditional below for console
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

// use console for dev/staging only
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console(options.console));
}

module.exports = logger;