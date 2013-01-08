var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Errors = require('../lib/errors'),
	helpers = require('./helpers');

// Set up
var pageSize = 12,
	currentPage = 2;

vows.describe('mediaApi/findRelatedVideos').addBatch({

	'making the request': {
		topic: new MediaApi(helpers.TestReadToken),

		'findRelatedVideos': {
			topic: function(api) {
				var options = api.withOptions()
								.havingPageSizeOf(12)
								.atPage(2)
								.includingVideoField().defaults()
								.includingCountOfItems();

				api.findRelatedVideos(helpers.TestVideoIds[0], null, options, this.callback);
			},

			'returns videos related to the supplied videoId': function(err,json) {
				assert.isNull(err);
				assert.isNotNull(json);
				assert.isNotNull(json.items);
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
			}
		},

		'findRelatedVideos with a bad videoId and referenceId': {
			topic: function(api) {
				api.findRelatedVideos(null, null, null, this.callback);
			},
			'returns an ApiError error': function(err, json) {
				assert.isNotNull(err);
				assert.instanceOf(err, Errors.Api);
			}
		}
	}
}).export(module);