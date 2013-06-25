var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playproject');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function()
{
	var User = require('../models/user');
	var Place =  require('../models/place');
	var center_point = [29, 48];
	var user_count = 100;
	var done_count = 0;

	for (var i = 0; i < user_count; i++)
	{
		var name = getName(8, 20, 'u', "" + i);
		var new_user = new User({
			username : name,
			email : name + "@gmail.com",
			password : name,
		});

		new_user.save(function(err, user)
		{
			if (err) {
				console.log("Error : user " + user.username + " could not be added to the database =>" + err);
				done_count++;
				if (done_count == user_count) {
					console.log("Disonnecting");
					mongoose.disconnect();
				}
				return ;
			}
			console.log("User " + user.username + " created");
			

			var new_place = user.createPlace((center_point[0] - 0.3) + ((Math.random() * 10) % 0.6), (center_point[1] - 1) + ((Math.random() * 10) % 2));
			new_place.save(function(err, place)
			{
				done_count++;
				if (err) {
					console.log("Error : place of user " + user.username + " could not be added to the database =>" + err);
				}
				else
					console.log("User " + user.username + "'s position has been saved : " + place.geo[0] + "/" + place.geo[1]);
				if (done_count == user_count) {
					console.log("Disonnecting");
					mongoose.disconnect();
				}
			});

		});
	}
});


/**
** NAME GENERATOR From http://leapon.net/files/namegen.html
** By leonti.us.to
** Used locally for testing purposes
**/

function rnd(minv, maxv){
	if (maxv < minv) return 0;
	return Math.floor(Math.random()*(maxv-minv+1)) + minv;
}

function getName(minlength, maxlength, prefix, suffix)
{
	prefix = prefix || '';
	suffix = suffix || '';
	//these weird character sets are intended to cope with the nature of English (e.g. char 'x' pops up less frequently than char 's')
	//note: 'h' appears as consonants and vocals
	var vocals = 'aeiouyh' + 'aeiou' + 'aeiou';
	var cons = 'bcdfghjklmnpqrstvwxz' + 'bcdfgjklmnprstvw' + 'bcdfgjklmnprst';
	var allchars = vocals + cons;
	//minlength += prefix.length;
	//maxlength -= suffix.length;
	var length = rnd(minlength, maxlength) - prefix.length - suffix.length;
	if (length < 1) length = 1;
	//alert(minlength + ' ' + maxlength + ' ' + length);
	var consnum = 0;
	//alert(prefix);
	/*if ((prefix.length > 1) && (cons.indexOf(prefix[0]) != -1) && (cons.indexOf(prefix[1]) != -1)) {
		//alert('a');
		consnum = 2;
	}*/
	if (prefix.length > 0) {
		for (var i = 0; i < prefix.length; i++) {
			if (consnum == 2) consnum = 0;
			if (cons.indexOf(prefix[i]) != -1) {
				consnum++;
			}
		}
	}
	else {
		consnum = 1;
	}
	
	var name = prefix;
	
	for (var i = 0; i < length; i++)
	{
		//if we have used 2 consonants, the next char must be vocal.
		if (consnum == 2)
		{
			touse = vocals;
			consnum = 0;
		}
		else touse = allchars;
		//pick a random character from the set we are goin to use.
		c = touse.charAt(rnd(0, touse.length - 1));
		name = name + c;
		if (cons.indexOf(c) != -1) consnum++;
	}
	name = name.charAt(0).toUpperCase() + name.substring(1, name.length) + suffix;
	return name;
}
