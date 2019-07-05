/**
 * middleware/auth.js
 *
 *
 */
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:db');
const config = require('config');


function auth(req, res, next) {

    const token = req.header('x-auth-token');

    if (! token) return res.status(401).send("Not authorized, no token provided.");

    try {

        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        // debug('decoded token', decoded);

        req.user = decoded;
        next(); // pass control to next middleware function
    }
    catch(err) {
        // debug('Invalid Token');
        res.status(400).send('Invalid token');
    }


}

module.exports = auth;