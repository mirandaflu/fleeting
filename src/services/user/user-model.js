// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	googleId: { type: String, unique: true, trim: true, index: true, sparse: true },
	username: { type: String, unique: true, trim: true, index: true, sparse: true }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
