问题：使用css模块化如何更好的兼容icon字体？
例如<i class="iconfont">&#xe851;</i>,这里的class需要使用模块化，很麻烦,还得这样写i.className = style.iconfont

1.devtool的使用
在development环境下 cheap-module-eval-source-map
载production环境下 cheap-module-source-map
cheap:代表提示只会精确到行，并不会到列
module：会把第三方的loader的错误提示出来
