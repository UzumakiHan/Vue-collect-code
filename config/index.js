const path = require('path')

const config = {
  alias: {
    '@vant': path.resolve(__dirname, '../src/components/vant-weapp'),
    '@/components': path.resolve(__dirname, '../src/components'),
    '@/config': path.resolve(__dirname, '../src/config'),
    '@/constant': path.resolve(__dirname, '../src/constant'),
    '@/utils': path.resolve(__dirname,'../src/utils'),
    '@/common': path.resolve(__dirname,'../src/common'),
    '@/types': path.resolve(__dirname,'../src/types'),

 },
  projectName: 'collectCode',
  date: '2022-8-24',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {
  },
  copy: {
    patterns: [
      { from: 'src/components/vant-weapp', to: 'dist/components/vant-weapp' },
    ],
    options: {
    }
  },
  framework: 'vue3',
  compiler: 'webpack4',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: [/van-/]
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
  },
  rn: {
    appName: 'taroDemo',
    postcss: {
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
