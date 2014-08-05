var _ = require('lodash-node');

module.exports = function(value){
    var hex40CharRegex = /^[a-f0-9]{40}/i,
        result;

    if (_.isString(value)) {
        result = value.match(hex40CharRegex);
    }

    return !!result;
};
