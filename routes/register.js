
/*
 * GET register page.
 */

var User = require('../models/user');
var checkForm = require('../utils/form-validator').validateRegistrationForm;

module.exports = function (req,res)
{
	if (!req.session.logged)
	{
    	res.render('register', {});
    }
    else
    	res.render('home', {session: req.session});
};