var vows = require('vows')
	assert = require('assert'),
	MediaApi = require('../lib/mediaApi'),
	Playlist = require('../lib/playlist'),
	helpers = require('./helpers');
/*
vows.describe('mediaApi/createPlaylist').addBatch({
	'making the request': {
		topic: new MediaApi(helpers.TestWriteToken),

		'createPlaylist': {
			topic: function(api) {

				//var playlist = new Playlist('test name', 'testPlaylist1', 'test description');
				//playlist.videoIds = helpers.TestVideoIds;
				//playlist.orderVideosExplicitly();

				var playlist = new Playlist('Phases 3 and 4', 'moonshot-1', 'The moon as it wanes from gibbous to crescent.');
				playlist.playlistType = 'ALPHABETICAL';
				playlist.addFilterTag('crescent');
				playlist.addFilterTag('gibbous');
				playlist.videoMustContainAllFilterTags(true);

				api.createPlaylist(playlist, this.callback);
			},

			'creates a playlist': function(err, json) {
				console.log(err)
				console.log(json)
			}
		}
	}
}).export(module);
*/
/*
{
	"method": "create_playlist",
	"params": {
		"token": "",
		"playlist": {
			"referenceId": "moonshot-1",
			"name": "Phases 3 and 4",
			"shortDescription": "The moon as it wanes from gibbous to crescent.",
			"playlistType": "ALPHABETICAL",
			"filterTags": ["crescent", "gibbous"],
			"tagInclusionRule": "AND"
		}
	}
}

generated
{"method":"create_playlist","params":{"playlist":{"name":"Phases 3 and 4","referenceId":"moonshot-1","shortDescription":"The moon as it wanes from gibbous to crescent.","playlistType":"ALPHABETICAL","filterTags":["crescent","gibbous"],"tagInclusionRule":"AND"},"token":"j1R2gIYQ1wvkR6Vb-mvPQf51d6BH_GMUVmrVA5Y3-TuMXftUGPKNJA.."}}
{"method":"create_playlist","params": {"token": "j1R2gIYQ1wvkR6Vb-mvPQf51d6BH_GMUVmrVA5Y3-TuMXftUGPKNJA..","playlist": {"referenceId": "moonshot-1","name": "Phases 3 and 4","shortDescription": "The moon as it wanes from gibbous to crescent.","playlistType": "ALPHABETICAL","filterTags": ["crescent", "gibbous"],"tagInclusionRule": "AND"}}}
hand-written
*/