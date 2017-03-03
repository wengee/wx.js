'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');
const urllib = require('urllib');
const assert = require('assert');
const qs = require('query-string');
const OfficialError = require('./official-error');

class ClientBase {
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
}

exports = module.exports = ClientBase;