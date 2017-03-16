'use strict';

const service = require('feathers-mongoose');
const group = require('./group-model');
const hooks = require('./hooks');

module.exports = function() {
	const app = this;

	const options = {
		Model: group,
		paginate: false
	};

	// Initialize our service with any options it requires
	app.use('/groups', service(options));

	// Get our initialize service to that we can bind hooks
	const groupService = app.service('/groups');

	// Set up our before hooks
	groupService.before(hooks.before);

	// Set up our after hooks
	groupService.after(hooks.after);
};
