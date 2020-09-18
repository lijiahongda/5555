// components/rpItem/rpItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    room: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 0
    },
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
    handleShowChildList(e) {
      console.log(e);
      let that = this;
  
      let _key = 'room.showStatus'
      if (that.data.room.showStatus == 1) {
        that.setData({
          [_key]: 0
        })
      } else {
        that.setData({
          [_key]: 1
        })
        // if(this.data.roomList.length == index* 1 +1){
        //   //代表点击的最后一个
        //   wx.pageScrollTo({
        //     scrollTop: 100000000
        //   })
        // }
      }
    
    },

    switch(e){
      this.triggerEvent('myevent', e.currentTarget.dataset);   //子组件传给父组件参
    },
  }
})
