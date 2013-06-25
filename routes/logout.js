
/*
 * GET home page.
 */

module.exports = function(req, res)
{
	req.session.logged = false;
	req.session.user = null;
  	res.render('index', {});
};