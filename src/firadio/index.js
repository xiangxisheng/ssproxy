import global from './global.js'
import API from './api'
import filter from './filter.js'
// import store from './store.js'
export default {
  install: function (Vue) {
    Vue.use(global)
    window.api = new API()
    Vue.use(filter)
    // Vue.use(store)
    // this.storeObj = store.storeObj
  }
}
