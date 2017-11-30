export default {
  install: function (Vue) {
    window.objCount = function (obj) {
      if (obj === undefined) {
        return 0
      }
      if (typeof (obj) !== 'object') {
        return 0
      }
      var i = 0
      for (var k in obj) {
        if (k) i++
      }
      return i
    }
    window.clone = function (obj) {
      if (typeof obj !== 'object') {
        return obj
      }
      if (obj === null) {
        return null
      }
      var o
      if (obj instanceof Array) {
        o = []
        for (var i = 0, len = obj.length; i < len; i++) {
          o.push(window.clone(obj[i]))
        }
      } else {
        o = {}
        for (var j in obj) {
          o[j] = window.clone(obj[j])
        }
      }
      return o
    }
    window.date = function (date) {
      function add0 (m) {
        return m < 10 ? '0' + m : m
      }
      if (date === undefined) {
        date = new Date()
      }
      let Y = date.getFullYear()
      let m = add0(date.getMonth() + 1)
      let d = add0(date.getDate())
      return Y + '-' + m + '-' + d
    }
    window.html_encode = function (str) {
      var s = ''
      if (str.length === 0) return ''
      s = str.replace(/&/g, '&gt;')
      s = s.replace(/</g, '&lt;')
      s = s.replace(/>/g, '&gt;')
      s = s.replace(/ /g, '&nbsp;')
      s = s.replace(/\\'/g, '&#39;')
      s = s.replace(/\\"/g, '&quot;')
      s = s.replace(/\r\n/g, '<br>')
      s = s.replace(/\r/g, '<br>')
      s = s.replace(/\n/g, '<br>')
      return s
    }
    window.getHtmlByBBCode = function (str) {
      let reg = new RegExp('\\[([A-Z]+)\\:([a-z]+)(\\,([a-z]+)\\=([\\dA-Za-z\\.]+))*\\]')
      let result = str.replace(reg, function () {
        let args = arguments
        let codePre = args[1]
        let codeType = args[2]
        if (codePre === 'CQ' && codeType === 'shake') {
          return window.getHtmlByCQCode_shake()
        }
        if (codePre === 'CQ' && codeType === 'face') {
          // return window.getHtmlByCQCode_face(args[5])
          return str
        }
        if (codePre === 'CQ' && codeType === 'image') {
          return window.getHtmlByCQCode_image(args[5])
        }
        return str
      })
      return result
    }
    window.getHtmlByCQCode_shake = function () {
      return '[shake震动]'
    }
    window.getHtmlByCQCode_face = function (id) {
      return '表情编号=' + id
    }
    window.getHtmlByCQCode_image = function (file) {
      let baseURL = window.api.config('baseURL')
      var url = baseURL + '/public/message/image.php'
      url += '?filename=' + file
      return '<a target=_blank href="' + url + '">图片</a>'
    }
    window.isMobile = function () {
      if (screen.width < screen.height) return true
      var sUserAgent = navigator.userAgent.toLowerCase()
      var bIsIpad = /ipad/i.test(sUserAgent)
      var bIsIphoneOs = /iphone os/i.test(sUserAgent)
      var bIsMidp = /midp/i.test(sUserAgent)
      var bIsUc7 = /rv:1.2.3.4/i.test(sUserAgent)
      var bIsUc = /ucweb/i.test(sUserAgent)
      var bIsAndroid = /android/i.test(sUserAgent)
      var bIsCE = /windows ce/i.test(sUserAgent)
      var bIsWM = /windows mobile/i.test(sUserAgent)
      if ((bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
        return true
      }
      return false
    }
    window.isIE = function () {
      var sUserAgent = navigator.userAgent
      if (sUserAgent.indexOf('MSIE') >= 0) {
        return true
      }
      if (sUserAgent.indexOf('Media Center') >= 0) {
        return true
      }
      if (sUserAgent.indexOf('.NET') >= 0) {
        return true
      }
      return false
    }
  }
}
