
// api reference: http://docs.brightcove.com/en/index.html
// object reference: http://support.brightcove.com/en/docs/media-api-objects-reference
//
// service: http://api.brightcove.com/services

var events = require('events'),
	util = require('util'),
	http = require('http'),
	Uri = require('jsuri'),
	Errors = require('./errors'),
	Options = require('./options'),
	Playlist = require('./playlist');

// Multiple search terms http://docs.brightcove.com/en/video-cloud/media/guides/search_videos-guide.html#multipleTerms
var multipleSearchTerms = ["any", "all", "none"];

var api = function MediaApi(token) {

	events.EventEmitter.call(this);

	// obligatory comment rebuking the touching of my privates...
	this.ReadService = 'http://api.brightcove.com/services/library';
	this.WriteService = 'http://api.brightcove.com/services/post';
	this.buildUrl = buildUrl;
	this.handleApiErrors = handleApiErrors;

	this.getToken = function getToken() {
		return token;
	}
}

// Yep, we'll be emitting api responses along with any callbacks given.  Keeps it nice and flexible.
util.inherits(api, events.EventEmitter);


var buildUrl = function buildUrl(command, options) {

	var service = (this.commands.write.hasOwnProperty(command)) ? this.WriteService : this.ReadService,
		url = new Uri(service)
		.addQueryParam('command', command)
		.addQueryParam('token', this.getToken());

	if (options !== undefined && options !== null) {
		
		// Apparently, the "sort_by" option use a format like "PLAYS_TOTAL:DESC" for those commands ONLY...
		if (command === 'search_videos_unfiltered' || command === 'search_videos') {
			if (options.sort_order && options.sort_by) {
				options.sort_by = options.sort_by + ':' + options.sort_order;
				delete options.sort_order;
			}
		}

		for (var option in options) {
			if (typeof options[option] !== 'function')
			  if (Array.isArray(options[option]) && multipleSearchTerms.indexOf(option) != -1) {
					for (var item in options[option]) {
						url.addQueryParam(option, options[option][item]);
					}
				} else {
					url.addQueryParam(option, options[option]);
				}
		}
	}
	
	return url;
}


var handleApiErrors = function handleApiErrors(err, json) {

	if (err !== undefined) return err;
	if (json == null) return new Errors.InvalidArgument();
	if (json.error != null && json.error != undefined) return new Errors.Api(json);
}


api.prototype.commands = {

	read: {

		// Video Read APIs
		find_all_videos: 'find_all_videos',
		find_video_by_id: 'find_video_by_id',
		find_videos_by_ids: 'find_videos_by_ids',
		find_related_videos: 'find_related_videos',
		find_video_by_reference_id: 'find_video_by_reference_id',
		find_videos_by_reference_ids: 'find_videos_by_reference_ids',
		search_videos: 'search_videos',

		// Playlist Read APIs
		find_all_playlists: 'find_all_playlists',
		find_playlist_by_id: 'find_playlist_by_id',
		find_playlists_by_ids: 'find_playlists_by_ids',
		find_playlist_by_reference_id: 'find_playlist_by_reference_id',
		find_playlists_by_reference_ids: 'find_playlists_by_reference_ids'
	},

	write: {

		// Video Write APIs

		// Playlist Write APIs
		create_playlist: 'create_playlist',
		update_playlist: 'update_playlist',
		delete_playlist: 'delete_playlist'
	}
}


api.prototype.makeRequest = function makeRequest(command, options, callback) {

	if (typeof callback === undefined || typeof callback === null)
		throw new Error('no callback defined when calling makeRequest');

	var request,
		self = this,
		useWriteApi = this.commands.write.hasOwnProperty(command),
		url = this.buildUrl(command, options),
		opts = {
			//protocol: url.protocol(),
			hostname: url.host(),
			path: url.path() + url.query(),
			method: (useWriteApi) ? 'POST' : 'GET'
		};

	request = http.request(opts, function(response) {

		var data = '';

		response.setEncoding('utf8');
		response.on('data', function(chunk) {
			data += chunk;
		});

		response.on('end', function(err) {
			try {
				var json = JSON.parse(data.toString());
			}
			catch (jsonError){
				// Pass along the error from JSON.parse
				err = jsonError;
			}

			var error = self.handleApiErrors(err, json);

			// emit response
			self.emit(command, error, json);

			// kick off callback, if supplied
			if (typeof callback === 'function')
				callback(error, json);
		});
	});

	// add POST payload, if needed
	if (useWriteApi) {

		var params = options || {};
		params.token = this.getToken();

		var post = {
			"method": command,
			"params": params
		}

		request.write(JSON.stringify(post))
	}
		
	request.end();

	// handle those pesky http request errors.
	request.on('error', function(e) {

		self.emit(command, e, null);

		// kick off callback, if needed
		if (typeof callback === 'function')
			callback(e, null);
	});
}


api.prototype.withOptions = function withOptions() {
	return new Options();
}


api.prototype.withDefaultOptions = function withDefaultOptions() {
	return new Options()
			.includingCountOfItems()
			.includingVideoField().defaults();
}


api.prototype.findAllVideos = function findAllVideos(options, callback) {

	this.makeRequest(this.commands.read.find_all_videos, options, callback);
}


api.prototype.findVideoById = function findVideoById(videoId, options, callback) {

	var opts = options || new Options();
	opts.video_id = videoId;

	this.makeRequest(this.commands.read.find_video_by_id, opts, callback);
}


api.prototype.findVideosByIds = function findVideosByIds(videoIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(videoIds))
		opts.video_ids = videoIds;

	this.makeRequest(this.commands.read.find_videos_by_ids, opts, callback);
}


api.prototype.findRelatedVideos = function findRelatedVideos(videoId, referenceId, options, callback) {

	var opts = options || new Options();

	if (typeof videoId === 'number')
		opts.video_id = videoId;

	if (typeof referenceId === 'number')
		opts.reference_id = referenceId;

	this.makeRequest(this.commands.read.find_related_videos, opts, callback);
}


api.prototype.findVideoByReferenceId = function findVideoByReferenceId(referenceId, options, callback) {

	var opts = options || new Options();
	opts.reference_id = referenceId;

	this.makeRequest(this.commands.read.find_video_by_reference_id, opts, callback);
}


api.prototype.findVideosByReferenceIds = function findVideosByReferenceIds(referenceIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(referenceIds))
		opts.reference_ids = referenceIds;

	this.makeRequest(this.commands.read.find_videos_by_reference_ids, opts, callback);
}


api.prototype.searchVideos = function searchVideos(all, any, none, exact, options, callback) {

	var opts = options || new Options();
	opts.exact = (typeof exact === 'boolean' && exact) ? true : false;

	if (Array.isArray(all))
		opts.all = all;

	if (Array.isArray(any))
		opts.any = any;
	
	if (Array.isArray(none))
		opts.none = none;	

	this.makeRequest(this.commands.read.search_videos, opts, callback);
}


api.prototype.findAllPlaylists = function findAllPlaylists(options, callback) {

	this.makeRequest(this.commands.read.find_all_playlists, options, callback);
}


api.prototype.findPlaylistById = function findPlaylistById(playlistId, options, callback) {

	var opts = options || new Options();
	opts.playlist_id = playlistId;

	this.makeRequest(this.commands.read.find_playlist_by_id, opts, callback);
}


api.prototype.findPlaylistsByIds = function findPlaylistsByIds(playlistIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(playlistIds))
		opts.playlist_ids = playlistIds;

	this.makeRequest(this.commands.read.find_playlists_by_ids, opts, callback);
}

api.prototype.findPlaylistByReferenceId = function findPlaylistByReferenceId(referenceId, options, callback) {

	var opts = options || new Options();
	opts.reference_id = referenceId;

	this.makeRequest(this.commands.read.find_playlist_by_reference_id, opts, callback);
}

api.prototype.findPlaylistsByReferenceIds = function findPlaylistsByReferenceIds(referenceIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(referenceIds))
		opts.reference_ids = referenceIds;

	this.makeRequest(this.commands.read.find_playlists_by_reference_ids, opts, callback);
}

api.prototype.createPlaylist = function createPlaylist(playlist, callback) {

	this.makeRequest(this.commands.write.create_playlist, { playlist: playlist }, callback);
}

module.exports = api;
