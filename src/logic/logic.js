const orderFoodStore = require('../store/order_food')
const {checkParamsExist} = require('../lib/common')

module.exports = {
    createTodayMenu,
    updateTodayMenu,
    getTodayMenu,
    agree,
    disagree,
}

/**
 * 创建今天的点餐信息
 * @param {string?} title 标题
 * @param {string?} description 菜单详细信息
 * @param {number?} endAt 点餐截止时间，毫秒
 * @return {Promise}
 */
function createTodayMenu(title, description, endAt) {
    return orderFoodStore.createTodayMenu({title, description, endAt})
}

/**
 * 查询今天的点餐信息
 * @return {Promise}
 */
function getTodayMenu() {
    return orderFoodStore.getTodayMenu()
}

/**
 * 修改今天的点餐信息
 * @param {string} menuId 菜单id
 * @param {string?} title 标题
 * @param {string?} description 菜单详细信息
 * @param {number?} endAt 点餐截止时间，毫秒
 * @return {Promise}
 */
function updateTodayMenu(menuId, title, endAt, description) {
    checkParamsExist({menuId})

    return orderFoodStore.updateTodayMenu(menuId, {title, description, endAt})
}

/**
 * 同意点餐
 * @param {string} menuId 菜单id
 * @param {string} peopleName
 * @return {Promise}
 */
function agree(menuId, peopleName) {
    checkParamsExist({menuId})

    return orderFoodStore.agree(menuId, peopleName)
}

/**
 * 拒绝点餐
 * @param {string} menuId 菜单id
 * @param {string} peopleName
 * @return {Promise}
 */
function disagree(menuId, peopleName) {
    checkParamsExist({menuId})

    return orderFoodStore.disagree(menuId, peopleName)
}