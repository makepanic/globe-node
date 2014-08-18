/* eslint camelcase:0 */

var speeds = require('./speeds'),
    escapeRegex = require('../../util/escape-regex'),
    _ = require('lodash-node');

/**
 * Add a value to a target after checking if another value exists and it isn't empty
 * @param {Object} target Mongodb filter object
 * @param {String} targetField Mongodb filter object field
 * @param {*} checkValue Value to check
 * @param {*} assignedValue Mongodb filter expression
 * @return {void}
 */
var addToOptionIf = function (target, targetField, checkValue, assignedValue) {
    if (checkValue !== undefined && checkValue !== null) {
        if (_.isArray(checkValue)) {
            if (checkValue.length) {
                target[targetField] = _.isFunction(assignedValue) ? assignedValue(checkValue) : assignedValue;
            }
        } else {
            target[targetField] = _.isFunction(assignedValue) ? assignedValue(checkValue) : assignedValue;
        }
    }
};

module.exports = function (filterOptions) {
    var dbFilterOptions = {},
        hasExitSpeedFilter = filterOptions.exitSpeed !== null && filterOptions.exitSpeed !== undefined,
        notFaster = hasExitSpeedFilter && filterOptions.exitSpeed.NOT_FASTER;
//        hasSameNetworkFilter = hasExitSpeedFilter && filterOptions.exitSpeed.MAX_PER_NETWORK;

    // apply exit speed filters
    if (hasExitSpeedFilter) {
        if (notFaster) {
            dbFilterOptions.bandwidth_rate = {
                $gt: filterOptions.exitSpeed.BANDWIDTH_RATE,
                $lt: speeds.FAST_EXIT.BANDWIDTH_RATE
            };
            // advertised_banwdith filter
            dbFilterOptions.advertised_bandwidth = {
                $gt: filterOptions.exitSpeed.ADVERTISED_BANDWIDTH,
                $lt: speeds.FAST_EXIT.ADVERTISED_BANDWIDTH
            };
        } else {
            // bandwidth_rate filter
            dbFilterOptions.bandwidth_rate = {
                $gt: filterOptions.exitSpeed.BANDWIDTH_RATE
            };
            // advertised_banwdith filter
            dbFilterOptions.advertised_bandwidth = {
                $gt: filterOptions.exitSpeed.ADVERTISED_BANDWIDTH
            };
        }
    }


    if (_.isString(filterOptions.query)) {
        var query = filterOptions.query;
        // copy of onionoo RequestHandler.java.filterBySearchTerm
        if (query.length) {
            if (query[0] === '$') {
                /* Search is for $-prefixed fingerprint. */
                dbFilterOptions.fingerprint = query.substring(1).toUpperCase();
            } else {
                var lowerEscapedQuery = escapeRegex(query.toLowerCase()),
                    upperEscapedQuery = lowerEscapedQuery.toUpperCase();

                dbFilterOptions.$or = [
                    /* Nickname matches. */
                    {nickname: {$regex: new RegExp('.*' + lowerEscapedQuery + '.*') }},
                    /* Non-$-prefixed fingerprint matches. */
                    {fingerprint: {$regex: new RegExp('^' + upperEscapedQuery) }},
                    {or_addresses: {$elemMatch: {$regex: new RegExp('^' + lowerEscapedQuery) }}},
                    {exit_addresses: {$elemMatch: {$regex: new RegExp('^' + lowerEscapedQuery) }}}
                ];
            }
        }
    }
    addToOptionIf(dbFilterOptions, 'guard_probability', filterOptions.guards, { $gt: 0 });
    addToOptionIf(dbFilterOptions, 'flags', filterOptions.flag, filterOptions.flag);
    addToOptionIf(dbFilterOptions, 'running', filterOptions.running, filterOptions.running);
    addToOptionIf(dbFilterOptions, 'exit_probability', filterOptions.exit, { $gt: 0 });
    addToOptionIf(dbFilterOptions, 'as_number', filterOptions.as, filterOptions.as);
    addToOptionIf(dbFilterOptions, 'country', filterOptions.country, filterOptions.country);
    addToOptionIf(dbFilterOptions, 'os', filterOptions.os, {$in: filterOptions.os});
    addToOptionIf(dbFilterOptions, 'tor', filterOptions.tor, {$in: filterOptions.tor});
    addToOptionIf(dbFilterOptions, 'family', filterOptions.family, function () {
        return '$' + filterOptions.family.toUpperCase();
    });

    return dbFilterOptions;
};
