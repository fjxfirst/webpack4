const path=require('path')
const webpack=require('webpack')
module.exports={
  mode:"production",
  entry:{
    vendors:['react','react-dom','lodash']
  },
  output: {
    filename: '[name].dll.js',
    path:path.resolve(__dirname,'../dll'),
    library: '[name]'
  },
  plugin:[ //使用DllPlugin插件来分析这个库，把映射关系放入json文件中
    new webpack.DllPlugin({
      name:'[name]',
      path: path.join(__dirname, '../dll/[name].manifest.json')
    })
  ]
}