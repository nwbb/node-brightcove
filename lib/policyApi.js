
// api reference: http://docs.brightcove.com/en/video-cloud/policy-api/references/versions/v1/index.html

var events = require('events'),
	util = require('util'),
	https = require('https'),
	Uri = require('jsuri'),
	Errors = require('./errors');


var api = function PolicyApi(accountId, oauthApi) {

	events.EventEmitter.call(this);

	this.oauthApi = oauthApi;
	this.baseUrl = 'https://policy.api.brightcove.com/v1';
	this.policyKeysUrl = this.baseUrl + '/accounts/'+accountId+'/policy_keys';

	this.getAccountId = function getAccountId() {
		return accountId;
	}
}

util.inherits(api, events.EventEmitter);


api.prototype.commands = {

	get_policy_key: 'get_policy_key',
	get_policy: 'get_policy'
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

			var json = '';
			var error = null;

			// if error 4** or 5**
			if (response.statusCode != 200) {
				json = data;
				error = {
					code: response.statusCode,
					message: response.statusMessage
				};
			}

			// if success
			else {
				json = JSON.parse(data.toString());
				error = handleApiErrors(err, json);
			}


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

/**
 *  Call oAuth API to get an access token then create policy key
 */
api.prototype.getPolicyKey = function getPolicyKey(callback) {
	this.oauthApi.getAccessToken(function(err, accessToken) {
		if (err) {
			callback(err, null);
		} else {
			var url = buildUrl(this.policyKeysUrl);
      var accountId = this.getAccountId();
      url.addQueryParam('account_id', accountId);

      var opts = {
        hostname: url.host(),
        path: url.path() + url.query(),
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : accessToken.token_type + ' ' + accessToken.access_token
        },
        body: {
          'key-data' : {
            'account-id': accountId
          }
        }
      };

      this.makeRequest(this.commands.get_policy_key, opts, callback);
		}
	}.bind(this));
}


/**
 *  Call oAuth API to get an access token then get policy data from policy key
 */
api.prototype.getPolicy = function getPolicy(keyString, callback) {
  this.oauthApi.getAccessToken(function(err, accessToken) {
    if (err) {
      callback(err, null);
    } else {
    	var url = buildUrl(this.policyKeysUrl + '/' + keyString);

      var opts = {
        hostname: url.host(),
        path: url.path() + url.query(),
        method: 'GET',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : accessToken.token_type + ' ' + accessToken.access_token
        }
      };

      this.makeRequest(this.commands.get_policy, opts, callback);
    }
  }.bind(this));
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