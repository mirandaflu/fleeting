'use strict';

const service = require('feathers-mongoose');
const notification = require('./notification-model');
const hooks = require('./hooks');

module.exports = function() {
	const app = this;

	const options = {
		Model: notification,
		paginate: false
	};

	// Initialize our service with any options it requires
	app.use('/notifications', service(options));

	// Get our initialize service to that we can bind hooks
	const notificationService = app.service('/notifications');

	// Set up our before hooks
	notificationService.before(hooks.before);

	// Set up our after hooks
	notificationService.after(hooks.after);
};
