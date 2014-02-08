var RSVP = require('rsvp'),
    Storage = require('objstore'),
    keys = require('./storageKeys');

var store = {};

// set to local
Storage.local();

// initialize storages
Object.keys(keys).forEach(function(key){
    store[keys[key]] = Storage.create({
        size: 100,
        perFree: 20,
        // expire every hour
        expire: 1000 * 60 * 60
    });
});

exports.find = function(where, key){
    return new RSVP.Promise(function(resolve){
        resolve(store[where].find(key));
    });
};
exports.store = function(where, key, val){
    return new RSVP.Promise(function(resolve){
        store[where].store(key, val);
        resolve(val);
    });
};
exports.on = function(where, topic, callback){
    return store[where].on(topic, callback);
};