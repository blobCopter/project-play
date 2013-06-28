var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	Tag = require('./tag'),
	Place = require('./place'),
	SALT_ROUNDS = 10;

/**
* SCHEMA
*
*/
var userSchema = mongoose.Schema({
    username: { type : String, unique : true, required: true },
    email: { type : String, unique : true, required: true },
    password: { type : String, required : true},
    current_game: {type : String, default:""},
    looking_for: {type : String, default:""},
    tags: [Tag]
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