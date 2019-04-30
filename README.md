问题：使用css模块化如何更好的兼容icon字体？  
例如<i class="iconfont">&#xe851;</i>,这里的class需要使用模块化，很麻烦,还得这样写i.className = style.iconfont  

1.devtool的使用  
在development环境下 cheap-module-eval-source-map
载production环境下 cheap-module-source-map
cheap:代表提示只会精确到行，并不会到列
module：会把第三方的loader的错误提示出来
2.tree-shaking  
在development环境下  
optimization: {  
usedExports: true //在development环境下使用tree shaking  
}
还需要在package.json中配置"sideEffects":["@babel/poliy-fill","*.css","*.scss"],表示tree-shaking要忽略的包，这时候打包好的文件中仍然有未引用的代码，
原因是development环境下调试的时候防止删除代码后对调试造成影响，例如source-map。但是会多一条注释。
在production环境下，可以不用写optimization的配置，tree-shaking会完全生效，但是sideEffects还得写
3.使用dynamic-import-webpack插件，就可以使用import()方法,但这是非官方的插件，通过它打包的分割的代码不同使用注释改变文件名，显示的还是0  
4.代码分割， 和webpack无关，webpack代码分割底层使用的SplitChunksPlugin插件  
webpack中实现代码分割有2中方式  
①同步代码：只需要在webpack.common.js中做optimization.splitChunks的配置  
②异步代码（import）：异步代码，无需做任何配置，会自动进行代码分割  
cacheGroups的配置，无论是同步还是异步，都会起作用
如果spliChunks配置的是个{},等同于默认配置
                          splitChunks: {
                               chunks: "async", //配置成async表示只对异步代码生效，initial表示只对同步代码生效，all表示同步和异步的都生效，但是需要下面的
                               cacheGroups配置的结合才能生效，它会检测cacheGroups中的vendors中的test，这个库是不是在node_modules
                               这个目录下，是的话就符合vendors这个组，就会打包出vendors~xxx.js,也可以设置filename来改变文件名
                               
                               
                               minSize: 30000, //表示小于30000个字节，就不会做代码分割，只有大于这个数目才会做分割
                               maxSize: 50000,//一般不配置，50kb,如果配置了，例如lodash是1mb，它会尝试对lodash做第二次分割，看能不能再拆分出20个50kb的代码
                               minChunks: 1,//当一个模块至少用了minChunks次的时候才这个模块进行代码分割
                               maxAsyncRequests: 5,//例如有10个模块，在打包前5个时，它会分割成5个文件，后面的就再不会分割了
                               maxInitialRequests: 3,//入口文件，或者首页引入的文件，最多也只能分割出3个文件
                               automaticNameDelimiter: '~',//文件生成时的连接符，例如vendors~main.js
                               name: true,//使下面的filename的文件名的配置生效
                               cacheGroups: {//在执行这里的配置时，以上的配置都执行完了，但并没有分割，还要根据cacheGroups进行
                                   vendors: {
                                       test: /[\\/]node_modules[\\/]/, //判断是不是在node_modules目录下
                                       priority: -10,//值越大，优先级越高，-10大于-20那么如果一个模块都符合vendors和default，会按照vendors的配置分割代码
                                       filename:'vendors.js'
                                   },
                               default: {
                                       minChunks: 2,
                                       priority: -20,
                                       reuseExistingChunk: true //表示如果某个模块在打包过程中已经被打包了，就复用之前的，不会对这个模块在进行打包，例如index.js里面引入了a.js和b.js,
                                       a.js里面也引入了b.js,这个时候b.js就会复用之前已经被打包的
                                   }
                               }
                           }
                           chunks的默认配置为什么是async,因为异步代码可以提高首屏代码的利用率，所以首屏的加载速度更快
5.webpack打包分析：   
webpack --profile --json > stats.json --config build/webpack.dev.js  
表示把打包过程中的描述放置到stats.json中, https://github.com/webpack/analyse,进入网站后上传stats.json
6.Prefetching和Preloading，在网络空闲时间加载异步交互的代码，例如某个网站的首页，点击登录按钮挑出登录框的代码是不需要首屏加载的，最好是在首屏加载后的空闲时间再去加载
使用魔法注释/*webpackPrefetch: true*/，异步加载click.js,这里就不一定是非得点击后才去加载click.js
和/*webpackPreload: true*/的区别是,webpackPreload会和主业务js文件一起加载，所以使用webpackRrefetch更合适，webpackPrefetch在某些浏览器上有一些兼容性问题需要注意
document.addEventListener('click',()=>{
import(/*webpackPrefetch: true*/,'./click.js').then(()=>{})
})
7.filename和chunkFilename的区别  

entry中的入口文件对应的是output中的filename,间接引用的代码被打包是走的是chunkFilename  
8.css文件代码分割  
使用mini-css-extract-plugin插件， 是否在dev环境下支持hmr，有待确定 
plugins:[
    new MiniCssExtractPlugin({
      filename:'[name].css', //如果css文件被页面直接引用，则打包出来的文件名走这个逻辑
      chunkFilename:'[name].chunk.css',//

    })
  ]  
  mini-css-extract-plugin的底层也是要借助splitChunks的，可以再cacheGroups中配置styles
  optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',  //把样式都打包到styles文件里面去
            test: /\.css$/,  //匹配到css文件
            chunks: 'all',  //同步和异步文件都包括
            enforce: true, //true代表忽略掉一些默认的参数，例如minSize,maxSize,它不会去做检查
          },
        },
      },
    }  
  还可以根据js入口打包,例如   
  entry: {
                     foo: path.resolve(__dirname, 'src/foo'),
                     bar: path.resolve(__dirname, 'src/bar'),
                   },  
  配置了2个入口，那么  
  optimization: {
      splitChunks: {
        cacheGroups: {
          fooStyles: {
            name: 'foo', //被foo所引入的css文件会全部打包进foo样式文件中
            test: (m, c, entry = 'foo') =>
              m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            chunks: 'all',
            enforce: true,
          },
          barStyles: {
            name: 'bar',//被bar所引入的css文件会全部打包进foo样式文件中
            test: (m, c, entry = 'bar') =>
              m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    }  
 9.performance配置，performace:false,如果配置为false，代表不让webpack提示一些性能的问题
 10.webpack与浏览器缓存  
 在pro环境下的output中的filename可以配置成[name].[contenthash].js,只有当文件内容改变时，hash值就会变化，这样浏览器就会获取最新的代码
 在旧版的webpack中可能存在即使内容没改，重新打包后hash也会改变的问题，可以在optimization中配置runtimeChunk  
 optimization:{
  runtimeChunk:{
    name:'runtime'
  }
 }  
 这样打包后会多生成一个runtime.js,原因是，本来主业务逻辑代码和我们使用的库的代码，例如index.js和vendors.js，它们之间是有关联逻辑内置处理的代码  
 叫做manifest,它存在于index.js和vendors.js中，在旧版的打包中，manifest可能会有差异，正是因为差异才导致即使内容没改，重新打包后hash也会改变的问题  
 这样将manifest抽出来就不会存在这样的问题了 
 11.Shimming垫片  
 例如使用jquery，他只能在有引用的模块中使用，在plugins中配置  
 new webpack.ProvidePlugin({
 $:'jquery' //当在代码中使用$时，就会自动导入jquery
 _join:['lodash','join'] //当在代码中使用_join时，就会导入lodash中的join方法，而不会把lodash的代码全部导入
 })  
默认每个模块中的this指向的是模块自身，如果想改成window,那么需要使用imports-loader,  
      ```{
        test: /\.js$/,  
        exclude: /node_modules/,  
        use:[{  
          loader: 'babel-loader'  
        },{  
          loader: 'imports-loader?this=>window'  
        }]  
      }```
12.webpack对库library的打包的配置，在output中配置libraryTarget  
output:{
  path:path.resolve(__dirname,'dist'),
  filename:'library.js',
  libraryTarget:'umd' 
 }   
umd代表的意思是通用的，不管以任何形式引入都能引用的到，commonJs,ES6模块化，AMD模块化都可以引入  
如果想用标签<script src='library.js'></script>，引入全局的library,那么需要加入配置library
output:{
  path:path.resolve(__dirname,'dist'),
  filename:'library.js',
  libraray:'library',
  libraryTarget:'umd' 
 }  
 有时候library和libraryTarget是配合使用的
 libraray:'library'  
 libraryTarget:'this', // 表示就不支持commonJs,ES6模块化，AMD模块化的引入了，会把library挂在全局的this上，如果是node环境下也可以写global  
 
 还有externals的配置，如果library使用了lodash,别人在使用library的同时也使用了lodash就有可能把lodash的代码代码打包了2份，为了避免这样的情况发生  
 可以externals:["lodash"],表示忽略对lodash的打包  
 externals:{
  lodash:{
    root:'_', //表示使用标签引入，把_挂到全局变量上
    commonjs:'lodash' //表示commonjs引入时，名字只能是lodash
  }
 }
 13.库的发布  
 在package.json中配置"main":"./dist/library.js"  
 ①在npm网站上登录npm  
 ②然后在命令行npm adduser  
 ③npm publish 就发布到npm仓库了，名字不能相同  
 14.使用WebpackDevServer实现请求的转发
  例如有一个http请求axios.get('/react/api/header.json')
  
 devServer{
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
              } 
      changeOrigin:true, //突破对origin的限制，例如像爬取别的网站的数据时，说明对origin做了限制
      headers:{//做转发时可以自己变更请求头
         host:'www.fjx.com',
         cookie:'sdfadfa'
      },
      historyApiFallback:true //解决单页应用路由问题，这里也可以配置对象，具体看文档，就是解决页面跳转时让它重新跳到某个指定的页面
    }
  }
 }