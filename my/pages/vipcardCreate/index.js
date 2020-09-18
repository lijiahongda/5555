import {
  cardCreateDetail,
  cardCreate
} from '../../../api/personal'

Page({
  data: {
    Detail: {},
    cardId:'',
    cpsCustomerId:'',
    adminId:''
  },
 
  onShow() {
    let that = this;
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;

    console.log(options, "分享参数接收")
    that.setData({
      cardId:options.cardId,
      cpsCustomerId:options.cpsCustomerId,
      adminId:options.adminId?options.adminId:'',
    })

    that.getList()
    
   

  },
   // 列表详情
   getList() {
    let that = this
    let data = {
      memberId: wx.getStorageSync('memberId'),
      dealerId: wx.getStorageSync('dealerId'),
      customerId: wx.getStorageSync('customerId'),
      cardId:that.data.cardId
    }
    cardCreateDetail(data).then(res => {
      console.log(res, '会员卡返值1111')
      that.setData({
        Detail:res.data
      })
    })
  },


  open() {
    let that = this;
    let item = that.data.Detail
    
    let obj = {
      "adminId": that.data.adminId,// 酒店管理员id
      "cardId": item.unionCardSubDTO.cardId,// 卡id
      "cardLevel": item.unionCardSubDTO.cardLevel,// 卡等级
      "cardLevelId": item.unionCardSubDTO.cardLevelId,//  卡等级id
      "cardName": item.unionCardSubDTO.cardName,// 卡名称
      "cardPrice": item.unionCardSubDTO.cardPrice,//    价格
      "customerId": wx.getStorageSync("customerId"),//   用户id
      "dealerId": wx.getStorageSync('dealerId'),//   酒店id
      "orderAmount": item.unionCardSubDTO.cardPrice,//      订单金额
      "oriAmount": item.unionCardSubDTO.cardPrice,//  原金额
      "payAmount": item.unionCardSubDTO.cardPrice,// 订单支付金额
      "sysSource": "zhiding_wxapp",//   直订小程序传这个固定值
      "yuechengCardId": item.unionCardSubDTO.yuechengCardId,//悦城id
      "cpsCustomerId": that.data.cpsCustomerId, // 邀请者 邀请者customer_id
      "memberId":wx.getStorageSync('memberId')
    }

    cardCreate(obj).then(res => {
      let _data = res.data;
      console.log(res,'---')
      wx.navigateTo({
        url: '/hotel/pages/pay/index?oid=' + _data.orderNo + "&hid=" + that.data.dealerId + "&type=5&aid=" + that.data.adminId+'&cardId='+that.data.cardId+'&lastprice='+item.unionCardSubDTO.cardPrice+'&coupon=1'
      })
    }).catch(err => {
    })
  },

})