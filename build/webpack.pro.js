const path =require('path')
const merge =require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') //css代码分割
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')//css代码压缩
const common =require('./webpack.common')
module.exports =merge(common,{
  mode: 'production',
  output: {
    // publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js'
  },
  devtool:'cheap-module-source-map',
  module:{
    rules:[
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },

  plugins:[
    new MiniCssExtractPlugin({
      filename:'[name].css', //如果css文件被页面直接引用，则打包出来的文件名走这个逻辑
      chunkFilename:'[name].chunk.css',//

    })
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  }
})