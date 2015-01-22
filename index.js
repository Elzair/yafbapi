var loginApi = require(__dirname + '/api/login')
  , v22Api   = require(__dirname + '/api/v2.2')
  ;

module.exports = {
    login: loginApi
  , v2: {
      2: v22Api
    }
};

