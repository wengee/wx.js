'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ClientBase = require('../base');

const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_component_token';

class Client extends ClientBase {
  constructor({ appId, appSecret, token, encodingAESKey, ticket, redis }) {
    super();
    this.appId = appId;
    this.appSecret = appSecret;
    this.token = token;
    this.encodingAESKey = encodingAESKey;
    this.ticket = ticket;
    this.redis = redis;

    this._accessToken = null;
    this.services = {};
  }

  service(name) {
    if (this.services[name]) {
      return this.services[name];
    } else {
      let Service = require('./services/' + name);
      if (Service) {
        let s = new Service(this);
        this.services[name] = s;
        return s;
      } else {
        return null;
      }
    }
  }

  setCache(redis) {
    this.redis = redis;
  }

  accessToken() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this._accessToken) {
        return _this._accessToken;
      } else {
        let token;
        if (_this.redis) token = yield _this.redis.get(_this.appId + '_accessToken');

        if (!token) {
          let data = yield _this.getAccessToken();

          if (_this.redis) yield _this.redis.set(_this.appId + '_accessToken', data.accessToken, 'EX', data.expiresIn - 600);

          token = data.accessToken;
        }

        _this._accessToken = token;
        return token;
      }
    })();
  }

  getAccessToken() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this2.request('POST', ACCESS_TOKEN_URL, {
        accessToken: false,
        data: {
          component_appid: _this2.appId,
          component_appsecret: _this2.appSecret,
          component_verify_ticket: _this2.ticket
        }
      });

      return {
        accessToken: data.component_access_token,
        expiresIn: data.expires_in
      };
    })();
  }
}

exports = module.exports = Client;