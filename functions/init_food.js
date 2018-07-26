const common = require('../lib/common')
const oss = require('../lib/oss')

module.exports.handler = async function(req, resp, context) {
    // 必须同步调用，不能异步，也不能放在某个await后面，否则不会回调。搞不懂
    // const body = await common.parseBody(req)
    try {
        const result = await saveFood(req, resp)
        resp.send(result)
    } catch (e) {
        resp.setStatusCode(502)
        resp.send(e.message)
    }
}

async function saveFood(req, resp) {
    const foodData = {
        version: 1,
        name: req.queries.name,
        description: req.queries.description || '',
        createdAt: Date.now(),
        atList: req.queries.atList || [],
        agreeList:[],
        disagreeList:[],
    }
    const result = await oss.putOss(common.getOrderFileName(), foodData)
    return `创建成功 ${result.name}`
}