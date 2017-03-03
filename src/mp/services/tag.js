'use strict';

const ServiceBase = require('./index');

const CREATE_URL = 'https://api.weixin.qq.com/cgi-bin/tags/create';
const GET_URL = 'https://api.weixin.qq.com/cgi-bin/tags/get';
const UPDATE_URL = 'https://api.weixin.qq.com/cgi-bin/tags/update';
const DELETE_URL = 'https://api.weixin.qq.com/cgi-bin/tags/delete';
const GET_USERS_URL = 'https://api.weixin.qq.com/cgi-bin/user/tag/get';
const BATCH_TAGGING_URL = 'https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging';
const BATCH_UNTAGGING_URL = 'https://api.weixin.qq.com/cgi-bin/tags/members/batchuntagging';
const GETID_URL = 'https://api.weixin.qq.com/cgi-bin/tags/getidlist';

class Tag extends ServiceBase
{
  async create (tagName) {
    let data = await this.request('POST', CREATE_URL, {
      data: {
        tag: {
          name: tagName
        }
      }
    });

    return data.tag;
  }

  async list () {
    let data = await this.request('POST', GET_URL);
    return data.tags;
  }

  async update (tagId, tagName) {
    let data = await this.request('POST', UPDATE_URL, {
      data: {
        tag: { id: tagId, name: tagName }
      }
    });

    return !data.errcode;
  }

  async del (tagId) {
    let data = await this.request('POST', DELETE_URL, {
      data: {
        tag: { id: tagId }
      }
    });

    return !data.errcode;
  }

  async fetch (openId) {
    let data = await this.request('POST', GETID_URL, {
      data: {
        openid: openId
      }
    });

    return data.tagid_list;
  }

  async getUsers (tagId, nextOpenId = null) {
    let data = await this.request('POST', GET_USERS_URL, {
      data: {
        tagid: tagId,
        next_openid: nextOpenId
      }
    });

    return data;
  }

  async tagging (openIds, tagId) {
    if (!Array.isArray(openIds)) return false;

    let data = await this.request('POST', BATCH_TAGGING_URL, {
      data: {
        openid_list: openIds,
        tagid: tagId
      }
    });

    return !data.errcode;
  }

  async untagging (openIds, tagId) {
    if (!Array.isArray(openIds)) return false;

    let data = await this.request('POST', BATCH_UNTAGGING_URL, {
      data: {
        openid_list: openIds,
        tagid: tagId
      }
    });

    return !data.errcode;
  }
}

exports = module.exports = Tag;
