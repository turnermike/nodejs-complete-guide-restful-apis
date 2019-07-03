/**
 * middleware/validateObjectId.js
 *
 * Checks req.params.id for a valid MongoDB Objectd.
 *
 */

const mongoose = require('mongoose');

module.exports = function(req, res, next) {

    if (! mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID');

    next();                                                     // pass control to next middleware function

}