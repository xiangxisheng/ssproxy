<template>
  <div>
    <group>
      <cell :title="$t('CurrentLogined')" link="/user/profile" :value="nickname">
        <span class="demo-icon" slot="icon"><x-icon type="ios-person-outline"></x-icon></span>
      </cell>
    </group>
  </div>
</template>

<i18n>
CurrentLogined:
  en: Current Logined
  zh-CN: 当前登录
MyQQ:
  en: My QQ Number
  zh-CN: 我的QQ号码
BackHome:
  en: Back Home
  zh-CN: 返回主页
GotoLoginPage:
  en: Register or Login
  zh-CN: 登录&激活Email账号
</i18n>

<script>
import { Msg, XButton, Cell, Group } from 'vux'

export default {
  components: {Msg, XButton, Cell, Group},
  created () {
    let that = this
    window.api.post('/session.php', {}, function (data) {
      if (!data.hasOwnProperty('session')) {
        return
      }
      that.nickname = data.session.profile.nickname
    })
  },
  data () {
    return {
      nickname: ''
    }
  }
}
</script>
