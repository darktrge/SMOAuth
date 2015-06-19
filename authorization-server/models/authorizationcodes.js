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

  AuthorizationCodes.findOne({code:key},function(err,found){
    if (!err && found) {
      return done(err,found);
    }else{
      return done(null)
    }
  });
  //console.log('finding authorization-code');
  /*mongodb.getCollection(function (collection) {
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
  });*/
};

/**
 * Saves a authorization code, client id, redirect uri, user id, and scope.
 * @param code The authorization code (required)
 * @param clientId The client ID (required)
 * @param userId The user ID (required)
 * @param redirectURI The redirect URI of where to send access tokens once exchanged (required)
 * @param scope The scope (optional)
 * @param done Calls this with null always
 * @returns returns this with null
 */
exports.save = function (code, clientId, redirectURI, userId, scope, done) {
  var code = new AuthorizationCodes({code:code, clientId:clientId,redirectURI:redirectURI,
    userId:userId, scope:scope});
  code.save(function(err) {
    if (err) {
      //console.log('AuthorizationCode NOT saved due to');
      //console.log('error',err);
      return done(err);
    } else {
      //console.log('AuthorizationCode saved');
      return done(null);
    }
  });

};

/**
 * Deletes an authorization code
 * @param key The authorization code to delete
 * @param done Calls this with null always
 */
exports.delete = function (key, done) {
  AuthorizationCodes.findOneAndRemove({code:key},function(err,found) {
    //console.log(err);
    //console.log(found,'deleted');
    return done(err,found);
  });
  /*
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
  });*/
};


var AuthorizationCodesSchema = new Schema({
  code: {
    type: String,
    trim: true,
    required: true
  },
  clientId: {
    type: String,
    trim: true,
    /*required: true*/
  },
  redirectURI: {
    type: String,
    trim: true,
    /*required: true*/
  },
  userId: {
    type: String,
    trim: true,
    /*required: true*/
  },
  scope: {
    type: String
  }
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
