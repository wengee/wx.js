'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const qs = require('query-string');
const ServiceBase = require('./index');

const AUTH_URL = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?';
const PRE_AUTH_CODE_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode';
const QUERY_AUTH_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_query_auth';

class Auth extends ServiceBase {
  getPreAuthCode() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = yield _this.request('POST', PRE_AUTH_CODE_URL, {
        data: {
          component_appid: _this.client.appId
        }
      });

      return data.pre_auth_code;
    })();
  }

  authorizeUrl(redirectUrl) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let preAuthCode = yield _this2.getPreAuthCode();

      return AUTH_URL + qs.stringify({
        component_appid: _this2.client.appId,
        pre_auth_code: preAuthCode,
        redirect_uri: redirectUrl
      });
    })();
  }

  queryAuth(code) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this3.request('POST', QUERY_AUTH_URL, {
        data: {
          component_appid: _this3.client.appId,
          authorization_code: code
        }
      });

      return data;
    })();
  }
}