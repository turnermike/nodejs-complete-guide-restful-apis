const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const config = require('config');
const logger = require('./middleware/logger');      // initialize winston middleware
const port = process.env.PORT || 3000;

const app = express();                              // initialize express
require('./startup/logging')(app);                  // initialize error logging
require('./startup/config')();                        // initialize config options
require('./startup/routes')(app);                   // load routes
require('./startup/db')();                          // load db connection
require('./startup/validation');                    // load Joi validation module

// basic pug templating example
app.set('view engine', 'pug');                      // pug templating engine
app.set('views', './views');                        // template location (views is default)



// start server
app.listen(port, () => { logger.info(`Listening on port ${port}`) });





// thow an exception for testing
// throw new Error('Delibertly thrown Exception for testing');
// thow a promise rejection for testing
// const p = Promise.reject(new Error('Delibertly thrown Promise Rejection'));

// // example of logging a message
// logger.log({
//   level: 'debug',
//   message: 'Testing INFO log.',
//   additional: { test1: 'hello', test2: 'goodbye' },
//   // more: 'passed along'
// });