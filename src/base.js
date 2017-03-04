'use strict';

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
}

class ClientBase
{
  get cryptor () {
    if (this.encodingAESKey) {
      return WXBizMsgCrypt(this.token, this.encodingAESKey, this.appId);
    } else {
      return null;
    }
  }

  async request (method, url, options = {}) {
    options.query = options.query || {};
    if (this.accessToken && !options.accessToken && options.accessToken !== false) {
      options.query.access_token = await this.accessToken();
    }

    if (!_.isEmpty(options.query)) {
      url = url + (url.indexOf('?') === -1 ? '?' : '&') + qs.stringify(options.query);
    }

    let res;
    try {
      res = await urllib.request(url, {
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
      if (res.data && res.data.errcode)
        throw new OfficialError(res.data.errcode, res.data.errmsg);
    }

    return res.data;
  }

  async parseEncrypt (req) {
    if (!this.cryptor) {
      throw new Error('Invalid cryptor');
    }

    let signature = req.query.msg_signature;
    let timestamp = req.query.timestamp;
    let nonce = req.query.nonce;

    if (req.method === 'GET') {
      const echostr = req.query.echostr;
      if (signature !== this.cryptor.getSignature(timestamp, nonce, echostr)) {
        throw new Error('Invalid signature');
      } else {
        const result = this.cryptor.decrypt(echostr);
        return result.message;
      }
    } else {
      if (!req.body) {
        throw new Error('body is empty');
      }

      let data = await xmlParse(req.body);
      let encryptMessage = data.Encrypt;
      if (signature !== this.cryptor.getSignature(timestamp, nonce, encryptMessage)) {
        throw new Error('Invalid signature');
      }

      let decrypted = cryptor.decrypt(encryptMessage);
      let messageWrapXml = decrypted.message;
      if (messageWrapXml === '') {
        throw new Error('Invalid appid');
      }

      return messageWrapXml;
    }
  }

  async parseRequest (req) {
    let rawXml = req.body;

    if (req.query.encrypt_type && req.query.msg_signature) {
      rawXml = await this.parseEncrypt(req);
    } else if (!checkSignature(req.query, this.token)) {
      throw new Error('Invalid signature');
    }

    if (req.method === 'GET') {
      return req.query.echostr;
    } else if (req.method === 'POST') {
      return await xmlParse(rawXml);
    }
  }
}

ClientBase.prototype.checkSignature = checkSignature;
exports = module.exports = ClientBase;
