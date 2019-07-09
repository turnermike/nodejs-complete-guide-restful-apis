/**
 * startup/db.js
 *
 * MongoDB connection.
 *
 */

const mongoose = require('mongoose');
const config = require('config');
const logger = require('../middleware/logger');

module.exports = function() {

    const connStr = (process.env.NODE_ENV === 'production') ? process.env.mongodb : config.get('mongodb');

    // connect to mongodb
    mongoose.connect(connStr, { useNewUrlParser: true, useFindAndModify: false })
        .then( () => logger.info(`Connected to MongoDB: ${connStr}`))
        // .catch(err => debug('Error: ', err));
    mongoose.set('useCreateIndex', true);

}