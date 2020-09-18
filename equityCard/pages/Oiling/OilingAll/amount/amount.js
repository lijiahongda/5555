import {
  getGzbMemberCouponInfo,
  orderPay,
  fuelRule
} from "../../../../../api/cps"
Page({
  data: {
    detailedBox: false, //明细弹框
    detail: {
      plummets: 0,
      consumeReward: 0
    },
    literTitle: '约0L',
    payAmount: 0,
    state:0,//1显示 0隐藏  优惠规则是否展示
  },
  onLoad(option) {
    let that = this
    console.log("option", option);
    that.setData({
      id: option.id,
      listid: option.listid,
      name: option.name,
      price: JSON.parse(option.price),
      type: option.type,
      zname: option.zname,
      goods_id: option.goods_id, //商品id
      attrs: JSON.parse(option.attrs),
      gun_id: option.gun_id, //抢号
    })
    that.showTips()
    console.log(that.data.attrs, 'attrs')
  },
  // 明细
  detailed() {
    this.setData({
      detailedBox: !this.data.detailedBox
    })
  },
  // 是否展示加油规则介绍
  showTips(){
    fuelRule({}).then(res => {
      this.setData({
        state: res.data.state
      })
    })
  },
  detailedClose() {
    this.setData({
      detailedBox: false
    })
  },
  // 输入金额
  bindinputMoney(e) {
    if (e.detail.value <= 1000) {
      this.setData({
        money: e.detail.value
      })
      this.getMoney()
    } else {
      wx.showToast({
        title: '金额小于1000元',
        icon: 'none'
      })
    }
  },
  // 选择金额
  inputMonty(e) {
    this.setData({
      money: e.currentTarget.dataset.item
    })
    this.getMoney()
  },
  getMoney() {
    let that = this
    wx.showLoading()
    getGzbMemberCouponInfo({
      gun: that.data.gun_id, //抢号
      id: that.data.id,
      money: that.data.money,
      name: that.data.name,
      phone: wx.getStorageSync('userinfostr').mobile,
      type: that.data.type
    }).then(res => {
      that.setData({
        detail: res.data,
        literTitle: res.data.literTitle,
        payAmount: res.data.payAmount
      })
    })
  },
  // 规格
  rule() {
    wx.navigateTo({
      url: '/equityCard/pages/Oiling/OilingAll/rule/rule'
    })
  },
  /**
   * 确认支付
   * amount_gun: 300   价格
   * gas_id: 11115     列表id
   * gas_name: "长虹加油加气站"    info.gas_id 
   * gun_no: 8       抢号id
   * litre: 64.24     本页面中  litre
   * name: "92#"    选择油号name
   * number: 92    选择油号id  name删除#后
   * oil_type: 1     选择商品类型
   * other_gas_id: "ZH000012779"   
   * paySource: 3      小程序
   * pay_amount: 299.03   实际支付  本页面中 payAmount
   * price_gun: "4.67"    attr.qiyou.priceGun
   * price_unit: "4.54"    attr.qiyou.priceYfq
   * version: 5       默认值5
   */
  handleBuy() {
    let that = this
    if (that.data.payAmount <= 0) {
      wx.showToast({
        title: '请填写金额',
        icon: 'none'
      })
      return
    }
    wx.showLoading()
    var obj = {
      amount_gun: that.data.money,
      gas_id: that.data.listid,
      gas_name: that.data.zname,
      gun_no: that.data.gun_id,
      litre: that.data.detail.litre,
      name: that.data.name,
      number: that.data.attrs.id,
      oil_type: that.data.attrs.oilType,
      other_gas_id: that.data.id,
      paySource: 3,
      pay_amount: that.data.payAmount,
      price_gun: that.data.attrs.priceGun,
      price_unit: that.data.attrs.priceYfq,
      version: 5,
      appId: 'wx9d427e623c3fb4c4',
      openId: wx.getStorageSync('openId'),
    }
    console.log(obj, '000')
    // return
    orderPay(obj).then(res => {
      let weixininfo = res.data.pay.getwayBody
      console.log(weixininfo, 'weixininfo')
      wx.requestPayment({
        timeStamp: weixininfo.timeStamp,
        nonceStr: weixininfo.nonceStr,
        package: weixininfo.package,
        signType: weixininfo.signType,
        paySign: weixininfo.paySign,
        success(res) {
          console.log("支付成功", res);
          wx.redirectTo({
            url: '/hotel/pages/paySuccess/index'
          });
        },
        fail(res) {
          console.log("支付失败", res, that.data.returnUrl)
          wx.redirectTo({
            url: "/hotel/pages/payFail/index"
          });
        }
      })
    })
  },
});