/*jslint node: true */
/*global exports */
'use strict';

var passport = require('passport');

/**
 * Simple informational end point, if you want to get information
 * about a particular user.  You would call this with an access token
 * in the body of the message according to OAuth 2.0 standards
 * http://tools.ietf.org/html/rfc6750#section-2.1
 *
 * Example would be using the endpoint of
 * https://localhost:3000/api/userinfo
 *
 * With a GET using an Authorization Bearer token similar to
 * GET /api/userinfo
 * Host: https://localhost:3000
 * Authorization: Bearer someAccessTokenHere
 */
exports.info = [
  passport.authenticate('bearer', {session: false}),
  function (req, res) {
    // req.authInfo is set using the `info` argument supplied by
    // `BearerStrategy`.  It is typically used to indicate scope of the token,
    // and used in access control checks.  For illustrative purposes, this
    // example simply returns the scope in the response.
      //console.log(req.user);
    res.json({user_id: req.user.id, username: req.user.username, name: req.user.firstName, last_name: req.user.lastName, email: req.user.email, scope: req.authInfo.scope});
  }
];
