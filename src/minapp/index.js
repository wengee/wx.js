'use strict';

const ClientBase = require('../base');

class Client extends ClientBase
{
  constructor ({ appId, appSecret }) {
    super();
    this.appId = appId;
    this.appSecret = appSecret;

    this.services = {};
  }

  service (name) {
    if (this.services[name]) {
      return this.services[name];
    } else {
      let Service = require('./services/' + name);
      if (Service) {
        let s = new Service(this);
        this.services[name] = s;
        return s;
      } else {
        return null;
      }
    }
  }
}

exports = module.exports = Client;
