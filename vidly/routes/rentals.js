/**
 * routes/rentals.js
 *
 * - handle all /api/rentals routes (loaded via index.js with path prefix)
 *
 */

const { Rentals, validate } = require('../models/rentals');
const { Movies } = require('../models/movies');
const { Customers } = require('../models/customers');
const logger = require('../middleware/logger');
const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const router = express.Router();

Fawn.init(mongoose);        // Fawn is used to handle multiple database transactions

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
 * - inserts a sub document for the genre field
 * - using Fawn to handle multiple transactions:
 * https://github.com/e-oj/Fawn
 *
 */
router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    debug('error: ', error);

    const customer = await Customers.findById(new ObjectID(req.body.customerId));
    if (! customer) return res.status(400).send(error.details[0].message);
    // debug('customer: ' + customer);

    const movie = await Movies.findById(new ObjectID(req.body.movieId));
    if (! movie) return res.status(400).send('Invalid movie ID');
    // debug('movie: ' + movie);

    if(movie.numberInStock <= 0) return res.status(400).send('Movie not in stock');

    // add new rental document
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
    // rental.save();

    try{

        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

    }
    catch(err) {
        res.status(500).send('Something failed');
    }


    logger.info('Rental added:', rental);
    res.send(rental);

});

module.exports = router;
