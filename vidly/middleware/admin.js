/**
 * middleware/admin.js
 *
 *
 */

module.exports = function (req, res, next) {

    console.log('req.user', req.user);

    if (! req.user.isAdmin) return res.status(403).send('Access Denied, you do not have proper permissions');

    next();

}

// module.exports = admin;
