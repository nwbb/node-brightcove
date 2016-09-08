
// api reference: http://docs.brightcove.com/en/index.html
// object reference: http://support.brightcove.com/en/docs/media-api-objects-reference
//
// service: http://api.brightcove.com/services

var events = require('events'),
	util = require('util'),
	request = require('request'),
	fs = require('fs'),
	Uri = require('jsuri'),
	Errors = require('./errors'),
	Options = require('./options'),
	Playlist = require('./playlist');

// Used for posting filestreams to brightcove
// creator: sindresorhus/is-stream
function isStream(stream) {
		return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
}
function isReadableStream(stream) {
	return stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
}

// Multiple search terms http://docs.brightcove.com/en/video-cloud/media/guides/search_videos-guide.html#multipleTerms
var multipleSearchTerms = ["any", "all", "none"];

var api = function MediaApi(token, config) {

	this.config = config || {};

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
	var useWriteApi = (this.commands.write.hasOwnProperty(command));
	var service = useWriteApi ? this.WriteService : this.ReadService;
	var	url = new Uri(service);

		// POST params go on the body
		if(useWriteApi) return url;

		url
		.addQueryParam('command', command)
		.addQueryParam('token', options.token);

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
		find_video_by_id_unfiltered: 'find_video_by_id_unfiltered',
		find_videos_by_ids: 'find_videos_by_ids',
		find_videos_by_ids_unfiltered: 'find_videos_by_ids_unfiltered',
		find_related_videos: 'find_related_videos',
		find_video_by_reference_id: 'find_video_by_reference_id',
		find_video_by_reference_id_unfiltered: 'find_video_by_reference_id_unfiltered',
		find_videos_by_reference_ids: 'find_videos_by_reference_ids',
		find_videos_by_reference_ids_unfiltered: 'find_videos_by_reference_ids_unfiltered',
		search_videos: 'search_videos',
		search_videos_unfiltered: 'search_videos_unfiltered',

		// Playlist Read APIs
		find_all_playlists: 'find_all_playlists',
		find_playlist_by_id: 'find_playlist_by_id',
		find_playlists_by_ids: 'find_playlists_by_ids',
		find_playlist_by_reference_id: 'find_playlist_by_reference_id',
		find_playlists_by_reference_ids: 'find_playlists_by_reference_ids'
	},

	write: {

		// Video Write APIs
		create_video: 'create_video',
		update_video: 'update_video',
		delete_video_by_id: 'delete_video',
		delete_video_by_reference_id: 'delete_video',

		// Playlist Write APIs
		create_playlist: 'create_playlist',
		update_playlist: 'update_playlist',
		delete_playlist: 'delete_playlist'
	}
}


api.prototype.makeRequest = function makeRequest(command, params, callback, progressCallback) {

	if (typeof callback === undefined || typeof callback === null) {
		throw new Error('no callback defined when calling makeRequest');
	}

	var self = this;
	var useWriteApi = this.commands.write.hasOwnProperty(command);
	params.token = this.getToken();
	var url = this.buildUrl(command, params);
	var	opts = {
		proxy: this.config.proxy || undefined,
		url: url.toString(),
		method: useWriteApi ? 'POST' : 'GET'
	};

	// set by npm script
	if(this.config.debug) {
		console.log(opts)
	}

	var r = request(opts, function(error, response, body) {
		try {
			body = JSON.parse(body)
		} catch(e) {
			// Not a JSON response
		}
		if (!error && response.statusCode == 200 && body && !body.error) {
			// emit response
			self.emit(command, error, body);

			// kick off callback, if supplied
			if (typeof callback === 'function') {
				callback(error, body);
			}
		} else {
			error = error || (body === null ? undefined : body.error);
			// handle those pesky http request errors.
			self.handleApiErrors(error, body);
			self.emit(command, error, body);

			// kick off callback, if needed
			if (typeof callback === 'function') {
				callback(error, body);
			}
		}
	});

	// Below only needed for POSTing
	if(!useWriteApi) return r;

	// Manually build form as Brightcove can't handle A-Z ordering of parameters on formData
	// Ends up complaining about POST params as the file data comes before the video data
	var form = r.form();
	var formData = {};
	var knownLength, stream; // Will only be defined on create_video calls

	if(command === "create_video") {
		// Handle the video params differently (some params are directly on params)
		parseExtraCreateVideoParams(params);
		
		if(!params.video.file) { throw new Error('Missing Video Parameter') }

		// If it is a file reference we can also get the known size which will allow progress events
		if(isStream(params.video.file)) {
			if(progressCallback) {
				// any way to get progress on streams without buffering to determine length?
				progressCallback = undefined;
				console.log('progressCallback will not be called as streams are unknown in length')
			}
			stream = params.video.file;
		} else {
			// Don't calculate if we're not going to need it
			if (progressCallback) knownLength = fs.statSync(params.video.file).size;
			stream = fs.createReadStream(params.video.file);
		}
		// Make it a stream if a file reference
		if(!isReadableStream(stream)) { throw new Error('Unable To Read From File Stream') }

		// Don't want this on the json data attr anymore as we have it as in a stream
		delete params.video.file;
	} else if(command === "delete_video") {
		parseExtraDeleteVideoParams(params);
	}

	formData['json'] = JSON.stringify({ method: command, params: params });

	// Add the attrs on first
	for(var prop in formData) {
		if(formData.hasOwnProperty(prop)) {
			form.append(prop, formData[prop]);
		}
	}

	// Second (AND MUST BE!) adds the file stream to the form
	if(stream) {
		// passing length allows form-data library to calculate request size syncronously which allows progress events
		form.append('file', stream, knownLength !== undefined ? { knownLength: knownLength } : undefined);

		if (progressCallback) {
			var bytesSent = 0;
			var bytesTotal = form.getLengthSync();

			stream.on('data', function(chunk) {
				bytesSent += chunk.length;
				progressCallback((bytesSent / bytesTotal) * 100);
			})
		}
	}

	return r;
}

function parseExtraDeleteVideoParams(params) {
	 // Deletes video even assigned to playlists or players
	 params.cascade = !!params.force; // enforce boolean type casting
	 // Deletes all shared copies from all accounts even if not active
	 params.delete_shares = !!params.includingShared
	 // Finish by removing internal only flags
	 delete params.force;
	 delete params.includingShared;
}

function parseExtraCreateVideoParams(params) {
		// Handle encoding
		if(params.video.encodeTo !== undefined) {
			if(params.video.encodeTo !== 'MP4' && params.video.encodeTo !== 'FLV') {
				throw new Error('video.encodeTo must be either MP4 or FLV');
			}
			params.encode_to = params.video.encodeTo; 
			delete params.video.encodeTo;
		}
		// Handle multiple renditions
		if(params.video.createMultipleRenditions !== undefined) {
			params.create_multiple_renditions = !!params.video.createMultipleRenditions; 
			delete params.video.createMultipleRenditions;
		}
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

	return this.makeRequest(this.commands.read.find_all_videos, options, callback);
}

api.prototype.findVideoById = function findVideoById(videoId, options, callback) {

	var opts = options || new Options();
	opts.video_id = videoId;

	return this.makeRequest(opts.useUnfilteredMethod ? this.commands.read.find_video_by_id_unfiltered : this.commands.read.find_video_by_id, opts, callback);
}

api.prototype.findVideosByIds = function findVideosByIds(videoIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(videoIds))
		opts.video_ids = videoIds;

	return this.makeRequest(opts.useUnfilteredMethod ? this.commands.read.find_videos_by_ids_unfiltered : this.commands.read.find_videos_by_ids, opts, callback);
}

api.prototype.findRelatedVideos = function findRelatedVideos(videoId, referenceId, options, callback) {

	var opts = options || new Options();

	if (typeof videoId === 'number')
		opts.video_id = videoId;

	if (typeof referenceId === 'number')
		opts.reference_id = referenceId;

	return this.makeRequest(this.commands.read.find_related_videos, opts, callback);
}

api.prototype.findVideoByReferenceId = function findVideoByReferenceId(referenceId, options, callback) {

	var opts = options || new Options();
	opts.reference_id = referenceId;

	return this.makeRequest(opts.useUnfilteredMethod ? this.commands.read.find_video_by_reference_id_unfiltered : this.commands.read.find_video_by_reference_id, opts, callback);
}

api.prototype.findVideosByReferenceIds = function findVideosByReferenceIds(referenceIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(referenceIds))
		opts.reference_ids = referenceIds;

	return this.makeRequest(opts.useUnfilteredMethod ? this.commands.read.find_videos_by_reference_ids_unfiltered : this.commands.read.find_videos_by_reference_ids, opts, callback);
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

	return this.makeRequest(opts.useUnfilteredMethod ? this.commands.read.search_videos_unfiltered : this.commands.read.search_videos, opts, callback);
}

api.prototype.findAllPlaylists = function findAllPlaylists(options, callback) {

	return this.makeRequest(this.commands.read.find_all_playlists, options, callback);
}

api.prototype.findPlaylistById = function findPlaylistById(playlistId, options, callback) {

	var opts = options || new Options();
	opts.playlist_id = playlistId;

	return this.makeRequest(this.commands.read.find_playlist_by_id, opts, callback);
}

api.prototype.findPlaylistsByIds = function findPlaylistsByIds(playlistIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(playlistIds))
		opts.playlist_ids = playlistIds;

	return this.makeRequest(this.commands.read.find_playlists_by_ids, opts, callback);
}

api.prototype.findPlaylistByReferenceId = function findPlaylistByReferenceId(referenceId, options, callback) {

	var opts = options || new Options();
	opts.reference_id = referenceId;

	return this.makeRequest(this.commands.read.find_playlist_by_reference_id, opts, callback);
}

api.prototype.findPlaylistsByReferenceIds = function findPlaylistsByReferenceIds(referenceIds, options, callback) {

	var opts = options || new Options();

	if (Array.isArray(referenceIds))
		opts.reference_ids = referenceIds;

	return this.makeRequest(this.commands.read.find_playlists_by_reference_ids, opts, callback);
}

api.prototype.createPlaylist = function createPlaylist(playlist, callback) {

	return this.makeRequest(this.commands.write.create_playlist, { playlist: playlist }, callback);
}

api.prototype.createVideo = function createVideo(video, callback, progressCallback) {

	return this.makeRequest(this.commands.write.create_video, { video: video }, callback, progressCallback);
}

api.prototype.updateVideo = function updateVideo(video, callback) {

	return this.makeRequest(this.commands.write.update_video, { video: video }, callback);
}

api.prototype.deleteVideoById = function deleteVideoById(videoId, options, callback) {

	var opts = options || new Options();
	opts.video_id = videoId;

	return this.makeRequest(this.commands.write.delete_video_by_id, opts, callback);
}

api.prototype.deleteVideoByReferenceId = function deleteVideoByReferenceId(referenceId, options, callback) {

	var opts = options || new Options();
	opts.reference_id = referenceId;

	return this.makeRequest(this.commands.write.delete_video_by_reference_id, opts, callback);
}

module.exports = api;
