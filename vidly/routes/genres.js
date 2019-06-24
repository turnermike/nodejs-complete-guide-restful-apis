/**
 * routes/courses.js
 *
 * - handle all /api/courses routes (loaded via index.js with path prefix)
 *
 */

const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const morgan = require('morgan');
const Joi = require('joi');
const router = express.Router();

// // connect to mongodb
// mongoose.connect('mongodb://localhost/node-restful-api', { useNewUrlParser: true, useFindAndModify: false })
//     .then( () => debug('Connected to MongoDB'))
//     .catch(err => debug('Error: ', err));

// initialize genre collection schema
const Genres = mongoose.model(
    'Genres',
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: [2, 'Name must have at least 2 characters'],
            maxlength: [255, 'Name must have a maximum of 255 characters'],
            trim: true,
        },
    })
);

/**
 * Routes (/api/courses)
 */

// get all courses
router.get('/', async (req, res) => {

    const allGenres = await Genres.find();

    debug('All genres requested: \n', allGenres);
    res.send(allGenres);

});

// get genre by id
router.get('/:id', async (req, res) => {

    const genre = await Genres.findById(
        { _id: new ObjectID(req.params.id) },
        (err, genre) => {
            if (err) {
                debug('Error: \n', err.message);
                // res.send({ error: err.message });
                res.status(404).send(`The genre with that ID ('${req.params.id}') does not exist.`);
                return;
            }

            debug('Get genre by ID: \n', genre);
            res.send(genre);
        }
    );

});

// add new genre
router.post('/', (req, res) => {

    const { error } = validateGenres(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genres({
        name: req.query.name,
    });

    const result = genre.save(); // .save() returns a promise

    result
        .then(result => {
            debug('New genre added: \n', result);
            res.send(result);
        })
        .catch(err => {
            debug('Insert error: \n', err.errors);
            res.send(err.errors);
        });

});

// update a genre
router.put('/:id', async (req, res) => {

    // validate
    const { error } = validateGenres(req.body);
    if (error ) return res.status(400).send(error.details[0].message);

    // find/update
    try{
        const genre = await Genres.findByIdAndUpdate(
            { _id: new ObjectID(req.params.id) },
            { name: req.body.name },
            { upsert: true, new: true }
        );
        debug('Updated genre: ', genre);
        res.send(genre);

    }
    catch(err) {
        debug('Update Genre error: ', err.message);
        res.send(err.message);
    }


});

// delete genre by id
router.delete('/:id', async (req, res) => {

    try{

        const genre = await Genres.findByIdAndRemove({ _id: new ObjectID(req.params.id) });

        res.send(genre);

    }
    catch(err) {

        debug('Delete Genre error: ', err.message);
        res.send(err.message);

    }

});

function validateGenres(genre) {

    // debug('validateGenres', genre);

    const schema = {
        name: Joi.string().required(),
    };

    return Joi.validate(genre, schema);

}

module.exports = router;
