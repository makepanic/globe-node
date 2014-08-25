/**
 * Function to reduce an array and count the occurrences of each item.
 * Do not use an array with anything other than string or null elements with this function.
 * It is only works correctly with strings and null.
 *
 * Note:
 * This function will be replaced (when it's done) with an ES6 Map implementation.
 * @example:
 *      var obj = new Map();
 *      arr.forEach(function (item) {
 *          obj.set(item, obj.has(item) ? obj.get(item) + 1 : 1);
 *      });
 *      return obj;
 * @see https://groups.google.com/forum/#!topic/v8-users/T-LgdSosMJ8
 *
 * @via https://gist.github.com/ralphcrisostomo/3141412
 * @param {Array} array Array to use
 * @returns {Array} Array of unique counted items
 */
module.exports = function (array) {
    var obj = {},
        el = '',
        nulls = 0;

    // count all unique elements
    for (var i = 0, length = array.length; i < length; i++) {
        el = array[i];
        if (el !== null) {
            // if not null add to object
            obj[el] = (obj[el] || 0) + 1;
        } else {
            // if null increase null counter
            nulls++;
        }
    }

    var keys = Object.keys(obj),
        len = keys.length,
        j,
    // put null in
        countedArray = nulls > 0 ? [
            [null, nulls]
        ] : [];

    // iterate over created object
    for (j = 0; j < len; j++) {
        countedArray.push([keys[j], obj[keys[j]]]);
    }

    return countedArray;
};
