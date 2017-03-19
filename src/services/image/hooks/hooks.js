'use strict';

const aws = require('aws-sdk');

exports.updateGroupImage = function(options) {
	return function(hook) {
		return new Promise((resolve, reject) => {
			hook.app.service('groups')
				.patch(hook.result.group, { recentImage: hook.result.key })
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

exports.storeLastImageKey = function(options) {
	return function(hook) {
		return new Promise((resolve, reject) => {
			if (!hook.data.key || !hook.params.provider) return resolve(hook);
			hook.app.service('images').get(hook.id).then(image => {
				hook.app.service('images').patch(hook.id, {
					oldKey: image.key
				}).then(result => { resolve(hook); }).catch(reject);
			}).catch(reject);
		});
	};
};

exports.deleteLastImageFromS3 = function(options) {
	return function(hook) {
		return new Promise((resolve, reject) => {
			if (!hook.data.key || !hook.params.provider) return resolve(hook);
			aws.config.update({
				accessKeyId: hook.app.get('s3').accessKeyId,
				secretAccessKey: hook.app.get('s3').secretAccessKey
			});
			const s3 = new aws.S3();
			s3.deleteObjects({
				Bucket: hook.app.get('s3').bucket,
				Delete: { Objects: [ { Key: hook.result.oldKey } ] }
			}, (error, data) => {
				if (error) reject(error);
				else resolve(hook);
			});
		});
	};
};
