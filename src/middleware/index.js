'use strict';

const path = require('path');
const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');

const aws = require('aws-sdk');

module.exports = function() {
	// Add your custom middleware here. Remember, that
	// just like Express the order matters, so error
	// handling middleware should go last.
	const app = this;

	aws.config.update({
		accessKeyId: app.get('s3').accessKeyId,
		secretAccessKey: app.get('s3').secretAccessKey
	});

	app.use('/s3', require('react-s3-uploader/s3router')({
		bucket: app.get('s3').bucket,
		ACL: 'public-read',
		uniquePrefix: true
	}));

	// redirect to https in production
	app.get('*', function(req,res,next) {
		if (req.headers['x-forwarded-proto'] != 'https' && process.env.NODE_ENV === "production"){
			res.redirect('https://'+req.headers.host+req.url);
		}
		else {
			next();
		}
	});

	// account for using react-router with browserHistory
	app.get('*', function (request, response){
		if (request.url == '/index_bundle.js') {
			response.sendFile(path.resolve(__dirname, '../../dist', 'index_bundle.js'));
		}
		else if (request.url == '/index_bundle.js.map') {
			response.sendFile(path.resolve(__dirname, '../../dist', 'index_bundle.js.map'));
		}
		else if (request.url == '/manifest.json') {
			response.sendFile(path.resolve(__dirname, '../../app', 'manifest.json'));
		}
		else {
			response.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
		}
	});

	app.use(notFound());
	app.use(logger(app));
	app.use(handler());
};
