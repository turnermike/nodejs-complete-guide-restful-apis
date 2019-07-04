/**
 * routes/returns.js
 *
 *
 */

const { Rentals, validate } = require('../models/rentals');
const { Movies } = require('../models/movies');
const { Customers } = require('../models/customers');
const logger = require('../middleware/logger');
const express = require('express');
const mongoose = require('mongoose');
const debug = require('debug')('app:db');
const router = express.Router();


router.post('/', async (req, res) => {


    // logger.info("ID CHECK: " + req.body.customerId);

    if (! req.body.customerId)
        return res.status(400).send('Customer ID not provided.');

    if (! req.body.movieId)
        return res.status(400).send('Movie ID not provided.');

    const rental = await Rentals.lookup(req.body.customerId, req.body.movieId);
    debug('rental', rental);



    // res.status(401).send('Unauthorized');

});

module.exports = router;