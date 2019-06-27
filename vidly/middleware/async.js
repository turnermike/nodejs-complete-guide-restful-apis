/**
 * middleware/async.js
 *
 * - calls the handler passed as parameter
 * - returns an express route handler
 *
 */

module.exports = function asyncMiddleware(handler) {

    // return a route handler function
    return async (req, res, next) => {

        try {
            await handler(req, res);
        }
        catch(ex) {
            next(ex);
        }

    }

}