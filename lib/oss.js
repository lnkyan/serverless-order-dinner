let OSS = require('ali-oss')
OSS = OSS.Wrapper || OSS
// 服务器端的版本必须取Wrapper，否则不返回promise

let client

function getOssClient() {
    if (!client) {
        let config
        try {
            config = require('./config.js')
        } catch (e) {
            console.error('You need rename config.sample.js to config.js')
            throw e
        }
        client = new OSS({
            region: config.OSS_REGION,
            accessKeyId: config.ACCESS_KEY_ID,
            accessKeySecret: config.ACCESS_KEY_SECRET,
            bucket: config.OSS_BUCKET,
            timeout: 10000
        })
    }
    return client
}

module.exports.putOss = function(key, value) {
    const client = getOssClient()
    if (typeof value === 'object') {
        value = JSON.stringify(value)
    }
    return client.put(key, new Buffer(value))
}

module.exports.getOss = async function(key) {
    const client = getOssClient()
    let result = await client.get(key)
    try {
        result = JSON.parse(result.content.toString())
    } catch (ignore) {
    }
    return result
}