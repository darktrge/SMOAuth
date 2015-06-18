/*jslint node: true */
/*global exports */
'use strict';

var MongoClient = require('mongodb').MongoClient;
var config = require('../config');

//TODO Configure the connection string for mongo to accept more than just local host

/**
 * Our local static db
 */
var localDb;
//start of development!!!! not safe to use!!!
var initialize_database = function () {
  if (typeof localDb !== "undefined") {
    //The database is already initialized
    console.log('The database is already initialized, nothing todo');
    //var localCollection = localDb.collection('tokens');
  } else {
    //We have to initialize the database and its connection
    console.log('Trying to initialize the database and its connection');
    MongoClient.connect(config.db.connection_string , function (err, db) {
      if (err) {
        throw err;
      }
      localDb = db;
      //Add an index to the tokens
      localDb.collection('tokens').createIndex({token: 1}, function (err, inserted) {
      });
      localDb.collection('accesstokens').createIndex({token: 1}, function (err, inserted) {
      });
      localDb.collection('refreshtokens').createIndex({token: 1}, function (err, inserted) {
      });
      localDb.collection('authorizationcodes').createIndex({code: 1}, function (err, inserted) {
      });
    });
  }
};

initialize_database();
