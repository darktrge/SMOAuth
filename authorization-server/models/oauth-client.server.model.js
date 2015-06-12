'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    utils = require('../lib/utils');

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

mongoose.model('OAuthClient', OAuthClientSchema);