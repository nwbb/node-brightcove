var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

vows.describe('mediaApi/findPlaylistByReferenceId').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findPlaylistByReferenceId': {
			topic: function(api) {
				api.findPlaylistByReferenceId(helpers.TestPlaylistReferenceIds[0], null, this.callback);
			},
			'returns the proper playlist': function(err, json) {
				assert.isNull(err);
				assert.isNotNull(json);
				assert.equal(json.referenceId, helpers.TestPlaylistReferenceIds[0]);
			}
		}/*,
		'findPlaylistByReferenceId with a bad referenceId': {
			topic: function(api) {
				api.findPlaylistByReferenceId(0, null, this.callback);
			},
			'returns with an InvalidArgument error': function(err, json) {
				assert.isNotNull(err);
				assert.instanceOf(err, Errors.InvalidArgument);
			}
		}*/
	}
}).export(module);