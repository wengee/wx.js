'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ServiceBase = require('./index');

const CREATE_URL = 'https://api.weixin.qq.com/cgi-bin/tags/create';
const GET_URL = 'https://api.weixin.qq.com/cgi-bin/tags/get';
const UPDATE_URL = 'https://api.weixin.qq.com/cgi-bin/tags/update';
const DELETE_URL = 'https://api.weixin.qq.com/cgi-bin/tags/delete';
const GET_USERS_URL = 'https://api.weixin.qq.com/cgi-bin/user/tag/get';
const BATCH_TAGGING_URL = 'https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging';
const BATCH_UNTAGGING_URL = 'https://api.weixin.qq.com/cgi-bin/tags/members/batchuntagging';
const GETID_URL = 'https://api.weixin.qq.com/cgi-bin/tags/getidlist';

class Tag extends ServiceBase {
  create(tagName) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = yield _this.request('POST', CREATE_URL, {
        data: {
          tag: {
            name: tagName
          }
        }
      });

      return data.tag;
    })();
  }

  list() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this2.request('POST', GET_URL);
      return data.tags;
    })();
  }

  update(tagId, tagName) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this3.request('POST', UPDATE_URL, {
        data: {
          tag: { id: tagId, name: tagName }
        }
      });

      return !data.errcode;
    })();
  }

  del(tagId) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this4.request('POST', DELETE_URL, {
        data: {
          tag: { id: tagId }
        }
      });

      return !data.errcode;
    })();
  }

  get(openId) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this5.request('POST', GETID_URL, {
        data: {
          openid: openId
        }
      });

      return data.tagid_list;
    })();
  }

  getUsers(tagId, nextOpenId = null) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this6.request('POST', GET_USERS_URL, {
        data: {
          tagid: tagId,
          next_openid: nextOpenId
        }
      });

      return data;
    })();
  }

  tagging(openIds, tagId) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      if (!Array.isArray(openIds)) return false;

      let data = yield _this7.request('POST', BATCH_TAGGING_URL, {
        data: {
          openid_list: openIds,
          tagid: tagId
        }
      });

      return !data.errcode;
    })();
  }

  untagging(openIds, tagId) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      if (!Array.isArray(openIds)) return false;

      let data = yield _this8.request('POST', BATCH_UNTAGGING_URL, {
        data: {
          openid_list: openIds,
          tagid: tagId
        }
      });

      return !data.errcode;
    })();
  }
}

exports = module.exports = Tag;