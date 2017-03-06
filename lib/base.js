'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');
const crypto = require('crypto');
const urllib = require('urllib');
const assert = require('assert');
const qs = require('query-string');
const WXBizMsgCrypt = require('wechat-crypto');
const OfficialError = require('./official-error');
const { replyTpl, encryptWrap } = require('./template');
const { xmlParse } = require('./xmlparse');

const checkSignature = function (query, token) {
  let signature = query.signature;
  let timestamp = query.timestamp;
  let nonce = query.nonce;

  let shasum = crypto.createHash('sha1');
  let arr = [token, timestamp, nonce].sort();
  shasum.update(arr.join(''));

  return shasum.digest('hex') === signature;
};

const getRawBody = function (stream) {
  if (!stream) {
    return null;
  }

  return new Promise(function (resolve, reject) {
    let result = '';
    stream.on('data', chunk => {
      result += Buffer.from(chunk).toString();
    });

    stream.on('end', () => {
      resolve(result);
    });
  });
};

const formatMessage = function (message) {
  let result = {};
  _.forEach(message, (item, index) => {
    result[_.camelCase(index)] = item;
  });
  return result;
};

class ClientBase {
  get cryptor() {
    if (this.encodingAESKey) {
      return WXBizMsgCrypt(this.token, this.encodingAESKey, this.appId);
    } else {
      return null;
    }
  }

  request(method, url, options = {}) {
    var _this = this;

    return _asyncToGenerator(function* () {
      options.query = options.query || {};
      if (_this.accessToken && !options.accessToken && options.accessToken !== false) {
        options.query.access_token = yield _this.accessToken();
      }

      if (!_.isEmpty(options.query)) {
        url = url + (url.indexOf('?') === -1 ? '?' : '&') + qs.stringify(options.query);
      }

      let res;
      try {
        res = yield urllib.request(url, {
          method,
          data: options.data || {},
          dataType: options.dataType || 'json',
          contentType: options.contentType || 'json'
        });
        assert(res.status === 200, 'Could not connect to api server.');
      } catch (e) {
        throw new OfficialError(-1, e.message);
      }

      if (!options.dataType || options.dataType.toUpperCase() === 'JSON') {
        if (res.data && res.data.errcode) throw new OfficialError(res.data.errcode, res.data.errmsg);
      }

      return res.data;
    })();
  }

  setContext(ctx) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (ctx.request) {
        _this2.ctx = ctx;
        yield _this2.parseMessage(ctx);
      }
    })();
  }

  parseEncryptMessage(ctx) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!_this3.cryptor) {
        throw new Error('Invalid cryptor');
      }

      let signature = ctx.request.query.msgSignature;
      let timestamp = ctx.request.query.timestamp;
      let nonce = ctx.request.query.nonce;

      if (ctx.request.method === 'GET') {
        const echostr = ctx.request.query.echostr;
        if (signature !== _this3.cryptor.getSignature(timestamp, nonce, echostr)) {
          throw new Error('Invalid signature');
        } else {
          const result = _this3.cryptor.decrypt(echostr);
          return result.message;
        }
      } else {
        let rawXml = getRawBody(ctx.req);
        if (!rawXml) {
          throw new Error('body is empty');
        }

        let data = yield xmlParse(rawXml);
        let encryptMessage = data.Encrypt;
        if (signature !== _this3.cryptor.getSignature(timestamp, nonce, encryptMessage)) {
          throw new Error('Invalid signature');
        }

        let decrypted = cryptor.decrypt(encryptMessage);
        let messageWrapXml = decrypted.message;
        if (messageWrapXml === '') {
          throw new Error('Invalid appid');
        }

        data = yield xmlParse(messageWrapXml);
        data = formatMessage(data);
        _this3.message = data;
        return data;
      }
    })();
  }

  parseMessage(ctx) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (ctx.request.query.encrypt_type && ctx.request.query.msg_signature) {
        return yield _this4.parseEncryptMessage(ctx);
      } else if (!checkSignature(ctx.request.query, _this4.token)) {
        throw new Error('Invalid signature');
      }

      if (ctx.request.method === 'GET') {
        return ctx.request.query.echostr;
      } else if (ctx.request.method === 'POST') {
        let rawXml = yield getRawBody(ctx.req);
        let data = yield xmlParse(rawXml);
        data = formatMessage(data);
        _this4.message = data;
        return data;
      }
    })();
  }
}

ClientBase.prototype.checkSignature = checkSignature;
exports = module.exports = ClientBase;