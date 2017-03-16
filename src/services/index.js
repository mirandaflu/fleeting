'use strict';
const notification = require('./notification');
const image = require('./image');
const group = require('./group');
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');

module.exports = function() {
	const app = this;

	mongoose.connect(app.get('mongodb'));
	mongoose.Promise = global.Promise;

	app.configure(authentication);
	app.configure(user);
	app.configure(group);
	app.configure(image);
	app.configure(notification);
};
