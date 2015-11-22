var vows = require('vows')
	assert = require('assert'),
	OAuthApi = require('../lib/oauthApi'),
	helpers = require('./helpers');

var lastToken = null;

vows.describe('oauthApi/createAccessToken').addBatch({

	'making the request': {
		topic: new OAuthApi(helpers.TestClientId, helpers.TestClientSecret),

		'createAccessToken': {
			topic: function (api) {
				api.createAccessToken(this.callback);
			},

			'does not throw an error': function(err, json) {
				assert.isNull(err);
			},

			'receive an "access_token"': function(err, json) {
				assert.notStrictEqual(json.access_token, undefined);
			},

			'receive an "expires_in"': function(err, json) {
				assert.notStrictEqual(json.expires_in, undefined);
			},

			'receive a "token_type"': function(err, json) {
				assert.notStrictEqual(json.token_type, undefined);
			}
		}
	}
})
.addBatch({

	'making the request': {
		topic: new OAuthApi(helpers.TestClientId, helpers.TestClientSecret),

		'createAccessToken + getAccessToken': {
			topic: function (api) {
				api.createAccessToken(function(err, json){
					if (err) {
						this.callback(err, json);
					} else {
						lastToken = json;
						api.getAccessToken(this.callback);
					}
				}.bind(this));
			},

			'does not throw an error': function(err, json) {
				assert.isNull(err);
			},

			'receive the same token created before': function(err, json) {
				assert.strictEqual(json, lastToken);
			}
		}
	}
}).export(module);
