<template>
  <div>
    <group :title="group_title">
      <cell v-if="rows.length===0" align="center" title="您尚未购买SS账号"></cell>
      <!--<scroller lock-x scrollbar-y use-pullup use-pulldown height="350px" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" v-model="status" ref="scroller">-->
      <scroller v-if="rows.length>0" lock-x scrollbar-y use-pulldown height="350px" @on-pulldown-loading="refresh" ref="scroller" v-model="status">
        <!--content slot-->
        
        <!--<cell v-for="row of rows" :key="row.id" :title="row.text" :value="$t('Entry')" @click.native="actionsheetShow(row)"></cell>-->
        <div class="box2">
          <cell v-for="row of rows" :key="row.id" :title="row.text" :value="$t('Entry')" @click.native="actionsheetShow(row)"></cell>
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
      <x-button @click.native="add" type="primary">{{$t('BuySSAccount')}}</x-button>
    </box>
    <actionsheet v-model="actionsheet.show" :menus="actionsheet.menus" @on-click-menu-info="info()" @on-click-menu-edit="edit()" @on-click-menu-delete="del()" show-cancel></actionsheet>
    <div v-transfer-dom>
      <popup v-model="popupBox.showAdd" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
            <selector ref="location" :title="$t('SelectLocation')" placeholder="$t('ChoiceLocation')" v-model="popupBox.formData.location_id" :options="locationList" @on-change="onChangeMoney"></selector>
            <selector ref="transferGb" :title="$t('TransferGb')" placeholder="$t('ChoineTransferGb')" v-model="popupBox.formData.transferGb_id" :options="transferList" @on-change="onChangeMoney"></selector>
            <selector ref="keepdays" :title="$t('BuyKeepDays')" placeholder="$t('ChoiceKeepDays')" v-model="popupBox.formData.keepdays" :options="keepdaysList" @on-change="onChangeMoney"></selector>
            <x-input :title="$t('Remark')" placeholder="" v-model="popupBox.formData.remark"></x-input>
            <cell :title="$t('OrderPrice')"><s>{{$t('OldPrice')}} 999 {{$t('Yuan')}}</s> <b style="color:red">{{$t('NewPrice')}}￥{{popupBox.formData.sumPrice}} {{$t('Yuan')}}</b></cell>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <flexbox-item><x-button type="primary" @click.native="submit()">{{$t('OK')}}</x-button></flexbox-item>
              <flexbox-item><x-button @click.native="popupBox.showAdd=false">{{$t('Cancel')}}</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
      <popup v-model="popupBox.showInfo" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
            <x-input :title="$t('ServerIP')" placeholder="" v-model="popupBox.formData.ipv4" readonly></x-input>
            <x-input :title="$t('ServerPort')" placeholder="" v-model="popupBox.formData.port" readonly></x-input>
            <x-input :title="$t('ConnPass')" placeholder="" v-model="popupBox.formData.passwd" readonly></x-input>
            <x-input :title="$t('CryptMethod')" placeholder="" value="aes-256-cfb" readonly></x-input>
            <x-input :title="$t('Protocol')" placeholder="" value="origin" readonly></x-input>
            <x-input :title="$t('Obfs')" placeholder="" value="plain" readonly></x-input>
            <x-input :title="$t('SSRLink')" placeholder="" v-model="popupBox.formData.ssrlink" readonly></x-input>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <!--<flexbox-item><x-button type="primary" @click.native="submit()">{{$t('OK')}}</x-button></flexbox-item>-->
              <flexbox-item><x-button @click.native="popupBox.showInfo=false">{{$t('Close')}}</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
      <popup v-model="popupBox.showEdit" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
            <x-input :title="$t('Remark')" placeholder="" v-model="popupBox.formData.remark"></x-input>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <flexbox-item><x-button type="primary" @click.native="submit()">{{$t('Save')}}</x-button></flexbox-item>
              <flexbox-item><x-button @click.native="popupBox.showEdit=false">{{$t('Cancel')}}</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<i18n>
ServerIP:
  en: Server IP
  zh-CN: 服务器IP
ServerPort:
  en: Server Port
  zh-CN: 服务端口
ConnPass:
  en: Password
  zh-CN: 连接密码
CryptMethod:
  en: Crypt Method
  zh-CN: 加密方式
Protocol:
  en: Protocol
  zh-CN: 协议
Obfs:
  en: Obfs
  zh-CN: 混淆
SSRLink:
  en: SSR Link
  zh-CN: SSR链接
Save:
  en: Save
  zh-CN: 保存修改
Cancel:
  en: Cancel
  zh-CN: 取消
Close:
  en: Close
  zh-CN: 关闭
OK:
  en: OK
  zh-CN: 确定
Entry:
  en: Entry
  zh-CN: 操作
ModifyRemark:
  en: Modify Remark
  zh-CN: 修改备注
ShowSSInfo:
  en: Show Info of the SS
  zh-CN: 查看SS账号连接信息
Traffic:
  en: Traffic
  zh-CN: 流量
OperationMenu:
  en: Operation Menu
  zh-CN: 请选择您要的操作
Remark:
  en: Remark
  zh-CN: 备注
EditTitle:
  en: Edit Info for SS
  zh-CN: 编辑SS账号
MySSAccount:
  en: My SS Account
  zh-CN: 我的SS账号
BuySSAccount:
  en: Buy a SS Account
  zh-CN: 购买SS账号
SelectLocation:
  en: Location
  zh-CN: 所在地区
ChoiceLocation:
  en: Buy a SS Account
  zh-CN: 选择VPN服务器所在地
TransferGb:
  en: Transfer(Gb)
  zh-CN: 流量大小
ChoineTransferGb:
  en: Choine Transfer (Gb)
  zh-CN: 选择您要购买的流量大小
BuyKeepDays:
  en: Keep Days
  zh-CN: 有效时长
ChoiceKeepDays:
  en: Choice KeepDays
  zh-CN: 选择您要保留的时长
OrderPrice:
  en: Order Price
  zh-CN: 订单价格
OldPrice:
  en: OldPrice
  zh-CN: 原价
NewPrice:
  en: NewPrice
  zh-CN: 现价
Yuan:
  en: Yuan
  zh-CN: 元
</i18n>

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
          'title.noop': this.$t('OperationMenu'),
          info: this.$t('ShowSSInfo'),
          edit: this.$t('ModifyRemark')
          // delete: '<span style="color:red">删除SS账号</span>'
        }
      },
      popupBox: {
        show: false,
        showAdd: false,
        showInfo: false,
        showEdit: false,
        title: this.$t('EditTitle'),
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
      group_title: this.$t('MySSAccount'),
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
      var locationTitle = this.getOption(this.locationList, this.popupBox.formData.location_id)
      if (this.$i18n.locale() === 'zh-CN') {
        locationTitle = locationTitle.title_cn
      } else {
        locationTitle = locationTitle.title_en
      }
      this.popupBox.formData.remark = locationTitle + ' ' + transferRow.transfer_gb + 'GB ' + this.$t('Traffic')
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
            row2['value'] = row2.title_en
            if (that.$i18n.locale() === 'zh-CN') {
              row2['value'] = row2.title_cn
            }
            that.locationList.push(row2)
          }
        }
        if (data.hasOwnProperty('transferList')) {
          that.transferList = []
          for (var key3 in data.transferList) {
            var row3 = data.transferList[key3]
            row3['key'] = row3.id
            if (that.$i18n.locale() === 'zh-CN') {
              row3.value = row3.transfer_gb + ' GB ' + that.$t('Traffic') + '￥' + row3.price + that.$t('Yuan')
            } else {
              row3.value = '￥' + row3.price + ' ' + that.$t('Yuan') + ' for ' + row3.transfer_gb + ' GB ' + that.$t('Traffic')
            }
            that.transferList.push(row3)
          }
        }
        if (data.hasOwnProperty('keepdaysList')) {
          that.keepdaysList = []
          for (var key4 in data.keepdaysList) {
            var row4 = data.keepdaysList[key4]
            row4.key = row4.days
            row4.value = row4.title_en
            if (that.$i18n.locale() === 'zh-CN') {
              row4.value = row4.title_cn
            }
            that.keepdaysList.push(row4)
          }
        }
        for (var key in that.rows) {
          var row = that.rows[key]
          // row.text = row.ipv4 + ':' + row.port
          row.text = row.id + ': ' + row.remark
          var bytes = parseInt(row.transfer_upload, 10) + parseInt(row.transfer_download, 0)
          row.text += ' (' + that.getHumanFormat(bytes) + ' / ' + row.transfer_enable_gb + 'GB)'
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
      // this.actionsheet.menus['title.noop'] = '<span class="small">要对&nbsp;</span>' + row.id + ': ' + row.remark + '<span class="small">&nbsp;做什么？</span>'
      this.actionsheet.show = true
    },
    add () {
      this.popupBox.modify_id = 0
      this.popupBox.title = this.$t('BuySSAccount')
      this.popupBox.formData.title = ''
      this.popupBox.showAdd = true
    },
    info () {
      this.popupBox.title = this.$t('ShowSSInfo')
      this.popupBox.showInfo = true
    },
    edit () {
      this.popupBox.title = this.$t('EditTitle')
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
