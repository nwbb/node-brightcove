var vows = require('vows')
	assert = require('assert'),
	OAuthApi = require('../lib/oauthApi'),
	PolicyApi = require('../lib/policyApi'),
	helpers = require('./helpers');

var accountId = process.env.ACCOUNT_ID || helpers.TestAccountId;
var clientId = process.env.CLIENT_ID || helpers.TestClientId;
var clientSecret = process.env.CLIENT_SECRET || helpers.TestClientSecret;

if (!process.env.ACCOUNT_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
	vows.describe('policyApi/getPolicyKey').addBatch({
		'checking presence of environment variables' : {
			topic: function(){
				console.log('You need a valid account to run policy tests !');
				console.log('Set ACCOUNT_ID, CLIENT_ID and CLIENT_SECRET environnment variables to do so.\n');
				this.callback();
			},
			'process.env.ACCOUNT_ID' : function() {
				assert.notStrictEqual(process.env.ACCOUNT_ID, undefined);
			},
			'process.env.CLIENT_ID' : function() {
				assert.notStrictEqual(process.env.CLIENT_ID, undefined);
			},
			'process.env.CLIENT_SECRET' : function() {
				assert.notStrictEqual(process.env.CLIENT_SECRET, undefined);
			}
		}
	}).export(module);

} else {
	vows.describe('policyApi/getPolicyKey').addBatch({

		'making the request': {
			topic: new PolicyApi(accountId, new OAuthApi(clientId, clientSecret)),

			'getPolicyKey': {
				topic: function (api) {
					api.getPolicyKey(this.callback);
				},

				'does not throw an error': function(err, json) {
					assert.isNull(err);
				},

				'receive a "key-string"': function(err, json) {
					assert.notStrictEqual(json ? json['key-string'] : undefined, undefined);
				},

				'receive a "policies"': function(err, json) {
					assert.notStrictEqual(json ? json.policies : undefined, undefined);
				}
			},

			'getPolicy': {
				topic: function (api) {
					api.getPolicyKey(function(err, json){
						api.getPolicy(json['key-string'], this.callback);
					}.bind(this));
				},

				'does not throw an error': function(err, json) {
					assert.isNull(err);
				},

				'receive a "key-string"': function(err, json) {
					assert.notStrictEqual(json ? json['key-string'] : undefined, undefined);
				},

				'receive a "policies"': function(err, json) {
					assert.notStrictEqual(json ? json.policies : undefined, undefined);
				}
			}
		}
	}).export(module);
}

