var Fs = require('fs');
var User = require('../../models/user');

// GET /rest/avatars/:username
exports.getAvatarByUserName = function(req, res)
{
	User.findOne({username: req.params.username}, function (err, user)
	{
		if (user.profilePictureName != "")
			var path = require('../../locals').uploadDir + "/avatars/" + user.profilePictureName;
		else
			var path = "public/images/avatar-placeholder.png";
		res.sendfile(path)
	});
}

// POST /rest/avatars/:username
exports.setAvatar = function(req, res)
{
	if (!req.session.logged)
		return res.send({success:false, errors:["Bad authentification"]});
	if (req.params.username != req.session.user.username)
		return res.send({success:false, errors:["Permission denied"]});

	if (req.files.profile_picture.type != 'image/png' &&
		req.files.profile_picture.type != 'image/jpg' &&
		req.files.profile_picture.type != 'image/jpeg')
		return res.send({success:false, errors:["Invalid file format (requires png or jpg)"]});

	if (req.files.profile_picture.size > 5242880)
	{
		return res.send({success:false, errors:["File size exceeds maximum limit (5M)"]});
	}

	var tmp_path = req.files.profile_picture.path;

	var target_dir = require('../../locals').uploadDir + "/avatars/";
	var target_path = require('../../locals').uploadDir + "/avatars/" + req.params.username + '.' + req.files.profile_picture.type.split('/').pop();

	Fs.rename(tmp_path, target_path, function(err)
	{
		if (err)
			return res.send({success:false, errors:["Server error.B"]});
		Fs.unlink(tmp_path, function() {
			if (err)
				return res.send({success:false, errors:["Server error.C"]});
			

			req.session.user.profilePictureName = req.params.username + '.' + req.files.profile_picture.type.split('/').pop();
			console.log(req.session.user);
			User.findOne({username : req.params.username},
				function(err, user)
				{
					if (err)
						return res.send({success:false, errors:["Server error."]});
					user.profilePictureName = req.params.username + '.' + req.files.profile_picture.type.split('/').pop();
					user.save(function(err){
						if (err)
							return res.send({success:false, errors:["Server error."]});
						res.send({success:true,data:null});
					});
				}
			);
		});
	});
}