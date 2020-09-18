// supermarket/shop/CommoditySharing/index.js
const app = getApp();


import request from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverSuit: app.serverSuit(),
    image: [],
    Return: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-30/20/yuelvhuidjEjRAEqX01588248683.png',
    yesImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-26/21/yuelvhuiiNMToTSNzY1582722517.png',
    noImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-26/21/yuelvhui2BYCqBzzlG1582722540.png',
    goodsid: 7651925
  },
  // 复制
  copy: function (e) {
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
  // 选择图片
  clickImage: function (e) {
    let that = this
    let image = that.data.image
    let {
      index,
      shareimage
    } = e.currentTarget.dataset
    for (var i = 0; i < image.length; i++) {
      console.log('e.currentTarget.dataset')
      if (index == i) {
        image[i].ischeck = !image[i].ischeck
        that.setData({
          shareImage: shareimage
        })
      } else {
        image[i].ischeck = false
      }
      that.setData({
        image: image
      })
    }
    that.setData({
      shareImageinit: shareimage
    })
    that.posterJd(that.data.goodsid, wx.getStorageSync('memberId'), shareimage)
  },
  // 默认分享数据
  dataInit: function (goodsid, uid, bannerItem) {
    let that = this
    let data = {
      goods_id: goodsid,
      uid: wx.getStorageSync('memberId'),
      type: 3
    }
    request._post(that.data.serverSuit +'/outside/jd/jdGoodsShareData',data,res=>{
      console.log(res)
      if (res.data.code == 200) {
        let goods_imge = res.data.data.goods_imge ? res.data.data.goods_imge : bannerItem
        console.log(goods_imge)
        let image = that.data.image
        for (var i = 0; i < goods_imge.length; i++) {
          image[i] = {
            ischeck: i == 0 ? true : false,
            img: goods_imge[i]
          }
        }
        that.setData({
          image: image,
          good_info: res.data.data.good_info,
          shareImage: image[0].img,
          poster: image[0].img,
          shareImageinit: image[0].img
        })
        console.log(image[0].img)
        that.posterJd(goodsid, uid, image[0].img)
      } else {
        wx.showToast({
          title: res.data.data.msg,
          icon: 'none'
        })
      }
    })

    // jdGoodsShareData(data).then(res => {
    //   console.log(res)
      
    // })
  },
  // 分享海报
  posterJd: function (goodsid, uid, pic) {
    let that = this
    let data = {
      goods_id: goodsid,
      uid: uid,
      type: 2,
      pic: pic
    }
    console.log('7777')
    request._post(that.data.serverSuit +'/outside/jd/jdGoodsShare',data,res=>{
      console.log(res)
      if (res.data.code == 200) {
        console.log(res)
        that.setData({
          poster: res.data.data.img
        })
      } else {
        wx.showToast({
          title: res.data.data.msg,
          icon: 'none'
        })
      }
    })

    // jdGoodsShare(data).then(res => {
    //   console.log(res)
      
    // })
  },
  // 保存图片
  saveImage: function () {
    let that = this
    console.log(that.data.poster)
    wx.downloadFile({
      url: that.data.poster,
      success: function (res) {
        var benUrl = res.tempFilePath;
        //图片保存到本地相册
        wx.saveImageToPhotosAlbum({
          filePath: benUrl,
          //授权成功，保存图片
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          //授权失败
          fail: function (err) {
            if (err.errMsg) { //重新授权弹框确认
              wx.showModal({
                title: '提示',
                content: '您好,请先授权，在保存此图片。',
                showCancel: false,
                success(res) {
                  if (res.confirm) { //重新授权弹框用户点击了确定
                    wx.openSetting({ //进入小程序授权设置页面
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) { //用户打开了保存图片授权开关
                          wx.saveImageToPhotosAlbum({
                            filePath: benUrl,
                            success: function (data) {
                              wx.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000
                              })
                            },
                          })
                        } else { //用户未打开保存图片到相册的授权开关
                          wx.showModal({
                            title: '温馨提示',
                            content: '授权失败，请稍后重新获取',
                            showCancel: false,
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  onShow:function(){
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
  onShareAppMessage: function () {
    let that = this
    console.log(wx.getStorageSync('mYinviteCode') ,'分享邀请码')
    let url = '/supermarket/mall/jdDetail/index?goods_id=' + that.data.goodsid + '&reCode=' + wx.getStorageSync('mYinviteCode') + '&Entrance=' + 'jd'
    return {
      title: this.data.good_info.goods_name,
      imageUrl: this.data.shareImageinit,
      path: url
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 胶囊位计算
    // app.navTop(function (res) {
    //   that.setData({
    //     navTop: res.navTop
    //   })
    // });
    that.setData({
      Entrance: options.Entrance,
      goodsid: options.goodsid,
      amount: options.amount,
      price: options.price,
      goodsName: options.goodsName,
      vipPrice: options.vipPrice,
      saleCount: options.saleCount
    })
    console.log(options.bannerItem)
    that.dataInit(options.goodsid, wx.getStorageSync('memberId'), that.data.bannerItem)
  }
})