
// find_all_videos -> media_delivery

var SortOrder = require('./sortOrder'),
	VideoFields = require('./videoFields'),
	PlaylistFields = require('./playlistFields');

var options = function Options() {

	var videoFields,
		playlistFields;

	this.getVideoFields = function getVideoFields() {
		if (videoFields === null || videoFields === undefined)
			videoFields = new VideoFields(this);
		return videoFields;
	}

	this.getPlaylistFields = function getPlaylistFields() {
		if (playlistFields === null || playlistFields === undefined)
			playlistFields = new PlaylistFields(this);
		return playlistFields;
	}
}

options.prototype.includingCountOfItems = function includingCountOfItems() {
	this.get_item_count = true;
	return this;
}

options.prototype.havingPageSizeOf = function havingPageSizeOf(pageSize) {
	this.page_size = pageSize;
	return this;
}

options.prototype.atPage = function atPage(page) {
	this.page_number = page;
	return this;
}

options.prototype.inAscendingOrder = function inAscendingOrder() {
	this.sort_order = 'ASC';
	return this;
}

options.prototype.inDescendingOrder = function inDescendingOrder() {
	this.sort_order = 'DESC';
	return this;
}

options.prototype.sortingBy = function sortingBy() {
	return new SortOrder(this);
}

options.prototype.withCustomFields = function withCustomFields(customFields) {
	if (Array.isArray(customFields))
		this.custom_fields = customFields.toString();

	return this;
}

options.prototype.includingVideoField = function includingVideoField() {
	return this.getVideoFields();
}

options.prototype.includingPlaylistField = function includingPlaylistField() {
	return this.getPlaylistFields();
}

options.prototype.httpMediaDelivery = function httpMediaDelivery() {
	this.media_delivery = 'http';
	return this;
}

options.prototype.hlsMediaDelivery = function hlsMediaDelivery() {
	this.media_delivery = 'http_ios';
	return this;
}

module.exports = options;
