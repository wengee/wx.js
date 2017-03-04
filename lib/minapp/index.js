'use strict';

const ClientBase = require('../base');

class Client extends ClientBase {
  constructor({ appId, appSecret }) {
    super();
    this.appId = appId;
    this.appSecret = appSecret;

    this.services = {};
  }

  service(name) {
    if (!this.services[name]) {
      let Service = require('./services/' + name);
      if (Service) {
        this.services[name] = new Service(this);
      }
    }

    return this.services[name];
  }
}

exports = module.exports = Client;