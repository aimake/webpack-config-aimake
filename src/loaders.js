import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import postcssSelectorNamespace from 'postcss-selector-namespace';
import px2rem from 'postcss-px2rem';
import util from './util';

function getPossConfig(options) {
  const plugins = [];
  if (options.projectType === 'mobile') {
    // 移动端项目需要加入px2rem autoprefixer
    plugins.push(autoprefixer({ browsers: ['ios_saf >= 7', 'android >= 4'] }));
    plugins.push(px2rem({
      remUnit: options.px2rem.remUnit,
      remPrecision: options.px2rem.remPrecision,
      autoRem: options.px2rem.autoRem,
    }));
  }
  if (options.needNameSpace) {
    plugins.push(postcssSelectorNamespace({
      namespace: options.appName === '' ? '' : `.${options.appName}`,
    }));
  }
  return {
    plugins,
  };
}

function getPresets(options) {
  if (options.libType === 'modern') {
    // ES6
    return util.babel('preset', [
      'es2015',
    ]);
  } else if (options.libType === 'react') {
    // React
    return util.babel('preset', [
      'es2015',
      'stage-0',
      'react',
    ]);
  }
  return [];
}

function getCssLoader(options, cssType, postcssConfig) {
  if (process.env.NODE_ENV === 'production' && !(options.cssExtract === false)) {
    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader?minimize', {
        loader: 'postcss-loader',
        options: postcssConfig,
      }, cssType],
    });
  }
  return ['style-loader', 'css-loader', {
    loader: 'postcss-loader',
    options: postcssConfig,
  }, cssType];
}

export default function (options) {
  // postcss
  const postcssConfig = getPossConfig(options);

  const loaders = {
    rules: [{
      test: /\.(png|jpg|gif)$/,
      use: `url-loader?limit=${options.base64ImageLimit}&name=images/[hash].[ext]`,
    }, {
      test: /\.html$/,
      use: 'html-loader',
    }, {
      test: /\.xtpl$/,
      use: 'xtpl-loader',
    }, {
      test: /\.less$/,
      use: getCssLoader(options, 'less-loader', postcssConfig),
    }, {
      test: /\.scss$/,
      use: getCssLoader(options, 'sass-loader', postcssConfig),
    }, {
      test: /\.css$/,
      use: getCssLoader(options, 'sass-loader', postcssConfig),
    }, {
      test: /.(woff(2)?|eot|ttf|svg|otf)(\?[a-z0-9=.]+)?$/,
      use: 'url-loader?limit=100',
    }],
  };

  // 除了正常类型（ES4），其他都需要 babel 编译
  if (options.libType !== 'normal') {
    loaders.rules.push({
      test: /\.jsx?$/,
      loader: 'babel-loader',
      options: {
        presets: getPresets(options),
        compact: false,
        babelrc: options.babelrc,
      },
      exclude: [path.resolve('node_modules'), /node_modules/],
    });
  }
  return loaders;
}
