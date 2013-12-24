
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
      title: 'Express'
  });
};
exports.help = function(req, res){
  res.render('help', {
      title: 'Express'
  });
};