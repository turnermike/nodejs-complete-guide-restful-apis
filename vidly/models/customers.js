/**
 * modles/customers.js
 *
 * Define and validate a customer object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');

// initialize customers collection schema
const Customers = mongoose.model(
    'Customers',
    new mongoose.Schema({
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
);

function validateCustomers(customer) {

    // debug('validateCustomers', customer);

    const schema = {
        name: Joi.string().min(2).max(255).required(),
        phone: Joi.string().min(2).max(255).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);

}

exports.Customers = Customers;
exports.validate = validateCustomers;