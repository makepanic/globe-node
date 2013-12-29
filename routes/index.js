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
        title: 'Index'
    };
    res.render('help', data);
};