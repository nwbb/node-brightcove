var util = require('util');


var playlist = function Playlist(name, referenceId, shortDescription) {

	this.name = name;
	this.referenceId = referenceId;
	this.shortDescription = shortDescription;
}

playlist.ConvertJsonToPlaylist = function ConvertJsonToPlaylist(json) {

	if (json === undefined || json === null || typeof json !== 'object')
		return new playlist();

	var list = new playlist(json.name, json.referenceId, json.shortDescription);
	list.videoIds = json.videoIds;
	list.filterTags = json.filterTags;
	list.tagInclusionRule = json.tagInclusionRule;
	list.playlistType = json.playlistType;
	list.videos = json.videos;
	list.id = json.id;

	return list;
}

playlist.prototype.addVideo = function addVideo(videoId) {

	if (this.videoIds === undefined || this.videoIds === null || !Array.isArray(this.videoIds))
		this.videoIds = [];

	this.videoIds.push(videoId);
}

playlist.prototype.addFilterTag = function addFilterTag(filterTag) {

	if (this.filterTags === undefined || this.filterTags === null || !Array.isArray(this.filterTags))
		this.filterTags = [];

	this.filterTags.push(filterTag);	
}

playlist.prototype.videoMustContainAllFilterTags = function videoMustContainAllFilterTags(bool) {
	this.tagInclusionRule = (bool) ? 'AND' : 'OR';
}

playlist.prototype.orderVideosExplicitly = function orderVideosExplicitly() {
	this.playlistType = 'EXPLICIT';
	this.videoIds = this.videoIds || [];
}

playlist.prototype.orderVideosByActivationDate = function orderVideosByActivationDate(inDescendingOrder) {
	this.playlistType = (inDescendingOrder) ? 'NEWEST_TO_OLDEST' : 'OLDEST_TO_NEWEST';
}

playlist.prototype.orderVideosByStartDateAscending = function orderVideosByStartDateAscending(inDescendingOrder) {
	this.playlistType = (inDescendingOrder) ? 'START_DATE_NEWEST_TO_OLDEST ALPHABETICAL' : 'START_DATE_OLDEST_TO_NEWEST';
}

playlist.prototype.orderVideosByTotalPlays = function orderVideosByTotalPlays() {
	this.playlistType = 'PLAYS_TOTAL';
}

playlist.prototype.orderVideosByTotalPlaysOfLastWeek = function orderVideosByTotalPlaysOfLastWeek() {
	this.playlistType = 'PLAYS_TRAILING_WEEK';
}

module.exports = playlist;