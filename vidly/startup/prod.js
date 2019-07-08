/**
 * startup/prod.js
 *
 * Use this to import middleware for production environment only.
 *
 */

const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app) {

    app.use(helmet());
    app.use(compression());

}