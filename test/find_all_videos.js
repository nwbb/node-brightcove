var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	helpers = require('./helpers');

// Set up
var pageSize = 12,
	currentPage = 2;

vows.describe('mediaApi/findAllVideos').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findAllVideos': {
			topic: function (api) { 
				
				var options = api.withOptions()
								.havingPageSizeOf(12)
								.atPage(2)
								.sortingBy().totalPlays().inDescendingOrder()
								.includingVideoField().videoId()
								.includingVideoField().title()
								.includingVideoField().playsTotal()
								.includingCountOfItems();
				api.findAllVideos(options, this.callback); 
			},

			'does not throw an error': function(err, json) {
				assert.isNull(err);
			}, 

			'returns videos': function(err, json) {
				assert.isNotNull(json);
				assert.isTrue(json.items.length > 0);
			},

			'returns correct page size': function(err, json) {
				assert.equal(json.page_size, pageSize);
			},

			'returns correct page number': function(err, json) {
				assert.equal(json.page_number, currentPage);
			}, 

			'returns videos sorted by the proper field': function(err, json) {
				var totalPlays,
					index;

				for (index in json.items) {
					var playCount = json.items[index].playsTotal;

					if (playCount > totalPlays) {
						assert.fail(playCount, totalPlays, 'Items are not sorted in the correct order');
						return;
					}

					totalPlays = playCount;
				}
			},

			'returns videos sorted in the proper direction': function(err, json) {
				var totalPlays,
					index;

				for (index in json.items) {
					var playCount = json.items[index].playsTotal;

					if (playCount > totalPlays) {
						assert.fail(playCount, totalPlays, 'Items are not sorted in the correct order');
						return;
					}

					totalPlays = playCount;
				}
			},

			'includes item count, when specified': function(err, json) {
				assert.isNumber(json.total_count);
				assert.isTrue(json.total_count > -1);
			},

			'includes only the specified video fields': function(err, json) {
				var video = json.items[0];
				
				for (var key in video) {
					assert.isTrue(key == 'id' || key == 'playsTotal' || key == 'name');
				}
			}
		}
	}
}).export(module);
