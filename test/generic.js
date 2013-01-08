var vows = require('vows')
	assert = require('assert'),
	helpers = require('./helpers'),
	MediaApi = require('../lib/mediaApi'),
	playlist = require('../lib/playlist');

var api = new MediaApi(helpers.TestToken);

//api.findAllVideos(api.withDefaultOptions().havingPageSizeOf(10), function(err, json) { console.log(json)});
