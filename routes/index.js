/*
 * GET home page.
 */

exports.index = function (req, res) {
    var data = {};
    res.render('index', data);
};
exports.help = function (req, res) {
    var data = {
        title: ['Help'],
        path: 'help'
    };
    res.render('help', data);
};
exports.code = function (req, res) {
    var data = {
        title: ['Code'],
        path: 'code'
    };
    res.render('code', data);
};