'use strict';

const ServiceBase = require('./index');

const AUTHORIZER_INFO_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_info';
const AUTHORIZER_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_authorizer_token';
const AUTHORIZER_OPTION_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_option';
const SET_AUTHORIZER_OPTION_URL = 'https://api.weixin.qq.com/cgi-bin/component/api_set_authorizer_option';

class Account extends ServiceBase {
  async getInfo(appId) {
    let data = await this.request('POST', AUTHORIZER_INFO_URL, {
      data: {
        component_appid: this.client.appId,
        authorizer_appid: appId
      }
    });

    return data;
  }

  async getAuthorizerToken(appId, refreshToken) {
    let data = await this.request('POST', AUTHORIZER_TOKEN_URL, {
      data: {
        component_appid: this.client.appId,
        authorizer_appid: appId,
        authorizer_refresh_token: refreshToken
      }
    });

    return {
      accessToken: data.authorizer_access_token,
      expiresIn: data.expires_in,
      refreshToken: data.authorizer_refresh_token
    }
  }

  async getOption(appId, optionName) {
    let data = await this.request('POST', AUTHORIZER_OPTION_URL, {
      data: {
        component_appid: this.client.appId,
        authorizer_appid: appId,
        option_name: optionName
      }
    });

    return data.option_value;
  }

  async setOption(appId, optionName, optionValue) {
    let data = this.request('POST', SET_AUTHORIZER_OPTION_URL, {
      data: {
        component_appid: this.client.appId,
        authorizer_appid: appId,
        option_name: optionName,
        option_value: optionValue
      }
    });

    return data;
  }
}
