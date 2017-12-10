<template>
  <div>
    <group :title="group_title">
      <cell v-if="rows.length===0" align="center" title="您尚未购买SS账号"></cell>
      <!--<scroller lock-x scrollbar-y use-pullup use-pulldown height="350px" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">-->
      <scroller v-if="rows.length>0" lock-x scrollbar-y use-pulldown height="350px" @on-pulldown-loading="refresh" ref="scroller" v-model="status">
        <!--content slot-->
        
        <!--<cell v-for="row of rows" :key="row.id" :title="row.text" value="操作" @click.native="actionsheetShow(row)"></cell>-->
        <div class="box2">
          <cell v-for="row of rows" :key="row.id" :title="row.text" value="操作" @click.native="actionsheetShow(row)"></cell>
        </div>
        <!--pullup slot-->
<!--
        <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
          <span v-show="status.pullupStatus === 'default'"></span>
          <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
          <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
-->
        <!--pulldown slot-->
        <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
          <span v-show="status.pulldownStatus === 'default'"></span>
          <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">↓</span>
          <span v-show="status.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
        </div>
      </scroller>
    </group>
    <box gap="10px 10px">
      <x-button @click.native="add" type="primary">购买SS账号</x-button>
    </box>
    <actionsheet v-model="actionsheet.show" :menus="actionsheet.menus" @on-click-menu-info="info()" @on-click-menu-edit="edit()" @on-click-menu-delete="del()" show-cancel></actionsheet>
    <div v-transfer-dom>
      <popup v-model="popupBox.showAdd" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
            <selector ref="location" title="所在地区" placeholder="选择VPN服务器所在地" v-model="popupBox.formData.location_id" :options="locationList" @on-change="onChangeMoney"></selector>
            <selector ref="transferGb" title="流量大小" placeholder="选择您要购买的流量大小" v-model="popupBox.formData.transferGb_id" :options="transferList" @on-change="onChangeMoney"></selector>
            <selector ref="keepdays" title="有效时长" placeholder="选择您要保留的时长" v-model="popupBox.formData.keepdays" :options="keepdaysList" @on-change="onChangeMoney"></selector>
            <x-input title="备注" placeholder="" v-model="popupBox.formData.remark"></x-input>
            <cell title="订单价格"><s>原价xx元</s> <b style="color:red">现价{{popupBox.formData.sumPrice}}元</b></cell>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <flexbox-item><x-button type="primary" @click.native="submit()">确定下单</x-button></flexbox-item>
              <flexbox-item><x-button @click.native="popupBox.showAdd=false">取消</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
      <popup v-model="popupBox.showInfo" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
            <x-input title="服务器IP" placeholder="" v-model="popupBox.formData.ipv4" readonly></x-input>
            <x-input title="服务端口" placeholder="" v-model="popupBox.formData.port" readonly></x-input>
            <x-input title="连接密码" placeholder="" v-model="popupBox.formData.passwd" readonly></x-input>
            <x-input title="加密" placeholder="" value="aes-256-cfb" readonly></x-input>
            <x-input title="协议" placeholder="" value="origin" readonly></x-input>
            <x-input title="混淆" placeholder="" value="plain" readonly></x-input>
            <x-input title="SSR链接" placeholder="" v-model="popupBox.formData.ssrlink" readonly></x-input>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <!--<flexbox-item><x-button type="primary" @click.native="submit()">确定</x-button></flexbox-item>-->
              <flexbox-item><x-button @click.native="popupBox.showInfo=false">关闭</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
      <popup v-model="popupBox.showEdit" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
<!--
            <selector ref="location" title="所在地区" placeholder="选择VPN服务器所在地" v-model="popupBox.formData.location_id" :options="locationList" @on-change="onChangeMoney"></selector>
            <selector ref="transferGb" title="流量大小" placeholder="选择您要购买的流量大小" v-model="popupBox.formData.transferGb_id" :options="transferList" @on-change="onChangeMoney"></selector>
            <selector ref="keepdays" title="有效时长" placeholder="选择您要保留的时长" v-model="popupBox.formData.keepdays" :options="keepdaysList" @on-change="onChangeMoney"></selector>
-->
            <x-input title="备注" placeholder="" v-model="popupBox.formData.remark"></x-input>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <flexbox-item><x-button type="primary" @click.native="submit()">确定下单</x-button></flexbox-item>
              <flexbox-item><x-button @click.native="popupBox.showEdit=false">取消</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {TransferDom, Box, Flexbox, FlexboxItem, XButton, Cell, Group, XDialog, Actionsheet, Popup, XInput, XNumber, Selector, XTextarea, Scroller, Spinner} from 'vux'

export default {
  directives: { TransferDom },
  components: {Box, Flexbox, FlexboxItem, XButton, Cell, Group, XDialog, Actionsheet, Popup, XInput, XNumber, Selector, XTextarea, Scroller, Spinner},
  created () {
    this.update()
    // this.$watch('transferList', this.onChangeMoney)
    // this.$watch('popupBox.formData.transferGb_id', this.onChangeMoney)
    // this.$watch('keepdaysList', this.onChangeMoney)
    // this.$watch('popupBox.formData.keepdays', this.onChangeMoney)
  },
  data () {
    return {
      actionsheet: {
        show: false,
        menus: {
          'title.noop': '请选择您要的操作',
          info: '查看SS账号连接信息',
          edit: '修改备注'
          // delete: '<span style="color:red">删除SS账号</span>'
        }
      },
      popupBox: {
        show: false,
        showAdd: false,
        showInfo: false,
        showEdit: false,
        title: '编辑SS账号',
        formData: {
          ipv4: '',
          location_id: 1,
          transferGb_id: 1,
          keepdays: 30,
          sumPrice: 0
        }
      },
      station: {id: 0},
      locationList: [],
      transferList: [],
      keepdaysList: [],
      lanmuList: [],
      group_title: '我的SS账号',
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
    onChangeMoney () {
      if (!this.transferList.length) {
        return
      }
      var price1 = 0
      var price2 = 0
      var transferRow = this.getOption(this.transferList, this.popupBox.formData.transferGb_id)
      price1 = transferRow.price
      price2 = this.getOption(this.keepdaysList, this.popupBox.formData.keepdays).price
      this.popupBox.formData.sumPrice = price1 + price2
      var locationTitle = this.getOption(this.locationList, this.popupBox.formData.location_id).title
      this.popupBox.formData.remark = locationTitle + '' + transferRow.transfer_gb + 'G流量'
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
      window.api.post('/panel/ssproxy/port/list.php', param, function (data) {
        if (!data.hasOwnProperty('rows')) {
          return
        }
        that.rows = data.rows
        if (data.hasOwnProperty('locationList')) {
          that.locationList = []
          for (var key2 in data.locationList) {
            var row2 = data.locationList[key2]
            row2['key'] = row2.id
            row2['value'] = row2.title
            that.locationList.push(row2)
          }
        }
        if (data.hasOwnProperty('transferList')) {
          that.transferList = []
          for (var key3 in data.transferList) {
            var row3 = data.transferList[key3]
            row3['key'] = row3.id
            row3.value = row3.title
            that.transferList.push(row3)
          }
        }
        if (data.hasOwnProperty('keepdaysList')) {
          that.keepdaysList = []
          for (var key4 in data.keepdaysList) {
            var row4 = data.keepdaysList[key4]
            row4.key = row4.days
            row4.value = row4.title
            that.keepdaysList.push(row4)
          }
        }
        for (var key in that.rows) {
          var row = that.rows[key]
          // row.text = row.ipv4 + ':' + row.port
          row.text = row.id + ': ' + row.remark
          /*
          if (row.remark) {
            row.text += ' (' + row.remark + ')'
          }
          */
        }
        that.onChangeMoney()
        if (that.$refs.scroller !== undefined) {
          that.$refs.scroller.donePulldown()
        }
      })
    },
    actionsheetShow (row) {
      this.popupBox.modify_id = row.id
      // this.popupBox.formData.transferGb_id = row.transferGb_id
      this.popupBox.formData.ipv4 = row.ipv4
      this.popupBox.formData.port = row.port
      this.popupBox.formData.passwd = row.passwd
      this.popupBox.formData.remark = row.remark
      this.popupBox.formData.ssrlink = row.ssrlink
      this.actionsheet.menus['title.noop'] = '<span class="small">要对&nbsp;</span>' + row.id + ': ' + row.remark + '<span class="small">&nbsp;做什么？</span>'
      this.actionsheet.show = true
    },
    add () {
      this.popupBox.modify_id = 0
      this.popupBox.title = '购买SS账号'
      this.popupBox.formData.title = ''
      this.popupBox.showAdd = true
    },
    info () {
      this.popupBox.title = '查看SS账号连接信息'
      this.popupBox.showInfo = true
    },
    edit () {
      this.popupBox.title = '编辑SS账号'
      this.popupBox.showEdit = true
    },
    del () {
      let that = this
      let msg = '<b>' + that.popupBox.formData.title + '</b><br /><font color=red>删除后将为您保留60天</font>'
      window.$vuf.confirm(msg, function () {
        let params = {}
        params.modify_id = that.popupBox.modify_id
        window.api.post('/panel/diantai/manage/program/del.php', params, function (data) {
          that.update()
        })
      }, '确定要删除吗？')
    },
    submit () {
      let that = this
      var path = '/panel/ssproxy/port/add.php'
      let row = this.popupBox.formData
      if (this.popupBox.modify_id) {
        row.modify_id = this.popupBox.modify_id
        path = '/panel/ssproxy/port/save.php'
      }
      window.api.post(path, row, function (data) {
        that.update()
        that.popupBox.showAdd = false
        that.popupBox.showEdit = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box2-wrap {
  height: 3000px;
}
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
