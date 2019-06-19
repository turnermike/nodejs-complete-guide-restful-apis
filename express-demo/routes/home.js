/**
 * routes/home.js
 *
 * - handle all /api/courses routes (loaded via index.js with path prefix)
 *
 */

const express = require('express');
const debug = require('debug')('app:startup');

const router = express.Router();

// default route
router.get('/', (req, res) => {
    debug('landing page');
    // res.send('hello world');
    res.render('index', { title: 'My Express App', message: 'Hello!' });
});

module.exports = router;