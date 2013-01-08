var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	helpers = require('./helpers');

// Set up
var pageSize = 12,
	currentPage = 2;

vows.describe('mediaApi/findAllPlaylists').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findAllPlaylists': {
			topic: function (api) { 
				
				var options = api.withOptions()
								.havingPageSizeOf(12)
								.atPage(2)
								.includingVideoField().defaults()
								.includingCountOfItems()
								.includingPlaylistField().videos()
								.includingPlaylistField().playlistId()
								.includingPlaylistField().name();

				api.findAllPlaylists(options, this.callback); 
			},

			'does not throw an error': function(err, json) {
				assert.isNull(err);
			}, 

			'returns playlists': function(err, json) {
				assert.isNotNull(json);
				assert.isNotNull(json.items);

				if (json.items !== undefined)
					assert.isTrue(json.items.length > 0);
			},

			'returns correct page size': function(err, json) {
				assert.equal(json.page_size, pageSize);
			},

			'returns correct page number': function(err, json) {
				assert.equal(json.page_number, currentPage);
			},

			'includes item count, when specified': function(err, json) {
				assert.isNumber(json.total_count);
				assert.isTrue(json.total_count > -1);
			},

			'only contains the playlist fields specified': function(err, json) {
				var playlist = json.items[0];
				
				for (var key in playlist) {
					assert.isTrue(key == 'id' || key == 'videos' || key == 'name');
				}
			}
		}
	}
}).export(module);