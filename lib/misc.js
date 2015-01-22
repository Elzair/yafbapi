var util = require('util');

var buildQueryString = exports.buildQueryString = function(options) {
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
