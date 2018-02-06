import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import util from './util';

function setEntryHtmlPlugin(_options, _plugins) {
  const options = _options;
  const plugins = _plugins;
  if (typeof options.entryHtml === 'object' && !options.entryHtml.length) {
    Object.keys(options.entryHtml).forEach((key) => {
      const htmlOptions = options.entryHtml[key];
      plugins.push(new HtmlWebpackPlugin({
        template: key,
        filename: htmlOptions.filename || path.basename(key),
        inject: htmlOptions.inject || true,
        chunks: htmlOptions.chunks || 'all',
        minify: htmlOptions.minify || false,
      }));
    });
    return;
  }
  if (typeof options.entryHtml === 'string') {
    options.entryHtml = [options.entryHtml];
  }
  const entries = util.entryChunks(options.entry);
  if (entries.length >= options.entryHtml.length) {
    const len = options.entryHtml.length;
    for (let i = 0; i < len; i += 1) {
      plugins.push(new HtmlWebpackPlugin({
        template: options.entryHtml[i],
        filename: path.basename(options.entryHtml[i]),
        inject: true,
        chunks: entries[i],
        minify: false,
      }));
    }
  }
}

export default function (options) {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ];
  if (options.entryHtml) {
    setEntryHtmlPlugin(options, plugins);
  }
  if (options.sourceMap) {
    plugins.push(new webpack.SourceMapDevToolPlugin({
      module: true,
    }));
  }
  if (process.env.NODE_ENV === 'production') {
    if (!(options.cssExtract === false)) {
      plugins.push(new ExtractTextPlugin({
        disable: false,
        allChunks: true,
        filename: '[name].css',
      }));
    }
    if (!(options.buildCompress === false)) {
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true,
        },
        minimize: true,
        sourceMap: true,
      }));
    }
  }
  return plugins;
}
