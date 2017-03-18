'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

const localHooks = require('./hooks.js');

exports.before = {
	all: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated()
	],
	find: [],
	get: [],
	create: [
		hooks.setUpdatedAt()
	],
	update: [
		hooks.setUpdatedAt()
	],
	patch: [
		hooks.setUpdatedAt()
	],
	remove: []
};

exports.after = {
	all: [],
	find: [
		localHooks.populateUsername()
	],
	get: [],
	create: [
		localHooks.updateGroupImage()
	],
	update: [],
	patch: [
		localHooks.updateGroupImage()
	],
	remove: []
};
