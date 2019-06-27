/**
 * middleware/error.js
 *
 *
 */

const winston = require('winston');
const config = require('config');

module.exports = function(err, req, res, next){

    // console.log('errorLogToFile', config.get('errorLogToFile'));

    // log to file
    // if (config.get('errorLogToFile')) {


        winston.error(err.message, err);

    // }




    res.status(500).send('Something failed');

}
