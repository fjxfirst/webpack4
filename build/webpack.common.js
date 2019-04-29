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
    new CleanWebpackPlugin({
      root:path.resolve(__dirname,'../')
    }),
  ],
  optimization: {
    //代码分割
    splitChunks: {
      chunks: "async",//配置成async表示只对异步代码生效，initial表示只对同步代码生效，all表示同步和异步的都生效，但是需要下面的cacheGroups配置的结合才能生效，它会检测cacheGroups中的vendors中的test，这个库是不是在node_modules这个目录下，是的话就符合vendors这个组，就会打包出vendors~xxx.js,也可以设置filename来改变文件名
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: false,
        default: false
      }
    }
  }
}