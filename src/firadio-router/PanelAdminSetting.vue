<template>
  <div>
    <group>
      <x-input title="站点名称" v-model="formData.title" />
      <x-textarea title="网站信息" :max="200" name="description" :placeholder="$t('placeholder')" v-model="formData.contact_info"></x-textarea>
      <div style="margin: 0px 10px;">
        <x-button @click.native="save" type="primary">{{$t('Save')}}</x-button>
      </div>
    </group>
  </div>
</template>

<i18n>
placeholder:
  en: placeholder
  zh-CN: 这里输入您要显示给用户看的网站资料
</i18n>

<script>
import { Msg, XButton, Cell, Group, XInput, XTextarea } from 'vux'

export default {
  components: {Msg, XButton, Cell, Group, XInput, XTextarea},
  created () {
    this.update()
  },
  data () {
    return {
      formData: {
        title: ''
      }
    }
  },
  methods: {
    readCommonData (data) {
      if (!data.hasOwnProperty('site')) {
        return
      }
      this.formData = data.site
    },
    update () {
      let that = this
      window.api.post('/panel/ssproxy.php', {}, function (data) {
        that.readCommonData(data)
      })
    },
    save () {
      let that = this
      window.api.post('/panel/ssproxy/manage/setting.php', this.formData, function (data) {
        that.update()
      })
    }
  }
}
</script>
