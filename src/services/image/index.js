'use strict';

const service = require('feathers-mongoose');
const image = require('./image-model');
const hooks = require('./hooks');

module.exports = function() {
	const app = this;

	const options = {
		Model: image,
		paginate: false
	};

	// Initialize our service with any options it requires
	app.use('/images', service(options));

	// Get our initialize service to that we can bind hooks
	const imageService = app.service('/images');

	// Set up our before hooks
	imageService.before(hooks.before);

	// Set up our after hooks
	imageService.after(hooks.after);

	// Only let group members see image events
	imageService.filter((data, connection, hook) => {
		hook.app.service('groups').get(data.group).then(group => {
			if (group.members.indexOf(connection.user._id) != -1) return data;
			else return false;
		}).catch(error => {
			return false;
		});
	});
};
