/**
 * Function to escape an string for use in a regex.
 * @see http://stackoverflow.com/a/6969486
 * @param {String} input Input
 * @return {String} escaped input
 */
module.exports = function (input) {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};
