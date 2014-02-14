var moment = require('moment');

module.exports = function(value){
    var momentDate = moment(value, 'YYYY-MM-DD HH:mm:ss'),
        diff,
    // default result
        result = {},
        fl = Math.floor;

    if (momentDate.isValid()) {

        diff = moment().diff(momentDate);

        result.s = Math.round(diff / 1000);
        result.m = fl(result.s / 60);
        result.h = fl(result.m / 60);
        result.d = fl(result.h / 24);

        result.s %= 60;
        result.m %= 60;
        result.h %= 24;
    }

    return result;
};