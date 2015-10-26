var MediaApi = require('./lib/mediaApi'),
	OAuthApi = require('./lib/oauthApi'),
	Playlist = require('./lib/playlist'),
	Errors = require('./lib/errors');

module.exports = {
	Api: MediaApi, // old and deprecated!!
	MediaApi: MediaApi,
	OAuthApi: OAuthApi,
	Playlist: Playlist,
	errors: Errors
}