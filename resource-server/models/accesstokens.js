/*jslint node: true */
/*global exports */
'use strict';

//The access tokens.
//You will use these to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)
var mongodb = require('./mongoinit.js');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Returns an access token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the access token
 * @param done The function to call next
 * @returns The access token if found, otherwise returns null
 */
exports.find = function (key, done) {
  console.log('finding accesstoken find');

  AccessTokens.findOne({token:key},function(err,found){
    return done(null,found);
  });
  console.log('OVO NIJE TREBALO DA SE IZVRSI');

  /*models.getCollection(function (collection) {
    var cursor = collection.find({token: key});
    cursor.nextObject(function (err, token) {
      if (!err && token) {
        console.log('accesstoken found');
        return done(null, token);
      } else {
        console.log('accesstoken NOT found');
        return done(null);
      }
    });
  });*/
};

/**
 * Saves a access token, expiration date, user id, client id, and scope.
 * @param token The access token (required)
 * @param expirationDate The expiration of the access token that is a javascript Date() object (required)
 * @param userID The user ID (required)
 * @param clientID The client ID (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (token, expirationDate, userID, clientID, scope, done) {
    console.log('attempting accesstoken save');
    var token = new AccessTokens({token:token, expirationDate:expirationDate,
                userID:userID, clientID:clientID, scope:scope});
    token.save(function(err) {
      if (err) {
          return done(err);
      } else {
          return done(null);
      }
    });

  /*
  models.getCollection(function (collection) {
    collection.insert({
      token: token,
      userID: userID,
      expirationDate: expirationDate,
      clientID: clientID,
      scope: scope
    }, function (err, inserted) {
      if (err) {
        console.log('accesstoken NOT saved');
        return done(err);
      } else {
        console.log('accesstoken saved');
        return done(null);
      }
    });
  });*/
};

/**
 * Deletes an access token
 * @param key The access token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
  console.log('attempting accesstoken key delete');

  AccessTokens.findOneAndRemove({token:key},function(err,offer) {
    console.log(err);
    return done(err,offer);
  });
  /*
  models.getCollection(function (collection) {
    collection.remove({
      token: key
    }, function (err, result) {
      if (err) {
        console.log('accesstoken NOT deleted');
        return done(err, result);
      } else {
        console.log('accesstoken deleted');
        return done(null, result);
      }
    });
  });*/
};

/**
 * Removes expired access tokens.  It does this by looping through them all
 * and then removing the expired ones it finds.
 * @param done returns this when done.
 * @returns done
 */
exports.removeExpired = function (done) {
  AccessTokens.find({expirationDate: {$lt:Date.now}},function(err,found){
    if(found){
      console.log('deleting expired tokens',found);
      AccessTokens.find({expirationDate: {$lt:Date.now()}}).remove(function(err){
        return done(err);
      });
    }
  });



  /*models.getCollection(function (collection) {
    collection.find().each(function (err, token) {
      if (token !== null) {
        if (new Date() > token.expirationDate) {
          collection.remove({
            token: token
          }, function (err, result) {
          });
        }
      }
    });
  });*/
  return done(null);
};

/**
 * Removes all access tokens.
 * @param done returns this when done.
 */
exports.removeAll = function (done) {
  console.log('finding accesstoken remove all - DISABLED!!!!');
  //AccessTokens.remove();
  /*models.getCollection(function (collection) {
    collection.remove(function (err, result) {
    });
    return done(null);
  });*/
};

var AccessTokenSchema = new Schema({
  token: String,
  userID: {
    type: String,
    trim: true,
    default: null
  },
  expirationDate: {
    type: Date,
    default: Date.now
  },
  clientID: {
    type: String,
    trim: true,
    required: true
  },
  scope: {
    type: String,
  }
});

AccessTokenSchema.statics = {
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).exec(cb);
  }
};

mongoose.model('AccessToken', AccessTokenSchema);
var AccessTokens=mongoose.model('AccessToken', AccessTokenSchema);
var Users=mongoose.model('User');
