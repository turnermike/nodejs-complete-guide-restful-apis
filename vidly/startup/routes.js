/**
 * startup/routes.js
 *
 * Load routes and middleware.
 *
 */
const express = require('express');
const helmet = require('helmet');
const error = require('../middleware/error');        // error handling middleware
const genres = require('../routes/genres');          // genres router
const customers = require('../routes/customers');    // customers router
const movies = require('../routes/movies');          // movies router
const rentals = require('../routes/rentals');        // rentals router
const users = require('../routes/users');            // users router
const auth = require('../routes/auth');              // auth router
const home = require('../routes/home');              // default/base router

module.exports = function(app) {

    app.use(express.json());                            // use express.json middleware in request processing pipeline
    app.use(express.urlencoded({ extended: true }));    // allow use of key/value pairs has post data
    app.use(express.static('public'));                  // set public directory
    app.use(helmet());                                  // helps secure http headers
    app.use('/api/customers', customers);               // use the customs router object for any routes starting with /api/customers
    app.use('/api/genres', genres);                     // use the genres router object for any routes starting with /api/genres
    app.use('/api/movies', movies);                     // use the movies router object for any routes starting with /api/movies
    app.use('/api/rentals', rentals);                   // use the rentals router object for any routes starting with /api/rentals
    app.use('/api/users', users);                       // use the users router object for any routes starting with /api/users
    app.use('/api/auth', auth);                         // use the auth router object for any routes starting with /api/auth
    app.use('/', home);                                 // use home router object for any routes starting with /
    app.use(error);                                     // use error handling middleware

}