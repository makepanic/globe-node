module.exports = function (propertyName) {
    var sortTypes = {
            numeric: ['consensus_weight_fraction', 'advertised_bandwidth_fraction', 'guard_probability',
                'middle_probability', 'exit_probability'],
            string: ['nickname', 'country', 'fingerprint', 'as_number']
        },
        foundType;

    // every breaks on return false
    Object.keys(sortTypes).every(function (sortType) {
        if (sortTypes[sortType].indexOf(propertyName) > -1) {
            foundType = sortType;
            return false;
        }
        return true;
    });

    return foundType;
};