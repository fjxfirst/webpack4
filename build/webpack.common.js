const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    // publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
        /*options: {
          //这里的配置可以放在.babelrc中
          presets:[['@babel/preset-env',{
            targets:{
              chrome:'67'
            }
            useBuiltIns:'usage' //根据业务代码添加对应的polyfill
          }]]

        }*/
      },
      {
        test: /\.jpg|png|jepg|gif|svg$/,
        use: {
          loader: 'url-loader',//url-loader的使用必须安装file-loader
          options: {
            limit: 7168 //单位是字节，1024代表1kb,小于改值的图片会被转为base64编码
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      },
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
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(),
  ]
}