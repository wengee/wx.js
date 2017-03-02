'use strict';

import ClientBase, { OfficialError } from '../base';

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
      Service = Service.default || Service;
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

export default Client;
