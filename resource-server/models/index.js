/*jslint node: true */
'use strict';

var mongodb = require('./mongoinit.js');
var mongoose = require('mongoose');
var config = require('../config/index');

exports.connection = mongoose.connect(config.db.connection_string, function(err) {
  if (err) {
    console.log('Could not connect to MongoDB!!!');
    console.log(err);
  }
});

exports.users = require('./users');
exports.clients = require('./clients');
exports.accessTokens = require('./accesstokens');
exports.authorizationCodes = require('./authorizationcodes');
exports.refreshTokens = require('./refreshtokens');
