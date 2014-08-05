var assert = require('assert');

module.exports = function (versionString) {
    assert(typeof versionString === 'string');

    var version = {},
        segments = versionString.split('.');
    if (segments.length > 0) {
        // major.minor[.build[.revision]]
        version.major = parseInt(segments[0], 10);
        version.minor = parseInt(segments[1], 10);
        version.build = parseInt(segments[2], 10);
        version.revision = segments[3];
    }
    return version;
};
