'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	//errorHandler = require('./errors.server.controller'),
	OAuthClient = mongoose.model('OAuthClient'),
	_ = require('lodash');

/**
 * Create a Oauth client
 */
exports.create = function(req, res) {
	var oauthClient = new OAuthClient(req.body);
	oauthClient.user = req.user;

	oauthClient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(oauthClient);
		}
	});
};

/**
 * Show the current Oauth client
 */
exports.read = function(req, res) {
	res.jsonp(req.oauthClient);
};

/**
 * Update a OAuth client
 */
exports.update = function(req, res) {
	var oauthClient = req.oauthClient ;

	oauthClient = _.extend(oauthClient , req.body);

	oauthClient.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(oauthClient);
		}
	});
};

/**
 * Delete an Oauth client
 */
exports.delete = function(req, res) {
	var oauthClient = req.oauthClient ;

	oauthClient.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(oauthClient);
		}
	});
};

/**
 * List of Oauth clients
 */
exports.list = function(req, res) {
    OAuthClient.find().sort('-created').populate('user', 'displayName').exec(function(err, oauthClients) {
		//console.log(oauthClients);
        if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(oauthClients);
		}
	});
};

/**
 * Oauth client middleware
 */
exports.oauthClientByID = function(req, res, next, id) {
    OAuthClient.findById(id).populate('user', 'displayName').exec(function(err, oauthClient) {
		//console.log(oauthClient);
        if (err) return next(err);
		if (! oauthClient) return next(new Error('Failed to load Oauth client ' + id));
		req.oauthClient = oauthClient ;
		next();
	});
};

/**
 * Oauth client authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.oauthClient.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
