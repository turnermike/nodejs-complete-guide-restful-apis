/**
 * middleware/admin.js
 *
 *
 */

function admin(req, res, next) {

    if (! req.user.isAdmin) return res.status(403).send('Access Denied, you do not have proper permissions');

    next();

}

module.exports = admin;

