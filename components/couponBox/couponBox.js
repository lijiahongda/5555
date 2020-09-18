// components/couponBox/couponBox.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: {
      type: Object,
      value: []
    },
    states: {
      type: Number,
      value: 0
    },
    // 按钮字
    btn: {
      type: String,
      value: ''
    },
    // 提示字
    tips: {
      type: String,
      value: ''
    },
    buy: {//0首页-未领取  1联名卡 已领取
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    states:0
  },
  // "couponType": 2,  //优惠卷类型        Discount(1, "折扣券"), Cash(2, "现金券"), Exchange(3,"兑换券"), FullSubtraction (4,"满减券"),GiftCoupon(5,"赠品券");

  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.setData({
        states:0
      })
    },
    // 进入酒店列表
    goHotelList(e){
      wx.navigateTo({
        url: '/hotel/pages/pmsList/pmsList',
      })
    },
  }
})
