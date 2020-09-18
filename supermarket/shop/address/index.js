import {getAddressList,deleteAddress} from "../../../api/baina"
const app = getApp()

Page({
  data: {
    list: [],
    authorizationStatus:true,
    delBtnWidth: 121,//删除按钮宽度单位（rpx）
    Mywinning: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    let that = this
    that.getAddressList()
  },
  onUnload:function(){
    console.log("页面销毁");
    if(this.data.list.length == 0){
      const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
      const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
      if (wxPrevPage) {
        wxPrevPage.setData({
          hasAddress:false
        })
        // console.log(wxPrevPage,"参数===")
        // wx.navigateBack()
      }
    }
  },
  //获取收货地址列表
  getAddressList(){
    let that = this;
    wx.showLoading()
    getAddressList({}).then(res=>{
      wx.hideLoading()
        for (let item of res.data) {
          item.txtStyle = ''
        }
        that.setData({
          list: res.data
        })
    })
  },
  // 选择地址
  SelectAddress: function (e) {
    console.log(e.currentTarget.dataset.item,'124')

    const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    if (wxPrevPage) {
      wxPrevPage.setData({
        page: 1,
        receiver_name: e.currentTarget.dataset.item.receiverName,
        mobile: e.currentTarget.dataset.item.mobile,
        address: e.currentTarget.dataset.item.address,
        addressId: e.currentTarget.dataset.item.addressId,
        isDefault: e.currentTarget.dataset.item.isDefault,
        isaddress: e.currentTarget.dataset.item,
        addressType: 1,
        addressIds: e.currentTarget.dataset.item.areaIds,
        areaId: e.currentTarget.dataset.item.addressId,
        areaid: e.currentTarget.dataset.item.addressId,
        confirmSiteType: 1,
        confirmSiteShow: false,
        hasAddress:true
      })

      console.log(e.currentTarget.dataset.item.receiverName,"参数===")
      wx.navigateBack(wxPrevPage)
      // wx.navigateBack({
      //   delta:1
      // })
     
    }
  },

  // 新建地址
  ImmediateSettlement: function (e) {
    wx.navigateTo({
      url: '/supermarket/shop/webContainer/index?type=' + e.currentTarget.dataset.type + '&isElite=' + this.data.isElite + '&orderNo=' + this.data.orderNo,
    })
  },
  // 编辑
  edit: function (e) {
    wx.navigateTo({
      url: '/supermarket/shop/webContainer/index?provicename=' + e.currentTarget.dataset.provicename + '&cityname=' + e.currentTarget.dataset.cityname + '&zonename=' + e.currentTarget.dataset.zonename + '&receivername=' + e.currentTarget.dataset.receivername + '&mobile=' + e.currentTarget.dataset.mobile + '&address=' + e.currentTarget.dataset.address + '&addressId=' + e.currentTarget.dataset.addressid + '&isDefault=' + e.currentTarget.dataset.isdefault + '&type=' + e.currentTarget.dataset.type + '&townName=' + e.currentTarget.dataset.townname + '&proviceId=' + e.currentTarget.dataset.proviceid + '&cityId=' + e.currentTarget.dataset.cityid + '&zoneId=' + e.currentTarget.dataset.zoneid + '&townId=' + e.currentTarget.dataset.townid,
    })
  },
  /**
     * 删除事件
     */
  delItem: function (e) {
    let that = this
    deleteAddress({
      addressId: e.currentTarget.dataset.addressid
    }).then (res=> {
      if (res.data.length >0) {
        // for (let item of res.data.result) {
        //   item.txtStyle = ''
        // }
        // that.setData({
        //   list: res.data.result
        // })
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
      }
      this.getAddressList()
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }

      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index]['txtStyle'] = txtStyle;
      //更新列表的状态
      this.setData({
        'list': list
      });
    }
  },
  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        'list': list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

})
