/**
 * routes/customers.js
 *
 * - handle all /api/customers routes (loaded via index.js with path prefix)
 *
 */

const { Customers, validate } = require('../models/customers');
const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const morgan = require('morgan');
// const Joi = require('joi');
const router = express.Router();

/**
 * Routes (/api/courses)
 */

// get all customers
router.get('/', async (req, res) => {

    const allCustomers = await Customers.find();

    debug('All genres requested: \n', allCustomers);
    res.send(allCustomers);

});

// get customer by id
router.get('/:id', async (req, res) => {

    const customers = await Customers.findById(
        { _id: new ObjectID(req.params.id) },
        (err, customers) => {
            if (err) {
                debug('Error: \n', err.message);
                // res.send({ error: err.message });
                res.status(404).send(`The customers with that ID ('${req.params.id}') does not exist.`);
                return;
            }

            debug('Get customers by ID: \n', customers);
            res.send(customers);
        }
    );

});

// add new customer
router.post('/', (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customers({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    const result = customer.save(); // .save() returns a promise

    result
        .then(result => {
            debug('New customer added: \n', result);
            res.send(result);
        })
        .catch(err => {
            debug('Insert customer error: \n', err.errors);
            res.send(err.errors);
        });

});

// update a customer
router.put('/:id', async (req, res) => {

    // validate
    const { error } = validate(req.body);
    if (error ) return res.status(400).send(error.details[0].message);

    // find/update
    try{
        const customer = await Customers.findByIdAndUpdate(
            { _id: new ObjectID(req.params.id) },
            {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold
            },
            { upsert: true, new: true }
        );
        debug('Updated customer: ', customer);
        res.send(customer);

    }
    catch(err) {
        debug('Update customer error: ', err.message);
        res.send(err.message);
    }


});

// delete customer by id
router.delete('/:id', async (req, res) => {

    try{

        const customer = await Customers.findByIdAndRemove({ _id: new ObjectID(req.params.id) });

        res.send(customer);

    }
    catch(err) {

        debug('Delete Genre error: ', err.message);
        res.send(err.message);

    }

});

module.exports = router;
