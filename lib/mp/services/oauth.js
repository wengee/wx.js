'use strict';

const ServiceBase = require('./index');

const AUTHORIZE_URL = 'https://open.weixin.qq.com/connect/oauth2/authorize';
const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/access_token';
const COMPONENT_ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/component/access_token';
const REFRESH_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/refresh_token';
const COMPONENT_REFRESH_TOKEN_URL = 'https://api.weixin.qq.com/sns/oauth2/component/refresh_token';
const USERINFO_URL = 'https://api.weixin.qq.com/sns/userinfo';
const CHECK_URL = 'https://api.weixin.qq.com/sns/auth';

class OAuth extends ServiceBase
{
  authorizeUrl (redirectUrl, scope = 'snsapi_base', state = null) {
    redirectUrl = encodeURI(redirectUrl);
    let appId = this.client.appId;

    return `${AUTHORIZE_URL}?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  }

  async accessToken (code) {
    let data = await this.request('GET', ACCESS_TOKEN_URL, {
      accessToken: false,
      data: {
        appid: this.client.appId,
        secret: this.client.appSecret,
        code: code,
        grant_type: 'authorization_code'
      }
    });

    this.accessToken = data.access_token;
    this.openId = data.openid;

    return data;
  }

  async refreshToken (rToken) {
    let data = await this.request('GET', REFRESH_TOKEN_URL, {
      accessToken: false,
      data: {
        appid: this.client.appId,
        grant_type: 'refresh_token',
        refresh_token: rToken
      }
    });

    this.accessToken = data.access_token;
    this.openId = data.openid;

    return data;
  }

  async getUserInfo ({ accessToken = null, openId = null, lang = 'zh_CN' }) {
    accessToken = accessToken || this.accessToken;
    openId = openId || this.openId;

    return await this.request('GET', USERINFO_URL, {
      accessToken: false,
      data: {
        access_token: accessToken,
        openid: openId,
        lang
      }
    });
  }

  async check ({ accessToken = null, openId = null }) {
    accessToken = accessToken || this.accessToken;
    openId = openId || this.openId;

    let data = await this.request('GET', CHECK_URL, {
      accessToken: false,
      data: {
        access_token: accessToken,
        openid: openId
      }
    });

    return data.errcode === 0;
  }
}

exports = module.exports = OAuth;
