'use strict';

// group-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
	name: { type: String, required: true },
	recentImage: { type: String },
	admins: [ Schema.Types.ObjectId ],
	members: [ Schema.Types.ObjectId ],
	createdAt: { type: Date, 'default': Date.now },
	updatedAt: { type: Date, 'default': Date.now }
});

const groupModel = mongoose.model('group', groupSchema);

module.exports = groupModel;