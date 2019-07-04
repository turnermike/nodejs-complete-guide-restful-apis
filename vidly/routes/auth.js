/**
 * routes/auth.js
 *
 * - handle all /api/auth routes (loaded via index.js with path prefix)
 * - no logout functionality, needs to be handled on client side by deleting the JWT
 *
 */

const { Users } = require ('../models/users');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const morgan = require('morgan');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const config = require('config');
const router = express.Router();

// passwordX1$
const passwordComplexityOptions = {
    min: 5,
    max: 255,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
};

/**
 * Routes (/api/auth)
 */

// login/authenticate user
router.post('/', async (req, res) => {

    // validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check for existing user
    let user = await Users.findOne({ email: req.body.email });
    if (! user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (! validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();

    // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));           // use _.pick to select with properties to send
    // res.header('x-auth-token', token).send(token);
    res.send(token);
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDEyNzY2YTc5NTgzODBkZmE5NWQzYmIiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NjE2NDgzNTN9.JjU67jcZDm5GU8rDhCH2nuRo3nXdBysD2QAg8cxEuqw

});


// validation
function validate(req) {

    // debug('validateUsers', req);

    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: new PasswordComplexity(passwordComplexityOptions).required()
    };

    return Joi.validate(req, schema);

}

module.exports = router;
