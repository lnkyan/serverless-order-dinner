const app = require('./app')

const port = process.env.PORT || 29400
process.env.HOST = `http://127.0.0.1:${port}`

app.listen(port, (error) => {
    if (error) {
        console.error(error)
    } else {
        console.log(`\x1b[34m监听端口:${port} 访问地址:http://127.0.0.1:${port}\x1b[0m`)
    }
})