const anyBody = require('body/any')

/**
 * 封装回包，捕获异常
 * @param {Function} logic 普通的路由函数，但只需要把返回的json数据return出来即可，不必再使用res
 * @return {Function} 封装后的路由函数
 */
module.exports.handlerRsp = function(logic) {
    return async (req, res, next) => {
        // console.log(req.url)
        // console.log(req.clientIP)
        try {
            const result = await logic(req, res, next)
            const body = {
                data: result,
                status: {
                    code: 0,
                },
            }
            res.send(body)
        } catch (e) {
            next(e)
        }
    }
}

/**
 * 解析post请求的body
 */
module.exports.parseBody = function(req, res, next) {
    if (!req.headers['content-type']) {
        next()
        return
    }

    anyBody(req, res, (err, body) => {
        if (err) {
            next(err)
        } else {
            req.body = body
            next()
        }
    })
}

/**
 * 通用检查参数是否存在方法
 * @param {object} paramsObj
 */
module.exports.checkParamsExist = function checkParamsExist(paramsObj) {
    const errMsg = Object.entries(paramsObj)
        .filter(([, value]) => !value || typeof value === 'undefined' || value === 'undefined')
        .map(([key, value]) => `${key}=${value}`)
        .join(', ')
    if (errMsg) {
        throw new Error(`参数${errMsg}`)
    }
}