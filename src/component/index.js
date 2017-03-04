'use strict';

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
    if (!this.services[name]) {
      let Service = require('./services/' + name);
      if (Service) {
        this.services[name] = new Service(this);
      }
    }

    return this.services[name];
  }

  setCache(redis) {
    this.redis = redis;
  }

  async accessToken() {
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

  async getAccessToken() {
    let data = await this.request('POST', ACCESS_TOKEN_URL, {
      accessToken: false,
      data: {
        component_appid: this.appId,
        component_appsecret: this.appSecret,
        component_verify_ticket: this.ticket
      }
    });

    return {
      accessToken: data.component_access_token,
      expiresIn: data.expires_in
    };
  }
}

exports = module.exports = Client;
