/**
 * Created by Lnk on 2016/8/22.
 */
function showProcessWarning() {
    // 捕获未处理的异常
    process.on('uncaughtException', exports.printUncaughtException)
    process.on('unhandledRejection', exports.printUnhandledRejection)
    process.on('warning', exports.printProcessWarning)
}

// 处理错误信息用的路由
/* eslint-disable no-unused-vars */
// noinspection JSUnusedLocalSymbols
exports.router = function router(err, req, res, next) {
    /* eslint-enable no-unused-vars */
    console.error(`path: ${req.path}, message:`, err)

    const body = {
        status: {
            code: 1,
            message: err.message,
        },
    }
    res.send(body)
}

/**
 * 处理未捕获的异常
 * @param {Error} err
 */
exports.printUncaughtException = function printUncaughtException(err) {
    console.error('未捕获的普通异常')
    console.error(err)
}

/**
 * 处理process上监听到的warning
 * @param {Error} err
 */
exports.printProcessWarning = function printProcessWarning(err) {
    console.error('未捕获的警告')
    console.warn(err)
}

/**
 * 处理未捕获的Promise.reject
 * @param {Error} err
 */
exports.printUnhandledRejection = function printUnhandledRejection(err) {
    console.error('未捕获的异步异常')
    console.error(err)
}

showProcessWarning()
