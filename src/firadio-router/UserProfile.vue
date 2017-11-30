<template>
  <div>
    <group>
      <cell title="昵称" :value="nickname">
        <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;</span>
      </cell>
      <div style="margin: 0px 10px;">
        <x-button @click.native="logout" type="primary">退出当前账号</x-button>
      </div>
    </group>
  </div>
</template>

<i18n>

</i18n>

<script>
import { Msg, XButton, Cell, Group } from 'vux'

export default {
  components: { Msg, XButton, Cell, Group },
  created () {
    let that = this
    window.api.post('/session.php', {}, function (data) {
      if (!data.hasOwnProperty('session')) {
        return
      }
      that.nickname = data.session.profile.nickname
    })
  },
  mounted () {
  },
  data () {
    return {
      nickname: '123'
    }
  },
  methods: {
    logout () {
      let that = this
      window.api.post('/panel/logout.php', {}, function (data) {
        if (data.flag === 'logouted') {
          that.$router.push('/user/sign')
        }
      })
    }
  }
}
</script>
