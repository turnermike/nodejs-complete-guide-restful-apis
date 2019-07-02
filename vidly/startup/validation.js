/**
 * startup/validation.js
 *
 * Using Joi for Mongo Schema validation.

 *
 */

const Joi = require('joi');

module.exports = function() {

    Joi.objectId = require('joi-objectid')(Joi);

}