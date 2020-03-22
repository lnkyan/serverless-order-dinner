const crypto = require('crypto')
const axios = require('axios')

/**
 * 钉钉机器人推送
 * @param {string} accessToken webhook中的参数
 * @param {string?} secret “加签”安全方式中用到的秘钥，不填则表示不签名
 * @see https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq
 */
class DingRobot {
    constructor(accessToken, secret) {
        this.accessToken = accessToken
        this.secret = secret
    }

    getWebhook() {
        const params = [`access_token=${this.accessToken}`]
        if (this.secret) {
            const timestamp = Date.now()
            const plain = `${timestamp}\n${this.secret}`
            const sign = encodeURIComponent(crypto.createHmac('sha256', this.secret).update(plain).digest('base64'))
            params.push(`timestamp=${timestamp}`)
            params.push(`sign=${sign}`)
        }

        return `https://oapi.dingtalk.com/robot/send?${params.join('&')}`
    }

    /**
     * 推送文本消息
     * @param {string} message 消息内容
     * @param {[string]?} atList 要@的用户的手机号列表，被@的人会在桌面看到提示
     * @param {boolean?} isAtAll 是否要@全员
     * @return {Promise}
     */
    sendText(message, atList, isAtAll) {
        return post(this.getWebhook(), {
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
     * 推送文本消息
     * @param {string} title 首行消息内容
     * @param {object} obj 将该对象以kv的形式打印出来
     * @param {[string]?} atList 要@的用户的手机号列表，被@的人会在桌面看到提示
     * @param {boolean?} isAtAll 是否要@全员
     * @return {Promise}
     */
    sendObj(title, obj, atList, isAtAll) {
        const message = Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('\n')
        return this.sendText(`${title}\n${message}`, atList, isAtAll)
    }

    /**
     * 推送卡片
     * @param {string} title 点进会话前看到的文字
     * @param {string} markdown 卡片内容，支持常用的markdown语法
     * @param {[{title:string, actionURL:string}]} btnList 按钮列表
     * @return {Promise}
     */
    sendCard(title, markdown, btnList) {
        return post(this.getWebhook(), {
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

    /**
     * 推送Markdown文字
     * @param {string} title 点进会话前看到的文字
     * @param {string} content 文字内容，支持常用的markdown语法
     * @return {Promise}
     */
    sendMarkdown(title, content) {
        return post(this.getWebhook(), {
            msgtype: 'markdown',
            markdown: {
                title,
                text: content,
            },
        })
    }
}

async function post(url, data) {
    const headers = {
        'Content-Type': 'application/json',
    }
    const res = await axios.post(url, data, {headers: headers})
    // HTTP response
    // console.log(`[${res.status}]`, res.data)
    if (res.data && res.data.errcode) {
        console.error(`Ding robot post error: [${res.data.errcode}] ${res.data.errmsg}`)
    }
    return res.data
}

module.exports = DingRobot