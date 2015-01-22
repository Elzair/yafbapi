var oauthApi = require(__dirname + '/api/oauth')
  , v22Api   = require(__dirname + '/api/v2.2')
  ;

module.exports = {
    oauth: oauthApi
  , v2: {
      2: v22Api
    }
};

