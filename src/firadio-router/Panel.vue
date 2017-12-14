<template>
  <div>
    <group title="">
      <cell :title="$t('MySSAccount')" link="/panel/ssport" :value="$t('Entry')">
        <span class="demo-icon free" slot="icon"><x-icon type="android-contact"></x-icon></span>
      </cell>
    </group>
    <group title="系统管理">
      <cell :title="$t('SiteSettings')" link="/panel/admin-setting" :value="$t('Entry')">
        <span class="demo-icon free" slot="icon"><x-icon type="android-settings"></x-icon></span>
      </cell>
      <cell :title="$t('AccountBalance')" link="/panel/admin-balance" :value="$t('Entry')">
        <span class="demo-icon free" slot="icon"><x-icon type="cash"></x-icon></span>
      </cell>
    </group>
    <div align="center" style="padding: 10px; font-size: 14px;">
      {{site.contact_info}}
    </div>
  </div>
</template>

<i18n>
SiteSettings:
  en: Site Settings
  zh-CN: 站点设置
AccountBalance:
  en: Account Balance
  zh-CN: 账户余额管理
Entry:
  en: Entry
  zh-CN: 进入
</i18n>

<script>
import { Msg, XButton, Cell, Group } from 'vux'

export default {
  components: {Msg, XButton, Cell, Group},
  created () {
    let that = this
    window.api.post('/panel/ssproxy.php', {}, function (data) {
      if (!data.hasOwnProperty('site')) {
        return
      }
      that.site = data.site
    })
  },
  data () {
    return {
      site: {
        contact_info: ''
      }
    }
  }
}
</script>

<style>
.free {
  fill: green;
  color: green;
}
</style>
