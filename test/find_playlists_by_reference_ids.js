var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

// Set up
var pageSize = 12,
	currentPage = 2;

vows.describe('mediaApi/findPlaylistsByReferenceIds').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findPlaylistsByReferenceIds': {
			topic: function(api) {
				api.findPlaylistsByReferenceIds(helpers.TestPlaylistReferenceIds, null, this.callback);
			},

			'returns playlists with the specified IDs': function(err, json) {
				assert.isNull(err);
				assert.isNotNull(json);
				assert.isNotNull(json.items);
				assert.equal(json.items.length, helpers.TestReferenceIds.length);
			}
		},

		'findPlaylistsByReferenceIds with no specified IDs': {
			topic: function(api) {
				api.findPlaylistsByReferenceIds(null, null, this.callback);
			},

			'throws an ApiError': function(err, json) {
				assert.isNotNull(err);
				assert.instanceOf(err, Errors.Api);
			}
		}
	}
}).export(module);