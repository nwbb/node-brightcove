var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

vows.describe('mediaApi/findVideoById').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findVideoById': {
			topic: function(api) {
				api.findVideoById(helpers.TestVideoIds[0], null, this.callback);
			},
			'returns the proper video': function(err, json) {
				assert.isNull(err);
				assert.isNotNull(json);
				assert.equal(json.id, helpers.TestVideoIds[0]);
			}
		},
		'findVideoById with a bad videoId': {
			topic: function(api) {
				api.findVideoById(0, null, this.callback);
			},
			'returns with an InvalidArgument error': function(err, json) {
				assert.isNotNull(err);
				assert.instanceOf(err, Errors.InvalidArgument);
			}
		}
	}
}).export(module);