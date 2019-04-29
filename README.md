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
和/*webpackPreload: true*/的区别是
document.addEventListener('click',()=>{
import(/*webpackPrefetch: true*/,'./click.js').then(()=>{})
})
