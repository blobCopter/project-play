module.exports = function()
{
	var express = require('express');
	var app = express();
	app.locals(require('../../locals'));


	// CRUD:
	// Create -> POST
	// Read -> GET
	// Update -> PUT
	// Delete -> DELETE


	/*
	* REST/USERS
	*/
	var rest_users = require('./users-rest');
	app.get('/users', rest_users.findAll);
	app.get('/users/:id', rest_users.findById);
	app.post('/users', rest_users.addUser);
	app.put('/users/:id', rest_users.updateUser);
	app.delete('/users/:id', rest_users.deleteUser);

	/*
	* REST/GAMSE
	*/
	var rest_games = require('./games-rest');
	app.get('/games/search', rest_games.findGameByName);

	return app;
}();