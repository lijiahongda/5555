import {ajaxUniversity} from "../../../api/strategyApi"
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    page:1
  },
  created() {
    
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    this.getData()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    webUrl(e){
      console.log(e)
      let url = encodeURIComponent(e.currentTarget.dataset.url)
      console.log(url)
      wx.navigateTo({
        url: '/page/Community/pages/webUrl/webUrl?url=' + url,
      })
    },
    getData() {
      let that = this
      // 刷新个人信息
      let data = {
        page:this.data.page
      }
      ajaxUniversity(data).then(res=>{

        if (res.code == 200) {
          that.setData({
            list: that.data.list.concat(res.data.list)
          })
        }
      })


      // get('/university/v2/list/10199/10/' + this.data.page, {}, (res) => {
      //   if (res.data.code == 200) {
      //     that.setData({
      //       list: that.data.list.concat(res.data.data.list)
      //     })
      //   }
      // }, 1, this.data.token, true, this.data.uid, 1)
    },
    more(){
      console.log('more')
      this.setData({
        page:this.data.page+1
      })
      this.getData()
    }
  }
})
