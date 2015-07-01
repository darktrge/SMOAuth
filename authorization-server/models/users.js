/*jslint node: true */
/*global exports */
'use strict';

/**
 * This is the configuration of the users that are allowed to connected to your authorization server.
 * These represent users of different client applications that can connect to the authorization server.
 * At a minimum you need the required properties of
 *
 * id: (A unique numeric id of your user )
 * username: (The user name of the user)
 * password: (The password of your user)
 * name: (The name of your user)
 */

var users={}

/*var users = [
  {
    id: '1',
    username: 'bob',
    password: 'secret',
    name: 'Bob Smith'
  },
  {
    id: '2',
    username: 'joe',
    password: 'password',
    name: 'Joe Davis'
  }
];*/

/**
 * Returns a user if it finds one, otherwise returns
 * null if a user is not found.
 * @param id The unique id of the user to find
 * @param done The function to call next
 * @returns The user if found, otherwise returns null
 */
exports.find = function (id, done) {
  Users.findById(id,function(err,found){
      if(err){
          return done(err,null);
      }else{
          return done(null,found);
      }
  });
};

exports.findByUserId = function (id, done) {
  Users.findById(id,function(err,found){
      if(err){
          return done(err,null);
      }else{
          return done(null,found);
      }
  });
};

/**
 * Returns a user if it finds one, otherwise returns
 * null if a user is not found.
 * @param username The unique user name to find
 * @param done The function to call next
 * @returns The user if found, otherwise returns null
 */
exports.findByUsername = function (username, done) {
  Users.findOne({'username':username},function(err,found){
    return done(null,found);
  });

  /*for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.username === username) {
      return done(null, user);
    }
  }
  return done(null, null);*/
};

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin','developer']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');
	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);
var Users=mongoose.model('User', UserSchema);

/*
Users.find(id, done){}.exec(function (err,data) {
  });*/
