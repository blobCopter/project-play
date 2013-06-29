
/*
 * GET users listing.
 */

var User = require('../models/user');

exports.list = function(req, res)
{

	var fields = User.allFieldsStr();

	list = {};

	User.find({}, fields, function(err, users)
	{
		res.send(users);
	})
};