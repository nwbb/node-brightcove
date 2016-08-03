var video = function Video() {}

video.ConvertJsonToVideo = function ConvertJsonToVideo(json) {

	if (json === undefined || json === null || typeof json !== 'object') {
		return new video();
	}

	var videoInstance = new video();
	if (json.id !== undefined) videoInstance.id = json.id;
	if (json.name) videoInstance.name = json.name; 
	if (json.shortDescription) videoInstance.shortDescription = json.shortDescription;
	if (json.longDescription) videoInstance.longDescription = json.longDescription;
	if (json.referenceId !== undefined) videoInstance.referenceId = json.referenceId;
	if (json.tags) videoInstance.tags = json.tags;
	if (json.customFields) videoInstance.customFields = json.customFields;
	if (json.file) videoInstance.file = json.file;
	if (json.startDate) videoInstance.startDate = json.startDate;
	if (json.endDate) videoInstance.endDate = json.endDate;

	return videoInstance;
}

// Can be filepath or stream
video.prototype.addFile = function addFile(file) {
	this.file = file;
	return this;
}

video.prototype.addTag = function addTag(tag) {

	if (this.tags === undefined || this.tags === null || !Array.isArray(this.tags)) {
		this.tags = [];
	}

	this.tags.push(tag);
	return this;
}

video.prototype.addCustomField = function addCustomField(field, value) {

	if (this.customFields === undefined || this.customFields === null || typeof this.customFields !== 'object') {
		this.customFields = {};
	}

	this.customFields[field] = value;
	return this;
}

video.prototype.addShortDescription = function addShortDescription(desc) {
	if(desc.length > 250) {
		throw new Error('Video shortDescription exceeds 250 character limit')
	}
	this.shortDescription = desc;
	return this;
}

video.prototype.addLongDescription = function addLongDescription(desc) {
	if(desc.length > 5000) {
		throw new Error('Video longDescription exceeds 5000 character limit')
	}
	this.longDescription = desc;
	return this;
}

video.prototype.enableMultipleRenditions = function enableMultipleRenditions() {
	this.createMultipleRenditions = true;
	return this;
}

video.prototype.setEncoding = function setEncoding(type) {
	if(type !== 'MP4' && type !== 'FLV') {
		throw new Error('encoding must be either MP4 or FLV');
	}
	this.encodeTo = type;
	return this;
}

// TODO: (http://docs.brightcove.com/en/video-cloud/media/references/reference.html#Video)
//			Geo: geoRestricted, geoFiltered, geoFilteredCountries, geoFilterExclude
//			Date: startDate, endDate
//			State: itemState
//			Captions: captioning

module.exports = video;