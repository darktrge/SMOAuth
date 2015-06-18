/*jslint node: true */
/*global exports */
/*global models */
'use strict';

//The refresh tokens.
//You will use these to get access tokens to access your end point data through the means outlined
//in the RFC The OAuth 2.0 Authorization Framework: Bearer Token Usage
//(http://tools.ietf.org/html/rfc6750)

//var mongodb = require('./mongoinit.js');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Returns a refresh token if it finds one, otherwise returns
 * null if one is not found.
 * @param key The key to the refresh token
 * @param done The function to call next
 * @returns The refresh token if found, otherwise returns null
 */
exports.find = function (key, done) {

  RefreshTokens.findOne({token:key},function(err,found){
    return done(null,found);
  });

  /*var token=RefreshTokens.findById(key).exec(function(err, refreshToken) {
    return refreshToken;
  });
  console.log(token, 'TOKEN');
  if (token) {
    return done(null, token);
  } else {
    return done(null);
  }

  models.getCollection(function (collection) {
    var cursor = collection.find({token: key});
    cursor.nextObject(function (err, token) {
      if (!err && token) {
        return done(null, token);
      } else {
        return done(null);
      }
    });
  });*/
};

/**
 * Saves a refresh token, user id, client id, and scope.
 * @param token The refresh token (required)
 * @param userId The user ID (required)
 * @param clientId The client ID (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (token, userId, clientId, scope, done) {
  var rToken = new RefreshTokens({token:token,
    userId:userId, clientId:clientId, scope:scope});
    //console.log(rToken);
    //console.log(token,userId,clientId,scope);
  rToken.save(function(err) {
    if (err) {
      console.log('refreshtoken NOT saved');
      console.log('error',err);
      return done(err);
    } else {
      console.log('refreshtoken saved');
      return done(null);
    }
  });

  /*
  models.getCollection(function (collection) {
    collection.insert({
      token: token,
      userID: userID,
      clientID: clientID,
      scope: scope
    }, function (err, inserted) {
      if (err) {
        return done(err);
      } else {
        return done(null);
      }
    });
  });*/
};

/**
 * Deletes a refresh token
 * @param key The refresh token to delete
 * @param done returns this when done
 */
exports.delete = function (key, done) {
  console.log('attempting refreshtoken delete');
  RefreshTokens.findOneAndRemove({token:key},function(err,offer) {
    console.log(err);
    return done(err,offer);
  });

  /*models.getCollection(function (collection) {
    collection.remove({
      token: key
    }, function (err, result) {
      if (err) {
        return done(err, result);
      } else {
        return done(null, result);
      }
    });
  });*/
};

var RefreshTokenSchema = new Schema({
  token: {
    type: String,
    trim: true,
    required: true
  },
  userId: {
    type: String,
    trim: true,
    /*required: true*/
  },
  clientId: {
    type: String,
    trim: true,
    /*required: true*/
  },
  scope: {
    type: String,
    trim: true,
    /*required: true*/
  }
});

mongoose.model('RefreshToken', RefreshTokenSchema);
var RefreshTokens=mongoose.model('RefreshToken', RefreshTokenSchema);

RefreshTokens.find().exec(function (err,data) {
  //console.log(users);
  //users=data;
  //console.log(users);
});

