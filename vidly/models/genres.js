/**
 * modles/genres.js
 *
 * Define and validate a genre object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');

// schema
const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        minlength: [5, 'Name must have at least 2 characters'],
        maxlength: [50, 'Name must have a maximum of 255 characters'],
        trim: true,
    }
});

// model
const Genres = mongoose.model('Genres', genresSchema);

// validation
function validateGenres(genre) {

    // debug('validateGenres', genre);

    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);

}

exports.genresSchema = genresSchema;
exports.Genres = Genres;
exports.validate = validateGenres;