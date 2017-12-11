<template>
  <div>
    <group>
      <cell :title="$t('MySSAccount')" link="/panel/ssport" :value="$t('Entry')">
        <span class="demo-icon free" slot="icon"><x-icon type="person-stalker"></x-icon></span>
      </cell>
    </group>
  </div>
</template>

<i18n>
Entry:
  en: Entry
  zh-CN: 进入
</i18n>

<script>
import { Msg, XButton, Cell, Group } from 'vux'

export default {
  components: {Msg, XButton, Cell, Group},
  created () {
    // let that = this
    window.api.post('/session.php', {}, function (data) {
      // console.log(that)
    })
  },
  data () {
    return {
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
