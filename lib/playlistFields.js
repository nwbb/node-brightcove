
var playlistFields = function PlaylistFields(options) {

	if (options === null || options === undefined)
		throw new Error('Options were not passed in to PlaylistFields.');

	this._options = options;
}

playlistFields.prototype.clearFields = function clearFields() {
	this._options.playlist_fields = [];
}

playlistFields.prototype.addPlaylistField = function addPlaylistField(field) {
	if (!Array.isArray(this._options.playlist_fields))
		this._options.playlist_fields = [];

	if (this._options.playlist_fields.indexOf(field) == -1)
		this._options.playlist_fields.push(field);

	return this._options;
}

playlistFields.prototype.allFields = function allFields() {

	// by not specifying any fields, it will return all fields.
	if (Array.isArray(this._options.playlist_fields))
		delete this._options.playlist_fields;
}

playlistFields.prototype.playlistId = function playlistId() {
	return this.addPlaylistField('id');
}

playlistFields.prototype.referenceId = function referenceId() {
	return this.addPlaylistField('referenceId');
}

playlistFields.prototype.accountId = function accountId() {
	return this.addPlaylistField('accountId');
}

playlistFields.prototype.name = function name() {
	return this.addPlaylistField('name');
}

playlistFields.prototype.shortDescription = function shortDescription() {
	return this.addPlaylistField('shortDescription');
}

playlistFields.prototype.videoIds = function videoIds() {
	return this.addPlaylistField('videoIds');
}

playlistFields.prototype.videos = function videos() {
	return this.addPlaylistField('videos');
}

playlistFields.prototype.playlistType = function playlistType() {
	return this.addPlaylistField('playlistType');
}

playlistFields.prototype.filterTags = function filterTags() {
	return this.addPlaylistField('filterTags');
}

playlistFields.prototype.tagInclusionRule = function tagInclusionRule() {
	return this.addPlaylistField('tagInclusionRule');
}

playlistFields.prototype.thumbnailUrl = function thumbnailUrl() {
	return this.addPlaylistField('thumbnailURL');
}

module.exports = playlistFields;
