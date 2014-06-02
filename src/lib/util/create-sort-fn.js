/**
 * Creates a sort function for numeric sorting.
 * @param {String} property Property to check while sorting
 * @param {Boolean} asc If the sort function should sort ascending or descending
 * @return {Function} Function that can be used in Array.sort
 */
exports.numeric = function (property, asc) {
    return asc ? function (a, b) {
        return a[property] - b[property];
    } : function (a, b) {
        return b[property] - a[property];
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
        return (a[property] || '').toLowerCase().localeCompare((b[property] || '').toLowerCase());
    } : function (a, b) {
        return (b[property] || '').toLowerCase().localeCompare((a[property] || '').toLowerCase());
    };
};
exports.firstObjectKeyString = function (property, asc) {
    return asc ? function (a, b) {
        var firstKeyA = Object.keys(a[property])[0],
            firstKeyB = Object.keys(b[property])[0];

        return firstKeyA.toLowerCase().localeCompare(firstKeyB.toLowerCase());
    } : function (a, b) {
        var firstKeyA = Object.keys(a[property])[0],
            firstKeyB = Object.keys(b[property])[0];
        return firstKeyB.toLowerCase().localeCompare(firstKeyA.toLowerCase());
    };
};
exports.objectKeysLength = function (property, asc) {
    return asc ? function (a, b) {
        return Object.keys(a[property]).length - Object.keys(b[property]).length;
    } : function (a, b) {
        return Object.keys(b[property]).length - Object.keys(a[property]).length;
    };
};

exports.arrayLength = function (property, asc) {
    return asc ? function (a, b) {
        return a[property].length - b[property].length;
    } : function (a, b) {
        return b[property].length - a[property].length;
    };
};