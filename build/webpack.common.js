const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const webpack=require('webpack')
module.exports = {
  entry: {
    index: './src/index.js'
  },
  resolve: {
    extensions: ['.js','.jsx']//当引入模块时如果没有带后缀，会自动加上后缀
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use:[{
          loader: 'babel-loader'
        },{
          loader: 'imports-loader?this=>window'
        }]

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

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template:'index.html'
    }),
    new CleanWebpackPlugin({
      root:path.resolve(__dirname,'../')
    }),
    /*new AddAssetHtmlWebpackPlugin({
      filepath:path.resolve(__dirname,'../dll/vendors.dll.js')
    }),
    new webpack.DllReferencePlugin({
      mainfest:path.resolve(__dirname,'../dll/vendors.mainfest.json')
    })*/
  ],
  optimization: {
    usedExports: true, //在development环境下使用tree shaking
    //代码分割
    splitChunks: {
      chunks: "all",//配置成async表示只对异步代码生效，initial表示只对同步代码生效，all表示同步和异步的都生效，但是需要下面的cacheGroups配置的结合才能生效，它会检测cacheGroups中的vendors中的test，这个库是不是在node_modules这个目录下，是的话就符合vendors这个组，就会打包出vendors~xxx.js,也可以设置filename来改变文件名
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, //判断是不是在node_modules目录下
          priority: -10,//值越大，优先级越高，-10大于-20那么如果一个模块都符合vendors和default，会按照vendors的配置分割代码
          filename:'vendors.js'
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true //表示如果某个模块在打包过程中已经被打包了，就复用之前的，不会对这个模块在进行打包，例如index.js里面引入了a.js和b.js,a.js里面也引入了b.js,这个时候b.js就会复用之前已经被打包的
    }
      }
    }
  }
}