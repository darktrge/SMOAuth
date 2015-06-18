/*jslint node: true */
/*global exports */
'use strict';

/**
 * The client id and the client secret.  I'm using a
 * "trusted" client so that I don't get the "decision"
 * screen.
 */
exports.client = {
  clientID: "trustedClient",
  clientSecret: "ssh-otherpassword"
};

//TODO Compact this more, and document it better
/**
 * The Authorization server's location, port number, and the token info end point
 */
exports.authorization = {
  host: "localhost",
  port: "3000",
  url: "https://localhost:3000/",
  tokenURL: "oauth/token",
  authorizeURL: "https://localhost:3000/dialog/authorize",
  tokeninfoURL: "https://localhost:3000/api/tokeninfo?access_token=",
  redirectURL: "https://localhost:4000/receivetoken"
};

/**
 * Database configuration for access and refresh tokens.
 *
 * timeToCheckExpiredTokens - The time in seconds to check the database
 * for expired access tokens.  For example, if it's set to 3600, then that's
 * one hour to check for expired access tokens.
 * @type {{timeToCheckExpiredTokens: number}}
 */

/*
exports.db = {
  timeToCheckExpiredTokens: 3600
};
*/

exports.db = {
  timeToCheckExpiredTokens: 3600,
  type: "models",//directory name with data models. e.g. swith to mysql, create folder mysql with all models required
  dbName: "smportal-dev",
  connection_string: "mongodb://localhost:27017/smportal-dev"
};

/**
 * Session configuration
 *
 * secret - The session secret that you should change to what you want
 */

exports.session = {
  type: "MongoStore",
  maxAge: 3600000 * 24 * 7 * 52,
  //TODO You need to change this secret to something that you choose for your secret
  secret: "SM-secret-key",
  dbName: "smportal-dev"
};

//exports.session = {
//  //TODO You need to change this secret to something that you choose for your secret
//  secret: "A Secret That Should Be Changed"
//};

