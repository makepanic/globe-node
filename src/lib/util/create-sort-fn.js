var version = require('../util/compare-version');
var number = function (a, b) {
    /* eslint no-else-return: 0 */
    if (a === undefined || b === undefined) {
        if (a === undefined && b === undefined) {
            return 0;
        }
        if (a === undefined && b !== undefined) {
            return -1;
        } else {
            return 1;
        }
    }
    return a - b;
};
/**
 * Creates a sort function for numeric sorting.
 * @param {String} property Property to check while sorting
 * @param {Boolean} asc If the sort function should sort ascending or descending
 * @return {Function} Function that can be used in Array.sort
 */
exports.numeric = function (property, asc) {
    return asc ? function (a, b) {
        return number(a[property], b[property]);
    } : function (a, b) {
        return number(b[property], a[property]);
    };
};
/**
 * Creates a sort function.
 * @param {String} property Property to check while sorting
 * @param {Boolean} asc If the sort function should sort ascending or descending
 * @return {Function} Function that can be used in Array.sort
 */
exports.string = function (property, asc) {
    return asc ? function (a, b) {
        return (a[property] || '').localeCompare(b[property] || '');
    } : function (a, b) {
        return (b[property] || '').localeCompare(a[property] || '');
    };
};
exports.firstArrayEntry = function (property, asc) {
    return asc ? function (a, b) {
        var firstKeyA = a[property],
            firstKeyB = b[property];

        if (!firstKeyA && !firstKeyB || !firstKeyA.length && !firstKeyB.length || firstKeyA[0][0] === null && firstKeyB[0][0] === null) {
            return 0;
        }
        if (!firstKeyA && firstKeyB || !firstKeyA.length && firstKeyB.length || firstKeyA[0][0] === null && firstKeyB[0][0] !== null) {
            return -1;
        }
        if (firstKeyB && !firstKeyB || firstKeyA.length && !firstKeyB.length || firstKeyA[0][0] !== null && firstKeyB[0][0] === null) {
            return 1;
        }
        return firstKeyA[0][0].localeCompare(firstKeyB[0][0]);
    } : function (a, b) {
        var firstKeyA = a[property],
            firstKeyB = b[property];


        if (!firstKeyA && !firstKeyB || !firstKeyA.length && !firstKeyB.length || firstKeyA[0][0] === null && firstKeyB[0][0] === null) {
            return 0;
        }
        if (!firstKeyA && firstKeyB || !firstKeyA.length && firstKeyB.length || firstKeyA[0][0] === null && firstKeyB[0][0] !== null) {
            return 1;
        }
        if (firstKeyB && !firstKeyB || firstKeyA.length && !firstKeyB.length || firstKeyA[0][0] !== null && firstKeyB[0][0] === null) {
            return -1;
        }

        return firstKeyB[0][0].localeCompare(firstKeyA[0][0]);
    };
};

// Compare array length
exports.arrayLength = function (property, asc) {
    return asc ? function (a, b) {
        return a[property].length - b[property].length;
    } : function (a, b) {
        return b[property].length - a[property].length;
    };
};

exports.version = function (property, asc) {
    return asc ? function (a, b) {
        return version(a[property], b[property]);
    } : function (a, b) {
        return version(b[property], a[property]);
    };
};
