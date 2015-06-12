/*jslint node: true */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var config = require('./config');
var db = require('./' + config.db.type);

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
/*passport.use(new LocalStrategy(
  function (username, password, done) {
    db.users.findByUsername(username, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));*/

var User = require('mongoose').model('User');

passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({
				username: username
			}, function(err, user) {
				if (err) {
          //console.log('local strategy -error happened quering for user',username,password);
					return done(err);
				}
				if (!user) {
          console.log('uknown user in local strategy:'+username);
					return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}
				if (!user.authenticate(password)) {
					console.log('wrong password used in local strategy for user:',user);
          return done(null, false, {
						message: 'Unknown user or invalid password'
					});
				}
        console.log('local strategy succesfuly used');
				return done(null, user);
			});
		}
	));

/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients.  They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens.  The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate.  Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header).  While this approach is not recommended by
 * the specification, in practice it is quite common.
 */
passport.use(new BasicStrategy(
  function (username, password, done) {
    //console.log('BasicStrategy used with: ');
    //console.log('username used: '+username);
    //console.log('password used: '+password);
    db.clients.findByClientId(username, function (err, client) {

      if (err) {
        return done(err);
      }

      if (!client) {
          console.log('NO CLIENT FOUND');
          return done(null, false);
      }
        //console.log('client found', client);
        var clientSecret = password;

      if (clientSecret != client.clientSecret) {
          console.log('Client PASSWORD MISMATCH!!!!!');
          //console.log('clientSecret',client.clientSecret);
          //console.log('password provided',clientSecret);
          return done(null, false);
      }else{
        //console.log('CLIENT PASSWORD MATCHESSSSS!!!!!');
      }
      return done(null, client);
    });
  }
));

/**
 * Client Password strategy
 *
 * The OAuth 2.0 client password authentication strategy authenticates clients
 * using a client ID and client secret. The strategy requires a verify callback,
 * which accepts those credentials and calls done providing a client.
 */
passport.use(new ClientPasswordStrategy(
  function (clientId, clientSecret, done) {
      //console.log('entering ClientPasswordStrategy');
      db.clients.findByClientId(clientId, function (err, client) {
      if (err) {
        return done(err);
      }
        //console.log('NO errors');
      if (!client) {
        return done(null, false);
      }
      if (client.clientSecret != clientSecret) {
        return done(null, false);
          console.log('passwords MISMATCH');
      }
        //console.log(clientId);
        //console.log(clientSecret);
        //console.log('passwords match');
      return done(null, client);
    });
  }
));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function (accessToken, done) {
      //console.log('entering BearerStrategy');
      db.accessTokens.find(accessToken, function (err, token) {
      if (err) {
        console.log('BearerStrategy reports error:', err);
        return done(err);
      }
      if (!token) {
        console.log('BearerStrategy reports token NOT found:', token);
        return done(null, false);
      }
        console.log('BearerStrategy reports token found:', token);
      if (new Date() > token.expirationDate) {
        console.log('BearerStrategy reports token expired:', token.expirationDate);
        db.accessTokens.delete(accessToken, function (err) {
          //console.log('BearerStrategy tries to delete token:', accessToken);
          return done(err);
        });
      } else {
        if (token.userID !== null) {
          //console.log("token.userID !== null passed", token.userID);
          db.users.find(token.userID, function (err, user) {
            if (err) {
              console.log('BearerStrategy cannot match token\'s user:', token.userID, err);
              return done(err);
            }
            if (!user) {
              console.log('BearerStrategy reports missing user:', token.userID);
              return done(null, false);
            }
            // to keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes
            var info = {scope: '*'};
            return done(null, user, info);
          });
        } else {
          console.log("token.userID !== null DIDNT pass for: userID", token.userID);
          //The request came from a client only since userID is null
          //therefore the client is passed back instead of a user
          db.clients.find(token.clientID, function (err, client) {
            if (err) {
              console.log('BearerStrategy reports error fetching client:', token.clientID);
              return done(err);
            }
            if (!client) {
              console.log('BearerStrategy reports client missing client:', token.clientID);
              return done(null, false);
            }
            console.log('BearerStrategy reports client found:', client);
            // to keep this example simple, restricted scopes are not implemented,
            // and this is just for illustrative purposes
            var info = {scope: '*'};
            return done(null, client, info);
          });
        }
      }
    });
  }
));

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTPS request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  //console.log('deserializeUser started');
  db.users.find(id, function (err, user) {
    //console.log(id);
    //console.log(err);
    //console.log(user);
    done(err, user);
  });
});
