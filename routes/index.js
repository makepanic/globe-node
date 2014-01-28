/*
 * GET home page.
 */

exports.index = function (req, res) {
    var data = {
        title: 'Index'
    };
    res.render('index', data);
};
exports.help = function (req, res) {
    var data = {
        title: 'Index',
        path: 'help'
    };
    res.render('help', data);
};
exports.code = function (req, res) {
    var data = {
        title: 'Index',
        path: 'code'
    };
    res.render('code', data);
};