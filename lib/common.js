const getRawBody = require('raw-body')

/**
 * 获取存储每日预定信息的文件名
 * @return {string}
 */
module.exports.getOrderFileName = function() {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    return `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`
}

/**
 * 解析post请求的body
 * 注意必须同步调用，不能异步，也不能放在某个await后面，否则不会回调。搞不懂
 * @param req
 * @return {Promise}
 */
module.exports.parseBody = function(req) {
    return new Promise((resolve, reject) => {
        getRawBody(req, (err, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(body)
            }
        })
    })
}