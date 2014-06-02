// TODO: xss escape
var _ = require('lodash'),
    querystring = require('querystring'),
    errors = require('../errors'),
    is40CharHex = require('./../onionoo/util/is40CharHex'),
    uptimeCalculator = require('./UptimeCalculator'),
    countryFlag = require('./countryFlag'),
    globals = require('../globalData'),
    clone = require('./clone');

exports.uptimeFull = function(value) {
    if(!value){
        return '';
    }
    var uptimeArray = uptimeCalculator(value, 'long');
    return uptimeArray.join(' ');
};
exports.uptimeShort = function(value) {
    if(!value){
        return '';
    }
    var uptimeArray = uptimeCalculator(value, 'short');
    return uptimeArray.join(' ');
};

exports.port = function(value){
    var port = '';

    if(typeof value === 'string'){
        var parts = value.split(':');
        if(parts.length === 2 && parts[1].length){
            port = parts[1];
        }
    }

    return port;
};

exports.bandwidth = function(value){
    var formatted = '';

    value = parseInt(value, 10);
    if(value !== -1 && !isNaN(value)){
        var bandwidthKB = value / 1000;
        var bandwidthMB = bandwidthKB / 1000;

        if (bandwidthMB >= 1) {
            formatted = Math.round(bandwidthMB * 100) / 100 + ' MB/s';
        } else {
            if (bandwidthKB >= 1) {
                formatted = Math.round(bandwidthKB * 100) / 100 + ' kB/s';
            } else {
                formatted = value + ' B/s';
            }
        }
    }

    return formatted;
};

exports.propFlag = function(value){
    var map = globals.icons,
        withImage = '';

    if(map.hasOwnProperty(value)){
        withImage = '<span class="fa ' + map[value] + '" title="' + value + '"></span>';
    }
    return withImage;
};

exports.onionFlags = function (data) {
    var flagString = '';

    // check if data is not empty array
    if(!(_.isArray(data) && data.length)){
        return '';
    }
    data.forEach(function(n){
        flagString += exports.propFlag(n);
    });
    return flagString;
};

exports.flaggify = function(value){
    return countryFlag(value);
};


/**
 * Returns the fingerprint from a detail document family member
 * @see {@link https://onionoo.torproject.org/#details}
 * @param {String} val family member
 * @returns {String} empty or fingerprint
 * @example
 * // returns '0000000000000000000000000000000000000000'
 * GLOBE.Formatter.familyToFingerprint('$0000000000000000000000000000000000000000')
 */
exports.familyToFingerprint = function (val) {
    var fingerprint = '';

    // check if value is a string and begins with $
    if (_.isString(val) && val.indexOf('$') === 0) {
        // strip $ from value
        fingerprint = val.slice(1);
    }

    // check if it's a fingerprint
    if (!is40CharHex(fingerprint)) {
        throw errors.NotA40CharHexString;
    }

    return fingerprint;
};

exports.percent = function(val, precision) {
    var fixed = '';
    precision = precision || 2;
    if (!isNaN(val) && typeof val === 'number') {
        fixed = (val * 100).toFixed(precision) + '%';
    }
    return fixed;
};

/**
 * Function that generates a sort query with a given query object and field that should be used to sort.
 * @param {Object} query Query object
 * @param {String} field Field to sort
 * @return {String} Created querystring
 */
exports.searchQuery = function (query, field) {
    var queryClone = clone(query),
        invert = queryClone.sortBy === field,
        sortAsc = queryClone.sortAsc === 'true' || queryClone.sortAsc === true;

    queryClone.sortBy = field;

    if (invert) {
        queryClone.sortAsc = '' + !sortAsc;
    } else {
        queryClone.sortAsc = 'false';
    }
    return querystring.stringify(queryClone);
};

exports.sortIndicator = function (type, asc) {
    type = type || 'amount';

    return '<i class="fa fa-sort-' + type + '-' + (asc ? 'asc' : 'desc') + '"></i>';
};