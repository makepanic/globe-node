exports.FEATURES = {
//    TRAC_XYZ: true
};
exports.DB = {
    // sync every hour
    SYNC_INTERVAL: 1000 * 60 * 60,
    DATABASE_NAME: 'onionoo',
    URL: 'mongodb://localhost:27017/onionoo',
    // remove oldest, excluding STORE_HISTORY newest collections
    STORE_HISTORY: 4
};
exports.ONIONOO = {
    BASE_URL: 'https://onionoo.torproject.org/',
    // timeout 10 sec
    REQUEST_TIMEOUT: 1000 * 10
};
