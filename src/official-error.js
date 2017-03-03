'use strict';

class OfficialError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

exports = module.exports = OfficialError;
