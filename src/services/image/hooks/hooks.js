'use strict';

exports.updateGroupImage = function(options) {
	return function(hook) {
		return new Promise((resolve, reject) => {
			hook.app.service('groups')
				.patch(hook.result.group, { recentImage: hook.result.path })
				.then(result => { resolve(hook); })
				.catch(reject);
		});
	};
};

exports.populateUsername = function(options) {
	return function(hook) {
		return new Promise((resolve, reject) => {
			return Promise.all(hook.result.map(image => {
				return hook.app.service('users').get(image.user).then(user => {
					image.username = user.username;
				});
			})).then(result => {
				resolve(hook);
			}).catch(reject);
		});
	};
};
