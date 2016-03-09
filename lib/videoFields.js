
var videoFields = function VideoFields(options) {

	if (options === null || options === undefined)
		throw new Error('Options were not passed in to VideoFields.');

	this._options = options;
}

videoFields.prototype.clearFields = function clearFields() {
	this._options.video_fields = [];
}

videoFields.prototype.addVideoField = function addVideoField(field) {
	if (!Array.isArray(this._options.video_fields))
		this._options.video_fields = [];

	if (this._options.video_fields.indexOf(field) == -1)
		this._options.video_fields.push(field);

	return this._options;
}

videoFields.prototype.videoId = function videoId() {
	return this.addVideoField('id');
}

videoFields.prototype.title = function title() {
	return this.addVideoField('name');
}

videoFields.prototype.shortDescription = function shortDescription() {
	return this.addVideoField('shortDescription');
}

videoFields.prototype.longDescription = function longDescription() {
	return this.addVideoField('longDescription');
}

videoFields.prototype.creationDate = function creationDate() {
	return this.addVideoField('creationDate');
}

videoFields.prototype.publishedDate = function publishedDate() {
	return this.addVideoField('publishedDate');
}

videoFields.prototype.lastModifiedDate = function lastModifiedDate() {
	return this.addVideoField('lastModifiedDate');
}

videoFields.prototype.startDate = function startDate() {
	return this.addVideoField('startDate');
}

videoFields.prototype.linkUrl = function linkUrl() {
	return this.addVideoField('linkURL');
}

videoFields.prototype.linkText = function linkText() {
	return this.addVideoField('linkText');
}

videoFields.prototype.tags = function tags() {
	return this.addVideoField('tags');
}

videoFields.prototype.videoStillUrl = function videoStillUrl() {
	return this.addVideoField('videoStillURL');
}

videoFields.prototype.thumbnailUrl = function thumbnailUrl() {
	return this.addVideoField('thumbnailURL');
}

videoFields.prototype.referenceId = function referenceId() {
	return this.addVideoField('referenceId');
}

videoFields.prototype.duration = function duration() {
	return this.addVideoField('length');
}

videoFields.prototype.economics = function economics() {
	return this.addVideoField('economics');
}

videoFields.prototype.playsTotal = function playsTotal() {
	return this.addVideoField('playsTotal');
}

videoFields.prototype.playsTrailingWeek = function playsTrailingWeek() {
	return this.addVideoField('playsTrailingWeek');
}

videoFields.prototype.videoUrl = function videoUrl() {
	return this.addVideoField('FLVURL');
}

videoFields.prototype.streamingVideoUrl = function videoUrl() {
	return this.addVideoField('FLVURL');
}

videoFields.prototype.renditions = function renditions() {
	return this.addVideoField('renditions');
}

videoFields.prototype.iOSRenditions = function iOSRenditions() {
	return this.addVideoField('iOSRenditions');
}

videoFields.prototype.FLVFullLength = function FLVFullLength() {
	return this.addVideoField('FLVFullLength');
}

videoFields.prototype.videoFullLength = function videoFullLength() {
	return this.addVideoField('videoFullLength');
}

videoFields.prototype.allFields = function allFields() {

	// clear out existing fields
	this.clearFields();

	this.videoId();
	this.title();
	this.shortDescription();
	this.longDescription();
	this.creationDate();
	this.publishedDate();
	this.lastModifiedDate();
	this.startDate();
	this.linkUrl();
	this.linkText();
	this.tags();
	this.videoStillUrl();
	this.thumbnailUrl();
	this.referenceId();
	this.duration();
	this.economics();
	this.playsTotal();
	this.playsTrailingWeek();
	this.videoUrl();
	this.renditions();
	this.iOSRenditions();
	this.FLVFullLength();
	this.videoFullLength();
	return this._options;
}

// This is only arbitrary for you.  It suited my needs perfectly.  Sorry.
videoFields.prototype.defaults = function defaults() {

	// clear out existing fields
	this.clearFields();
	
	this.title();
	this.shortDescription();
	this.longDescription();
	this.linkUrl();
	this.linkText();
	this.tags();
	this.videoStillUrl();
	this.thumbnailUrl();
	this.referenceId();
	this.duration();
	this.playsTotal();
	this.playsTrailingWeek();
	this.videoUrl();
	this.renditions();
	return this._options;
}

module.exports = videoFields;






