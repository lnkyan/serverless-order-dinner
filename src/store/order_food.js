const oss = require('../lib/oss')
const dingRobot = require('../lib/ding_robot')

module.exports = {
    createTodayMenu,
    updateTodayMenu,
    getTodayMenu,
    agree,
    disagree,
}

/**
 * 创建今天的点餐信息
 * @param {object} menuData
 * @param {string?} menuData.title 标题
 * @param {string?} menuData.description 菜单详细信息
 * @param {number?} menuData.endAt 点餐截止时间，毫秒
 * @return {Promise}
 */
async function createTodayMenu({title = '', description = '', endAt = 0}) {
    const menuId = getTodayOrderFileName()
    const menuData = {
        version: 1,
        id: menuId,
        title: title || `${getTodayStr()}晚餐`,
        description: description,
        endAt,
        agreeList: [],
        disagreeList: [],
    }
    await oss.putOss(menuId, menuData)

    const message = `#### ${menuData.title}\n\n${menuData.description}\n\n 请确认自己是否成功点餐，不要吃其它小伙伴... \n\n Please confirm whether the order was success...'`
    await dingRobot.sendCard('点餐啦', message, [
        {
            'title': '算啦',
            'actionURL': `${process.env.HOST}/make_choice.html?menuId=${menuId}&agree=0`,
        },
        {
            'title': '+1',
            'actionURL': `${process.env.HOST}/make_choice.html?menuId=${menuId}&agree=1`,
        },
    ])
    return menuData
}

/**
 * 修改今天的点餐信息
 * @param {string} menuId 菜单id
 * @param {object} menuData
 * @param {string?} menuData.title 标题
 * @param {string?} menuData.description 菜单详细信息
 * @param {number?} menuData.endAt 点餐截止时间，毫秒
 * @return {Promise}
 */
async function updateTodayMenu(menuId, {title, description, endAt}) {
    const menuData = await oss.getOss(menuId)
    if (title) {
        menuData.title = title
    }
    if (description) {
        menuData.description = description
    }
    if (endAt) {
        menuData.endAt = endAt
    }
    await oss.putOss(menuId, menuData)
}

/**
 * 查询今天的点餐信息
 * @return {Promise}
 */
function getTodayMenu() {
    return oss.getOss(getTodayOrderFileName())
}

/**
 * 同意点餐
 * @param {string} menuId 菜单id
 * @param {string} peopleName
 * @return {Promise}
 */
async function agree(menuId, peopleName) {
    const menuData = await oss.getOss(menuId)
    if (!menuData) {
        throw new Error(`the menu ${menuId} is not exist`)
    }
    // removeForm disagreeList
    if (!menuData.agreeList.includes(peopleName)) {
        menuData.agreeList.push(peopleName)
    }
    // removeForm disagreeList
    const index = menuData.disagreeList.indexOf(peopleName)
    if (index >= 0) {
        menuData.disagreeList.splice(index, 1)
    }
    await oss.putOss(menuId, menuData)
}

/**
 * 拒绝点餐
 * @param {string} menuId 菜单id
 * @param {string} peopleName
 * @return {Promise}
 */
async function disagree(menuId, peopleName) {
    const menuData = await oss.getOss(menuId)
    if (!menuData) {
        throw new Error(`the menu ${menuId} is not exist`)
    }
    // removeForm disagreeList
    if (!menuData.disagreeList.includes(peopleName)) {
        menuData.disagreeList.push(peopleName)
    }
    // removeForm disagreeList
    const index = menuData.agreeList.indexOf(peopleName)
    if (index >= 0) {
        menuData.agreeList.splice(index, 1)
    }
    await oss.putOss(menuId, menuData)
}

/**
 * 获取存储每日预定信息的文件名
 * @return {string}
 */
function getTodayOrderFileName() {
    return `dinner_menu_${getTodayStr()}`
}

/**
 * 获取今天的日期字符串
 * @return {string}
 */
function getTodayStr() {
    const d = new Date(Date.now() + 8 * 60 * 60 * 1000)
    const year = d.getUTCFullYear()
    const month = d.getUTCMonth() + 1
    const day = d.getUTCDate()
    return `${year}${month < 10 ? '0' : ''}${month}${day < 10 ? '0' : ''}${day}`
}