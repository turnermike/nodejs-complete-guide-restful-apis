const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
require('express-async-errors');
const debug = require('debug')('app:startup');      // requires env var: export DEBUG=app:startup,app:db
const logger = require('./middleware/logger');      // middleware
const error = require('./middleware/error');        // error handling middleware
// const courses = require('./routes/courses');        // course router
const genres = require('./routes/genres');          // genres router
const customers = require('./routes/customers');    // customers router
const movies = require('./routes/movies');          // movies router
const rentals = require('./routes/rentals');        // rentals router
const users = require('./routes/users');            // users router
const auth = require('./routes/auth');              // auth router
const home = require('./routes/home');              // default/base router
const port = process.env.PORT || 3000;

// initialize middelware
const app = express();
app.set('view engine', 'pug');                      // pug templating engine
app.set('views', './views');                        // template location (views is default)
app.use(express.json());                            // use express.json middleware in request processing pipeline
app.use(express.urlencoded({ extended: true }));    // allow use of key/value pairs has post data
app.use(express.static('public'));                  // set public directory
app.use(helmet());                                  // helps secure http headers
// app.use('/api/courses', courses);                   // use the courses router object for any routes starting with /api/courses
app.use('/api/customers', customers);               // use the customs router object for any routes starting with /api/customers
app.use('/api/genres', genres);                     // use the genres router object for any routes starting with /api/genres
app.use('/api/movies', movies);                     // use the movies router object for any routes starting with /api/movies
app.use('/api/rentals', rentals);                   // use the rentals router object for any routes starting with /api/rentals
app.use('/api/users', users);                       // use the users router object for any routes starting with /api/users
app.use('/api/auth', auth);                         // use the auth router object for any routes starting with /api/auth
app.use('/', home);                                 // use home router object for any routes starting with /
app.use(error);                                     // use error handling middleware

// output app info
console.log(`Application Name: ${config.get('name')}`);
console.log(`MongoDB URL: ${config.get('mongodb')}`);
console.log(`jwtPrivateKey: ${config.get('jwtPrivateKey')}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log('app.get("env"):', app.get('env'));

// environment specific middleware
if (app.get('env') === 'development'){
    app.use(morgan('tiny'));                            // logs requests to terminal
    debug('Morgan enabled...');
    app.use(logger);                                    // example of a custom middleware
}

// check for JWT token
if (! config.get('jwtPrivateKey') || config.get('jwtPrivateKey') == '') {
    debug('Error: ', 'jwtPrivateKey is not defined');
    process.exit(1);
}

// connect to mongodb
mongoose.connect(config.get('mongodb'), { useNewUrlParser: true, useFindAndModify: false })
    .then( () => debug('Connected to MongoDB'))
    .catch(err => debug('Error: ', err));
mongoose.set('useCreateIndex', true);

// start server
app.listen(port, () => { console.log(`Listening on port ${port}`) });
