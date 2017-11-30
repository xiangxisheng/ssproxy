export default {
  install: function (Vue) {
    Vue.filter('datetime', function (value) {
      function add0 (m) {
        return m < 10 ? '0' + m : m
      }
      let time = new Date(parseInt(value, 10))
      let Y = time.getFullYear()
      let m = add0(time.getMonth() + 1)
      let d = add0(time.getDate())
      let H = add0(time.getHours())
      let i = add0(time.getMinutes())
      let s = add0(time.getSeconds())
      return Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s
    })
    Vue.filter('date', function (value) {
      function add0 (m) {
        return m < 10 ? '0' + m : m
      }
      var date = value
      if (!(date instanceof Date)) {
        date = new Date(parseInt(value, 10))
      }
      let Y = date.getFullYear()
      let m = add0(date.getMonth() + 1)
      let d = add0(date.getDate())
      return Y + '-' + m + '-' + d
    })
    Vue.filter('date-dmY', function (value) {
      function add0 (m) {
        return m < 10 ? '0' + m : m
      }
      var date = value
      if (!(date instanceof Date)) {
        date = new Date(parseInt(value, 10))
      }
      let Y = date.getFullYear()
      let m = add0(date.getMonth() + 1)
      let d = add0(date.getDate())
      return d + '/' + m + '/' + Y
    })
    Vue.filter('time', function (value) {
      function add0 (m) {
        return m < 10 ? '0' + m : m
      }
      let time = new Date(parseInt(value, 10))
      let H = add0(time.getHours())
      let i = add0(time.getMinutes())
      let s = add0(time.getSeconds())
      return H + ':' + i + ':' + s
    })
  }
}
