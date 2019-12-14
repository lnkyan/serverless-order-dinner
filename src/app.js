const express = require('express')
const path = require('path')
const {parseBody} = require('./lib/common')
const apiRouter = require('./logic/api_router')
const errorHandler = require('./lib/error_handler')

const app = express()
// 设置静态资源目录
app.use(express.static(path.resolve(__dirname, '../public')))
// 所有api的路由
app.use('/api', parseBody)
app.use('/api', apiRouter)
// 没有找到可路由的api接口，返回404状态
app.use((req, res) => res.sendStatus(404))
// 处理错误信息
app.use(errorHandler.router)

module.exports = app