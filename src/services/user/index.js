'use strict';

const service = require('feathers-mongoose');
const user = require('./user-model');
const hooks = require('./hooks');

module.exports = function(){
	const app = this;

	let options = {
		Model: user,
		paginate: false
	};

	// Initialize our service with any options it requires
	app.use('/users', service(options));

	// Get our initialize service to that we can bind hooks
	const userService = app.service('/users');

	// Set up our before hooks
	userService.before(hooks.before);

	// Set up our after hooks
	userService.after(hooks.after);

	// Only let a user see their own events
	userService.filter((data, connection) => {
		if (data._id.toString() == connection.user._id.toString()) return data;
		else return false;
	});
};
