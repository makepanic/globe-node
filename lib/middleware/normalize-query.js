var _ = require('lodash');

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
            normalized = value
        } else if (typeof value === 'string') {
            normalized = value === 'true';
        }

        return normalized;
    },
    mappings = {
        checkbox: checkbox,
        empty: empty,
        boolean: boolean
    };

module.exports = function (mapping) {
    return function (req, res, next) {
        for (var type in mapping) {
            if (mapping.hasOwnProperty(type) && mappings.hasOwnProperty(type)) {
                mapping[type].forEach(function (val) {
                    req.query[val] = mappings[type](req.query[val]);
                });
            }
        }
        next();
    };
};