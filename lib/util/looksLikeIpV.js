/**
 * Function that takes a ip address and decides if it could be a ipv6 or ipv4 address.
 * Do not use this as validation for ip addresses.
 * @param {String} address
 * @return {undefined|String} 6, 4 or undefined (if address is no string).
 */
module.exports = function looksLikeIpV(address) {
    var looksLike,
        v6Result,
        v4Result;

    if (typeof address === 'string') {
        // I used an assignment with boolean check because .match can return null
        if ((v6Result = address.match(/:/g)) && v6Result.length > 1) {
            looksLike = '6';
        } else if ((v4Result = address.match(/\./g)) && v4Result.length === 3) {
            looksLike = '4';
        }
    }

    return looksLike;
};