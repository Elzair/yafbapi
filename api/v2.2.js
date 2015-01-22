var misc    = require(__dirname + '/../lib/misc')
  , request = require('co-request')
  , typeOf  = require('typeof')
  , util    = require('util')
  ;

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

  var queryString = misc.misc.buildQueryString(parameters);

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
      misc.buildQueryString({access_token: access_token}) : '';
  
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

  var queryString = misc.buildQueryString(parameters);

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
  var user   = JSON.parse(result);

  if (!user.hasOwnProperty('id')) {
    throw new Error('Invalid result from getResultId');
  }

  return user.id;
};
