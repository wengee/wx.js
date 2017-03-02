'use strict';

const _ = require('lodash');
const urllib = require('urllib');
const assert = require('assert');
const qs = require('query-string');

class OfficialError extends Error
{
  constructor (code, message) {
    super(message);
    this.code = code;
  }
}

class ClientBase
{
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
}

exports = module.exports = ClientBase;
exports.OfficialError = OfficialError;
