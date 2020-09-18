// pages/commodityList/index.js
const app = getApp()
import {
  jdHomeIndex,
  jdHomeSearchGoodsList,
  addAssistantPush,
  getJdGoodsThreePieces,
  JdGoodsKeyword,
  jdGoodsShareData,
  ownGoods,
  hotHotelShow
} from '../../api/cps'
import {
  getTJshop,
  getFICshop
} from '../../api/personal'
import {hotelGoodsShare,hotelCardShare} from "../../api/hotel"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData: [], //酒店爆品
    topIcon: [],
    twoIndex: 0,
    imgUrls: [],
    // 机器助理
    x: 0,
    y: '420rpx',
    tabs: 'jdshop',
    isExclusiveRobot: app.globalData.isExclusiveRobot, //0没有专属机器人 1有专属机器人
    tab: [true, false],
    bannerBg: ['linear-gradient(180deg,rgba(53,120,207,1) 0%,rgba(248,248,248,1) 100%);'],
    jdListIcon: ["http://image.zhiding365.com/2020/8/19/5fa96f1d-b0e6-42e3-801a-f15f7109fb0f.png",
      "http://image.zhiding365.com/2020/8/19/c08f3a63-fe28-400e-9bd4-6e6b7dec9cc9.png",
      "http://image.zhiding365.com/2020/8/19/e3faed07-dfe2-4dec-9e76-671b03ca47c6.png"
    ],
    recommendList: {}, //推荐商品列表
    recommendImg: '', //推荐商品左侧图片
    searchVal: '', //搜索框值
    searchDefault: '', //搜索默认值
    hotHotelIfShow: 0, //酒店爆品是否展示  1展示，0不展示	
    hotelPackage: 0, //酒店套餐是否展示  1展示，0不展示	
    mallGood: 0, //特价商品是否展示  1展示，0不展示	
    tabidx:0,
  },
  ficList() { // 获取酒店套餐列表
    let data = {
      memberId: wx.getStorageSync('memberId'),
      dealerId: wx.getStorageSync('dealerId'),
      customerId: wx.getStorageSync('customerId'),
      page: 1
    }

    getFICshop(data).then(res => {
      if (res.data) {
        let shopData = []
        for (let s of res.data.productCardDTOList) {
          shopData.push({
            name: s.cardName,
            picurl: s.coverImage,
            coupon: '',
            progress_num: 'empty',
            comment_num: 0,
            buy_num: '',
            vipPrice: s.cardPrice,
            oprice: s.originalPrice,
            btntype: app.globalData.isExclusiveRobot == 0 ? ['', 'copy', 'share', '', ''] : ['add', 'copy', 'share', '', ''],
            promote_price: '',
            goodsId: s.cardId,
            listType: 2,
            // isAddAssistant:s.isAddAssistant
          })
        }

        this.setData({
          shopData: shopData
        })
      }
    })
  },
  changetab(e) {
    var idx = e.currentTarget.dataset.idx;
    if (idx == 0) {
      this.getMallList()
    }
    if (idx == 1) {
      this.ficList()
    }
    var mk = []
    this.data.tab.forEach((item, index) => {
      if (index == idx) {
        mk.push(true)
      } else {
        mk.push(false)
      }
    })
    this.setData({
      tab: mk,
      tabidx:idx
    })
  },
  // 分类
  onTwoItemClick: function (e) {
    let that = this
    let {
      item
    } = e.currentTarget.dataset, idx = e.currentTarget.dataset.idx
    that.setData({
      twoIndex: idx,
      classId: item.id
    })
    this.getList()
    if (idx != 0) {
      // that.SecondaryActivitiesData(item)
    }
  },
  searchBind: function (e) {
    this.setData({
      searchVal: e.detail
    })
    if (e.detail) {
      wx.navigateTo({
        url: '/supermarket/mall/searchList/index?key=' + e.detail,
      })
      this.setData({
        searchVal: ''
      })
    }
  },
  commonHead_left_back: function () {
    wx.navigateBack();
  },
  commonHead_left_home: function () {
    wx.reLaunch({
      url: '/page/TrainTicketsHome/TrainTicketsHome'
    })
  },
  // 金刚位跳转
  onIcon(e) {
    wx.navigateTo({
      url: '/supermarket/mall/jdShop/jdShop?eliteId=' + e.currentTarget.dataset.item.id + '&title=' + e.currentTarget.dataset.item.name,
    })
  },
  // 社群赚
  goCommunity(){
    wx.navigateTo({
      url: '/page/Community/index',
    })
  },
  // 攻略
  goStartegy(){
    wx.navigateTo({
      url: '/page/strategy/index/index',
    })
  },
  gethomeData() {
    let data = {
      type: 1,
      uid: wx.getStorageSync('memberId')
    }
    jdHomeIndex(data).then(res => {
      let imgUrls = []
      for (let s of res.data.bannerData) {
        imgUrls.push({
          imgUrl: s.img_url,
          link: s.link
        })
      }
      this.setData({
        topIcon: res.data.classData,
        iconData: res.data.iconData,
        imgUrls: imgUrls,
        classId: res.data.classData[0].id
      })
      this.getJdGoodsThreePieces()
      this.JdGoodsKeyword()
      this.getList()
    })
  },

  // 中间推荐商品
  getJdGoodsThreePieces: function () {
    getJdGoodsThreePieces({}).then(res => {
      let recommendList = []
      for (let s of res.data.goods) {
        recommendList.push({
          img: s.goodsInfo.goods_image,
          goodsId: s.goodsInfo.goods_id,
          oPrice: s.goodsInfo.original_price,
          vipPrice: s.goodsInfo.jd_price,
        })
      }
      this.setData({
        recommendImg: res.data.image,
        recommendList: recommendList,
      })
    })

  },
  getList() {
    let data = {
      classId: this.data.classId,
      page: 1,
      pageSize: 10
    }
    jdHomeSearchGoodsList(data).then(res => {
      console.log(res, 'resresres')
      let jdList = []
      for (let s of res.data) {
        jdList.push({
          name: s.goodsInfo.goods_name,
          picurl: s.goodsInfo.goods_image,
          coupon: s.coupon,
          progress_num: 'empty',
          comment_num: 0,
          buy_num: s.goodsInfo.sale_num,
          vipPrice: s.goodsInfo.jd_price,
          oprice: s.goodsInfo.original_price,
          btntype: app.globalData.isExclusiveRobot == 0 ? ['', 'copy', 'share', '', ''] : ['add', 'copy', 'share', '', ''],
          promote_price: s.commission_info.earn_price,
          goodsId: s.goodsInfo.goods_id,
          listType: 2,
          // isAddAssistant:s.isAddAssistant
        })
      }
      this.setData({
        jdList: jdList
      })
    })
  },
  // 搜索默认值
  JdGoodsKeyword: function () {
    JdGoodsKeyword({}).then(res => {
      console.log(res, 'morezhi')
      this.setData({
        searchDefault: res.data.keyword
      })
    })
  },
  // 加入群助理
  handleAdd: function (e) {
    console.log(e)
    let data = {
      mid: wx.getStorageSync('memberId'),
      goods_type: 2,
      goodsId: e.detail.goodsId,
      activity_id: e.detail.activityId,
      product_sku_id: e.detail.skuid
    }
    addAssistantPush(data).then(res => {
      console.log(res, '加入助理')
      wx.showToast({
        title: '加入成功',
        icon: 'none'
      })
    })
  },
  jdshop(e) {
    this.setData({
      tabs: e.currentTarget.dataset.id
    })
  },
  hotelhot(e) {

    this.setData({
      tabs: e.currentTarget.dataset.id
    })
    this.getMallList()
  },
  // 跳转京东详情
  jdDetail(e) {

    console.log(e, '244')
    wx.navigateTo({
      url: '/supermarket/mall/jdDetail/index?goods_id=' + e.currentTarget.dataset.item.goodsId
    })
  },
  // 跳转自营或卡的详情
  commodityShow(e) {
    let obj = e.currentTarget.dataset.obj
    if (this.data.tabidx==1) { // 虚拟商品
      wx.navigateTo({
        url: '/supermarket/mall/shopVR/detail?id=' + obj.goodsId,
      })
      return
    }
    wx.navigateTo({
      url: "/supermarket/shop/detail/index?sid=" + obj.goodsId + "&shopid=" + wx.getStorageSync("shid") + "&dealerId=" + wx.getStorageSync("dealerId")
    });
  },
  // 机器助理
  transmit() {
    wx.navigateTo({
      url: '/supermarket/mall/jdAssistant/jdAssistant',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var that = this;
    console.log(query, 'queryquery')

    wx.getSystemInfo({
      success(res) {
        that.setData({
          "commonHeadHeight.statusBarHeight": (34 * 2),
          "commonHeadHeight.titleHeight": res.statusBarHeight + 46
        });
      }
    })
    this.gethomeData()
    this.hotHomeShow() //判断是否展示酒店爆品
  },
  // 判断是否展示酒店爆品
  hotHomeShow() {
    let data = {
      dealerId: wx.getStorageSync("dealerId"),
    }
    hotHotelShow(data).then(res => {
      if (res.code == 200) {
        this.setData({
          hotHotelIfShow: res.data.hotHotelIfShow, //酒店爆品是否展示  1展示，0不展示	
          hotelPackage: res.data.hotelPackage, //酒店套餐是否展示  1展示，0不展示	
          mallGood: res.data.mallGood, //特价商品是否展示  1展示，0不展示	
        })
      }
    })
  },

  // 酒店爆品
  getMallList() {
    let data = {
      dealerId: wx.getStorageSync("dealerId"),
      curPage: 1,
      pageSize: 10
    }
    getTJshop(data).then(res => {
      if (res.code == 200) {
        let shopData = []
        for (let s of res.data.docs) {
          shopData.push({
            name: s.productName,
            picurl: s.imageUrl,
            coupon: '',
            progress_num: 'empty',
            comment_num: 0,
            buy_num: '',
            vipPrice: s.price / 100,
            oprice: '',
            btntype: app.globalData.isExclusiveRobot == 0 ? ['', 'copy', 'share', '', ''] : ['add', 'copy', 'share', '', ''],
            promote_price: '',
            goodsId: s.productId,
            listType: 2,
            // isAddAssistant:s.isAddAssistant
          })
        }
        this.setData({
          shopData: shopData
        })

      }
    })
  },


  onShareAppMessage() {
    return {
      title: '来直订，购京东，享优惠，分享还可以赚哟~',
      imageUrl: "https://yuetao-1300766538.cos.ap-beijing.myqcloud.com//yuetao//image//2020-06-29//00//yuelvhuiBLAJtnFof21593360893.jpg",
      path: 'supermarket/mall/commodityList/index'
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("globalData", app.globalData)
    this.setData({
      isExclusiveRobot: app.globalData.isExclusiveRobot
    })
    let pages = getCurrentPages() //获取加载的页面
    let currentPage = pages[pages.length - 1] //获取当前页面的对象
    let options = currentPage.options;
    
    if (JSON.stringify(options) == "{}") {

    } else {
      if (!wx.getStorageSync('memberId')) {
        if (app.globalData.isStrongLogin == 1) {
          wx.navigateTo({
            url: '/pages/login/index'
          })
        }
      }
    }
  },







  // 复制文案
  handleCopy: function (e) {
    console.log(e)
    // if (e.detail.listType == 2) {//京东
    this.dataInitShare(e.detail.goodsId, e.detail.picurl, 1,e.detail.vipPrice, e.detail.oprice,e.detail.name)
    // } else if (e.detail.listType == 1) {//拼多多
    //   this.pddGoodsShareData(e.detail.goodsId, e.detail.picurl, 1)
    // } else if (e.detail.listType == 4) {
    //   if (e.detail.goodsType == 1) {//自营
    //     this.shopGoodsCopyText(e.detail.productId,e.detail.productSkuId)
    //   } else if (e.detail.goodsType == 2) {//京东
    //     this.dataInitShare(e.detail.productId, e.detail.picurl, 1)
    //   } else if (e.detail.goodsType == 3) {//拼多多
    //     this.pddGoodsShareData(e.detail.productId, e.detail.picurl, 1)
    //   }
    // }
  },
  // 分享海报
  handleShare: function (e) {
    console.log('----', e)
    // if (this.data.tabs == 'jdshop') {//京东
    this.dataInitShare(e.detail.goodsId, e.detail.picurl, 2, e.detail.vipPrice, e.detail.oprice,e.detail.name)
    // } else {
    //     this.dataInitShare(wx.getStorageSync('uid'), e.detail.goodsId, e.detail.productSkuId, 1, e.detail.productId, e.detail.picurl, '', 1)
    // }
  },
  //京东复制文案数据
  dataInitShare: function (goodsid, bannerItem, type, vipPrice, price,name) {
    let that = this
    wx.showLoading()
    var data = {
      goods_id: goodsid,
      uid: wx.getStorageSync('memberId'),
      type: 2
    }
    let producttype=''
      if(this.data.tabs=='jdshop'){
       producttype=2
      }else if(this.data.tabs=='hotelhot'){
        producttype=1
      }
    if(type==1){
      let CopyText = ''
      if(this.data.tabidx==0&&this.data.tabs=='hotelhot'){
        // 特价商品
        hotelGoodsShare({
          uid:wx.getStorageSync("memberId"),
          delearId:wx.getStorageSync("dealerId"),
          goodsId:goodsid,
          price:vipPrice,
          hotelName:wx.getStorageSync('dealerName'),
          goodsName:name

        }).then(res=>{
          console.log(res);
          if(res.code==200){
           CopyText =  '👇👇👇' + '\n' + res.data.goods_name + ' \n' + res.data.sale_desc + '\n' + res.data.buy_desc + '\n' + res.data.panic_link
            wx.setClipboardData({
                //去找上面的数据
                data: CopyText,
                success: function (res) {
                    wx.getClipboardData({
                      success (res) {
                        wx.showToast({
                          title:"复制成功",
                        });
                        that.triggerEvent("handleCloseDialog");
                      }
                    })
                }
            });
          }
        })  
        return
      }else if(this.data.tabidx==1&&this.data.tabs=='hotelhot'){
        // 酒店套餐
        hotelCardShare({
          cardId:goodsid,//卡id
          delearId:wx.getStorageSync('dealerId'),
          uid:wx.getStorageSync('memberId'),
          dealerName:wx.getStorageSync('dealerName'),// 酒店名称
          cardName:name,// 虚拟卡名称
          originalPrice:price,// 在售价
          cardPrice:vipPrice// 价格
        }).then (res => {
          console.log(res,'zhelisss')
          CopyText =  '👇👇👇' + '\n' + res.data.goods_name + ' \n' + res.data.sale_desc + '\n' + res.data.buy_desc + '\n' + res.data.panic_link
            wx.setClipboardData({
                //去找上面的数据
                data: CopyText,
                success: function (res) {
                    wx.getClipboardData({
                      success (res) {
                        wx.showToast({
                          title:"复制成功",
                        });
                        that.triggerEvent("handleCloseDialog");
                      }
                    })
                }
            });
          wx.hideLoading();
       })
        return
      }
      jdGoodsShareData(data).then(res => {
        if (res.code == 200) {
            wx.hideLoading()
            CopyText = '👇👇👇' + '\n' + res.data.good_info.goods_name + ' \n' + res.data.good_info.sale_desc + '\n' + res.data.good_info.buy_desc + '\n' + res.data.good_info.panic_desc + '\n' + res.data.good_info.panic_link
            wx.setClipboardData({
              data: CopyText,
              success(res) {
                wx.getClipboardData({
                  success(res) {}
                })
              },
              complete(res) {}
            })
          console.log(type)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      })
    }else if (type == 2) {
     // 生成H5海报
     var data = {
       product_id: goodsid,
       dealerId: wx.getStorageSync("dealerId"),
       type: producttype, //1自营 2京东 3白拿
       mid: wx.getStorageSync("memberId"),
       sku_id: "",
       vipPrice: vipPrice,
       price: price,
       pImg: bannerItem,
       pName: name
     }
     this.ajaxHaiBao(data)
   }
  },
  ajaxHaiBao(data) {
    //生成海报

    wx.showLoading({
      title: '海报生成中',
      mask: true
    });

    // let params = {
    //   product_id:this.data.goodsInfo.goods_id,
    //   dealerId:wx.getStorageSync("dealerId"),
    //   type:2,//1自营 2京东 3白拿
    //   mid: wx.getStorageSync("memberId"),
    //   sku_id:"",
    //   vipPrice:this.data.goodsInfo.jd_price,
    //   price:this.data.goodsInfo.original_price,
    //   pImg:this.data.goodsInfo.goods_image[0],
    //   pName:this.data.goodsInfo.goods_name
    // }


    ownGoods(data).then(res => {
      console.log("海报接口", res);
      this.setData({
        posterObj: {
          status: 1,
          url: res.data
        }
      })
      wx.hideLoading();
    })
  },
  handleBox() {
    //隐藏海报和分享的弹窗
    let _key = "posterObj.status"
    this.setData({
      [_key]: 0,
      shareSelectStatus: 0
    })
  },
})