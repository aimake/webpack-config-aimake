const srcPath = 'src';
const outputPath = 'build';
const pageDir = 'src/views';

export default {
  // 应用名称
  appName: '',
  // 应用是否需要CSS命名空间
  needNameSpace: false,
  // 环境类型 本地(local)、日常(daily)、预发(pre)、线上(prod)
  env: 'local',
  // 框架类型 `nomal modern react vue`
  libType: 'normal',
  // 项目类型 手机(mobile) 电脑(pc)
  projectType: 'pc',
  // 默认将 "src" 作为工作目录
  srcPath,
  // 输出目录
  outputPath,
  // 静态资源路径 本地(local)、日常(daily)、预发(pre)、线上(prod)
  publicPath: {
    local: '',
    daily: '',
    pre: '',
    prod: '',
  },
  // 页面
  pageDir,
  // base64 化图片的最大体积(Byte), 超过此体积的图片不做 base64 转码
  base64ImageLimit: 1000,
  // externals
  externals: [],
  // babelrc
  babelrc: true,
  // source map
  sourceMap: true,
  // imagemin
  imagemin: false,
  // imageUpload
  imageUpload: true,
  // px2rem
  px2rem: {
    remUnit: 75,
    remPrecision: 5,
    autoRem: true,
  },
  target: 'web',
  libraryTarget: 'var',
};
