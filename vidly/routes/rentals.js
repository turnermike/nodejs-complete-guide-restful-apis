/**
 * routes/rentals.js
 *
 * - handle all /api/rentals routes (loaded via index.js with path prefix)
 *
 */

const { Rentals, validate } = require('../models/rentals');
const { Movies } = require('../models/movies');
const { Customers } = require('../models/customers');
const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const router = express.Router();

/**
 * Routes (/api/rentals)
 */

/**
 * Get all rentals
 *
 */
router.get('/', async (req, res) => {

    const allRentals = await Rentals.find().sort('-dateOut');

    debug('All rentals requested: \n', allRentals);
    res.send(allRentals);

});

/**
 * Get rental by ID
 *
 */
router.get('/:id', async (req, res) => {

    const rental = await Rentals.findById(
        { _id: new ObjectID(req.params.id) },
        (err, rental) => {
            if (err) {
                debug('Error: \n', err.message);
                // res.send({ error: err.message });
                res.status(404).send(`The rental with that ID ('${req.params.id}') does not exist.`);
                return;
            }

            debug('Get rental by ID: \n', rental);
            res.send(rental);
        }
    );

});

/**
 * Add new rental
 *
 * inserts a sub document for the genre field
 *
 */
router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findById(new ObjectID(req.body.customerId));
    if (! customer) return res.status(400).send(error.details[0].message);
    // console.log('customer', customer);

    const movie = await Movies.findById(new ObjectID(req.body.movieId));
    if (! movie) return res.status(400).send('Invalid movie ID');
    // console.log('movie', movie);

    if(movie.numberInStock <= 0) return res.status(400).send('Movie not in stock');

    let rental = new Rentals({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    rental = await rental.save();

    // adjust inventory
    movie.numberInStock--;
    movie.save();

    debug('Rental added: \n', rental);
    res.send(rental);



    // try{

    //     // const genre = Genres.findById(new ObjectID(req.body.genre), (err, genre) => {
    //     const genre = Genres.findById({ _id: req.body.genre }, (err, genre) => {

    //         if(err) {
    //             debug('Error: \n', err.message);
    //             return;
    //         }

    //         // validate genre id
    //         if(! genre) return res.status(400).send('Invalid genre ID');

    //         let movie = new Movies({
    //             title: req.body.title,
    //             // genre,                   // the whole genre document
    //             genre: {                    // selected fields
    //                 _id: genre._id,
    //                 name: genre.name
    //             },
    //             numberInStock: req.body.numberInStock,
    //             dailyRentalRate: req.body.dailyRentalRate
    //         });

    //         const result = movie.save(); // .save() returns a promise

    //         result
    //             .then(result => {
    //                 debug('New movie added: \n', result);
    //                 res.send(result);
    //             })
    //             .catch(err => {
    //                 debug('Insert movie error: \n', err.errors);
    //                 res.send(err.errors);
    //         });

    //     });

    // }
    // catch(err) {

    //     res.send(err.message);

    // }

});

module.exports = router;
