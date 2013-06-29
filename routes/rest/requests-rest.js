/**
 * /rest/users/:username/requests
 */

var User = require('../../models/user');
var Request = require('../../models/request');
var ObjectId = require('mongoose').Types.ObjectId;

// GET /rest/requests
// Params
// from : String (optional, defaults to the current user)
// to : String (optional, defaults to the current user)
exports.findAllRequests = function(req, res)
{	
	if (!req.session.logged) {
		res.send({success: false, errors: ["Bad authentification"] });
		return;
	}

	var queryTo = req.query['to'];
	var queryFrom = req.query['from'];
	var search;
	// If they are the same
	if ((queryTo == queryFrom) && queryTo != null)
		return res.send({success:true, data:null});
	// If none of them is the current user
	if (queryTo != null && queryFrom != null && queryFrom != req.session.user.username && queryFrom != req.session.user.username)
		return res.send({success:true, data:null});

	if (queryTo != null && queryFrom != null) // If both fields have been sent
		search = { from : queryFrom, to : queryTo};
	else if (queryTo == null && queryFrom == null)
	{
		search = { $or:[{to : req.session.user.username}, {from : req.session.user.username}]};
	}
	else if (queryTo == null) // only the first one
	{
		if (queryFrom == req.session.user.username)
			search = {from : queryFrom}
		else
			search = {from : queryFrom, to : req.session.user.username}
	}
	else if (queryFrom == null) // only the second one
	{
		if (queryTo == req.session.user.username)
			search = {to : queryTo}
		else
			search = {from : req.session.user.username, to : queryTo}
	}

	Request.find(
		search,
		function(err, reqs)
		{
			if (err) {
				res.send({ success: false, errors: ["Server error"] });
				return;
			}
			res.send({success:true, data:reqs});
		}
	);
}

// POST /rest/users/:username/requests
// to : String
// msg : string (optional)
// (type : String (only type 'friend' available))
exports.addRequest = function(req, res)
{
	if (!req.session.logged) {
		res.send({success: false, errors: ["Bad authentification"] });
		return;
	}
	if (!req.body.to)
	{
		res.send({ success: false, errors: ["Missing parameter : 'to'"] });
		return;
	}
	if (req.body.to == req.session.user.username)
	{
		res.send({ success: false, errors : ["Invalid correspondant"] });
		return;
	}
	User.findOne({username : req.body.to},
		function(err, user)
		{
			// CHECK FOR ERRORS
			if (err)
				res.send({ success: false, errors: ["Server error"] });
			else if (!user)
				res.send({ success: false, errors: ["User not found"] });
			else
			{
				// ADDING THE REQUEST
				var new_req = new Request({
					type : "friend",
					from : req.session.user.username,
					to : req.body.to,
					msg : (req.body.msg ? req.body.msg : "")
				});

				new_req.save(function(err)
				{
					if (err)
						res.send({ success: false, errors: ["Database error " + err] });
					else
						res.send({success: true, data:null});
				});

			}
		}
	);
}

// DELETE /rest/requests
// Params :
// request id : ObjectId
// accept : boolean
exports.deleteRequest = function(req, res)
{
	if (!req.session.logged) {
		res.send({success: false, errors: ["Bad authentification"] });
		return;
	}
	var errs = [];
	if (!req.body.id)
		errs.push("Missing field 'id'");
	if (!req.body.accept
		|| (req.body.accept  != true && req.body.accept  != false
			&& req.body.accept  != "true" && req.body.accept  != "false"))
		errs.push("Missing or invalid field 'accept=[true|false]'");
	if (errs.length)
		return res.send({success:false, errors: errs});

	var accepted = (req.body.accept == "true" || req.body.accep == true) ? true : false;

	Request.findOne(
		{ _id : new ObjectId(req.body.id)},
		function(err, request)
		{
			if (err)
				return res.send({success:false, errors: ["Database error"]});
			if (!request)
				return res.send({success:false, errors: ["This request has not been found."]});
			if (request.to != req.session.user.username)
				return res.send({success:false, errors: ["This request has not been found"]});
			else
			{
				if (accepted)
				{
					User.find({ $or:[{username: request.to}, {username: request.from}]},
						function(err, users)
						{
							if (users.length != 2)
								return res.send({success: false, errors: ["User does not exist"]});

							// UPDATE FRIEND LIST
							if (users[0].friends.indexOf(users[1].username) < 0)
								users[0].friends.push(users[1].username);
							if (users[1].friends.indexOf(users[0].username) < 0)
								users[1].friends.push(users[0].username);

							if (users[0].username == req.session.user.username)
								req.session.user = users[0]; // UPDATE SESSION USER
							else if (users[1].username == req.session.user.username)
								req.session.user = users[1]; // UPDATE SESSION USER
							users[0].save(function(err)
							{
								if (err)
									return res.send({success:false, errors: ["Database error"]});
								else
								{
									users[1].save(function(err)
										{
											if (err)
												return res.send({success:false, errors: ["Database error"]});
											else
											{
												Request.remove({_id : request._id}, function(err){
													res.send({success:true, data: null});
												});
											}
										});
								}
							});
						}
					);
				}
				else
				{
					Request.remove({_id : request._id},
						function(err){
							res.send({success:true, data: null});
						}
					);
				}
			}
		}
	);

}