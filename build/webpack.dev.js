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
    hotOnly:true, //即便hmr没有生效，也不让浏览器自动刷新
    proxy:{
      index:'',//如果想要代理根目录，那么index要配成'',下面的'/react/api'代理就可以写成'/'
      '/react/api':{ //当请求匹配到该路径时，会转发到http://www.fjx.com
        target:'http://www.fjx.com',
        secure:false , //如果转发到的是https的网址,这个需要配成false
        pathRewrite:{
          'header.json':'demo.json' //会把url中的header.json替换成demo.json，实际请求的是demo.json的数据
        },
        bypass: function(req, res, proxyOptions) { //表示对代理的拦截，根据函数的返回值为false来跳过代理，或者根据自身需要返回其它的东西保持代理，例如返回html页面
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        },
        changeOrigin:true, //突破对origin的限制，例如像爬取别的网站的数据时，爬取不到，说明对origin做了限制
        headers:{//做转发时可以自己变更请求头
          host:'www.fjx.com',
          cookie:'sdfadfa'
        },
        historyApiFallback:true //解决单页应用路由问题，这里也可以配置对象，具体看文档，就是解决页面跳转时让它重新跳到某个指定的页面
      }
    }
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