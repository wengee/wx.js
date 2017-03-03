'use strict';

const crypto = require('crypto');

class WXAuthCrypt {
  constructor(appId, sessionKey) {
    this.appId = appId;
    this.sessionKey = sessionKey;
  }

  decrypt(encryptedData, iv) {
    let sessionKey = new Buffer(this.sessionKey, 'base64');
    encryptedData = new Buffer(encryptedData, 'base64');
    iv = new Buffer(iv, 'base64');

    try {
      let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
      decipher.setAutoPadding(true);
      let decoded = decipher.update(encryptedData, 'binary', 'utf8');
      decoded += decipher.final('utf8');
      decoded = JSON.parse(decoded);

      if (decoded.watermark.appid != this.appId) {
        throw new Error('Illegal Buffer');
      }

      return decoded;
    } catch (e) {
      throw new Error('Illegal Buffer');
    }
  }
}

exports = module.exports = WXAuthCrypt;