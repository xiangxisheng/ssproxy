import Qs from 'qs'
export default{

  url: '/get',

  // baseURL: 'https://https.firadio.net/api',
  // baseURL: 'http://api.feieryun.cn:2780',
  baseURL: 'https://https.firadio.net:444/cn2027',
  method: 'POST',

  transformRequest: [
    function (data) {
      // 为了避免qs格式化时对内层对象的格式化先把内层的对象转为
      // data.strSQL = base64encode(data.strSQL)
      // 由于使用的form-data传数据所以要格式化
      data = Qs.stringify(data)
      return data
    }
  ],

  transformResponse: [
    function (data) {
      return data
    }
  ],

  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },

  params: {},

  paramsSerializer: function (params) {
    return Qs.stringify(params)
  },

  data: {
    // appId: 1,
    // appName: 'firadio_yun',
    // siteId: 1,
    domain: document.domain,
    sessionId: (function () {
      if (!localStorage.hasOwnProperty('sessionId')) {
        localStorage.sessionId = new Date().getTime() + Math.random().toString().substring(2)
      }
      return localStorage.sessionId
    })()
  },

  timeout: 10000,

  withCredentials: true, // default is false

  responseType: '', // default

  // 将upload事件注释掉，防止跨域状态下发起option请求

  // onUploadProgress: function(progressEvent) {
  // Do whatever you want with the native progress event
  // },

  // onDownloadProgress: function(progressEvent) {
  // Do whatever you want with the native progress event
  // },

  maxContentLength: 2000,

  validateStatus: function (status) {
    return status >= 200 && status < 300 // default
  },

  maxRedirects: 5 // default
}
