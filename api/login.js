var misc    = require(__dirname + '/../lib/misc')
  , request = require('co-request')
  , typeOf  = require('typeof')
  , util    = require('util')
  ;

var getLoginUri = exports.getLoginUri = function(parameters) {
  var options = {};

  if (!parameters.client_id) {
    throw new Error("No Client ID!");
  }

  options.client_id = parameters.client_id;

  if (!parameters.redirect_uri) {
    throw new Error("No Redirect URI"); 
  }

  options.redirect_uri = parameters.redirect_uri;

  if (parameters.state) {
    options.state = parameters.state;
  }

  if (parameters.response_type) {
    switch(parameters.response_type) {
      case 'code':
      case 'token':
      case 'code token':
      case 'granted_scopes':
        options.response_type = parameters.response_type;
        break;
      default:
      throw new Error(util.format('Invalid response_type: %s',
                                  parameters.response_type));
    }
  }

  if (parameters.scope) {
    options.scope = parameters.scope;
  }

  var queryString = misc.buildQueryString(options);
  var uri = util.format('https://www.facebook.com/dialog/oauth%s',
                        queryString);

  return uri;
};

var getAccessToken = exports.getAccessToken = function*(parameters) {
   var options = {};

  if (typeOf(parameters) !== 'object') {
    throw new Error("parameters must be an object");
  }

  if (!parameters.client_id) {
    throw new Error("No Client ID");
  }

  options.client_id = parameters.client_id;

  if (!parameters.redirect_uri) {
    throw new Error("No Redirect URI"); 
  }

  options.redirect_uri = parameters.redirect_uri;

  if (!parameters.client_secret) {
    throw new Error("No Client Secret");
  }

  options.client_secret = parameters.client_secret;

  if (!parameters.code) {
    throw new Error("No Code");
  }

  options.code = parameters.code;

  if (parameters.state) {
    options.state = parameters.state;
  }

  var queryString = misc.buildQueryString(options);

  var uri = util.format('https://graph.facebook.com/oauth/access_token%s',
                        queryString);
  var results = yield request(uri);
  var resultsArr = results.body.split('&');
  var resultsObj = {
      access_token: resultsArr[0].split('=')[1]
    , expires:      resultsArr[1].split('=')[1]
  };
  
  return resultsObj;
};
