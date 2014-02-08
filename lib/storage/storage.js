var RSVP = require('rsvp'),
    Storage = require('objstore');
var store = {};

// set to local
Storage.local();

/**
 * Prepares the storage if it doesn't exist
 * @param where
 */
function useStorage(where) {
    if (!store.hasOwnProperty(where)){
        store[where] = Storage.create({
            size: 100,
            perFree: 20,
            expire: 1000 * 60 * 60
        });
    }
    return store[where];
}

exports.find = function(where, key){
    var storage = useStorage(where);

    return new RSVP.Promise(function(resolve, reject){
        resolve(storage.find(key));
    });
};
exports.store = function(where, key, val){
    var storage = useStorage(where);

    return new RSVP.Promise(function(resolve, reject){
        storage.store(key, val);
        resolve(val);
    });
};