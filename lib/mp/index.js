'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const crypto = require('crypto');
const ClientBase = require('../base');

const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token';
const TICKET_URL = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';

class Client extends ClientBase {
  constructor({ appId, appSecret, refreshToken, token, encodingAESKey,
    mchId, mchKey, certPath, keyPath, redis, accessToken }) {
    super();
    this.appId = appId;
    this.appSecret = appSecret;
    this.refreshToken = refreshToken;
    this.token = token;
    this.encodingAESKey = encodingAESKey;
    this.mchId = mchId;
    this.mchKey = mchKey;
    this.certPath = certPath;
    this.keyPath = keyPath;
    this.redis = redis;

    this.compClient = null;
    this._accessToken = accessToken;
    this._ticket = {};
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

  setComponent(compClient) {
    this.compClient = compClient;
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
      let data;
      if (_this2.compClient) {
        data = _this2.compClient.service('account').getAuthorizerToken(_this2.appId, _this2.refreshToken);
        return data;
      } else {
        data = yield _this2.request('POST', ACCESS_TOKEN_URL, {
          accessToken: false,
          query: {
            grant_type: 'client_credential',
            appid: _this2.appId,
            secret: _this2.appSecret
          }
        });

        return {
          accessToken: data.access_token,
          expiresIn: data.expires_in,
          refreshToken: null
        };
      }
    })();
  }

  jsapiSign(url) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let jsapiTicket = yield _this3.jsapiTicket();
      let nonceStr = String(Math.random()).substr(3, 10);
      let timestamp = String(parseInt(Date.now() / 1000));

      let str = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
      let signature = crypto.createHash('sha1').update(str).digest('hex');

      return {
        appId: _this3.appId,
        nonceStr,
        timestamp,
        signature
      };
    })();
  }

  jsapiTicket() {
    return this.ticket('jsapi');
  }

  wxcardTicket() {
    return this.ticket('wx_card');
  }

  ticket(type = 'jsapi') {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (_this4._ticket[type]) {
        return _this4._ticket[type];
      } else {
        let ticket;
        if (_this4.redis) ticket = yield _this4.redis.get(_this4.appId + '_ticket_' + type);

        if (!ticket) {
          let data = yield _this4.getTicket(type);

          if (_this4.redis) yield _this4.redis.set(_this4.appId + '_ticket_' + type, data.ticket, 'EX', data.expiresIn - 600);

          ticket = data.ticket;
        }

        _this4._ticket[type] = ticket;
        return ticket;
      }
    })();
  }

  getTicket(type = 'jsapi') {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this5.request('GET', TICKET_URL, {
        data: { type }
      });

      return {
        ticket: data.ticket,
        expiresIn: data.expires_in
      };
    })();
  }
}

exports = module.exports = Client;