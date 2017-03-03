'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const _ = require('lodash');
const ServiceBase = require('./index');

const MESSAGE_URL = 'https://api.weixin.qq.com/cgi-bin/message/custom/send';
const MSG_TYPES = ['text', 'image', 'voice', 'video', 'music', 'news', 'mpnews', 'wxcard'];

class Message extends ServiceBase {
  send(msgType, openId, data) {
    var _this = this;

    return _asyncToGenerator(function* () {
      msgType = msgType.toLowerCase();
      if (MSG_TYPES.indexOf(msgType) === -1) return false;

      switch (msgType) {
        case 'text':
          data = _.isPlainObject(data) ? data : { content: String(data) };
          break;

        case 'image':
        case 'voice':
        case 'video':
          data = _.isPlainObject(data) ? data : { media_id: String(data) };
          break;

        case 'news':
        case 'mpnews':
          if (_.isPlainObject(data)) {
            data = data.articles ? data : { articles: data };
          } else if (msgType === 'mpnews') {
            data = { media_id: String(data) };
          }
          break;
      }

      let postData = {
        touser: openId,
        msgtype: msgType
      };
      postData[msgType] = data;

      return yield _this.request('POST', MESSAGE_URL, { data: postData });
    })();
  }
}

MSG_TYPES.forEach(value => {
  let method = 'send' + value[0].toUpperCase() + value.substr(1);
  Message.prototype[method] = function (...args) {
    args = [value].concat(args);
    return this.send(...args);
  };
});

exports = module.exports = Message;