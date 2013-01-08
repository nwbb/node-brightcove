
var sortOrder = function SortOrder(options) {
	if (options === null || options === undefined)
		throw new Error('Options were not passed in to SortOrder.');
	this._options = options;
}

sortOrder.prototype.creationDate = function creationDate() {
	this._options.sort_by = 'CREATION_DATE';
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

module.exports = sortOrder;
