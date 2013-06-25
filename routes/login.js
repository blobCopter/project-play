
/*
 * GET home page.
 */
var User = require('../models/user');

module.exports = function(req, res)
{
	req.session.logged = false;
	req.session.user = null;
  	
  	User.findOne({ $or:[{username : req.body.identifier}, {email : req.body.identifier}]}, function (err, user)
  	{
  		if (err)
  			res.render('index', { login_errors: "Unable to reach server. Try again later (1)" });
  		else if (!user)
  			res.render('index', { login_errors: "Invalid id or password (id)" });
  		else
  		{
  			user.comparePassword(req.body.password, function(err, isMatch)
  			{
  				if (err)
  					res.render('index', { login_errors: "ASd -> " + err });
  				else if (isMatch)
  				{
  					req.session.logged = true;
  					req.session.user = user;
  					res.render('home', { session : req.session});
  				}
  				else
	  				res.render('index', { login_errors: "Invalid id or password (pass)" });
  			});
  		}
  	});
};