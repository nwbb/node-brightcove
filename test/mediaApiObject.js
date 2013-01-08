
var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	helpers = require('./helpers');

vows.describe('mediaApi').addBatch({
	'MediaApi object': {
		topic: new MediaApi('test'),
		'constructor': {
			'sets token': {
				topic: function(api) { return api; },
				'token is set': function(api) {
					assert.equal(api.getToken(), 'test');
				}
			}
		},
		'constant': {
			topic: function(api) { return api; },

			'Read API service url is set': function(api){
				assert.typeOf(api.ReadService, 'string');
				assert.isTrue(api.ReadService.length > 0);
			},

			'Write API service url is set': function(api){
				assert.typeOf(api.WriteService, 'string');
				assert.isTrue(api.WriteService.length > 0);
			}
		},
		'commands property': {
			topic: function(api) { return api; },
			'exists': function(api) { 
				assert.isNotNull(api.commands); 
				assert.typeOf(api.commands, 'object');
			}
		}
	}
}).export(module);