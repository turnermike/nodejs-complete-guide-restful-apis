/** * routes/movies.js *
 * - handle all /api/movies routes (loaded via index.js with path prefix)
 *
 */

const { Movies, validate } = require('../models/movies');
const { Genres } = require('../models/genres');
const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const router = express.Router();

/**
 * Routes (/api/movies)
 */

/**
 * Get all movies
 *
 */
router.get('/', async (req, res) => {

    const allMovies = await Movies.find();

    debug('All movies requested: \n', allMovies);
    res.send(allMovies);

});

/**
 * Get movie by ID
 *
 */
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

/**
 * Add new movie
 *
 * inserts a sub document for the genre field
 *
 */
router.post('/', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try{

        // const genre = Genres.findById(new ObjectID(req.body.genre), (err, genre) => {
        const genre = Genres.findById({ _id: req.body.genre }, (err, genre) => {

            if(err) {
                debug('Error: \n', err.message);
                return;
            }

            // validate genre id
            if(! genre) return res.status(400).send('Invalid genre ID');

            let movie = new Movies({
                title: req.body.title,
                // genre,                   // the whole genre document
                genre: {                    // selected fields
                    _id: genre._id,
                    name: genre.name
                },
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

    }
    catch(err) {

        res.send(err.message);

    }

});

/**
 * Update a movie
 *
 */
router.put('/:id', async (req, res) => {

    // validate
    const { error } = validate(req.body);
    if (error ) return res.status(400).send(error.details[0].message);

    // get the genre document
    const genre = await Genres.findById(new ObjectID(req.body.genre));
    // console.log('genre', genre);

    if(! genre) return res.status(400).send('Invalid genre ID');

    // find/update
    try{

        const movie = await Movies.findByIdAndUpdate(
            { _id: new ObjectID(req.params.id) },
            {
                title: req.body.title,
                // genre,                   // the whole genre document
                genre: {                    // selected fields
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
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

/**
 * Delete movie by ID
 *
 */
router.delete('/:id', async (req, res) => {

    try{

        const movie = await Movies.findByIdAndRemove({ _id: new ObjectID(req.params.id) });
        // debug('movie', movie);

        if(movie){
            res.send(movie);
        }else{
            res.send('That Movie ID was not found.');
        }


    }
    catch(err) {

        debug('Delete movie error: ', err.message);
        res.send(err.message);

    }

});

module.exports = router;
