var image = function Image() {}

image.ConvertJsonToImage = function ConvertJsonToImage(json) {

	if (json === undefined || json === null || typeof json !== 'object') {
		return new image();
	}

	var imageInstance = new image();

	// Used when updating an existing image, not warning about both being set
	if (json.id !== undefined) imageInstance.id = json.id;
	if (json.referenceId !== undefined) imageInstance.referenceId = json.referenceId;
	
	// Used when updating an existing image, not warning about both being set
	if (json.video_id !== undefined) imageInstance.video_id = json.video_id;
	if (json.video_reference_id !== undefined) imageInstance.video_reference_id = json.video_reference_id;

	// Setting both file and remoteUrl not warned against here
	if (json.file) imageInstance.file = json.file;
	if (json.remoteUrl) imageInstance.remoteUrl = json.remoteUrl;

	if (json.resize !== undefined) imageInstance.resize = json.resize;
	if (json.displayName) imageInstance.displayName = json.displayName;

	return imageInstance;
}

// Can be filepath or stream
image.prototype.addFile = function addFile(file) {
	if(this.remoteUrl !== undefined) console.warn('Overriding remoteUrl property with file');
	this.remoteUrl = undefined;
	this.file = file;
	return this;
}

image.prototype.addRemoteAsset = function addRemoteAsset(url) {
	if(this.file !== undefined) console.warn('Overriding video file property with remoteUrl');
	this.file = undefined;
	this.remoteUrl = url;
	return this;
}

image.prototype.addDisplayName = function addDisplayName(name) {
	this.displayName = name;
	return this;
}

image.prototype.relateById = function relateById(id) {
	if(this.video_id !== undefined || this.video_reference_id !== undefined) console.warn('Overriding existing video relation');
	this.video_reference_id = undefined;
	this.video_id = id;
	return this;
}

image.prototype.relateByReferenceId = function relateByReferenceId(refId) {
	if(this.video_id !== undefined || this.video_reference_id !== undefined) console.warn('Overriding existing video relation');
	this.video_id = undefined;
	this.video_reference_id = refId;
	return this;
}

image.prototype.setResize = function setResize(bool) {
	this.resize = bool;
	return this;
}

module.exports = image;