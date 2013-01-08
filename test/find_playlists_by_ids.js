var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

// Set up
var pageSize = 12,
	currentPage = 2;

vows.describe('mediaApi/findPlaylistsByIds').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findPlaylistsByIds': {
			topic: function(api) {
				api.findPlaylistsByIds(helpers.TestPlaylistIds, null, this.callback);
			},

			'returns playlists with the specified IDs': function(err, json) {
				assert.isNull(err);
				assert.isNotNull(json);
				assert.isNotNull(json.items);
				assert.equal(json.items.length, helpers.TestPlaylistIds.length);
			}
		},

		'findPlaylistsByIds with no specified IDs': {
			topic: function(api) {
				api.findVideosByIds(null, null, this.callback);
			},

			'throws an ApiError': function(err, json) {
				assert.isNotNull(err);
				assert.instanceOf(err, Errors.Api);
			}
		}
	}
}).export(module);