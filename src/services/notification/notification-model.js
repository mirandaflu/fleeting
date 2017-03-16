'use strict';

// notification-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
	user: { type: Schema.ObjectId, ref: 'user', required: true },
	group: { type: Schema.ObjectId, ref: 'group', required: true },
	unread: { type: Boolean, default: true },
	createdAt: { type: Date, 'default': Date.now },
	updatedAt: { type: Date, 'default': Date.now }
});

const notificationModel = mongoose.model('notification', notificationSchema);

module.exports = notificationModel;