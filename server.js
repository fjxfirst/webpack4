const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./build/webpack.dev')
//在node中直接使用webpack
const complier = webpack(config)
const app = express()
app.use(webpackDevMiddleware(complier, {
  publicPath: config.output.publicPath
}))
app.listen(8080, () => {
  console.log('server is running')
})