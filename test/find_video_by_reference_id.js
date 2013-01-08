var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

vows.describe('mediaApi/findVideoByReferenceId').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findVideoByReferenceId': {
			topic: function(api) {
				api.findVideoByReferenceId(helpers.TestReferenceIds[0], null, this.callback);
			},
			'returns the proper video': function(err, json) {
				assert.isNull(err);
				assert.isNotNull(json);
				assert.equal(json.referenceId, helpers.TestReferenceIds[0]);
			}
		},
		'findVideoByReferenceId with a bad referenceId': {
			topic: function(api) {
				api.findVideoByReferenceId(0, null, this.callback);
			},
			'returns with an InvalidArgument error': function(err, json) {
				assert.isNotNull(err);
				assert.instanceOf(err, Errors.InvalidArgument);
			}
		}
	}
}).export(module);