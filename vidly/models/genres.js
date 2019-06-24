/**
 * modles/genres.js
 *
 * Define and validate a genre object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');

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

function validateGenres(genre) {

    // debug('validateGenres', genre);

    const schema = {
        name: Joi.string().required(),
    };

    return Joi.validate(genre, schema);

}

exports.Genres = Genres;
exports.validate = validateGenres;