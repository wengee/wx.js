'use strict';

const crypto = require('crypto');
const ClientBase = require('../base');

const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token';
const TICKET_URL = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';

class Client extends ClientBase
{
  constructor ({ appId, appSecret, refreshToken, token, encodingAESKey,
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
    if (!this.services[name]) {
      let Service = require('./services/' + name);
      if (Service) {
        this.services[name] = new Service(this);
      }
    }

    return this.services[name];
  }

  setCache (redis) {
    this.redis = redis;
  }

  setComponent (compClient) {
    this.compClient = compClient;
  }

  async accessToken () {
    if (this._accessToken) {
      return this._accessToken;
    } else {
      let token;
      if (this.redis)
        token = await this.redis.get(this.appId + '_accessToken');

      if (!token) {
        let data = await this.getAccessToken();

        if (this.redis)
          await this.redis.set(this.appId + '_accessToken', data.accessToken, 'EX', data.expiresIn - 600);
        
        token = data.accessToken;
      }

      this._accessToken = token;
      return token;
    }
  }

  async getAccessToken () {
    let data;
    if (this.compClient) {
      data = this.compClient.service('account').getAuthorizerToken(this.appId, this.refreshToken);
      return data;
    } else {
      data = await this.request('POST', ACCESS_TOKEN_URL, {
        accessToken: false,
        query: {
          grant_type: 'client_credential',
          appid: this.appId,
          secret: this.appSecret
        }
      });

      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: null
      };
    }
  }

  async jsapiSign (url) {
    let jsapiTicket = await this.jsapiTicket();
    let nonceStr = String(Math.random()).substr(3, 10);
    let timestamp = String(parseInt(Date.now() / 1000));

    let str = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;
    let signature = crypto.createHash('sha1').update(str).digest('hex');

    return {
      appId: this.appId,
      nonceStr,
      timestamp,
      signature
    };
  }

  jsapiTicket () {
    return this.ticket('jsapi'); 
  }

  wxcardTicket () {
    return this.ticket('wx_card');
  }

  async ticket (type = 'jsapi') {
    if (this._ticket[type]) {
      return this._ticket[type];
    } else {
      let ticket;
      if (this.redis)
        ticket = await this.redis.get(this.appId + '_ticket_' + type);

      if (!ticket) {
        let data = await this.getTicket(type);

        if (this.redis)
          await this.redis.set(this.appId + '_ticket_' + type, data.ticket, 'EX', data.expiresIn - 600);
        
        ticket = data.ticket;
      }

      this._ticket[type] = ticket;
      return ticket;
    }
  }

  async getTicket (type = 'jsapi') {
    let data = await this.request('GET', TICKET_URL, {
      data: { type }
    });

    return {
      ticket: data.ticket,
      expiresIn: data.expires_in
    }
  }
}

exports = module.exports = Client;
