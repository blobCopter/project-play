
/*
 * GET home page.
 */

exports.index = function(req, res)
{
	if (req.session.logged)
		res.render('home', { session : req.session})
	else
  		res.render('index', { login_errors: null });
};