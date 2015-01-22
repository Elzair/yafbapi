var request = require('co-request')
  , typeOf  = require('typeof')
  , util    = require('util');

var buildQueryString = function(options) {
  var queries = [];

  for (var option in options) {
    if (options.hasOwnProperty(option)) {
      queries.push(util.format('%s=%s',
                               option,
                               encodeURIComponent(options[option])));
    }
  }

  var queryString = queries.length > 0 ? '?' + queries.join('&') : '';
  
  return queryString;
};


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

  var queryString = buildQueryString(options);
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

  var queryString = buildQueryString(options);

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

var checkParameters = function(id, path, parameters) {
  if (typeof(id) !== 'string' || id === '') {
    throw new Error('Invalid id');
  }

  if (typeOf(path) !== 'array') {
    throw new Error('Invalid path');
  }

  if (typeOf(parameters) !== 'object') {
    throw new Error('Invalid parameters');
  }
};

var get = exports.get = function*(id, path, parameters, access_token) {
  checkParameters(id, path, parameters);

  if (access_token) {
    parameters.access_token = access_token;
  }

  var queryString = buildQueryString(parameters);

  var uri = util.format('https://graph.facebook.com/v2.2/%s/%s%s',
                        id, path.join('/'), queryString);

  var result = yield request({
      uri:    uri
    , method: 'GET'
  });

  return result.body;
};

var post = exports.post = function*(id, path, parameters, access_token) {
  checkParameters(id, path, parameters);

  var queryString = access_token ?
      buildQueryString({access_token: access_token}) : '';
  
  var uri = util.format('https://graph.facebook.com/v2.2/%s/%s%s',
                        id, path.join('/'), queryString);

  var result = yield request({
      uri:    uri
    , method: 'POST'
    , body:   parameters
    , json:   true
  });

  return result.body;
};

var del = exports.del = function*(id, path, parameters, access_token) {
  checkParameters(id, path, parameters);

  if (access_token) {
    parameters.access_token = access_token;
  }

  var queryString = buildQueryString(parameters);

  var uri = util.format('https://graph.facebook.com/v2.2/%s/%s%s',
                        id, path.join('/'), queryString);

  var result = yield request({
      uri:    uri
    , method: 'DELETE'
  });

  return result.body;
};

var getUserId = exports.getUserId = function*(access_token) {
  var result = yield get('me', [], {fields: 'id'}, access_token);

  return result.body;
};
