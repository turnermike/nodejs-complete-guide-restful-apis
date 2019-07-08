/**
 * middleware/validate.js
 *
 * This is used to call each model or route controller's validation function
 * utilizing the Joi package.
 *
 */

module.exports = (validator) => {

    return (req, res, next) => {    // return  a middleware function

        const { error } = validator(req.body);
        if (error ) return res.status(400).send(error.details[0].message);

        next();

    }

};

