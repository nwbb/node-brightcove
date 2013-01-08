var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

vows.describe('mediaApi/findPlaylistById').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findPlaylistById': {
			topic: function(api) {
				api.findPlaylistById(helpers.TestPlaylistIds[0], null, this.callback);
			},
			'returns the proper playlist': function(err, json) {
				assert.isNull(err);
				assert.isNotNull(json);
				assert.equal(json.id, helpers.TestPlaylistIds[0]);
			}
		},
		'findPlaylistById with a bad playlistId': {
			topic: function(api) {
				api.findPlaylistById(0, null, this.callback);
			},
			'returns with an InvalidArgument error': function(err, json) {
				assert.isNotNull(err);
				assert.instanceOf(err, Errors.InvalidArgument);
			}
		}
	}
}).export(module);