import _ from 'lodash';
import path from 'path';
import glob from 'glob';
import chalk from 'chalk';
import loaders from './loaders';
import plugins from './plugins';
import defaultConfig from './config';

function getPublicPath(options) {
  if (options.baseUrl) {
    return options.baseUrl;
  }
  return options.publicPath[options.env] || '';
}

// 获取默认入口
// 约定/src/views/[page]/package.json中的main字段为页面的入口文件，同目录上存在与入口文件同名的html
function getEntries(options) {
  const viewsDir = path.join(process.cwd(), options.pageDir || './src/views');
  const entryFiles = glob.sync(`${viewsDir}/**/package.json`);
  const entry = {};
  const entryHtml = [];

  entryFiles.forEach((_filePath) => {
    let pkgJson;
    let filePath = _filePath;
    try {
      pkgJson = require(filePath);
    } catch (e) {
      console.log(chalk.red('获取入口文件失败'));
      process.exit(0);
    }
    const main = pkgJson.main;
    filePath = path.resolve(path.join(path.dirname(filePath), main));
    const filename = path.basename(filePath, path.extname(filePath));
    entry[filename] = filePath;
    entryHtml.push(path.resolve(path.join(path.dirname(filePath), `${filename}.html`)));
  });
  return {
    entry,
    entryHtml,
  };
}

export default function (customConfig) {
  // 合并用户配置
  const options = _.defaults(customConfig || {}, defaultConfig);

  if (!options.entry) {
    // 获取默认入口
    const entries = getEntries(options);
    options.entry = entries.entry;
    options.entryHtml = entries.entryHtml;
  }

  const webpackConfig = {
    entry: options.entry,
    target: options.target,
    output: {
      path: path.join(process.cwd(), options.outputPath),
      filename: '[name].js',
      publicPath: getPublicPath(options),
      libraryTarget: options.libraryTarget,
    },
    resolve: {
      modules: [path.join(__dirname, '..', 'node_modules'), 'node_modules'],
    },
    resolveLoader: {
      modules: [path.join(__dirname, '..', 'node_modules'), 'node_modules'],
    },
    module: loaders(options),
    plugins: plugins(options),
    devServer: {
      host: '0.0.0.0',
    },
  };

  return webpackConfig;
}
