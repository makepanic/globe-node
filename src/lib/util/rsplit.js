/*eslint valid-jsdoc:0 */

/**
 * @see https://stackoverflow.com/questions/5202085/javascript-equivalent-of-pythons-rsplit/5202185#5202185
 * @param str
 * @param sep
 * @param maxsplit
 * @return {Array}
 */
module.exports = function (str, sep, maxsplit) {
    var split = str.split(sep || /s+/);
    return maxsplit ? [ split.slice(0, -maxsplit).join(sep) ].concat(split.slice(-maxsplit)) : split;
};
