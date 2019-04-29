const path = require('path')
const webpack=require('webpack')
const merge =require('webpack-merge')
const common =require('./webpack.common')
module.exports = merge(common,{
  mode: 'development',
  devServer: {
    contentBase:'./dist',
    open:true,//自动打开浏览器
    hot:true, //开启hmr
    hotOnly:true //即便hmr没有生效，也不让浏览器自动刷新
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() //使用hmr功能
  ],
  optimization: {
    usedExports: true //在development环境下使用tree shaking
  }
})