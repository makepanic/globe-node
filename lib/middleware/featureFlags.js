var features = require('../../features');

/**
 * Function that returns a middleware that parses the `features` url parameter and enables the corresponding.
 * @return {Function} Middleware to parse features url parameter.
 */
module.exports = function () {
    return function (req, res, next) {
        var paramFeatures = req.param('features', ''),
            paramFeaturesArray = paramFeatures ? paramFeatures.split(',') : [],
            reqFeatures = {};

        Object.keys(features).forEach(function (feature) {
            reqFeatures[feature] = paramFeaturesArray.indexOf(feature) !== -1 ? true : features[feature];
        });

        req.features = reqFeatures;

        next();
    };
};