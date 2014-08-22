
// api reference: http://docs.brightcove.com/en/media/
// object reference: http://support.brightcove.com/en/docs/media-api-objects-reference
// test token taken from brightcove example: 0Z2dtxTdJAxtbZ-d0U7Bhio2V1Rhr5Iafl5FFtDPY8E.
//
// service: http://api.brightcove.com/services

var events = require('events'),
	util = require('util'),
	request = require('request'),
	fs = require('fs'),
	querystring = require('querystring'),
	Uri = require('jsuri'),
	Errors = require('./errors'),
	Options = require('./options'),
	Playlist = require('./playlist');


var api = function MediaApi(token, opts) {

	events.EventEmitter.call(this);

	// obligatory comment rebuking the touching of my privates...
	this.ReadService = 'http://api.brightcove.com/services/library';
	this.WriteService = 'http://api.brightcove.com/services/post';
	this.buildUrl = buildUrl;
	this.handleApiErrors = handleApiErrors;

	this.getToken = function getToken() {
		return token;
	}

    if (opts) {
      if (opts.proxyUrl) {
        this.proxyUrl = opts.proxyUrl;
      }
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
		for (var option in options) {
			if (typeof options[option] !== 'function')
				url.addQueryParam(option, querystring.escape(options[option]));
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
		create_video: 'create_video',

		// Playlist Write APIs
		create_playlist: 'create_playlist',
		update_playlist: 'update_playlist',
		delete_playlist: 'delete_playlist'
	}
}


api.prototype.makeRequest = function makeRequest(command, options, callback) {

	if (typeof callback === undefined || typeof callback === null)
		throw new Error('no callback defined when calling makeRequest');

	var self = this,
		useWriteApi = this.commands.write.hasOwnProperty(command),
		url = this.buildUrl(command, options),
		opts = {
			url: url.toString(),
			method: (useWriteApi) ? 'POST' : 'GET',
            proxy: self.proxyUrl
		};

	request(opts, function(error, response, body) {

        if (!error && response.statusCode == 200) {

			// emit response
			self.emit(command, error, body);

			// kick off callback, if supplied
			if (typeof callback === 'function')
				callback(error, body);

        } else {

	        // handle those pesky http request errors.
		    self.handleApiErrors(error, body);
		    self.emit(command, error, body);

            // kick off callback, if needed
            if (typeof callback === 'function')
                callback(error, body);
        }
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

api.prototype.createVideo = function createVideo(videoJson, filePath, callback) {

    var command = this.commands.write.create_video;

    if (typeof callback === undefined || typeof callback === null)
        throw new Error('no callback defined when calling makeRequest');

    var params = { params: { video: videoJson, token: this.getToken() }, method: command };

    var self = this,
    url = new Uri(this.WriteService),
    opts = {
        url: url.toString(),
        method: 'POST',
        proxy: self.proxyUrl
    };

    var r = request(opts, function(error, response, body) {

        if (!error && response.statusCode == 200) {

            // emit response
            self.emit(command, error, body);

            // kick off callback, if supplied
            if (typeof callback === 'function')
                callback(error, body);

        } else {

            // handle those pesky http request errors.
            self.handleApiErrors(error, body);
            self.emit(command, error, body);

            // kick off callback, if needed
            if (typeof callback === 'function')
                callback(error, body);
        }
    });

    var form = r.form();
    form.append('JSON-RPC', JSON.stringify(params));
    form.append('file', fs.createReadStream(filePath));
}

module.exports = api;
