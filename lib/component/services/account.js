'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ServiceBase = require('./index');

const AUTHORIZER_INFO_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info';
const AUTHORIZER_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token';
const AUTHORIZER_OPTION_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_option';
const SET_AUTHORIZER_OPTION_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_set_authorizer_option';

class Account extends ServiceBase {
  getInfo(appId) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = yield _this.request('POST', AUTHORIZER_INFO_URL, {
        data: {
          component_appid: _this.client.appId,
          authorizer_appid: appId
        }
      });

      return data;
    })();
  }

  getAuthorizerToken(appId, refreshToken) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this2.request('POST', AUTHORIZER_TOKEN_URL, {
        data: {
          component_appid: _this2.client.appId,
          authorizer_appid: appId,
          authorizer_refresh_token: refreshToken
        }
      });

      return {
        accessToken: data.authorizer_access_token,
        expiresIn: data.expires_in,
        refreshToken: data.authorizer_refresh_token
      };
    })();
  }

  getOption(appId, optionName) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this3.request('POST', AUTHORIZER_OPTION_URL, {
        data: {
          component_appid: _this3.client.appId,
          authorizer_appid: appId,
          option_name: optionName
        }
      });

      return data.option_value;
    })();
  }

  setOption(appId, optionName, optionValue) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let data = _this4.request('POST', SET_AUTHORIZER_OPTION_URL, {
        data: {
          component_appid: _this4.client.appId,
          authorizer_appid: appId,
          option_name: optionName,
          option_value: optionValue
        }
      });

      return data;
    })();
  }
}