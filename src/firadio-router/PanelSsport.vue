<template>
  <div>
    <group :title="group_title">
      <cell v-if="rows.length===0" align="center" title="您尚未购买SS账号"></cell>
      <cell v-for="row of rows" :key="row.id" :title="row.text" value="操作" @click.native="actionsheetShow(row)">
      </cell>
    </group>
    <box gap="10px 10px">
      <x-button @click.native="add" type="primary">购买SS账号</x-button>
    </box>
    <actionsheet v-model="actionsheet.show" :menus="actionsheet.menus" @on-click-menu-info="info()" @on-click-menu-edit="edit()" @on-click-menu-delete="del()" show-cancel></actionsheet>
    <div v-transfer-dom>
      <popup v-model="popupBox.showAdd" is-transparent>
        <div style="width: 95%;background-color:#fff;margin:10px auto;border-radius:5px;padding-top:10px;">
          <group :title="popupBox.title">
            <selector title="选择流量" placeholder="选择您要购买的流量大小" v-model="popupBox.formData.transferGb_id" :options="transferGbList"></selector>
          </group>
          <div style="padding:20px 15px;">
            <flexbox>
              <flexbox-item><x-button type="primary" @click.native="submit()">确定</x-button></flexbox-item>
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
              <flexbox-item><x-button type="primary" @click.native="submit()">确定</x-button></flexbox-item>
              <flexbox-item><x-button @click.native="popupBox.showInfo=false">取消</x-button></flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import {TransferDom, Box, Flexbox, FlexboxItem, XButton, Cell, Group, XDialog, Actionsheet, Popup, XInput, XNumber, Selector, XTextarea} from 'vux'

export default {
  directives: { TransferDom },
  components: {Box, Flexbox, FlexboxItem, XButton, Cell, Group, XDialog, Actionsheet, Popup, XInput, XNumber, Selector, XTextarea},
  created () {
    this.update()
  },
  data () {
    return {
      actionsheet: {
        show: false,
        menus: {
          'title.noop': '请选择您要的操作',
          // zhitiaoList: '查看SS账号小纸条',
          info: '查看SS账号连接信息'
          // edit: '编辑SS账号',
          // delete: '<span style="color:red">删除SS账号</span>'
        }
      },
      popupBox: {
        show: false,
        showAdd: false,
        showInfo: false,
        title: '编辑SS账号',
        formData: {
          ipv4: ''
        }
      },
      station: {id: 0},
      transferGbList: [],
      lanmuList: [],
      group_title: '我的SS账号',
      rows: []
    }
  },
  methods: {
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
        if (data.hasOwnProperty('transferGb')) {
          that.transferGbList = []
          for (var key2 in data.transferGb) {
            var row2 = data.transferGb[key2]
            that.transferGbList.push({'key': row2.id, 'value': '' + row2.title})
          }
        }
        for (var key in that.rows) {
          var row = that.rows[key]
          row.text = row.ipv4 + ':' + row.port
          if (row.summary) {
            row.text += ' (' + row.summary + ')'
          }
        }
      })
    },
    actionsheetShow (row) {
      this.popupBox.program_id = row.id
      this.popupBox.formData.transferGb_id = row.transferGb_id
      this.popupBox.formData.ipv4 = row.ipv4
      this.popupBox.formData.port = row.port
      this.popupBox.formData.passwd = row.passwd
      this.popupBox.formData.summary = row.summary
      this.popupBox.formData.ssrlink = row.ssrlink
      this.actionsheet.menus['title.noop'] = '<span class="small">要对&nbsp;</span>' + row.ipv4 + ':' + row.port + '<span class="small">&nbsp;做什么？</span>'
      this.actionsheet.show = true
    },
    add () {
      this.popupBox.program_id = 0
      this.popupBox.title = '购买SS账号'
      this.popupBox.formData.title = ''
      this.popupBox.formData.summary = ''
      this.popupBox.showAdd = true
    },
    info () {
      this.popupBox.title = '查看SS账号连接信息'
      this.popupBox.showInfo = true
    },
    edit () {
      this.popupBox.title = '编辑SS账号'
      this.popupBox.showInfo = true
    },
    del () {
      let that = this
      let msg = '<b>' + that.popupBox.formData.title + '</b><br /><font color=red>删除后将为您保留60天</font>'
      window.$vuf.confirm(msg, function () {
        let params = {}
        params.program_id = that.popupBox.program_id
        window.api.post('/panel/diantai/manage/program/del.php', params, function (data) {
          that.update()
        })
      }, '确定要删除吗？')
    },
    submit () {
      let that = this
      var path = '/panel/ssproxy/port/add.php'
      let row = this.popupBox.formData
      if (this.popupBox.port_id) {
        row.port_id = this.popupBox.port_id
        path = '/panel/diantai/manage/program/modify.php'
      }
      window.api.post(path, row, function (data) {
        that.update()
        that.popupBox.showAdd = false
      })
    }
  }
}
</script>

<style>
.small {
  color: #666;
  font-size: 14px;
}
</style>
