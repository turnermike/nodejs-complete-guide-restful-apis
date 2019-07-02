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

    // connect to mongodb
    mongoose.connect(config.get('mongodb'), { useNewUrlParser: true, useFindAndModify: false })
        .then( () => logger.info('Connected to MongoDB'))
        // .catch(err => debug('Error: ', err));
    mongoose.set('useCreateIndex', true);

 }