'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ServiceBase = require('./index');

const CREATE_URL = 'https://api.weixin.qq.com/cgi-bin/groups/create';
const GET_URL = 'https://api.weixin.qq.com/cgi-bin/groups/get';
const GETID_URL = 'https://api.weixin.qq.com/cgi-bin/groups/getid';
const UPDATE_URL = 'https://api.weixin.qq.com/cgi-bin/groups/update';
const UPDATE_MEMBER_URL = 'https://api.weixin.qq.com/cgi-bin/groups/members/update';
const BATCHUPDATE_MEMBER_URL = 'https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate';
const DELETE_URL = 'https://api.weixin.qq.com/cgi-bin/groups/delete';

class Group extends ServiceBase {
  create(groupName) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = yield _this.request('POST', CREATE_URL, {
        data: {
          group: {
            name: groupName
          }
        }
      });

      return data.group;
    })();
  }

  list() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this2.request('POST', GET_URL);
      return data.groups;
    })();
  }

  get(openId) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this3.request('POST', GETID_URL, {
        data: {
          openid: openId
        }
      });

      return data.groupid;
    })();
  }

  update(groupId, groupName) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this4.request('POST', UPDATE_URL, {
        data: {
          group: { id: groupId, name: groupName }
        }
      });

      return !data.errcode;
    })();
  }

  updateUser(openId, groupId) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this5.request('POST', UPDATE_MEMBER_URL, {
        data: {
          openid: openId,
          to_groupid: groupId
        }
      });

      return !data.errcode;
    })();
  }

  updateUsers(openIds, groupId) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      if (!Array.isArray(openIds)) return false;

      let data = yield _this6.request('POST', BATCHUPDATE_MEMBER_URL, {
        data: {
          openid_list: openIds,
          to_groupid: groupId
        }
      });

      return !data.errcode;
    })();
  }

  del(groupId) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      let data = yield _this7.request('POST', DELETE_URL, {
        data: {
          group: { id: groupId }
        }
      });

      return !data.errcode;
    })();
  }
}

exports = module.exports = Group;