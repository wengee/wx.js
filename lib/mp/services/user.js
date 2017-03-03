'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ServiceBase = require('./index');

const REMARK_URL = 'https://api.weixin.qq.com/cgi-bin/user/info/updateremark';
const USERINFO_URL = 'https://api.weixin.qq.com/cgi-bin/user/info';
const BATCHGET_URL = 'https://api.weixin.qq.com/cgi-bin/user/info/batchget';
const LIST_URL = 'https://api.weixin.qq.com/cgi-bin/user/get';

class User extends ServiceBase {
  remark(openId, remark) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let data = _this.request('POST', REMARK_URL, {
        data: {
          openid: openId,
          remark
        }
      });

      return data.errcode === 0;
    })();
  }

  fetch(openId, lang = 'zh_CN') {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return yield _this2.request('GET', USERINFO_URL, {
        data: {
          openid: openId,
          lang
        }
      });
    })();
  }

  batchGet(openIds, lang = 'zh_CN') {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (!Array.isArray(openIds)) return false;

      let userList = [];
      openIds.forEach(function (user) {
        if (Object.prototype.toString.call(user) === '[object Object]') {
          userList.push(user);
        } else {
          userList.push({
            openid: user,
            lang
          });
        }
      });

      let data = _this3.request('POST', BATCHGET_URL, {
        data: {
          user_list: userList
        }
      });

      return data.user_info_list;
    })();
  }

  list(nextOpenId) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return yield _this4.request('GET', LIST_URL, {
        data: {
          next_openid: nextOpenId
        }
      });
    })();
  }
}

exports = module.exports = User;