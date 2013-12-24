var storage = {
    _details: {}
};

exports.find = function(where, key){
    var obj,
        location = '_' + where;

    key = key.toUpperCase();

    if (storage.hasOwnProperty(location)) {
        obj = storage[location][key];
    }

    return obj;
};
exports.store = function(where, key, val){
    var location = '_' + where;

    key = key.toUpperCase();

    if (storage.hasOwnProperty(location)){
        storage[location][key] = val;
    }

    return val;
};