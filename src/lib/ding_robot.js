const axios = require('axios')
const {DING_ROBOT} = require('./config')

// 钉钉机器人推送
// 文档https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq


/**
 * 推送文本消息
 * @param {string} message 消息内容
 * @param {[string]} atList 要@的用户的手机号列表，被@的人会在桌面看到提示
 * @param {boolean} isAtAll 是否要@全员
 * @return {Promise}
 */
module.exports.sendText = function(message, atList, isAtAll) {
    return post(DING_ROBOT, {
        'msgtype': 'text',
        'text': {
            'content': message,
        },
        'at': {
            'atMobiles': atList,
            'isAtAll': isAtAll,
        },
    })
}

/**
 * 推送卡片
 * @param {string} title 点进会话前看到的文字
 * @param {string} markdown 卡片内容，支持常用的markdown语法
 * @param {[{title:string, actionURL:string}]} btnList 按钮列表
 * @return {Promise}
 */
module.exports.sendCard = function(title, markdown, btnList) {
    return post(DING_ROBOT, {
        'msgtype': 'actionCard',
        'actionCard': {
            'title': title,
            'text': markdown,
            'hideAvatar': '0', // 是否不显示发送者的头像（看起来像系统消息）
            'btnOrientation': '1',
            'btns': btnList,
        },
    })
}

function post(url, data) {
    const headers = {
        'Content-Type': 'application/json',
    }
    return axios.post(url, data, {headers: headers})
        .then(function(res) {
            // HTTP response
            // console.log(`[${res.status}]`, res.data)
            return res.data
        })
}