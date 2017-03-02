'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OfficialError = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _urllib = require('urllib');

var _urllib2 = _interopRequireDefault(_urllib);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OfficialError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

class ClientBase {
  async request(method, url, options = {}) {
    options.query = options.query || {};
    if (this.accessToken && !options.accessToken && options.accessToken !== false) {
      options.query.access_token = await this.accessToken();
    }

    if (!_lodash2.default.isEmpty(options.query)) {
      url = url + (url.indexOf('?') === -1 ? '?' : '&') + _queryString2.default.stringify(options.query);
    }

    let res;
    try {
      res = await _urllib2.default.request(url, {
        method,
        data: options.data || {},
        dataType: options.dataType || 'json',
        contentType: options.contentType || 'json'
      });
      (0, _assert2.default)(res.status === 200, 'Could not connect to api server.');
    } catch (e) {
      throw new OfficialError(-1, e.message);
    }

    if (!options.dataType || options.dataType.toUpperCase() === 'JSON') {
      if (res.data && res.data.errcode) throw new OfficialError(res.data.errcode, res.data.errmsg);
    }

    return res.data;
  }
}

exports.default = ClientBase;
exports.OfficialError = OfficialError;