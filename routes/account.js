
/*
 * GET register page.
 */

var User = require('../models/user');

module.exports = function (req,res)
{
	if (!req.session.logged)
	{
    	res.render('index', {});
    }
    else
    	res.render('account', {session: req.session, avatarpath:null});
};