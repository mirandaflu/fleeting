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

	// Only let group members see group events
	groupService.filter((data, connection) => {
		return new Promise((resolve, reject) => {
			return Promise.all(data.members.map(member => {
				return member.toString();
			})).then(members => {
				if (members.indexOf(connection.user._id.toString()) != -1) resolve(data);
				else reject();
			});
		});
	});
};
