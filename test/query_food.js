const handler = require('../functions/query_food').handler

const fakeResp = new Proxy({}, {
    get(target, key) {
        return console.log.bind(console, `[${key}]`)
    }
})

handler({}, fakeResp, {})