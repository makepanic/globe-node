/*eslint valid-jsdoc:0 */

/**
 * @see https://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range/8273091#8273091
 * @param start
 * @param stop
 * @param step
 * @return {Array}
 */
module.exports = function range(start, stop, step) {
    if (typeof stop === 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }
    if (typeof step === 'undefined') {
        step = 1;
    }
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
        return [];
    }
    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }
    return result;
};