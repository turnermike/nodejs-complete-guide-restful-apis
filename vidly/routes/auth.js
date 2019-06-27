/**
 * routes/auth.js
 *
 * - handle all /api/auth routes (loaded via index.js with path prefix)
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
 * Routes (/api/users)
 */

// // get all users
// router.get('/', async (req, res) => {

//     const allGenres = await Genres.find();

//     debug('All users requested: \n', allGenres);
//     res.send(allGenres);

// });

// // get genre by id
// router.get('/:id', async (req, res) => {

//     const genre = await Genres.findById(
//         { _id: new ObjectID(req.params.id) },
//         (err, genre) => {
//             if (err) {
//                 debug('Error: \n', err.message);
//                 // res.send({ error: err.message });
//                 res.status(404).send(`The genre with that ID ('${req.params.id}') does not exist.`);
//                 return;
//             }

//             debug('Get genre by ID: \n', genre);
//             res.send(genre);
//         }
//     );

// });

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

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));           // use _.pick to select with properties to send
    // res.send(token);


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
