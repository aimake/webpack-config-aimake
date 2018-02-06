'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (customConfig) {
  // 合并用户配置
  var options = _lodash2.default.defaults(customConfig || {}, _config2.default);

  if (!options.entry) {
    // 获取默认入口
    var entries = getEntries(options);
    options.entry = entries.entry;
    options.entryHtml = entries.entryHtml;
  }

  var webpackConfig = {
    entry: options.entry,
    target: options.target,
    output: {
      path: _path2.default.join(process.cwd(), options.outputPath),
      filename: '[name].js',
      publicPath: getPublicPath(options),
      libraryTarget: options.libraryTarget
    },
    resolve: {
      modules: [_path2.default.join(__dirname, '..', 'node_modules'), 'node_modules']
    },
    resolveLoader: {
      modules: [_path2.default.join(__dirname, '..', 'node_modules'), 'node_modules']
    },
    module: (0, _loaders2.default)(options),
    plugins: (0, _plugins2.default)(options),
    devServer: {
      host: '0.0.0.0'
    }
  };

  return webpackConfig;
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _loaders = require('./loaders');

var _loaders2 = _interopRequireDefault(_loaders);

var _plugins = require('./plugins');

var _plugins2 = _interopRequireDefault(_plugins);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPublicPath(options) {
  if (options.baseUrl) {
    return options.baseUrl;
  }
  return options.publicPath[options.env] || '';
}

// 获取默认入口
// 约定/src/views/[page]/package.json中的main字段为页面的入口文件，同目录上存在与入口文件同名的html
function getEntries(options) {
  var viewsDir = _path2.default.join(process.cwd(), options.pageDir || './src/views');
  var entryFiles = _glob2.default.sync(viewsDir + '/**/package.json');
  var entry = {};
  var entryHtml = [];

  entryFiles.forEach(function (_filePath) {
    var pkgJson = void 0;
    var filePath = _filePath;
    try {
      pkgJson = require(filePath);
    } catch (e) {
      console.log(_chalk2.default.red('获取入口文件失败'));
      process.exit(0);
    }
    var main = pkgJson.main;
    filePath = _path2.default.resolve(_path2.default.join(_path2.default.dirname(filePath), main));
    var filename = _path2.default.basename(filePath, _path2.default.extname(filePath));
    entry[filename] = filePath;
    entryHtml.push(_path2.default.resolve(_path2.default.join(_path2.default.dirname(filePath), filename + '.html')));
  });
  return {
    entry: entry,
    entryHtml: entryHtml
  };
}

module.exports = exports['default'];