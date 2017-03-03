'use strict';

const ServiceBase = require('./index');

const CREATE_URL = 'https://api.weixin.qq.com/cgi-bin/groups/create';
const GET_URL = 'https://api.weixin.qq.com/cgi-bin/groups/get';
const GETID_URL = 'https://api.weixin.qq.com/cgi-bin/groups/getid';
const UPDATE_URL = 'https://api.weixin.qq.com/cgi-bin/groups/update';
const UPDATE_MEMBER_URL = 'https://api.weixin.qq.com/cgi-bin/groups/members/update';
const BATCHUPDATE_MEMBER_URL = 'https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate';
const DELETE_URL = 'https://api.weixin.qq.com/cgi-bin/groups/delete';

class Group extends ServiceBase
{
  async create (groupName) {
    let data = await this.request('POST', CREATE_URL, {
      data: {
        group: {
          name: groupName
        }
      }
    });

    return data.group;
  }

  async list () {
    let data = await this.request('POST', GET_URL);
    return data.groups;
  }

  async get (openId) {
    let data = await this.request('POST', GETID_URL, {
      data: {
        openid: openId
      }
    });

    return data.groupid;
  }

  async update (groupId, groupName) {
    let data = await this.request('POST', UPDATE_URL, {
      data: {
        group: { id: groupId, name: groupName }
      }
    });

    return !data.errcode;
  }

  async updateUser (openId, groupId) {
    let data = await this.request('POST', UPDATE_MEMBER_URL, {
      data: {
        openid: openId,
        to_groupid: groupId
      }
    });

    return !data.errcode;
  }

  async updateUsers (openIds, groupId) {
    if (!Array.isArray(openIds)) return false;

    let data = await this.request('POST', BATCHUPDATE_MEMBER_URL, {
      data: {
        openid_list: openIds,
        to_groupid: groupId
      }
    });

    return !data.errcode;
  }

  async del (groupId) {
    let data = await this.request('POST', DELETE_URL, {
      data: {
        group: { id: groupId }
      }
    });

    return !data.errcode;
  }
}

exports = module.exports = Group;
