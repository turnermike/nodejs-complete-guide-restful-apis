/**
 * routes/genres.js
 *
 * - handle all /api/genres routes (loaded via index.js with path prefix)
 *
 */

const { Genres, validate } = require ('../models/genres');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const logger = require('../middleware/logger');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
// const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const debug = require('debug')('app:db');
// const morgan = require('morgan');

const router = express.Router();


/**
 * Routes (/api/genres)
 */

// get all genres
router.get('/', async (req, res, next) => {

    // throw new Error('Could not get genres.');

    const allGenres = await Genres.find();

    debug('All genres requested: \n', allGenres);
    res.send(allGenres);

});

// get genre by id
router.get('/:id', validateObjectId, async (req, res) => {

  const genre = await Genres.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);

    // const genre = await Genres.findById(
    //     { _id: new ObjectID(req.params.id) },
    //     (err, genre) => {
    //         if (err) {
    //             debug('Error: \n', err.message);
    //             // res.send({ error: err.message });
    //             res.status(404).send(`The genre with that ID ('${req.params.id}') does not exist.`);
    //             return;
    //         }

    //         debug('Get genre by ID: \n', genre);
    //         res.send(genre);
    //     }
    // );

});

// add new genre
router.post('/', auth, async (req, res) => {

    // console.log('req.body', req.body);
    // console.log('req.body.name', req.body.name);
    // res.send({});

    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genres({
        name: req.body.name,
    });

    const result = genre.save(); // .save() returns a promise

    res.send(genre);

});

// update a genre
router.put('/:id', auth, async (req, res) => {

    // validate
    const { error } = validate(req.body);
    if (error ) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true
    });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);

    // // find/update
    // try{
    //     const genre = await Genres.findByIdAndUpdate(
    //         { _id: new ObjectID(req.params.id) },
    //         { name: req.body.name },
    //         { upsert: true, new: true }
    //     );
    //     debug('Updated genre: ', genre);
    //     res.send(genre);

    // }
    // catch(err) {
    //     debug('Update Genre error: ', err.message);
    //     res.send(err.message);
    // }

});

// delete genre by id
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {

    const genre = await Genres.findByIdAndRemove({ _id: new ObjectID(req.params.id) });
    if (! genre) return res.status(404).send('That genre ID was not found');

    // logger.info('Deleted genre.');
    res.send(genre);

});

module.exports = router;
