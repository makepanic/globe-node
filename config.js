exports.FEATURES = {
//    TRAC_XYZ: true
};
exports.DB = {
    // sync every hour
    SYNC_INTERVAL: 1000 * 60 * 60,
    URL: 'mongodb://localhost:27017/onionoo'
};
exports.ONIONOO = {
    BASE_URL: 'https://onionoo.torproject.org/',
    // timeout 10 sec
    REQUEST_TIMEOUT: 1000 * 10
};