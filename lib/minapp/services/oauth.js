'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const WXAuthCrypt = require('../auth_crypto');
const ServiceBase = require('./index');

const SESSION_KEY_URL = 'https://api.weixin.qq.com/sns/jscode2session';

class OAuth extends ServiceBase {
  getSessionKey(code) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = yield _this.request('GET', SESSION_KEY_URL, {
        data: {
          appid: _this.client.appId,
          secret: _this.client.appSecret,
          js_code: code,
          grant_type: 'authorization_code'
        }
      });

      _this.code = code;
      _this.openId = data.openid;
      _this.sessionKey = data.session_key;

      return { openId: data.openid, sessionKey: data.session_key };
    })();
  }

  getUserInfo({ code, encryptedData, iv }) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (code && _this2.code != code) {
        yield _this2.getSessionKey(code);
      }

      if (!_this2.sessionKey) {
        throw new Error('Illegal session key.');
      }

      let cryptor = new WXAuthCrypt(_this2.client.appId, _this2.sessionKey);
      let decryptedData = cryptor.decrypt(encryptedData, iv);
      if (decryptedData.openId !== _this2.openId) {
        throw new Error('Illegal encryptedData.');
      }
      return decryptedData;
    })();
  }
}

exports = module.exports = OAuth;