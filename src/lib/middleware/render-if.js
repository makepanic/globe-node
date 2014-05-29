module.exports = function (checkFn, render) {
    return function (req, res, next) {
        if (checkFn()) {
            res.render(render);
        } else {
            next();
        }
    };
};