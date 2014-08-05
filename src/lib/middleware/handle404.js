module.exports = function () {
    return function (req, res) {
        // set response status to 404
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('error', {
                title: 404,
                msg: 'Resource not found'
            });
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({
                error: 'Resource not found'
            });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Resource not found');
    };
};
