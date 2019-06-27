/**
 * modles/users.js
 *
 * Define and validate a user object.
 *
 */

const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const jwt = require('jsonwebtoken');
const config = require('config');

// joi-password-complexity options
const passwordComplexityOptions = {
    min: 5,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
};

// schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 5,
        max: 50
    },
    email: {
        type: String,
        required: true,
        min: 5,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 1024
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

// schema/model
const Users = mongoose.model('Users', userSchema);

// validation
function validateUsers(user) {

    // debug('validateUsers', user);

    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).email().required(),
        // password: Joi.string().min(5).max(1024).required()
        password: new PasswordComplexity(passwordComplexityOptions).required()
    };

    return Joi.validate(user, schema);

}

exports.Users = Users;
exports.validate = validateUsers;
