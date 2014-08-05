var extractVersion = require('./extract-version');

/**
 * Function that can be used in a array.sort() to compare 4 level version strings.
 * @param {String} version1 Version 1 to compare
 * @param {String} version2 Version 2 to compare
 * @return {number} 0 if both are equal, -1 if version 1 is smaller, 1 if version 2 is smaller
 */
var compareVersions = function (version1, version2) {
    var v1, v2,
        compared = 0;

    try {
        v1 = extractVersion(version1);
        v2 = extractVersion(version2);
    } catch (e) {
        // catching an error means that one element is undefined.
        // This means that it is not important what we return,
        // because in the end, undefined in an array sort will be moved to the end.
        // see: http://stackoverflow.com/a/4783274
        return -1;
    }

    if (v1.major !== v2.major) {
        // compare major
        compared = v1.major - v2.major;
    } else if (v1.minor !== v2.minor) {
        compared = v1.minor - v2.minor;
    } else if (v1.build !== v2.build) {
        compared = v1.build - v2.build;
    } else if (v1.revision !== v2.revision) {
        compared = v1.revision.localeCompare(v2.revision);
    }

    return compared;
};

module.exports = compareVersions;
