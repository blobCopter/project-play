
/*
 * GET users listing.
 */

var User = require('../models/user');

exports.list = function(req, res)
{

	list = {};

	User.find(function(err, users)
	{
		res.send(users);
	})
};