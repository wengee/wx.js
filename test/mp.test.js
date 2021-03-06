'use strict';

const expect = require('expect.js');
const { MpClient } = require('../lib');
const config = require('./config');

const client = new MpClient(config.mp);

describe('MpClient', function () {
  it('getAccessToken()', function () {
    return client.getAccessToken().then(function (token) {
      expect(token).to.have.keys('accessToken', 'expiresIn');
    }, function (err) {
      expect(err).not.to.be.ok();
    });
  });

  it('user.list()', function () {
    return client.service('user').list().then(function (res) {
      expect(res).to.have.keys('total', 'count', 'data');
    }, function (err) {
      expect(err).not.to.be.ok();
    });
  })
});
