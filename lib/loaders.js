'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  // postcss
  var postcssConfig = getPossConfig(options);

  var loaders = {
    rules: [{
      test: /\.(png|jpg|gif)$/,
      use: 'url-loader?limit=' + options.base64ImageLimit + '&name=images/[hash].[ext]'
    }, {
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.xtpl$/,
      use: 'xtpl-loader'
    }, {
      test: /\.less$/,
      use: getCssLoader(options, 'less-loader', postcssConfig)
    }, {
      test: /\.scss$/,
      use: getCssLoader(options, 'sass-loader', postcssConfig)
    }, {
      test: /\.css$/,
      use: getCssLoader(options, 'sass-loader', postcssConfig)
    }, {
      test: /.(woff(2)?|eot|ttf|svg|otf)(\?[a-z0-9=.]+)?$/,
      use: 'url-loader?limit=100'
    }]
  };

  // 除了正常类型（ES4），其他都需要 babel 编译
  if (options.libType !== 'normal') {
    loaders.rules.push({
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        presets: getPresets(options),
        compact: false,
        babelrc: options.babelrc
      },
      exclude: [_path2.default.resolve('node_modules'), /node_modules/]
    });
  }
  return loaders;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _postcssSelectorNamespace = require('postcss-selector-namespace');

var _postcssSelectorNamespace2 = _interopRequireDefault(_postcssSelectorNamespace);

var _postcssPx2rem = require('postcss-px2rem');

var _postcssPx2rem2 = _interopRequireDefault(_postcssPx2rem);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPossConfig(options) {
  var plugins = [];
  if (options.projectType === 'mobile') {
    // 移动端项目需要加入px2rem autoprefixer
    plugins.push((0, _autoprefixer2.default)({ browsers: ['ios_saf >= 7', 'android >= 4'] }));
    plugins.push((0, _postcssPx2rem2.default)({
      remUnit: options.px2rem.remUnit,
      remPrecision: options.px2rem.remPrecision,
      autoRem: options.px2rem.autoRem
    }));
  }
  if (options.needNameSpace) {
    plugins.push((0, _postcssSelectorNamespace2.default)({
      namespace: options.appName === '' ? '' : '.' + options.appName
    }));
  }
  return {
    plugins: plugins
  };
}

function getPresets(options) {
  if (options.libType === 'modern') {
    // ES6
    return _util2.default.babel('preset', ['es2015']);
  } else if (options.libType === 'react') {
    // React
    return _util2.default.babel('preset', ['es2015', 'stage-0', 'react']);
  }
  return [];
}

function getCssLoader(options, cssType, postcssConfig) {
  if (process.env.NODE_ENV === 'production' && !(options.cssExtract === false)) {
    return _extractTextWebpackPlugin2.default.extract({
      fallback: 'style-loader',
      use: ['css-loader?minimize', {
        loader: 'postcss-loader',
        options: postcssConfig
      }, cssType]
    });
  }
  return ['style-loader', 'css-loader', {
    loader: 'postcss-loader',
    options: postcssConfig
  }, cssType];
}

module.exports = exports['default'];