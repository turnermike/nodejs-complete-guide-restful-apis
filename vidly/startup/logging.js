/**
 * startup/logging.js
 *
 * Log unhandled rejections.
 * Log unhandled promise rejections.
 *
 * Morgan - HTTP request logger middleware.
 * https://www.npmjs.com/package/morgan
 *
 * Debug - tiny debugging utility
 * https://www.npmjs.com/package/debug
 *
 */

require('express-async-errors');
const logger = require('../middleware/logger');
const morgan = require('morgan');
const config = require('config');
const debug = require('debug')('app:startup');      // requires env var: export DEBUG=app:startup,app:db

module.exports = function(app) {

    const devEnvs = ['development', 'test'];

    // output app info
    if(devEnvs.includes(app.get('env'))) {
    // if (app.get('env') === 'development') {
        debug(`Application Name: ${config.get('name')}`);
        debug(`MongoDB URL: ${config.get('mongodb')}`);
        debug(`jwtPrivateKey: ${config.get('jwtPrivateKey')}`);
        debug(`NODE_ENV: ${process.env.NODE_ENV}`);
        debug('app.get("env"):', app.get('env'));
    }

    // log any express uncaught exceptions
    process.on('uncaughtException', (ex) => {
        logger.log({
            level: 'error',
            message: ex.message
        });
        // process.exit(1);
    })

    // log any unhandled promise rejections
    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    // use morgan http request logger for development only
    if (app.get('env') === 'development'){
        app.use(morgan('tiny'));                        // logs requests to terminal
        logger.info('Morgan enabled...');
    }

}