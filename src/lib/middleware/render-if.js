var _ = require('lodash-node');

/**
 * Middleware that calls a function to determine if it should render a view and exit or
 * pass the request to the next middleware/handler.
 * @param {Function} checkFn Function to call
 * @param {String} render View name
 * @param {*} data Data to pass to rendered view
 * @return {Function} Middleware function
 */
module.exports = function (checkFn, render, data) {
    return function (req, res, next) {
        if (checkFn()) {
            res.render(render, _.isFunction(data) ? data() : data);
        } else {
            next();
        }
    };
};
