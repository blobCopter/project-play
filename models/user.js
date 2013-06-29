var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	Place = require('./place'),
	SALT_ROUNDS = 10;

/**
* SCHEMA
*
*/
var userSchema = mongoose.Schema({
    username: { type : String, unique : true, required: true }, // public
    email: { type : String, unique : true, required: true }, //private
    creationDate: { type: Date, default: Date.now }, // hidden
    password: { type : String, required : true}, // hidden
    friends: [String], // private
    current_game: {type : String, default:""}, // public
    looking_for: {type : String, default:""}, // public
    tags: [String], // public,
    profilePictureName: {type: String, default: ""} // hidden
});

/**
* PASSWORD BCRYPT
*
*/
userSchema.pre('save', function(next)
{
	var user = this;

	if (!user.isModified('password'))
		return next();
	bcrypt.genSalt(SALT_ROUNDS, function(err, salt)
	{
		if (err)
			return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash)
		{
			if (err) {
				return next(err);
			}		
			user.password = hash;
			next();
		});
	});
});


userSchema.statics.publicFieldsStr = function()
{
	return "username current_game looking_for tags";
}

userSchema.statics.privateFieldsStr = function()
{
	return "email friends friend_requests_to friend_requests_from"
}

userSchema.statics.allFieldsStr = function()
{
	return "username current_game looking_for tags email friends friend_requests_to friend_requests_from";
}

userSchema.methods.comparePassword = function(password_to_test, callback)
{
	bcrypt.compare(password_to_test, this.password, function(err, isMatch)
	{
		if (err)
			return callback(err, false);
		callback(null, isMatch);
	});
};

userSchema.methods.createPlace = function(x, y)
{
	return new Place({
		username : this.username,
		geo : [x, y]
	});
}


module.exports = mongoose.model("User", userSchema);