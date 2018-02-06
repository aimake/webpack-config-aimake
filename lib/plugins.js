'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = function (options) {
  var plugins = [new _webpack2.default.DefinePlugin({
    'process.env': {
      NODE_ENV: (0, _stringify2.default)(process.env.NODE_ENV)
    }
  })];
  if (options.entryHtml) {
    setEntryHtmlPlugin(options, plugins);
  }
  if (options.sourceMap) {
    plugins.push(new _webpack2.default.SourceMapDevToolPlugin({
      module: true
    }));
  }
  if (process.env.NODE_ENV === 'production') {
    if (!(options.cssExtract === false)) {
      plugins.push(new _extractTextWebpackPlugin2.default({
        disable: false,
        allChunks: true,
        filename: '[name].css'
      }));
    }
    if (!(options.buildCompress === false)) {
      plugins.push(new _webpack2.default.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        },
        minimize: true,
        sourceMap: true
      }));
    }
  }
  return plugins;
};

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setEntryHtmlPlugin(_options, _plugins) {
  var options = _options;
  var plugins = _plugins;
  if ((0, _typeof3.default)(options.entryHtml) === 'object' && !options.entryHtml.length) {
    (0, _keys2.default)(options.entryHtml).forEach(function (key) {
      var htmlOptions = options.entryHtml[key];
      plugins.push(new _htmlWebpackPlugin2.default({
        template: key,
        filename: htmlOptions.filename || _path2.default.basename(key),
        inject: htmlOptions.inject || true,
        chunks: htmlOptions.chunks || 'all',
        minify: htmlOptions.minify || false
      }));
    });
    return;
  }
  if (typeof options.entryHtml === 'string') {
    options.entryHtml = [options.entryHtml];
  }
  var entries = _util2.default.entryChunks(options.entry);
  if (entries.length >= options.entryHtml.length) {
    var len = options.entryHtml.length;
    for (var i = 0; i < len; i += 1) {
      plugins.push(new _htmlWebpackPlugin2.default({
        template: options.entryHtml[i],
        filename: _path2.default.basename(options.entryHtml[i]),
        inject: true,
        chunks: entries[i],
        minify: false
      }));
    }
  }
}

module.exports = exports['default'];