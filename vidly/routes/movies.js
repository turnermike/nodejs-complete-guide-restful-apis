/**
 * routes/movies.js
 *
 * - handle all /api/movies routes (loaded via index.js with path prefix)
 *
 */

const { Movies, validate } = require('../models/movies');
const { Genres } = require('../models/genres');
const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
// const morgan = require('morgan');
const router = express.Router();

/**
 * Routes (/api/movies)
 */

// get all movies
router.get('/', async (req, res) => {

    const allMovies = await Movies.find();

    debug('All movies requested: \n', allMovies);
    res.send(allMovies);

});

// get movie by id
router.get('/:id', async (req, res) => {

    const movies = await Movies.findById(
        { _id: new ObjectID(req.params.id) },
        (err, movies) => {
            if (err) {
                debug('Error: \n', err.message);
                // res.send({ error: err.message });
                res.status(404).send(`The movies with that ID ('${req.params.id}') does not exist.`);
                return;
            }

            debug('Get movies by ID: \n', movies);
            res.send(movies);
        }
    );

});

// add new movie
router.post('/', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let movie = new Movies({
        title: req.body.title,
        genre: req.body.genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    const result = movie.save(); // .save() returns a promise

    result
        .then(result => {
            debug('New movie added: \n', result);
            res.send(result);
        })
        .catch(err => {
            debug('Insert movie error: \n', err.errors);
            res.send(err.errors);
        });

});

// update a movie
router.put('/:id', async (req, res) => {

    // validate
    const { error } = validate(req.body);
    if (error ) return res.status(400).send(error.details[0].message);

    // find/update
    try{
        const movie = await Movies.findByIdAndUpdate(
            { _id: new ObjectID(req.params.id) },
            {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold
            },
            { upsert: true, new: true }
        );
        debug('Updated movie: ', movie);
        res.send(movie);

    }
    catch(err) {
        debug('Update movie error: ', err.message);
        res.send(err.message);
    }

});

// delete movie by id
router.delete('/:id', async (req, res) => {

    try{

        const movie = await Movies.findByIdAndRemove({ _id: new ObjectID(req.params.id) });

        res.send(movie);

    }
    catch(err) {

        debug('Delete Genre error: ', err.message);
        res.send(err.message);

    }

});

module.exports = router;
