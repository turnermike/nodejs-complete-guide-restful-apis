/**
 * routes/customers.js
 *
 * - handle all /api/customers routes (loaded via index.js with path prefix)
 *
 */

const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
const morgan = require('morgan');
const Joi = require('joi');
const router = express.Router();

// // connect to mongodb
// mongoose.connect('mongodb://localhost/node-restful-api', { useNewUrlParser: true, useFindAndModify: false })
//     .then( () => debug('Connected to MongoDB'))
//     .catch(err => debug('Error: ', err));

// initialize genre collection schema
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

    const { error } = validateCustomers(req.body);
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
    const { error } = validateCustomers(req.body);
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

function validateCustomers(customer) {

    // debug('validateCustomers', customer);

    const schema = {
        name: Joi.string().min(2).max(255).required(),
        phone: Joi.string().min(2).max(255).required(),
        isGold: Joi.boolean()
    };

    return Joi.validate(customer, schema);

}

module.exports = router;
