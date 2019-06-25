/**
 * routes/users.js
 *
 * - handle all /api/users routes (loaded via index.js with path prefix)
 *
 */

const { Users, validate } = require ('../models/users');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const router = express.Router();

// passwordX1$

/**
 * Routes (/api/users)
 */

// get all users
router.get('/', async (req, res) => {

    const allGenres = await Genres.find();

    debug('All users requested: \n', allGenres);
    res.send(allGenres);

});

// get genre by id
router.get('/:id', async (req, res) => {

    const genre = await Genres.findById(
        { _id: new ObjectID(req.params.id) },
        (err, genre) => {
            if (err) {
                debug('Error: \n', err.message);
                // res.send({ error: err.message });
                res.status(404).send(`The genre with that ID ('${req.params.id}') does not exist.`);
                return;
            }

            debug('Get genre by ID: \n', genre);
            res.send(genre);
        }
    );

});

// add new user
router.post('/', async (req, res) => {

    // validate
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check for existing user
    let user = await Users.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    // hash password
    const salt = await bcrypt.genSalt(10);

    // reset user object with new data
    user = new Users(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, salt);

    // user = new Users({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    await user.save();

    // use _.pick to select with properties to send
    res.send(_.pick(user, ['_id', 'name', 'email']));

});

module.exports = router;
