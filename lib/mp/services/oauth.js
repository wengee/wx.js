'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ServiceBase = require('./index');

const AUTHORIZE_URL = 'https://open.weixin.qq.com/connect/oauth2/authorize';
const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const COMPONENT_ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/component/access_token';
const REFRESH_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
const COMPONENT_REFRESH_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/component/refresh_token';
const USERINFO_URL = 'https://api.weixin.qq.com/sns/userinfo';
const CHECK_URL = 'https://api.weixin.qq.com/sns/auth';

class OAuth extends ServiceBase {
  authorizeUrl(redirectUrl, scope = 'snsapi_base', state = null) {
    redirectUrl = encodeURI(redirectUrl);
    let appId = this.client.appId;

    return `${AUTHORIZE_URL}?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  }

  accessToken(code) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = yield _this.request('GET', ACCESS_TOKEN_URL, {
        accessToken: false,
        data: {
          appid: _this.client.appId,
          secret: _this.client.appSecret,
          code: code,
          grant_type: 'authorization_code'
        }
      });

      _this.accessToken = data.access_token;
      _this.openId = data.openid;

      return data;
    })();
  }

  refreshToken(rToken) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this2.request('GET', REFRESH_TOKEN_URL, {
        accessToken: false,
        data: {
          appid: _this2.client.appId,
          grant_type: 'refresh_token',
          refresh_token: rToken
        }
      });

      _this2.accessToken = data.access_token;
      _this2.openId = data.openid;

      return data;
    })();
  }

  getUserInfo({ accessToken = null, openId = null, lang = 'zh_CN' }) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      accessToken = accessToken || _this3.accessToken;
      openId = openId || _this3.openId;

      return yield _this3.request('GET', USERINFO_URL, {
        accessToken: false,
        data: {
          access_token: accessToken,
          openid: openId,
          lang
        }
      });
    })();
  }

  check({ accessToken = null, openId = null }) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      accessToken = accessToken || _this4.accessToken;
      openId = openId || _this4.openId;

      let data = yield _this4.request('GET', CHECK_URL, {
        accessToken: false,
        data: {
          access_token: accessToken,
          openid: openId
        }
      });

      return data.errcode === 0;
    })();
  }
}

exports = module.exports = OAuth;