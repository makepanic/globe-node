// TODO: xss escape
var uptimeCalculator = require('./UptimeCalculator'),
    countryFlag = require('./countryFlag');

exports.uptimeFull = function(value) {
    if(!value){
        return '';
    }
    var uptimeArray = uptimeCalculator(value, 'long');
    return uptimeArray.join(' ');
}

exports.bandwidth = function(value){
    var formatted = '';

    value = parseInt(value, 10);
    if(value !== -1 && !isNaN(value)){
        var bandwidthKB = value / 1000;
        var bandwidthMB = bandwidthKB/1000;

        if (bandwidthMB >= 1) {
            formatted = Math.round(bandwidthMB*100)/100 + ' MB/s';
        } else {
            if (bandwidthKB >= 1) {
                formatted = Math.round(bandwidthKB*100)/100 + ' KB/s';
            } else {
                formatted = value + ' B/s';
            }
        }
    }

    return formatted;
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

    if (val && Object.prototype.toString.call(val) === '[object String]' && val.indexOf('$') === 0) {
        fingerprint = val.slice(1);
    }
    return fingerprint;
};