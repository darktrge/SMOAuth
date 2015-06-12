'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Request token Schema
 */
var RequestTokenSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    code: String,
    redirectUri: String,
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    client: {
        type: Schema.ObjectId,
        ref: 'OAuthClient'
    }
});

/**
 * Statics
 */
RequestTokenSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

mongoose.model('RequestToken', RequestTokenSchema);