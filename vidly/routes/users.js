/**
 * routes/users.js
 *
 * - handle all /api/users routes (loaded via index.js with path prefix)
 *
 */

const { Users, validate } = require ('../models/users');
const auth = require('../middleware/auth');
const logger = require('../middleware/logger');
const _ = require('lodash');
const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const config = require('config');
const router = express.Router();

// passwordX1$

/**
 * Routes (/api/users)
 */

// get current user
router.get('/me', auth, async (req, res) => {

    const user = await Users.findById(req.user._id).select('-password');
    logger.info('CURRENT USER: ' + user);
    // debug('CURRENT USER: ' + user);

    res.send(user);

});

// get all users
router.get('/', async (req, res) => {

    const allUsers = await Users.find();

    debug('All users requested: \n', allUsers);
    res.send(allUsers);

});

// get user by id
router.get('/:id', async (req, res) => {

    const user = await Users.findById(
        { _id: new ObjectID(req.params.id) },
        (err, user) => {
            if (err) {
                debug('Error: \n', err.message);
                // res.send({ error: err.message });
                res.status(404).send(`The user with that ID ('${req.params.id}') does not exist.`);
                return;
            }

            debug('Get user by ID: \n', user);
            res.send(user);
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

    const token = user.generateAuthToken();
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));

    // res.send(_.pick(user, ['_id', 'name', 'email']));           // use _.pick to select with properties to send
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));           // use _.pick to select with properties to send

});

module.exports = router;
