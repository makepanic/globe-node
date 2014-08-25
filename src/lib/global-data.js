var countries = require('./static').countries,
    pkg = require('../../package.json'),
    _ = require('lodash-node');

var globals = {},
    flags = {
        'Fast': 'fa-bolt',
        'Running': 'fa-code-fork',
        'BadExit': 'fa-warning',
        'Authority': 'fa-user-md',
        'Guard': 'fa-shield',
        'HSDir': 'fa-book',
        'Named': 'fa-info',
        'Stable': 'fa-anchor',
        'V2Dir': 'fa-folder',
        'Valid': 'fa-check',
        'Unnamed': 'fa-question',
        'Exit': 'fa-sign-out'
    },
    icons = {
        // map to convert given string to a character
        'Fast': 'fa-bolt',
        'Running': 'fa-code-fork',
        'BadExit': 'fa-warning',
        'Authority': 'fa-user-md',
        'Guard': 'fa-shield',
        'HSDir': 'fa-book',
        'Named': 'fa-info',
        'Stable': 'fa-anchor',
        'V2Dir': 'fa-folder',
        'Valid': 'fa-check',
        'Unnamed': 'fa-question',
        'Exit': 'fa-sign-out'
    },
    transformKeyValue = function (result, value, key) {
        return result.push({
            key: key,
            value: value
        });
    },
    countriesArray = _.transform(countries, transformKeyValue, []),
    flagsArray = _.transform(flags, transformKeyValue, []);

// write data to global object (see http://nodejs.org/api/globals.html#globals_global )
globals = {
    version: pkg.version,
    userAgent: pkg.name + '/' + pkg.version + ' (+' + pkg.bugs.url + ')',
    title: [],
    buildTitle: function (title, version) {
        // join title smgments
        return (title.length ? title.join(' | ') + ' | Globe' : 'Globe') + ' ' + version;
    },
    query: '',
    path: 'index',
    advSearch: {
        actions: {},
        group: {},
        filter: {}
    },
    search: {
        // Note: os, tor will be overwritten if the database is synced.
        // I filled the array here to get it to work if the app is run with `-n`
        os: ['Linux', 'Windows', 'OpenBSD', 'FreeBSD', 'Darwin', 'NetBSD', 'DragonFly', 'Bitrig', 'SunOS', 'GNU\\/kFreeBSD'],
        tor: ['0.2.2.35', '0.2.3.20-rc', '0.2.3.22-rc', '0.2.3.23-rc', '0.2.3.24-rc', '0.2.3.25', '0.2.4.10-alpha', '0.2.4.11-alpha', '0.2.4.12-alpha', '0.2.4.15-rc', '0.2.4.16-rc', '0.2.4.17-rc', '0.2.4.18-rc', '0.2.4.19', '0.2.4.20', '0.2.4.21', '0.2.4.21-dev', '0.2.4.22', '0.2.4.22-dev', '0.2.5.0-alpha-dev', '0.2.5.1-alpha', '0.2.5.1-alpha-dev', '0.2.5.2-alpha', '0.2.5.3-alpha', '0.2.5.3-alpha-dev', '0.2.5.4-alpha', '0.2.5.4-alpha-dev', '0.2.5.5-alpha', '0.2.5.5-alpha-dev', '0.2.6.0-alpha-dev'],

        type: ['relay', 'bridge'],
        running: [true, false],
        fields: ['ni', 'cw', 'ab', 'gp', 'mp', 'ep', 'to', 'os', 'ex', 'co', 'fa', 'gu']
    },
    countries: countries,
    countriesArray: countriesArray,
    flags: flags,
    flagsArray: flagsArray,
    icons: icons,
    group: {
        country: false,
        family: false,
        contact: false
    },
    filter: {
        type: '',
        running: '',
        country: '',
        as: '',
        family: '',
        flag: ''
    }
};

module.exports = globals;
