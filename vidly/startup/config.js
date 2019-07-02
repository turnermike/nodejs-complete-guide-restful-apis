/**
 * startup/config.js
 *
 *
 */

const config = require('config');

module.exports = function() {

    // check for JWT token
    if (! config.get('jwtPrivateKey') || config.get('jwtPrivateKey') == '') {
        // logger.error('Error: ', 'jwtPrivateKey is not defined');
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
        // process.exit(1);
    }

}