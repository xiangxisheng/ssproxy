<template>
  <div style="height:100%;">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenu" @on-click-menu="changeLocale"></actionsheet>
    </div>

    <drawer
    width="200px;"
    :show.sync="drawerVisibility"
    :show-mode="showModeValue"
    :placement="showPlacementValue"
    :drawer-style="{'background-color':'#35495e', width: '200px'}">

      <!-- drawer content -->
      <div slot="drawer">
        <group title="用户菜单" style="margin-top:20px;">
          <cell title="登录" link="/demo" value="演示" @click.native="drawerVisibility = false"></cell>
        </group>
      </div>

      <!-- main content -->
      <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">

        <x-header slot="header"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;"
        :left-options="leftOptions"
        :right-options="rightOptions"
        :title="title"
        :transition="headerTransition"
        @on-click-more="onClickMore">
        <!--
          <span v-if="route.path === '/' || route.path === '/component/drawer'" slot="overwrite-left" @click="drawerVisibility = !drawerVisibility">
            <x-icon type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
          </span>-->
        </x-header>

        <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
        <transition
        @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
        :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
          <router-view class="router-view"></router-view>
        </transition>

        <tabbar class="vux-demo-tabbar" icon-class="vux-center" v-show="!isTabbarDemo" slot="bottom">
          <tabbar-item :link="{path:'/'}" :selected="isIndex">
            <span class="demo-icon-22" slot="icon"><x-icon type="ios-home-outline"></x-icon></span>
            <span slot="label"><span v-if="indexTitleName" class="vux-demo-tabbar-component">{{indexTitleName}}</span><span v-else>{{$t('Home')}}</span></span>
          </tabbar-item>
          <tabbar-item :link="{path:'/panel'}" :selected="isPanel">
            <!--<span class="demo-icon-22" slot="icon">&#xe642;</span>-->
            <span class="demo-icon-22" slot="icon"><x-icon type="ios-cloud-outline"></x-icon></span>
            <span slot="label"><span v-if="yunTitleName" class="vux-demo-tabbar-component">{{yunTitleName}}</span><span v-else>{{$t('Panel')}}</span></span>
          </tabbar-item>
          <tabbar-item :link="{path:'/user'}" :selected="isUser">
            <span class="demo-icon-22" slot="icon"><x-icon type="ios-person-outline"></x-icon></span>
            <span slot="label"><span v-if="userTitleName" class="vux-demo-tabbar-component">{{userTitleName}}</span><span v-else>{{$t('User')}}</span></span>
          </tabbar-item>
        </tabbar>

      </view-box>
    </drawer>
  </div>
</template>

<i18n>
Submit:
  en: Submit
  zh-CN: 提交
Home:
  en: Home
  zh-CN: 主页
message:
  en: Message
  zh-CN: 消息
UserCenter:
  en: User Center
  zh-CN: 用户中心
login:
  en: Login
  zh-CN: 登录
sign:
  en: Sign
  zh-CN: 登录
Panel:
  en: Panel
  zh-CN: 面板
Profile:
  en: Profile
  zh-CN: 用户资料
profile:
  en: Profile
  zh-CN: 用户资料
ssport:
  en: SS Account
  zh-CN: 我的SS账号
</i18n>

<script>
import { Radio, Group, Cell, Badge, Drawer, Actionsheet, ButtonTab, ButtonTabItem, ViewBox, XHeader, Tabbar, TabbarItem, Loading, TransferDom } from 'vux'
import { mapState, mapActions } from 'vuex'

export default {
  directives: {
    TransferDom
  },
  components: {
    Radio,
    Group,
    Cell,
    Badge,
    Drawer,
    ButtonTab,
    ButtonTabItem,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading,
    Actionsheet
  },
  methods: {
    warn (text) {
      this.$vux.toast.show({
        type: 'warn',
        text: text,
        width: '20em'
      })
    },
    alert (content, fun, title) {
      let that = this
      if (title === undefined) {
        title = '提示'
      }
      this.$vux.alert.show({
        title: title,
        content: content,
        onHide () {
          if (content.indexOf('请先登录') !== -1) {
            that.$router.replace('/user/sign')
          }
          if (content.indexOf('已退出登录') !== -1) {
            that.$router.replace('/user')
          }
          if (typeof fun !== 'function') {
            return
          }
          fun()
        }
      })
    },
    confirm (content, fun, title) {
      this.$vux.confirm.show({
        title: title,
        content: content,
        onConfirm () {
          fun()
        }
      })
    },
    onShowModeChange (val) {
      /** hide drawer before changing showMode **/
      this.drawerVisibility = false
      setTimeout(one => {
        this.showModeValue = val
      }, 400)
    },
    onPlacementChange (val) {
      /** hide drawer before changing position **/
      this.drawerVisibility = false
      setTimeout(one => {
        this.showPlacementValue = val
      }, 400)
    },
    onClickMore () {
      this.showMenu = true
    },
    changeLocale (locale) {
      this.$i18n.set(locale)
      this.$locale.set(locale)
    },
    ...mapActions([
      'updateDemoPosition'
    ])
  },
  mounted () {
    let that = this
    if (!window.hasOwnProperty('$vuf')) {
      window.$vuf = {}
    }
    window.$vuf.alert = this.alert
    window.$vuf.confirm = this.confirm
    window.api.appThis = that
    this.handler = () => {
      if (this.path === '/demo') {
        this.box = document.querySelector('#demo_list_box')
        this.updateDemoPosition(this.box.scrollTop)
      }
    }
  },
  beforeDestroy () {
    this.box && this.box.removeEventListener('scroll', this.handler, false)
  },
  watch: {
    path (path) {
      if (path === '/component/demo') {
        this.$router.replace('/demo')
        return
      }
      if (path === '/demo') {
        setTimeout(() => {
          this.box = document.querySelector('#demo_list_box')
          if (this.box) {
            this.box.removeEventListener('scroll', this.handler, false)
            this.box.addEventListener('scroll', this.handler, false)
          }
        }, 1000)
      } else {
        this.box && this.box.removeEventListener('scroll', this.handler, false)
      }
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      deviceready: state => state.app.deviceready,
      demoTop: state => state.vux.demoScrollTop,
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction
    }),
    isShowBar () {
      if (/component/.test(this.path)) {
        return true
      }
      return false
    },
    leftOptions () {
      return {
        showBack: this.route.path !== '/'
      }
    },
    rightOptions () {
      return {
        showMore: true
      }
    },
    headerTransition () {
      return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
    },
    componentName () {
      if (this.route.path) {
        const parts = this.route.path.split('/')
        if (/component/.test(this.route.path) && parts[2]) return parts[2]
      }
    },
    isDemo () {
      return /component|demo/.test(this.route.path)
    },
    isIndex () {
      if (this.route.path === '/') {
        return true
      }
      return /^\/index/.test(this.route.path)
    },
    isPanel () {
      return /^\/panel/.test(this.route.path)
    },
    isUser () {
      return /^\/user/.test(this.route.path)
    },
    isTabbarDemo () {
      return /tabbar/.test(this.route.path)
    },
    title () {
      if (this.route.path === '/') return this.$t('Home')
      if (this.route.path === '/user/sign') return this.$t('Sign')
      if (this.route.path === '/user/profile') return this.$t('Profile')
      if (this.route.path === '/user') return this.$t('UserCenter')
      if (this.route.path === '/panel') return this.$t('Panel')
      if (this.route.path === '/panel/ssport') return this.$t('MySSAccount')
      return this.componentName ? `Demo/${this.componentName}` : this.$t('404Error')
    },
    titleByRoute () {
      if (this.route.path) {
        const parts = this.route.path.split('/')
        let partsT = []
        for (var i in parts) {
          var part = parts[i]
          if (part === '') {
            continue
          }
          part = this.$t(part)
          partsT.push(part)
        }
        return partsT
        // if (/component/.test(this.route.path) && parts[2]) return parts[2]
      }
    },
    indexTitleName () {
      if (!/^\/index/.test(this.route.path)) {
        return
      }
      let titles = this.titleByRoute
      return titles[1]
    },
    yunTitleName () {
      if (!/^\/panel/.test(this.route.path)) {
        return
      }
      let titles = this.titleByRoute
      return titles[1]
    },
    userTitleName () {
      if (!/^\/user/.test(this.route.path)) {
        return
      }
      let titles = this.titleByRoute
      return titles[1]
    }
  },
  data () {
    return {
      showMenu: false,
      menus: {
        'language.noop': '<span class="menu-title">Language</span>',
        'zh-CN': '中文',
        'en': 'English'
      },
      drawerVisibility: false,
      showMode: 'push',
      showModeValue: 'push',
      showPlacement: 'left',
      showPlacementValue: 'left'
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/tap.less';

body {
  background-color: #fbf9fe;
}
html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.demo-icon-22 {
  font-family: 'vux-demo';
  font-size: 22px;
  color: #888;
}
.weui-tabbar.vux-demo-tabbar {
  /** backdrop-filter: blur(10px);
  background-color: none;
  background: rgba(247, 247, 250, 0.5);**/
}
.vux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
  color: #F70968;
  fill: #F70968;
}
.vux-demo-tabbar .weui-tabbar_item.weui-bar__item_on .vux-demo-tabbar-icon-home {
  color: rgb(53, 73, 94);
}
.demo-icon-22:before {
  content: attr(icon);
}
.vux-demo-tabbar-component {
  background-color: #F70968;
  color: #fff;
  border-radius: 7px;
  padding: 0 4px;
  line-height: 14px;
}
.weui-tabbar__icon + .weui-tabbar__label {
  margin-top: 0!important;
}
.vux-demo-header-box {
  z-index: 100;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
}

@font-face {
  font-family: 'vux-demo';  /* project id 70323 */
  src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot');
  src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot?#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.woff') format('woff'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.ttf') format('truetype'),
  url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.svg#iconfont') format('svg');
}

.demo-icon {
  font-family: 'vux-demo';
  font-size: 20px;
  color: #04BE02;
}

.demo-icon-big {
  font-size: 28px;
}

.demo-icon:before {
  content: attr(icon);
}

.router-view {
  width: 100%;
  top: 46px;
}
.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.menu-title {
  color: #888;
}
</style>
