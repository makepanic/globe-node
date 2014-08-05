/**
 * Expressjs error handler. Returns a specific response based on the request accept field.
 * @param {bunyanLogger} logger Logger instance
 * @param {String} viewName View name to render if error thrown
 * @return {errorHandler} Middleware function
 */
module.exports = function errorHandler(logger, viewName) {
    /* eslint no-unused-vars: 0 */
    return function errorHandler(err, req, res, next) {
        // set response status to err.status or 500
        res.status(err.status ? err.status : 500);

        logger.error(err.stack || String(err));

        // handle html accept
        if (req.accepts('html')) {
            res.render(viewName, {
                error: err
            });
            return;
        }

        // handle json accept
        if (req.accepts('json')) {
            res.send({
                error: {
                    message: err.message,
                    stack: err.stack
                }
            });
            return;
        }

        res.type('txt').send('Error: ' + err.message + ', ' + err.stack);
    };
};
