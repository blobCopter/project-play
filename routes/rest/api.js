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
	app.get('/users/:username', rest_users.findById);
	app.post('/users', rest_users.addUser);
	app.put('/users/:username', rest_users.updateUser);
	app.delete('/users/:username', rest_users.deleteUser);

	/*
	* REST/GAMES
	*/
	var rest_games = require('./games-rest');
	app.get('/games', rest_games.searchGamesByName);

	/*
	* REQUESTS
	* REST/REQUESTS
	*/
	var rest_requests = require('./requests-rest');
	app.get('/requests', rest_requests.findAllRequests);
	app.post('/requests', rest_requests.addRequest);
	app.delete('/requests', rest_requests.deleteRequest);

	return app;
}();