const express = require('express')
const orderFoodLogic = require('./logic')
const {handlerRsp} = require('../lib/common')

const router = express.Router()

// 创建今天的点餐信息
router.post('/create', handlerRsp((req) => {
    const title = req.body.title
    const description = req.body.description
    const endAt = req.body.endAt

    return orderFoodLogic.createTodayMenu(title, description, endAt)
}))

// 查询今天的点餐信息
router.get('/show', handlerRsp(() => {
    return orderFoodLogic.getTodayMenu()
}))

// 修改今天的点餐信息
router.post('/edit', handlerRsp((req) => {
    const menuId = req.body.menuId
    const title = req.body.title
    const description = req.body.description
    const endAt = req.body.endAt

    return orderFoodLogic.updateTodayMenu(menuId, title, endAt, description)
}))

// 同意点餐
router.post('/agree', handlerRsp((req) => {
    const menuId = req.body.menuId
    const name = req.body.name

    return orderFoodLogic.agree(menuId, name)
}))

// 拒绝点餐
router.post('/disagree', handlerRsp((req) => {
    const menuId = req.body.menuId
    const name = req.body.name

    return orderFoodLogic.disagree(menuId, name)
}))

module.exports = router