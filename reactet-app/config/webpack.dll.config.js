const path = require('path');
const webpack = require('webpack');
module.exports = {
  // 你想要打包的模块的数组
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-router-dom',
      'axios',
      'mobx',
      'mobx-react'
    ]
  },
  output: {
    path: path.join(__dirname, '../build/dll'), // 打包后文件输出的位置
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_library'
    // vendor.dll.js中暴露出的全局变量名。
    // 主要是给DllPlugin中的name使用，
    // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../build/dll', '[name]-manifest.json'),
      name: '[name]_library',
      context: __dirname
    })
  ]
};
