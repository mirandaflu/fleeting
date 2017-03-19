'use strict';

// image-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
	user: { type: Schema.ObjectId, ref: 'user', required: true },
	group: { type: Schema.ObjectId, ref: 'group', required: true },
	key: { type: String },
	oldKey: { type: String },
	createdAt: { type: Date, 'default': Date.now }
});

const imageModel = mongoose.model('image', imageSchema);

module.exports = imageModel;