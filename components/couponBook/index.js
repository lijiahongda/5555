// components/couponBook/index.js
// import {
//   HotelCouponList
// } from '../../api/api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isCoupon: {
      type: Boolean,
      value: false
    }
  },
  attached: function () {
    this.initData()
  },
  /**
   * 组件的初始数据
   */
  data: {
    close: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-16/22/yuelvhuisyCKcbeGIx1587047288.png', //关闭弹窗
    SelectTrue: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-05-08/01/yuelvhui2iVgPXcy4E1588871597.png',
    selectFalse: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-05-08/01/yuelvhuiROmA2nNPDG1588871741.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData: function () {
      let data = {
        memberId: wx.getStorageSync('memberId'),
        // amount:this.data.amount
        amount: 3000

      }
      // HotelCouponList(data).then(res => {
      //   console.log(res)
      //   for (let c of res.isTrue) {
      //     c.isSelect = false
      //   }
      //   if (res.code == 200) {
      //     this.setData({
      //       coupon: res.isTrue
      //     })
      //   }
      // })
    },
    selsctCoupon: function (e) {
      let { id } = e.currentTarget.dataset
      let amount = 0
      for (let c of this.data.coupon) {
        if (id == c.id) {
          c.isSelect = true
          amount = c.amount
        } else {
          c.isSelect = false
        }
      }
      this.setData({
        coupon: this.data.coupon,
        isCoupon:false,
      })
      this.triggerEvent('couponFun',amount)
    },
    closePopup:function(){
      this.setData({
        isCoupon:false
      })
    }
  }
})
