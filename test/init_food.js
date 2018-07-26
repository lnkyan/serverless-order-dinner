const handler = require('../functions/init_food').handler

const fakeResp = new Proxy({}, {
    get(target, key) {
        return console.log.bind(console, `[${key}]`)
    }
})

handler({
    queries: {
        name: '青椒炒肉',
        description: '请确认是否点餐成功',
        atList: ['13812345678', '15900000000'],
    }
}, fakeResp, {})