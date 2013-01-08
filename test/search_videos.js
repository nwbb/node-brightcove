var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

// Set up
var pageSize = 12,
	currentPage = 2;

vows.describe('mediaApi/searchVideos').addBatch({
	'when making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'searchVideos with ALL criteria': {
			topic: function(api) {
				var options = api.withOptions()
								.havingPageSizeOf(12)
								.atPage(2)
								.sortingBy().totalPlays().inDescendingOrder()
								.includingVideoField().defaults()
								.includingCountOfItems();

				api.searchVideos(null, null, null, false, options, this.callback);
			},

			'returns videos that contain all of the specified criteria': function(err, json) {
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
			}
		},

		'searchVideos with ANY criteria': {
			topic: function(api) {
				var options = api.withOptions()
								.havingPageSizeOf(12)
								.atPage(2)
								.sortingBy().totalPlays().inDescendingOrder()
								.includingVideoField().defaults()
								.includingCountOfItems();

				api.searchVideos(null, null, null, false, options, this.callback);
			},

			'returns videos that contain at least one of the specified criteria': function(err, json) {
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
			}
		},

		'searchVideos with NONE criteria': {
			topic: function(api) {
				var options = api.withOptions()
								.havingPageSizeOf(12)
								.atPage(2)
								.sortingBy().totalPlays().inDescendingOrder()
								.includingVideoField().defaults()
								.includingCountOfItems();

				api.searchVideos(null, null, null, false, options, this.callback);
			},

			'returns videos that do not contain any of the specified criteria': function(err, json) {
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
			}
		}
	}
}).export(module);