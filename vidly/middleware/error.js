/**
 * middleware/error.js
 *
 * Will only catch errors associated with Express request processing pipeline.
 * Will ignore errors outside the context of Express.
 *
 */

// const winston = require('winston');
const logger = require('../config/winston');
const config = require('config');
const debug = require('debug')('app:db');

module.exports = function(err, req, res, next){

    logger.error(err.message);
    // winston.error(err.message);
    // winston.error(err.message, err);    // second argument is for meta data but doens't work with winston-monbodb

    // debug('Exception: ', err.message) ;

    res.status(500).send(err.message);


}
