var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Video = require('../lib/video'),
	helpers = require('./helpers');
var path = require('path');

/**
 * Integration tests
 * 
 * Note: Library pattern refactoring required to extract json building logic to allow unit tests (and stop real uploads here)
 * 
 */
vows.describe('mediaApi/createVideo').addBatch({
	'making the request': {
		topic: new MediaApi(helpers.TestWriteToken, { debug: true }),

		'createVideo': {
			topic: function(api) {

				var video = new Video.ConvertJsonToVideo({
          name: 'test-video-' + (new Date()).getTime(), // Random title for test video
          referenceId: 'test_reference',
          shortDescription: 'shortDescriptionValue',
          startDate: 1468678081000,
          file: path.join(__dirname, 'test_video.mp4')
        })

				api.createVideo(video, this.callback);

			},

			'creates a video': function(err, json) {
        console.log('results:')
				console.log(err)
				console.log(json)
			}
		}
	}
}).export(module);
/*
{
	"method": "create_video",
	"params": {
		"token": "j1R2gIYQ1wvkR6Vb-mvPQf51d6BH_GMUVmrVA5Y3-TuMXftUGPKNJA..",
		"video": {
			"referenceId": "test_reference",
			"name": "test-video",
			"shortDescription": "shortDescriptionValue"
		}
	}
}

generated
{"method":"create_video","params":{"playlist":{"name":"test-video","referenceId":"test_reference","shortDescription":"shortDescriptionValue"},"token":"j1R2gIYQ1wvkR6Vb-mvPQf51d6BH_GMUVmrVA5Y3-TuMXftUGPKNJA.."}}
*/