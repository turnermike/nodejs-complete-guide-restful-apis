/**
 * modles/rentals.js
 *
 * Define and validate a rental object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// initialize customers collection schema
const rentalsSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: [2, 'Name must have at least 2 characters'],
                maxlength: [255, 'Name must have a maximum of 255 characters'],
                trim: true
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: [2, 'Name must have at least 2 characters'],
                maxlength: [255, 'Name must have a maximum of 255 characters'],
                trim: true
            }

        })
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: [2, 'Name must have at least 2 characters'],
                maxlength: [255, 'Name must have a maximum of 255 characters'],
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                require: true,
                min: 0,
                max: 255
            }
        })
    },
    dateOut: {
        type: Date,
        requied: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});


// static method
rentalsSchema.statics.lookup = function(customerId, movieId) {

    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });

}

// instance method
rentalsSchema.methods.return = function() {

    const diffTime = Math.abs(this.dateOut.getTime() - new Date().getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const fee = diffDays * this.movie.dailyRentalRate;
    this.rentalFee = fee;
    // debug('diffTime', diffTime);
    // debug('diffDays', diffDays);
    // debug('this.movie.dailyRentalRate', this.movie.dailyRentalRate);
    // debug('fee', fee);

}

const Rentals = mongoose.model('Rentals', rentalsSchema);

function validateRentals(rental) {

    // debug('validateRentals', rental);

    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);

}

exports.Rentals = Rentals;
exports.validate = validateRentals;
