<template>
  <div>
    <group :title="group_title">
      <cell v-if="rows.length===0" align="center" title="没有找到用户"></cell>
      <scroller v-if="rows.length>0" lock-x scrollbar-y use-pulldown height="350px" @on-pulldown-loading="refresh" ref="scroller" v-model="status">
        <!--content slot-->
        <div>
          <cell v-for="row of rows" :key="row.id" :title="row.text" :value="$t('Entry')" @click.native="actionsheetShow(row)"></cell>
        </div>
        <!--pulldown slot-->
        <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
          <span v-show="status.pulldownStatus === 'default'"></span>
          <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">↓</span>
          <span v-show="status.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
      </scroller>
    </group>
    <actionsheet v-model="actionsheet.show" :menus="actionsheet.menus" @on-click-menu-deposit="deposit()" show-cancel></actionsheet>
    <div v-transfer-dom>
      <popup v-model="popupBox.showDeposit" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
            <x-input title="用户昵称" v-model="popupBox.nickname" readonly></x-input>
            <x-input title="充值金额" placeholder="" v-model="popupBox.formData.amount"></x-input>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <flexbox-item><x-button type="primary" @click.native="submit()">确定充值</x-button></flexbox-item>
              <flexbox-item><x-button @click.native="popupBox.showDeposit=false">{{$t('Cancel')}}</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<i18n>

</i18n>

<script>
import {TransferDom, Box, Flexbox, FlexboxItem, XButton, Cell, Group, XDialog, Actionsheet, Popup, XInput, XNumber, Selector, XTextarea, Scroller, Spinner} from 'vux'

export default {
  directives: { TransferDom },
  components: {Box, Flexbox, FlexboxItem, XButton, Cell, Group, XDialog, Actionsheet, Popup, XInput, XNumber, Selector, XTextarea, Scroller, Spinner},
  created () {
    this.update()
  },
  data () {
    return {
      actionsheet: {
        show: false,
        menus: {
          'title.noop': this.$t('OperationMenu'),
          deposit: '给用户充值'
        }
      },
      popupBox: {
        show: false,
        showAdd: false,
        showInfo: false,
        showDeposit: false,
        title: this.$t('EditTitle'),
        formData: {
          amount: 0
        }
      },
      station: {id: 0},
      locationList: [],
      transferList: [],
      keepdaysList: [],
      lanmuList: [],
      group_title: '用户列表',
      rows: [],
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      n1: 50
    }
  },
  methods: {
    loadMore () {
      setTimeout(() => {
        this.n += 10
        setTimeout(() => {
          this.$refs.scroller.donePullup()
        }, 10)
      }, 1000)
    },
    refresh () {
      this.update()
      /*
      setTimeout(() => {
        this.n = 10
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.scroller.donePulldown()
            // this.$refs.scroller.enablePullup()
          }, 10)
        })
      }, 1000)
      */
    },
    getOption (options, keyField) {
      for (var key in options) {
        var row = options[key]
        if (row.key === keyField) {
          return row
        }
      }
    },
    update () {
      let that = this
      that.popupBox.show = false
      let param = {}
      param.station_id = this.$route.params.station_id
      window.api.post('/panel/ssproxy/manage/user/list.php', param, function (data) {
        if (!data.hasOwnProperty('rows')) {
          return
        }
        that.rows = data.rows
        for (var key in that.rows) {
          var row = that.rows[key]
          row.nickname = '用户' + row.owner_uid
          row.text = row.id + ': ' + row.nickname
          row.text += ', 余额:' + parseFloat(row.balance) + '元'
        }
        if (that.$refs.scroller !== undefined) {
          that.$refs.scroller.donePulldown()
        }
      })
    },
    actionsheetShow (row) {
      this.popupBox.operate_id = row.id
      this.popupBox.nickname = row.nickname
      // this.actionsheet.menus['title.noop'] = '<span class="small">要对&nbsp;</span>' + row.id + ': ' + row.remark + '<span class="small">&nbsp;做什么？</span>'
      this.actionsheet.show = true
    },
    deposit () {
      this.popupBox.title = '给用户充值'
      this.popupBox.showDeposit = true
    },
    submit () {
      let that = this
      var path = '/panel/ssproxy.php'
      let row = this.popupBox.formData
      if (this.popupBox.operate_id) {
        row.operate_id = this.popupBox.operate_id
        path = '/panel/ssproxy/manage/balance/deposit.php'
        var msg = '用户昵称: ' + that.popupBox.nickname + '<br>'
        msg += '充值金额: ' + row.amount
        window.$vuf.confirm(msg, function () {
          window.api.post(path, row, function (data) {
            that.update()
            that.popupBox.showDeposit = false
          })
        }, '确定要充值吗？')
      }
    },
    getHumanFormat (bytes) {
      if (isNaN(bytes)) return '0 B'
      if (bytes === 0) return '0 B'
      var k = 1024
      var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      var i = Math.floor(Math.log(bytes) / Math.log(k))
      // return (bytes / Math.pow(k, i)) + ' ' + sizes[i]
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
      // toPrecision(3) 后面保留两位小数，如1.00GB
    }
  }
}
</script>

<style lang="less" scoped>
.small {
  color: #666;
  font-size: 14px;
}
.rotate {
  display: inline-block;
  transform: rotate(-180deg);
}
.pullup-arrow {
  transition: all linear 0.2s;
  color: #666;
  font-size: 25px;
}
</style>
