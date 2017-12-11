<template>
  <div>
    <group :title="$t('Welcome')">
      <cell :title="$t('EntryPanel')" link="/panel" :value="$t('Entry')"></cell>
    </group>
  </div>
</template>

<i18n>
Entry:
  en: Entry
  zh-CN: 进入
Welcome:
  en: Welcome
  zh-CN: 平台主页
EntryPanel:
  en: Entry To Panel
  zh-CN: 进入平台面板
</i18n>

<script>
import {Cell, Group, Badge, XSwitch, XDialog} from 'vux'
import { mapState, mapActions } from 'vuex'
const version = require('../../package.json').version
export default {
  components: {Cell, Group, Badge, XSwitch, XDialog},
  data () {
    return {
      version: version
    }
  },
  computed: {
    ...mapState({
      showRadioPlayer: state => state.vux.showRadioPlayer
    })
  },
  methods: {
    ...mapActions([
      'setRadioPlayer'
    ]),
    clickRadioPlayer () {
      // this.setRadioPlayer(!this.showRadioPlayer)
      this.setRadioPlayer(true)
    }
  }
}
</script>

<style scoped>
.center {
  margin-top: 15px;
  text-align: center;
}
.vux-notice {
  color: #666;
  line-height: 40px;
}
.vux-title {
  vertical-align: middle;
  text-align: center;
  color: #04BE02;
  display: inline-block;
  width: 75px;
  height: 75px;
  line-height: 75px;
  border-radius: 50%;
}
body {
  font-family: Helvetica, sans-serif;
  background-color: #fbf9fe;
}
</style>
