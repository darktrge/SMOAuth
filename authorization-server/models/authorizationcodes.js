/*jslint node: true */
/*global exports */
/*global models */
'use strict';

//The authorization codes.
//You will use these to get the access codes to get to the data in your endpoints as outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Returns an authorization code if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the authorization code
 * @param done The function to call next
 * @returns The authorization code if found, otherwise returns null
 */
exports.find = function (key, done) {
  //console.log('finding authorization-code');
  mongodb.getCollection(function (collection) {
    var cursor = collection.find({token: key});
    cursor.nextObject(function (err, token) {
      if (!err && token) {
        //console.log('authorization-code succesfully saved');
        return done(null, token);
      } else {
        //console.log('ERROR finding authorization-code');
        return done(null);
      }
    });
  });
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param code The authorization code (required)
 * @param clientID The client ID (required)
 * @param userID The user ID (required)
 * @param redirectURI The redirect URI of where to send access tokens once exchanged (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (code, clientID, redirectURI, userID, scope, done) {
  //console.log('saving authorization-code');
  mongodb.getCollection(function (collection) {
    collection.insert({
      token: code,
      clientID: clientID,
      redirectURI: redirectURI,
      userID: userID,
      scope: scope
    }, function (err, inserted) {
      if (err) {
        console.log('ERROR saving authorization-code');
        return done(err);
      } else {
        //console.log('saving authorization-code OK');
        return done(null);
      }
    });
  });
};

/**
 * Deletes an authorization code
 * @param key The authorization code to delete
 * @param done Calls this with null always
 */
exports.delete = function (key, done) {
  //console.log('deleting authorization-code');
  mongodb.getCollection(function (collection) {
    collection.remove({
      token: key
    }, function (err, result) {
      if (err) {
        console.log('ERROR deleting authorization-code');
        return done(err, result);
      } else {
        //console.log('deleting authorization-code OK');
        return done(null, result);
      }
    });
  });
};


var AuthorizationCodesSchema = new Schema({
  token: String,
  clientID: String,
  redirectURI: String,
  userID: String,
  scope: String,
  /*user: {
    type: Schema.ObjectId,
    ref: 'Users'
  },
  client: {
    type: Schema.ObjectId,
    ref: 'OAuthClient'
  }*/
});

AuthorizationCodesSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).exec(cb);
  }
};

mongoose.model('AuthorizationCode', AuthorizationCodesSchema);
var AuthorizationCodes=mongoose.model('AuthorizationCode', AuthorizationCodesSchema);
var Users=mongoose.model('User');
