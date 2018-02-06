'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = {
  // make babel plugin/preset absolute path
  babel: function babel(type, name) {
    if (Array.isArray(name)) {
      return name.map(function (n) {
        return util.babel(type, n);
      });
    } else if ((typeof name === 'undefined' ? 'undefined' : (0, _typeof3.default)(name)) === 'object') {
      return [require.resolve(['babel', type, name.name].join('-')), name.options];
    }
    return require.resolve(['babel', type, name].join('-'));
  },
  entryChunks: function entryChunks(entry) {
    if (Array.isArray(entry)) {
      // entry: ['a.js', 'b.js']
      return entry;
    }
    if (typeof entry === 'string') {
      // entry: 'a.js'
      return [entry];
    } else if (_lodash2.default.isPlainObject(entry)) {
      // entry: {bundle1: 'a.js', bundle2: ['a.js', 'b.js']}
      var result = [];
      (0, _keys2.default)(entry).forEach(function (key) {
        result.push([key]);
      });
      return result;
    }
    return [];
  }
};

exports.default = util;
module.exports = exports['default'];