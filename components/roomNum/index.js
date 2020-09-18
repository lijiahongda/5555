// components/roomNum/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    roomNum: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    close: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-16/22/yuelvhuisyCKcbeGIx1587047288.png',
    jian: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-23/03/yuelvhuiNQ3vvJZEA51587582784.png',
    jia: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-23/03/yuelvhuiazc1gYW2041587583004.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 减房间数
    jian: function () {
      console.log('2222')
      let num = this.data.roomNum
      
      if (num == 1) {
        wx.showToast({
          title: '至少选择一间房',
          icon: 'none'
        })
      } else {
        num = num - 1
        this.setData({
          roomNum:num
        })
      }
      this.triggerEvent('setRoomNum',num)
    },
    // 加房间数
    jia: function () {
      console.log('22223333')
      let num = this.data.roomNum
      num = num + 1
      console.log(num)
      this.setData({
        roomNum: num
      })
      this.triggerEvent('setRoomNum',num)
    },
    // 手动输入房间数
    roomNumInput:function(e){
      this.setData({
        roomNum:e.detail.value
      })
      console.log(e.detail.value)
      this.triggerEvent('setRoomNum',e.detail.value)
    },
    // 关闭弹窗
    close: function () {
      this.setData({
        isShow: false
      })
    },
    // 确认
    sure: function () {
      this.setData({
        isShow: false
      })
    }
  }
})
