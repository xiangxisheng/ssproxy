import axios from 'axios'
import config from './config'

// axios(config)
class API {
  // 获取配置
  config (key) {
    if (key === undefined) {
      return config
    }
    return config[key]
  }
  // 获取已授权列表
  get (param) {
    config.data.param = param.param
    return axios.post(param.api, {
    }, config)
  }
  // 添加授权
  post (path, param, fun) {
    param = JSON.stringify(param)
    config.data.param = param
    let appThis = this.appThis
    appThis.isLoading_api = true
    axios.post(path, {}, config).then(res => {
      appThis.isLoading_api = false
      if (!res.hasOwnProperty('status')) {
        appThis.warn('no status in res')
        return
      }
      if (res.status !== 200) {
        appThis.warn('res.status is ' + res.status)
        return
      }
      if (!res.hasOwnProperty('data')) {
        appThis.warn('no data in res')
        return
      }
      var data = res.data
      if (typeof (data) === 'string') {
        try {
          data = JSON.parse(data)
        } catch (ex) {
          data = {}
          appThis.warn(ex)
          return
        }
      }
      var isUnLogined = false
      if (!data.hasOwnProperty('session') && path.indexOf('/public/') !== 0) {
        isUnLogined = true
      }
      if (data.hasOwnProperty('message')) {
        window.$vuf.alert(data.message, function () {
          if (data.code === -2 && isUnLogined) {
            appThis.$router.push({path: '/user/sign'})
          }
        }, data.hasOwnProperty('title') ? data.title : null)
      } else if (isUnLogined) {
        window.$vuf.alert('您当前未登录', function () {
          appThis.$router.push({path: '/user/sign'})
        }, '提示')
      }
      var code = data.hasOwnProperty('code') ? parseInt(data.code, 10) : 0
      if (code !== 0) {
        return
      }
      fun(data)
    }).catch(error => {
      appThis.isLoading_api = false
      console.log(error)
      appThis.warn('无法连接到服务器<br />' + error)
    })
  }
  reqSuccess (obj, msg) {
    obj.$message({
      message: msg,
      type: 'success'
    })
  }
  reqFail (obj, msg) {
    obj.$message({
      message: msg,
      type: 'success'
    })
  }
}
export default API
