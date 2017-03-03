'use strict';

class ServiceBase {
  constructor(client) {
    this.client = client;
  }

  request(method, url, options = {}) {
    return this.client.request(method, url, options);
  }
}

exports = module.exports = ServiceBase;