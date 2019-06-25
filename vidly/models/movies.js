/**
 * modles/movies.js
 *
 * Define and validate a movie object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');
const { genresSchema } = require('./genres');

// initialize movies collection schema
const Movies = mongoose.model(
    'Movies',
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            minlength: [2, 'Name must have at least 2 characters'],
            maxlength: [255, 'Name must have a maximum of 255 characters'],
            trim: true
        },
        genre: {
            // type: genresSchema,
            type: String,
            required: true
        },
        numberInStock: {
            type: Number,
            required: true,
            min: 0,
            max: 255
        },
        dailyRentalRate: {
            type: Number,
            require: true,
            min: 0,
            max: 255
        }
    })
);

function validateMovies(movie) {

    // debug('validateMovies', movie);

    const schema = {
        title: Joi.string().min(2).max(255).required(),
        genre: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    };

    return Joi.validate(movie, schema);

}

exports.Movies = Movies;
exports.validate = validateMovies;