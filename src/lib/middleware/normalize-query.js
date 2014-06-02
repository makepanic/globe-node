var _ = require('lodash'),
    clone = require('../util/clone');

var checkbox = function (value) {
        var normalized = null;
        if (value !== null && value !== undefined && _.isString(value)) {
            normalized = value === 'on';
        }
        return normalized;
    },
    empty = function (value) {
        var normalized = value;
        if (value === undefined || value === '') {
            normalized = null;
        }
        return normalized;
    },
    boolean = function (value) {
        var normalized = null;
        if (typeof value === 'boolean') {
            normalized = value;
        } else if (typeof value === 'string' && value !== '') {
            normalized = value === 'true';
        }
        return normalized;
    },
    integer = function (value) {
        var parsed = parseInt(value, 10);
        return isNaN(parsed) ? null : parsed;
    },
    mappings = {
        checkbox: checkbox,
        empty: empty,
        boolean: boolean,
        integer: integer
    };

module.exports = function (mapping) {
    return function (req, res, next) {
        // if no normquery is set use query as base
        req.normQuery = req.normQuery || clone(req.query);

        for (var type in mapping) {
            if (mapping.hasOwnProperty(type) && mappings.hasOwnProperty(type)) {
                mapping[type].forEach(function (val) {
                    //req.query[val] = mappings[type](req.query[val]);
                    req.normQuery[val] = mappings[type](req.query[val]);
                });
            }
        }
        next();
    };
};