import {
  delAssistantPush,
  jdGoodsShareData,
  ownGoods,
  getAssistantList,
  updateAssistantPush
} from '../../../api/cps'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topIcon: [{
        name: '待推送',
        id: 0
      },
      {
        name: '推送历史',
        id: 1
      }
    ],
    posterObj: {
      status: 0,
      url: ""
    },
    shareSelectStatus: 0,
    twoIndex: 0,
    switch1Checked: true,
    status: 0,
    posterUrl: '',
    aindex: 0,
    shopData: [],
    switch1Checked: true,
    zlData: [],
    page: 1
  },
  switch1Change(e) {
    console.log(e.detail.value)

    let params = {
      mid: wx.getStorageSync("memberId"),

    }
    if (e.detail.value) {
      //开启
      params.type = 0;
      updateAssistantPush(params).then(res => {
        if (res.data.code == 200) {
          this.setData({
            switch1Checked: 0
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      })
    } else {
      //关闭
      params.type = 1;
      updateAssistantPush(params).then(res => {
        if (res.data.code == 200) {
          this.setData({
            switch1Checked: 1
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      })
    }
  },
  handleTap(e) {
    console.log(e);
    let aindex = e.currentTarget.dataset.oindex
    this.setData({
      aindex,
      page: 1,
      zlData: []
    })

    this.getGoodList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodList();
  },
  getGoodList() {
    let data = {
      "mid": wx.getStorageSync("memberId"),
      "status": this.data.aindex,
      "page": this.data.page
    }
    getAssistantList(data).then(response => {
      let res = response.data;
      if (res.code == 200) {
        wx.showLoading({
          title: '努力加载中',
          mask: true
        });
        console.log("数据---", res);

        this.setData({
          switch1Checked: res.push_status
        })

        let _arr = res.data;

        let _newArr = _arr.map(val => {

          let oneData = {
            indexid: val.id,
            skuid: val.goods_sku_id,
            goods_type: val.goods_type,
            id: val.goods_id, //商品id
            name: val.goods_name,
            picurl: val.goods_image, //商品图片
            progress_num: "empty", //如果不显示进度条 传个字符窜 empty
            coupon: [], //优惠券放在数组里，避免以后出现多个优惠券的情况  结构  {name:"",id:""}
            comment_num: "0", //评论数量
            avatar: [], //购买人的头像 结构 {url:""}
            buy_num: val.count, //已购买人数
            oprice: val.sale_desc, //原价
            vipPrice: val.buy_desc, //现价
            promote_price: 'empty', //推广赚多少钱  如果不显示这个数据 请传字符串 empty
            btntype: ['remove', 'copy', 'share']
          }
          return oneData;
        })
        this.setData({
          zlData: this.data.zlData.concat(_newArr)
        })
        //  debugger; 
        wx.hideLoading();

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
      wx.hideLoading();

    })








  },
  handleCopy: function (e) {
    console.log(e)

    this.dataInitShare(e.detail.id, e.detail.picurl, 1)

  },
  // 分享海报
  handleShare: function (e) {
    console.log('----', e)

    this.dataInitShare(e.detail.id, e.detail.picurl, 2, e.detail.vipPrice, e.detail.oprice)

  },
  //京东复制文案数据
  dataInitShare: function (goodsid, bannerItem, type, vprice, oprice) {
    let that = this
    wx.showLoading()
    var data = {
      goods_id: goodsid,
      uid: wx.getStorageSync('memberId'),
      type: 2
    }
    jdGoodsShareData(data).then(res => {
      let CopyText = ''
        if (type == 1) {
          wx.hideLoading()
          CopyText = '👇👇👇' + '\n' + res.data.data.good_info.goods_name + ' \n' + res.data.data.good_info.sale_desc + '\n' + res.data.data.good_info.buy_desc + '\n' + res.data.data.good_info.panic_desc + '\n' + res.data.data.good_info.panic_link
          wx.setClipboardData({
            data: CopyText,
            success(res) {
              wx.getClipboardData({
                success(res) {}
              })
            },
            complete(res) {}
          })
        }
        console.log(type)
        if (type == 2) {

          // 生成H5海报
          var data = {
            product_id: goodsid,
            dealerId: wx.getStorageSync("dealerId"),
            type: 2, //1自营 2京东 3白拿
            mid: wx.getStorageSync("memberId"),
            sku_id: "",
            vipPrice: vprice,
            price: oprice,
            pImg: bannerItem,
            pName: res.data.data.good_info.goods_name
          }
          this.ajaxHaiBao(data)

        }
      
    })


  },

  handleRemove(obj) {
    console.log(obj.detail);

    let params = {
      mid: wx.getStorageSync("memberId"),
      id: obj.detail.indexid,
      goodsId: obj.detail.id
    }
    delAssistantPush(params).then(res => {
      if (res.data.code == 200) {
        wx.showToast({
          title: '移除成功',
          icon: 'none'
        })
        console.log("重新获取列表数据");
        this.setData({
          page: 1,
          zlData: []
        })
        this.getGoodList();
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })

  },

  ajaxHaiBao(data) {
    //生成海报
    wx.showLoading({
      title: '海报生成中',
      mask: true
    });
    ownGoods(data).then(res => {
      console.log("海报接口", res);
      this.setData({
        posterObj: {
          status: 1,
          url: res.data.data
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.getGoodList()
  }
})