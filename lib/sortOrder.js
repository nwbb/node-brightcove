
var sortOrder = function SortOrder(options) {
	if (options === null || options === undefined)
		throw new Error('Options were not passed in to SortOrder.');
	this._options = options;
}

sortOrder.prototype.creationDate = function creationDate() {
	this._options.sort_by = 'CREATION_DATE';
	return this._options;
}

sortOrder.prototype.displayName = function displayName() {
	this._options.sort_by = 'DISPLAY_NAME';
	return this._options;
}

sortOrder.prototype.modifiedDate = function modifiedDate() {
	this._options.sort_by = 'MODIFIED_DATE';
	return this._options;
}

sortOrder.prototype.totalPlays = function totalPlays() {
	this._options.sort_by = 'PLAYS_TOTAL';
	return this._options;
}

sortOrder.prototype.totalPlaysOfLastWeek = function totalPlaysOfLastWeek() {
	this._options.sort_by = 'PLAYS_TRAILING_WEEK';
	return this._options;
}

sortOrder.prototype.publishDate = function publishDate() {
	this._options.sort_by = 'PUBLISH_DATE';
	return this._options;
}

sortOrder.prototype.referenceId = function referenceId() {
	this._options.sort_by = 'REFERENCE_ID';
	return this._options;
}

sortOrder.prototype.startDate = function startDate() {
	this._options.sort_by = 'START_DATE';
	return this._options;
}

module.exports = sortOrder;
