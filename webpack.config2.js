const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin=require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin=require('optimize-css-assets-webpack-plugin');
module.exports = {
    mode: 'development',
    // devtool: 'eval',
    // entry: './src/index.js', //单入口，打包出来的名字是main
    entry: {//多入口
        index: './src/index.js',
        vendor: ['react','react-dom'],
        // vendor: /node_modules/ //表示把node_modules下的所有模块放到vendor中
    },
    output: {
        path: path.join(__dirname, 'dist'), //输出的目录，只能是绝对目录
        // 哈希就是文件的指纹
        filename: '[name].[contenthash].js',
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 8080,
        host: 'localhost',
        compress: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // loader是一个函数,从右向左，从下向上
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(jpg|png|gif|jpeg|svg)$/,
                // use:'file-loader'
                use: {
                    loader: 'url-loader',
                    options: {
                        //utl内置了file-loader,如果图片效应10k就会转换成base64
                        limit: 2 * 1024,
                        //要把图片拷贝到img目录下
                        outputPath:'img',
                        //需要重写路径
                        publicPath:'/img',
                        esModule:false
                    }
                }
            },
            {
                test:/\.(html|htm)$/,
                // 需要在url-loader中配置esModule为false
                loader:'html-withimg-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', //指定模板文件
            filename: 'index.html',//产出后的文件名
            hash: true, //为了避免缓存，可以在产出的资源后面添加hash值
            chunks: ['vendor','index'], //只有一个的话就是main，这里的顺序决定了html中引入的顺序
            // chunks: ['main'], //只有一个的话就是main
            chunksSortMode: 'manual' // 对引入的代码块排序
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            //name取当前代码块的名字,如果有2个js引入同一个css，
            // 会产生2个内容相同单文件名不同的css文件
            //在filename中指定输出目录
            filename: 'css/[name].[contenthash].css',
            chunkFilename: '[id].css' //异步加载时用
        })
    ],
    optimization: { //这里放着优化的内容
        minimizer: [ //表示放优化的插件
            //要压缩的时候需要把mode改成'production'
            //压缩js，如果mode是'production'下面的可以注释，但是需要
            //配置的话就不要注释了
            new TerserWebpackPlugin({
                parallel:true, //开启多进程并行压缩
                cache: true //开启缓存，会把上次压缩后的结果缓存
            }),
            //压缩css
            new OptimizeCssAssetsWebpackPlugin({
                assetNameRegExp: /\.css$/g, //指定要压缩的模块的正则
                // cssProcessor:require('cssnano')
            })
        ]
    }
};
