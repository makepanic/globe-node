/**
 * Function that clones an object by creating a new one and copying it's properties
 * @param {Object} obj Object to clone
 * @return {Object} cloned Object
 */
module.exports = function (obj) {
    var clone = {};
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            clone[prop] = obj[prop];
        }
    }
    return clone;
};