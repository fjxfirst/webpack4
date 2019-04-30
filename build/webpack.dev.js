const path = require('path')
const webpack=require('webpack')
const merge =require('webpack-merge')
const common =require('./webpack.common')
module.exports = merge(common,{
  mode: 'development',
  output: {
    // publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  devtool:'cheap-module-eval-source-map',
  devServer: {
    contentBase:'./dist',
    open:true,//自动打开浏览器
    hot:true, //开启hmr
    hotOnly:true //即便hmr没有生效，也不让浏览器自动刷新
  },
  module:{
    rules:[
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, //确保scss文件中引用的其它scss必须通过sass-loader和postcss-loader的加载
              //modules: true //开启css模块化，避免样式冲突
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() //使用hmr功能
  ]
})