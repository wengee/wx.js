'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class ServiceBase {
  constructor(client) {
    this.client = client;
  }

  request(method, url, options = {}) {
    return this.client.request(method, url, options);
  }
}

exports.default = ServiceBase;