var _ = require('lodash-node');

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
    array = function (param, data) {
        var array;
        if (!_.isArray(param)) {
            array =  data.defaultsTo;
        } else {
            array = param.length ? param : data.defaultsTo;
        }
        return array;
    },
    mappings = {
        array: array,
        checkbox: checkbox,
        empty: empty,
        boolean: boolean,
        integer: integer
    };

module.exports = function (mapping) {
    return function (req, res, next) {
        // if no normquery is set use query as base
        req.normQuery = req.normQuery || _.clone(req.query);

        for (var type in mapping) {
            if (mapping.hasOwnProperty(type) && mappings.hasOwnProperty(type)) {
//                mapping[type].forEach(function (val) {
                for(var mappingIndex = 0; mappingIndex < mapping[type].length; mappingIndex++) {
                    var val = mapping[type][mappingIndex];
                    if (_.isString(val)) {
                        req.normQuery[val] = mappings[type](req.query[val]);
                    } else if (_.isObject(val)) {
                        // is object that uses the `param` field for assignment
                        req.normQuery[val.param] = mappings[type](req.query[val.param], val);
                    }
                }
            }
        }
        next();
    };
};
