/**
 * routes/returns.js
 *
 *
 */

const { Rentals, validate } = require('../models/rentals');
// const { Movies } = require('../models/movies');
// const { Customers } = require('../models/customers');
const auth = require('../middleware/auth');
const logger = require('../middleware/logger');
const express = require('express');
// const mongoose = require('mongoose');
const debug = require('debug')('app:db');
const util = require('util');
const router = express.Router();


router.post('/', auth, async (req, res) => {


    try{

        // logger.info("customerId: " + req.body.customerId);

        if (! req.body.customerId)
            return res.status(400).send('Customer ID not provided.');

        if (! req.body.movieId)
            return res.status(400).send('Movie ID not provided.');

        const rental = await Rentals.findOne({
            'customer._id': req.body.customerId,
            'movie._id': req.body.movieId
        });

        // console.log(util.inspect(rental), { showHidden: false, depth: null });

        if (! rental) return res.status(404).send('Rental not found.');




        // res.status(200).send('hi!');
        // res.status(401).send('Unauthorized');


    }
    catch(ex) {

        logger.error(ex);
        res.status(500).send('ERROR: ' + ex);

    }


});

module.exports = router;