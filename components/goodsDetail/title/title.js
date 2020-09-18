// component/goodsDetail/title/tiitle.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addstatus:{
      type: String,
      value: ''
    },
    isAddAssistant:{
      type: String,
      value: ''
    },
    sevenstatus:{
      type: String,
      value: '1'
    },
    status:{
      type: String,
      value: ''
    },
    title: { // 属性名
      type: String,
      value: ''
    },
    image:{
      type: String,
      value: ''
    },
    tip: {
      type: String,
      value: ''
    },
    openMember:{
      type: Number,
      value:0
    },
    reasonShow:{
      type:Boolean,
      value:false
    },
    reasonData:{
      type: String,
      value: ''
    },
    typeC:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    openMember(){
      wx.switchTab({
        url: '/page/EliteCard/EliteCard',
      })
    },
    copy:function(e){
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success(res) {
          wx.getClipboardData({
            success(res) { }
          })
        },
        complete(res) { }
      })
    },
    handleAddZl(){

      this.triggerEvent("handleAddZl")


    },
  }
})
