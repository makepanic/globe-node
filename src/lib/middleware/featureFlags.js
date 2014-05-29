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

        Object.keys(features).forEach(function (feature) {
            reqFeatures[feature] = paramFeaturesArray.indexOf(feature) !== -1 ? true : features[feature];
        });

        req.features = reqFeatures;

        next();
    };
};