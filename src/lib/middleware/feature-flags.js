var _ = require('lodash-node');

/**
 * Function that returns a middleware that parses the `features` url parameter and enables the corresponding.
 * @param {Object} features Map of enabled/disabled feature identifier.
 * @return {Function} Middleware to parse features url parameter.
 */
module.exports = function (features) {
    return function (req, res, next) {
        var paramFeatures = req.param('features', ''),
            paramFeaturesArray = paramFeatures ? paramFeatures.split(',') : [],
            reqFeatures = {};


        _.forIn(features, function (value, key) {
            reqFeatures[key] = paramFeaturesArray.indexOf(key) !== -1 ? true : value;
        });

        req.features = reqFeatures;

        next();
    };
};
