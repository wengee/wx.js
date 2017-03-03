'use strict';

const qs = require('query-string');
const ServiceBase = require('./index');

const AUTH_URL = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?';
const PRE_AUTH_CODE_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_create_preauthcode';
const QUERY_AUTH_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_query_auth';

class Auth extends ServiceBase
{
  async getPreAuthCode() {
    let data = await this.request('POST', PRE_AUTH_CODE_URL, {
      data: {
        component_appid: this.client.appId
      }
    });

    return data.pre_auth_code;
  }

  async authorizeUrl(redirectUrl) {
    let preAuthCode = await this.getPreAuthCode();

    return AUTH_URL + qs.stringify({
      component_appid: this.client.appId,
      pre_auth_code: preAuthCode,
      redirect_uri: redirectUrl
    });
  }

  async queryAuth(code) {
    let data = await this.request('POST', QUERY_AUTH_URL, {
      data: {
        component_appid: this.client.appId,
        authorization_code: code
      }
    });

    return data;
  }
}
