
var util = require('util');


var baseError = function BaseError(message, constructor) {

	Error.captureStackTrace(this, constructor || this);
	this.message = message || 'An unknown error has occurred';
}
util.inherits(baseError, Error);



var ApiError = function ApiError(json) {

	var combinedMessage = json.error + ' (' + json.code + ')\n';

	for (var index in json.errors) {
		combinedMessage += '\t - ' + json.errors[index].error + ' (' + json.errors[index].code + ')\n';
	}

	ApiError.super_.call(this, combinedMessage, this.constructor);
}
util.inherits(ApiError, baseError);
ApiError.prototype.name = 'API Error';



var InvalidArgument = function InvalidArgument() {
	InvalidArgument.super_.call(this, 'An invalid argument in the request has resulted with a null response.', this.constructor);
}
util.inherits(InvalidArgument, baseError);
InvalidArgument.prototype.name = 'Invalid Argument';



module.exports = {
	Api: ApiError,
	InvalidArgument: InvalidArgument
}