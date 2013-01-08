var MediaApi = require('./lib/mediaApi'),
	Playlist = require('./lib/playlist'),
	Errors = require('./lib/errors');

module.exports = {
	Api: MediaApi, // old and deprecated!!
	MediaApi: MediaApi,
	Playlist: Playlist,
	errors: Errors
}