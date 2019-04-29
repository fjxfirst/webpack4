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