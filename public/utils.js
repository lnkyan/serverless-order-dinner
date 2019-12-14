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
        .then(function(res) {
            // our protocol
            console.log(`[${res.status.code}]`, res.data)
            if (res.status.code) {
                throw new Error(res.status.message)
            }
            return res.data
        })
}

function get(url, data) {
    const headers = {
        'Content-Type': 'application/json',
    }
    return axios.get(url, data, {headers: headers})
        .then(function(res) {
            // HTTP response
            // console.log(`[${res.status}]`, res.data)
            return res.data
        })
        .then(function(res) {
            // our protocol
            console.log(`[${res.status.code}]`, res.data)
            if (res.status.code) {
                throw new Error(res.status.message)
            }
            return res.data
        })
}

/**
 * 获取url中的指定参数
 * @param   {string} name url中的参数名字
 * @param   {string?} url 不填则使用当前地址
 * @returns {null | string} 若获取失败则返回null
 */
function getUrlParam(name, url) {
    const matcher = (url || window.location.search).match(`\\b${name}=([^&#]+)`)
    if (!matcher || matcher.length < 2) {
        console.log(`No "${name}" in url`)
        return null
    }
    return matcher[1]
}