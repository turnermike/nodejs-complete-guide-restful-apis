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
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'Name must have at least 2 characters'],
        maxlength: [255, 'Name must have a maximum of 255 characters'],
        trim: true
    }
});
const Genres = mongoose.model('Genres', genreSchema);

/**
 * Routes (/api/courses)
 */

// get all courses
router.get('/', async (req, res) => {

    const allGenres = await Genres.find();
    debug('All genres requested: \n', allGenres)
    res.send(allGenres);

});

// get genre by id
router.get('/:id', async (req, res) => {

    const genre = await Genres.findById(new ObjectID(req.params.id), (err, genre) => {

        if (err) {
            debug('Error: \n', err.message);
            res.send({ 'error': err.message });
            return;
        }

        debug('Get genre by ID: \n', genre);
        res.send(genre);

    });

});

// add new genre
router.post('/', (req, res) => {

    const { error } = validateGenres(req.body);

    if ( error ) return res.status(400).send(error.details[0].message);

    const genre = new Genres({
        name: req.query.name
    });

    const result = genre.save();   // .save() returns a promise

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
router.put('/:id', (req, res) => {

    const query = { _id: new ObjectID(req.params.id) };

    const newData = {
        name: req.query.name,
    };

    const options = { upsert: true };

    const { error } = validateGenres(newData);
    if ( error ) return res.status(400).send(error.details[0].message);

    const result = Genres.updateOne(query, newData, options).exec();

    result
        .then(result => {
            debug('Updated genre: \n', result);
            res.send(req.params);
        })
        .catch(err => {
            debug('Update error: \n', err);
            res.send(err);
        });

});

// delete genre by id
router.delete('/:id', (req, res) => {

    Genres.deleteOne({ _id: new ObjectID(req.params.id)}, (err, result) => {

        if (err) {
            debug('Error: ', err);
            res.status(400).send(err.details[0].message);
        }

        debug('Deleted genre: ', result);

        if(result.deletedCount){
            res.send(result);
        }else{
            res.status(400).send(`No record found with the ID: ${req.params.id}`);
        }

    });

});

function validateGenres(genre) {

    debug('validateGenres', genre)

    const schema = {
        name: Joi.string().required()
    };

    return Joi.validate(genre, schema);

}

module.exports = router;