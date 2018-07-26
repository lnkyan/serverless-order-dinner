const common = require('../lib/common')
const oss = require('../lib/oss')
const tpl = require('../vendor/tpl').tpl

module.exports.handler = async function(req, resp, context) {
    try {
        const result = await renderPage(req, resp)
        resp.send(result)
    } catch (e) {
        resp.setStatusCode(502)
        resp.send(e.message)
    }
}

async function renderPage(req, resp) {
    let foodData
    try {
        foodData = await oss.getOss(common.getOrderFileName())
    } catch (e) {
        console.log(`没有创建今天的数据 ${e.message}`)
    }
    resp.setHeader('Content-type', 'text/html; charset=utf-8')
    if (foodData) {
        return renderExist(foodData)
    } else {
        return renderInit(foodData)
    }
}

function renderExist(foodData) {
    foodData.hesitateList = foodData.atList.filter(item => !foodData.agreeList.includes(item) && !foodData.disagreeList.includes(item))
    foodData.noticeUrl = ``
    const template = `
<html>
<h1>点餐情况</h1>
<h3><#=name#></h3>
<p><#=description#></p>
<p><#=new Date(createdAt).toLocaleString()#></p>
<p>已点餐：
    <# for(var i=0; i<agreeList.length; i++) { #>
    <span><#=agreeList[i]#></span>
    <# } #>
</p>
<p>已放弃：
    <# for(var i=0; i<disagreeList.length; i++) { #>
    <span><#=disagreeList[i]#></span>
    <# } #>
</p>
<p>未选择：
    <# for(var i=0; i<hesitateList.length; i++) { #>
    <span><#=hesitateList[i]#></span>
    <# } #>
    <# if(hesitateList.length) { #>
    <a href="<#=noticeUrl#>">再提醒一次</a>
    <# } #>
</p>
</html>`
    return tpl(template, foodData)
}

function renderInit(foodData) {
    const template = `
<html>
<h1>设置晚餐情况</h1>
</html>`
    return tpl(template, foodData)
}