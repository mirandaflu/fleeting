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
		return new Promise((resolve, reject) => {
			return hook.app.service('groups').get(data.group).then(group => {
				return Promise.all(group.members.map(member => {
					return member.toString();
				})).then(members => {
					if (members.indexOf(connection.user._id.toString()) != -1) resolve(data);
					else reject();
				})
			}).catch(reject);
		});
	});
};
