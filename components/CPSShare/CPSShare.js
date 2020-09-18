// components/CPSShare/CPSShare.js
var previewOnshow;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    image: {
      type: Array,
      value: []
    },
    good_info: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    image: [],
    yesImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-26/21/yuelvhuiiNMToTSNzY1582722517.png',
    noImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-02-26/21/yuelvhui2BYCqBzzlG1582722540.png',
    goodsid: 7651925,
    leng: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 一键保存
    OneClickSave: function (e) {
      let that = this
      let image = that.data.image
      console.log('一键保存')
      wx.showLoading({
        title: '保存中'
      })
      // console.log(that.data.leng.length,image.length)
      // if (that.data.leng.length == image.length) {
      //   wx.hideLoading()
      //   wx.showToast({
      //     title: '保存成功',
      //     icon: 'none'
      //   })
      //   that.setData({
      //     leng: []
      //   })
      // } else {
        //图片保存到本地相册
        that.queue(image)
      // }
    },
    // 队列
    queue(urls) {
      let promise = Promise.resolve()
      urls.forEach((url, index) => {
        promise = promise.then(() => {
          return this.download(index,urls,url)
        })
      })
      return promise
    },
    // 下载
    download(index,urls,url) {
      let leng = this.data.leng
      let that = this
      return new Promise((resolve, reject) => {
        console.log("url.img",url.img)
        wx.downloadFile({
          url: url.img,
          success: function (res) {
            var benUrl = res.tempFilePath;
            //图片保存到本地相册
            wx.saveImageToPhotosAlbum({
              filePath: benUrl,
              //授权成功，保存图片
              success: function (data) {
                resolve(res)
                leng.push(index)
                if(leng.length == urls.length){
                  wx.hideLoading()
                  wx.showToast({
                    title: '保存成功',
                    icon:'none'
                  })
                  leng=[]
                }
                that.setData({
                  leng:leng
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
      })
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
    // clickImage: function (e) {
    //   let that = this
    //   let image = that.data.image
    //   let {
    //     index,
    //     shareimage
    //   } = e.currentTarget.dataset
    //   for (var i = 0; i < image.length; i++) {
    //     if (index == i) {
    //       image[i].ischeck = !image[i].ischeck
    //       that.setData({
    //         shareImage: shareimage
    //       })
    //     } else {
    //       image[i].ischeck = false
    //     }
    //     that.setData({
    //       image: image
    //     })
    //   }
    //   console.log(image)
    //   that.triggerEvent('shareimageFun', shareimage)
    //   that.triggerEvent('posterJdFun', {
    //     goodsid: that.data.goodsid,
    //     uid: wx.getStorageSync('uid'),
    //     shareimage: shareimage
    //   })
    // },
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
    // 分享图片
    shareImage: function () {
      let image = []
      let src = this.data.image[0].img;
      let imgList = this.data.image;
      for (let i of imgList) {
        image.push(i.img)
      }
      //图片预览
      previewOnshow = true; //解决图片预览出发onshow
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: image // 需要预览的图片http链接列表
      })
    }
  }
})
