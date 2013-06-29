/**
 * /rest/users/*
 */

/**
* @TODO Params
*/

var User = require('../../models/user');

// GET /rest/users
exports.findAll = function(req, res)
{
	if (!req.session.logged)
	{
		res.send({success:false, errors: ["Bad authentification"]});
		return;
	}

	User.find({}, User.publicFieldsStr(), {}, function(err, all_users)
	{
		var result;
		if (err)
		{
			result = {
				success: false,
				errors : ["Failed to access db"],
			}
		}
		else
		{
			result = {
				success : true,
				data : all_users
			}
		}
		res.send(result)
	});
}

// GET /rest/users/:username
exports.findById = function(req, res)
{
	if (!req.session.logged)
	{
		res.send({success:false, errors:["Bad authentification"]});
		return;
	}

	var fields;
	if (req.session.user.username == req.params.username)
		fields = User.allFieldsStr();
	else
		fields = User.publicFieldsStr();


	User.findOne(
		{username : req.params.username},
		fields,
		null,
		function(err, user)
		{
			var result;
			if (err)
			{
				result = {
					success: false,
					errors : ["Failed to access db"],
				}
			}
			else
			{
				result = {
					success : true,
					data : user
				}
			}
			res.send(result)
		}
	);
}	

// POST /rest/users
// 
exports.addUser = function(req, res)
{
	if (req.session.logged)
	{
		res.send({success:false, errors:["Already authentificated"]});
		return;
	}

	var checkForm = require('../../utils/form-validator').validateRegistrationForm;

	checkForm(req, function(validation_results)
	{
		if (validation_results.isValid)
		{
			var new_user = new User({username : req.body.username, email : req.body.email, password : req.body.password});
			new_user.save(
				function(err, member)
				{
					var request_results;
					if (err)
					{
						res.send({
							success : false,
							errors : ["Server error : unable to create new user"]
						});
					}
					else
					{
						req.session.logged = true;
						req.session.user = new_user;
						res.send({
							success : true,
							data : null
						});
					}
				}
			);
		}
		else
		{
			var form_errors = [];

			for (var i = 0; i < validation_results.errors.length; i++)
				form_errors.push(validation_results.errors[i].msg);

			res.send({
				success : false,
				errors : form_errors
			});
		}
	});
}

// POST /rest/users/:username
exports.updateUser = function(req, res)
{
	if (!req.session.logged)
	{
		res.send({success:false, errors:["Bad authentification"]});
		return;
	}

	// if updating someone else's info
	if (req.params.username != req.session.user.username)
	{
		res.send({success:false, errors:["Permission denied"]});
		return;
	}

	res.send({success:false, errors:["Not implemented yet"]});
}

// DELETE /rest/users/:username
exports.deleteUser = function(req, res)
{
	if (!req.session.logged)
	{
		res.send({success:false, errors:["Bad authentification"]});
		return;
	}

	// if deleting someone else's info
	if (req.params.username != req.session.user.username)
	{
		res.send({success:false, errors:["Permission denied"]});
		return;
	}

	User.findOneAndRemove({ username : req.params.username }, function(err, removed)
	{
		if (err)
			res.send({success:false, errors:["Database access failed"]});
		else
		{
			req.session.logged = false;
			req.session.user = null;
			res.send({success:true, data:null});
		}
	});
}
