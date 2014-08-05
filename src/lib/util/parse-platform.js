var rsplit = require('../util/rsplit'),
    assert = require('assert');

var WORDS = {
    ON: ' on ',
    X86_64: 'x86_64',
    I686: 'i686',
    TOR: 'Tor'
};

/**
 * Parses an given string and extracts os related values.
 * @param {String} osString
 * @return {{os: String|undefined, version: String|undefined, meta: String|undefined, arch: String|undefined}} Object containing common os related values.
 * @example
 * parseOs('Windows 7 Service Pack 1 [workstation]')
 * // {os: 'Windows', version: '7', meta: '[workstation]', arch: undefined}
 * parseOs('Linux x86_64')
 * // {os: 'Linux', arch: 'x86_64', version: undefined, meta: undefined}
 */

function parseOs(osString) {
    var arch,
        meta,
        os,
        version,
        name;

    // extract arch
    if (osString.indexOf(WORDS.X86_64) >= 0) {
        arch = WORDS.X86_64;
    } else if (osString.indexOf(WORDS.I686) >= 0) {
        arch = WORDS.I686;
    }

    // extract meta (Windows [workstation])
    if (osString.match(/[\[\]]/)) {
        var words = osString.split(' '),
        // for [server] {enterprise} {terminal services, single user} {terminal services}'
            startIndex = -1;
        words.every(function (word, index) {
            if (word.indexOf('[') >= 0) {
                startIndex = index;
            }
            // stop loop if startIndex has changed (return false), otherwise continue (return true)
            return startIndex === -1;
        });
        if (startIndex >= 0) {
            meta = words.splice(startIndex).join(' ');
        }
        osString = words.join(' ');
    }

    // extract full os string
    // (Windows 7 Service Pack 1)
    if (meta && meta.length) {
        name = osString;
    } else {
        if (arch && arch.length) {
            // Linux i686
            name = osString.substring(0, osString.indexOf(arch)).trim();
        } else {
            // Linux
            name = osString;
        }
    }

    // extract os name (Windows, Linux, ...)
    if (name.length) {
        os = name.split(' ')[0];
    }

    // extract os version (7 Service Pack 1)
    if (os && os.length) {
        if (!arch && osString.length !== os.length) {
            version = osString.substring(os.length).trim();
        }
    }

    return {
        os: os,
        version: version,
        meta: meta,
        arch: arch
    };
}

/**
 * Parses a onionoo platform string.
 * @param {String} platformString Platform string to parse.
 * @return {{client: (string|*), tor: *, git: *, meta: (String|undefined|*), arch: (String|undefined|*), os: (String|undefined|*), version: (String|undefined|*), osString: String}} Parsed platform
 */
module.exports = function (platformString) {
    //assert.ok(platformString.indexOf('Tor') === 0, 'Not a Tor platform string.');

    //platformString = platformString.toLowerCase();
    var onPos = platformString.indexOf(WORDS.ON),
    // torversion = 'Tor ' (4) ... 'on'
        torClient = platformString.substring(0, platformString.indexOf(' ')),
        torVersion = platformString.substring(torClient.length + 1, onPos),
        on = platformString.substring(onPos + WORDS.ON.length, platformString.length),
        tor,
        git,
        os = parseOs(on),
        torVerGitSep = torVersion.indexOf(' ');

    if (torVerGitSep >= 0) {
        tor = torVersion.substring(0, torVerGitSep);
        git = torVersion.substring(torVerGitSep + 1, torVersion.length);
        // remove brackets, minus from git version
        if (git.length) {
            git = git.replace(new RegExp('[-\\(\\)]', 'g'), '').replace('git', '');
        }
    } else {
        tor = torVersion;
    }

    if (!tor.length) {
        tor = undefined;
    }
    if (!torClient) {
        torClient = undefined;
    }

    return {
        client: torClient,
        tor: tor,
        git: git,
        meta: os.meta,
        arch: os.arch,
        os: os.os,
        version: os.version,
        osString: [os.os, os.version, os.arch].join(' ').replace(/ +/g, ' ').trim()
    };
};
