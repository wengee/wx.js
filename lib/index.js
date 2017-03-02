'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MinappClient = exports.MpClient = exports.OfficialError = undefined;

var _base = require('./base');

var _mp = require('./mp');

var _mp2 = _interopRequireDefault(_mp);

var _minapp = require('./minapp');

var _minapp2 = _interopRequireDefault(_minapp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.OfficialError = _base.OfficialError;
exports.MpClient = _mp2.default;
exports.MinappClient = _minapp2.default;