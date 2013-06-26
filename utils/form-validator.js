

// Returns
// {
// 	isValid : boolean,
// 	errors : [ {
// 		msg : String,
// 		param : String,
// 		value : String,
// 	} ]
// }

var User = require('../models/user');

exports.validateRegistrationForm = function(req, callback)
	{
		req.assert('username', 'The username should be betwwen 4 and 30 characters. It can contain letters, numbers, underscores and dashes').regex('^[a-z0-9_-]{4,15}$', 'i');
		req.assert('email', 'Valid email required').isEmail();
		req.assert('password', 'Password requires 6 to 20 characters').len(6, 20);
		req.assert('password_verif', 'Password verification does not match').equals(req.body.password);

		var validationerrors = req.validationErrors();
		var result = {
			isValid : (validationerrors == null),
			errors : validationerrors
		};

		if (!result.isValid)
			callback(result);
		else
		{
			result.errors = [];
			User.findOne({$or: [ {username : req.body.username}, {email : req.body.email}]}, function(err, user)
			{
				if (err)
				{
					result.errors.push({
							msg : "Unable to reach server. Try again later",
							param : "all",
							value : ""
						});
					callback(result);
				} 
				else if (user == null)
					callback(result)
				else
				{
					if (user.username == req.body.username)
						result.errors.push({
							msg : "Username already in use. Please select another one",
							param : "username",
							value : req.body.username
						});
					if (user.email == req.body.email)
						result.errors.push({
							msg : "Email already in use. Please enter another one",
							param : "email",
							value : req.body.email
						});
					result.isValid = false;
					callback(result);
				}
			});
		}
	}
