



import {  ajaxNewList } from "../../../api/strategyApi"
import { retrunScene } from "../../../utils/util"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: 0, // 当前选项
    shareData: {},
    subBotton: '等待审核',
    status: [],
    hGroup: false,
    htmlSnip: '========================',
    isPopup: false,
    popupImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-07-30/22/yuelvhuiOfxtmOz6VZ1596120134.png'
  },
  // 改变步骤
  changeSteps(e) {
    console.log(e)
    this.setData({
      steps: e.currentTarget.dataset.steps
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "数据加载中",
      mask: true
    });
    this.setData({
      uid: wx.getStorageSync('uid'),
      token: wx.getStorageSync('token')
    })
    //扫码参数分解
    let reCode = ''
    if (options.scene != null) {
      retrunScene(options.scene, function (sceneObj) {
        reCode = sceneObj.R;
      });
    } else {
      reCode = options.reCode;
    }
    this.setData({
      reCode
    })

    this.initData()
  },
  onShow() {

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
  selectPopup: function () {
    this.setData({
      isPopup: false
    })
  },
  //点击开始的时间  
  timestart: function (e) {
    var _this = this;
    _this.setData({ timestart: e.timeStamp });
  },
  //点击结束的时间
  timeend: function (e) {
    var _this = this;
    _this.setData({ timeend: e.timeStamp });
  },
  webUrlVideo: function (e) {
    let { item } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/page/Community/pages/webUrl/webUrl?url=' + item.url
    })
  },
  //保存图片
  saveImg: function (e) {
    var _this = this;
    var times = _this.data.timeend - _this.data.timestart;
    console.log(times)
    if (times > 300) {
      console.log("长按");
      wx.getSetting({
        success: function (res) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function (res) {
              console.log("授权成功");
              var imgUrl = "http://shareds.oss-cn-hangzhou.aliyuncs.com/exhibit/20180815/tmp_35d425e6e732ba516f2e8c9988706eba.jpg";
              wx.downloadFile({//下载文件资源到本地，客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径
                url: imgUrl,
                success: function (res) {
                  // 下载成功后再保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,//返回的临时文件路径，下载后的文件会存储到一个临时文件
                    success: function (res) {
                      wx.showToast({
                        title: '成功保存到相册',
                        icon: 'success'
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  },
  // buItem
  buItem(e) {
    let { item } = e.currentTarget.dataset
    console.log(item)
    if (item.type == 3) {//开通群助手
      wx.navigateTo({
        url: '/page/Community/pages/groupUp/groupUp?status=1'
      })
    } else if (item.type == 1) {//视频
      wx.navigateTo({
        url: '/page/Community/pages/webUrl/webUrl?url=' + item.url
      })
    } else if (item.type == 2) {//弹窗
      this.setData({
        popupTitle: item.text,
        popupImage: item.url,
        isPopup: true
      })

    }
  },
  initData() {
    let that = this
    let data = {
      source:app.globalData.robotSource
    }
    ajaxNewList(data).then(res => {
      console.log("个人信息", res)
      if (res.code == 200) {
        that.setData({
          ListData: res.data.list,
          banner: res.data.banner
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
      wx.hideLoading();
    })
  },
  // 前往群助手
  goGroup() {
    wx.navigateTo({
      url: '/page/Community/pages/myGroup/myGroup',
    })
  },
  // 分享
  onShareAppMessage() {
    return {
      title: this.data.shareData.title,
      imageUrl: this.data.shareData.showImg,
      path: this.data.shareData.posterUrl
    }
  }
})