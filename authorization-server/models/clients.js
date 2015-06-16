/*jslint node: true */
/*global exports */
'use strict';

/**
 * This is the configuration of the clients that are allowed to connected to your authorization server.
 * These represent client applications that can connect.  At a minimum you need the required properties of
 *
 * id: (A unique numeric id of your client application )
 * name: (The name of your client application)
 * clientId: (A unique id of your client application)
 * clientSecret: (A unique password(ish) secret that is _best not_ shared with anyone but your client
 *     application and the authorization server.
 *
 * Optionally you can set these properties which are
 * trustedClient: (default if missing is false.  If this is set to true then the client is regarded as a
 *     trusted client and not a 3rd party application.  That means that the user will not be presented with
 *     a decision dialog with the trusted application and that the trusted application gets full scope access
 *     without the user having to make a decision to allow or disallow the scope access.
 */

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    utils = require('../utils');

/**
 * OAuthClient Schema
 */
var OAuthClientSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Oauthclient name',
        trim: true
    },
    clientId: {
        type: String,
        default: '',
        trim: true
    },
    clientSecret: {
        type: String,
        default: '',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    trusted_client: {
        type: Boolean,
        default: false
    },
    allowedDomainURL: {
      type: String,
      default: '',
      required: 'allowed Domain URL field is required',
      trim: true
    }
});

OAuthClientSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

OAuthClientSchema.pre('save', function(next) {
    if (!this.isNew) return next();
    this.clientId = utils.uid(16);
    this.clientSecret = utils.uid(32);
    next();
});

var clients = [
  {
    id: '1',
    name: 'ContentParadise1',
    clientId: 'abc123',
    clientSecret: 'ssh-secret'
  },
  {
    id: '2',
    name: 'ContentParadise1',
    clientId: 'xyz123',
    clientSecret: 'ssh-password'
  },
  {
    id: '3',
    name: 'ContentParadise_trusted',
    clientId: 'trustedClient',
    clientSecret: 'ssh-otherpassword',
    trustedClient: true
  },
];

mongoose.model('OAuthClient', OAuthClientSchema);
var OAuthClients = mongoose.model('OAuthClient', OAuthClientSchema);

var Clients=mongoose.model('OAuthClient');

/*
Clients.find().exec(function (err,data) {
    //console.log(clients);
    clients=data;
    //console.log(clients);
  });*/

/**
 * Returns a client if it finds one, otherwise returns
 * null if a client is not found.
 * @param id The unique id of the client to find
 * @param done The function to call next
 * @returns The client if found, otherwise returns null
 */



exports.find = function (id, done) {
    OAuthClients.findById(id,function(err,found){
      //console.log('client response from db',found);
      return done(null,found);
    });
};

/**
 * Returns a client if it finds one, otherwise returns
 * null if a client is not found.
 * @param clientId The unique client id of the client to find
 * @param done The function to call next
 * @returns The client if found, otherwise returns null
 */
exports.findByClientId = function (clientId, done) {
    OAuthClients.findOne({clientId:clientId},function(err,found){
      return done(null,found);
    });
};
