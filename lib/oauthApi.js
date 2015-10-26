
// api reference: http://docs.brightcove.com/en/video-cloud/oauth-api/reference/versions/v3/index.html

var events = require('events'),
	util = require('util'),
	https = require('https'),
	Uri = require('jsuri'),
	Errors = require('./errors');


var api = function OAuthApi(clientId, clientSecret) {

	events.EventEmitter.call(this);

	this.baseUrl = 'https://oauth.brightcove.com/v3';
	this.credentialsUrl = this.baseUrl + '/client_credentials';
	this.accessTokenUrl = this.baseUrl + '/access_token';

	this.getClientId = function getClientId() {
		return clientId;
	}

	this.getClientSecret = function getClientSecret() {
		return clientSecret;
	}
}

util.inherits(api, events.EventEmitter);


api.prototype.commands = {

	create_access_token: 'create_access_token',
	create_client_credential : 'create_client_credential',
	delete_client_credential : 'delete_client_credential',
	get_client_credential_by_id : 'get_client_credential_by_id',
	get_client_credential : 'get_client_credential',
	update_client_credential : 'update_client_credential'
}


api.prototype.getAuthorizationHeader = function getAuthorizationHeader(){
	return 'Basic ' + new Buffer(this.getClientId() + ":" + this.getClientSecret()).toString('base64');
}


api.prototype.makeRequest = function makeRequest(command, options, callback) {

	if (typeof callback === undefined || typeof callback === null)
		throw new Error('no callback defined when calling makeRequest');

	var body = null;

	if (typeof options.body !== undefined) {
		var body = options.body;
		delete options.body;
	}

	var request = https.request(options, function(response) {

		var data = '';

		response.setEncoding('utf8');
		response.on('data', function(chunk) {
			data += chunk;
		}.bind(this));

		response.on('end', function(err) {

			var json = JSON.parse(data.toString());
			var error = handleApiErrors(err, json);

			// emit response
			this.emit(command, error, json);

			// kick off callback, if supplied
			if (typeof callback === 'function')
				callback(error, json);
		}.bind(this));
	}.bind(this));

	if (body){
		request.write(JSON.stringify(body));
	}
	
	request.end();

	// handle those pesky http request errors.
	request.on('error', function(e) {

		this.emit(command, e, null);

		// kick off callback, if needed
		if (typeof callback === 'function')
			callback(e, null);
	}.bind(this));
}


api.prototype.createAccessToken = function createAccessToken(callback) {
	var url = buildUrl(this.accessTokenUrl);
	url.addQueryParam('grant_type', 'client_credentials');

	var opts = {
			hostname: url.host(),
			path: url.path() + url.query(),
			method: 'POST',
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Authorization' : this.getAuthorizationHeader()
			}
		};

	this.makeRequest(this.commands.create_access_token, opts, callback);
}


api.prototype.createClientCredential = function createClientCredential(callback) {
	// @todo: implement this
}


api.prototype.deleteClientCredential = function deleteClientCredential(callback) {
	// @todo: implement this
}


api.prototype.getClientCredentialById = function getClientCredentialById(callback) {
	// @todo: implement this
}


api.prototype.getClientCredential = function getClientCredential(callback) {
	// @todo: implement this
}


api.prototype.updateClientCredential = function updateClientCredential(callback) {
	// @todo: implement this
}


var buildUrl = function buildUrl(url) {

	var url = new Uri(url);
	
	return url;
}


var handleApiErrors = function handleApiErrors(err, json) {

	if (err !== undefined) return err;
	if (json == null) return new Errors.InvalidArgument();
	if (json.error != null && json.error != undefined) return new Errors.Api(json);
}

module.exports = api;