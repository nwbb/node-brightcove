var util = require('util');


var AccessToken = function AccessToken(json) {

	this.json = json;

	// set dates
	this.creationDate = new Date();
	this.expirationDate = new Date();
	this.expirationDate.setSeconds(this.expirationDate.getSeconds() + this.json.expires_in);
}

AccessToken.prototype.getJSON = function getJSON() {

	return this.json;
}

AccessToken.prototype.isExpired = function isExpired() {

	return new Date() > this.expirationDate;
}

module.exports = AccessToken;