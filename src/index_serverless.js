const {Server} = require('@webserverless/fc-express')
const app = require('./app')

const server = new Server(app)

// http trigger entry
module.exports.handler = function(req, res, context) {
    process.env.HOST = `https://${context.accountId}.${context.region}.fc.aliyuncs.com/2016-08-15/proxy/${context.service.name}/${context.function.name}`
    server.httpProxy(req, res, context)
}