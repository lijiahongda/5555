// import {  orderPay } from '../../api/order.js';

const app = getApp();

Component({
  properties: {
    isScreening: {
      type: Boolean,
      value: false
    },
    marginTop: {
      type: String,
      value: ''
    },
    ComprehensiveScreening: {
      type: Array,
      value: []
    }
  },
  data: {
    isLevel: [0, 0, 0, 0, 0],
    stairKey: 0,
    QuickTabbarKey: [0, 0, 0, 0, 0, 0],
  },
  attached: function () {
    this.BrandChain()
    this.TopBrand()
  },
  methods: {
    //综合筛选---品牌连锁
    BrandChain: function () {
      let that = this
      let filter = 'https://api2.yuelvhui.com/hotelApp/hotel/getBrands/' + 1;
      console.log('4444')
      //请求
      wx.request({
        url: filter,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Sys 2001.1587309981000.e25eda72d50c127034ed1d9a08fe8de9'
        },
        success: function (res) {
          console.log('888s')
          wx.hideLoading()
          if (res.statusCode === 200) {
            console.log('9999')
            let item = res.data.data;
            for (var i = 0; i < item.length; i++) {
              item[i].isChecked = 0;
            }
            console.log(item)
            console.log(that.data.ComprehensiveScreening)
            that.data.ComprehensiveScreening[0].level = item
            that.setData({
              ComprehensiveScreening: that.data.ComprehensiveScreening,
              ComprehensiveScreeningCall: res.data.data,
              currentData: item
            })
            console.log(res.data)
          } else if (res.code === 400) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '网络错误 ',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })

    },
    TopBrand: function () {
      let that = this
      let filter = 'https://api2.yuelvhui.com/hotelApp/hotel/getHotBrands/' + 1;
      wx.request({
        url: filter,
        method: 'GET',
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Sys 2001.1587309981000.e25eda72d50c127034ed1d9a08fe8de9'
        },
        success: function (res) {
          console.log('888s')
          wx.hideLoading()
          if (res.statusCode === 200) {
            let item = res.data.data;
            for (var i = 0; i < item.length; i++) {
              item[i].isCheckedTop = false;
            }
            that.setData({
              hotBrands: item,
              currentData: item
            })
          } else if (res.code === 400) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '网络错误 ',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    },
    clickstairComprehensive: function (e) {
      let stairId = e.currentTarget.dataset.id;
      let types = e.currentTarget.dataset.types;
      this.setData({
        stairId: stairId,
        types: types
      })
      let ComprehensiveScreeningCall = this.data.ComprehensiveScreening[stairId].level;

      let LevelKey = this.data.isLevel[types];
      if (this.data.isLevel[types] == 0) {
        LevelKey = 0
      }

      this.setData({
        stairKey: stairId,
        ComprehensiveScreeningCall: ComprehensiveScreeningCall,
        LevelKey: LevelKey,
        currentData: this.data.ComprehensiveScreening[stairId].level,
        // ismap: false
      })
    },
    //综合筛选二区
    ConditionsCell: function (e) {
      let that = this;
      console.log(that.data.currentData)
      let keyword = e.currentTarget.dataset.title;
      // let tabbar = that.data.tabbar[3];
      let LevelKey = e.currentTarget.dataset.index;
      let isLevel = [0, 0, 0, 0, 0];
      let tabid = e.currentTarget.dataset.tabid;
      let checked = e.currentTarget.dataset.checked;
      let tabbarSplit = []
      let SelectItem = []
      // tabbar = keyword
      if (that.data.stairKey == 5) { //特权选中
        that.data.QuickTabbarKey[4] = checked ? 0 : 1
      } else if (that.data.stairKey == 3) { //优惠促销
        if (LevelKey == 0) { //今日特价  
          that.data.QuickTabbarKey[1] = checked ? 0 : 1
        } else if (LevelKey == 1) {
          that.data.QuickTabbarKey[2] = checked ? 0 : 1
        } else if (LevelKey == 3) {
          that.data.QuickTabbarKey[3] = checked ? 0 : 1
        }
      } else if (that.data.stairKey == 2) { //主题推荐
      } else if (that.data.stairKey == 1) { //设施服务
      } else if (that.data.stairKey == 0) { //品牌连锁
        if (LevelKey != 0) { //不等于不限
          that.data.hotBrands[0].isCheckedTop = 0
          that.data.ComprehensiveScreening[0].level[0].isChecked = 0
          for (let i = 0; i < that.data.hotBrands.length; i++) {
            if (that.data.hotBrands[i].id == that.data.ComprehensiveScreening[that.data.stairKey].level[LevelKey].id) {
              that.data.hotBrands[i].isCheckedTop = checked ? 0 : 1
            }
          }
          if (that.data.QuickTabbarKey[0] == 1 || that.data.QuickTabbarKey[1] == 0) { //二级菜单处于热门品牌
            that.setData({
              hotBrands: that.data.hotBrands,
              currentData: that.data.hotBrands
            })
          }
        } else {
          if (!checked) { //如果不限选中
            for (let i = 1; i < that.data.hotBrands.length; i++) {
              that.data.hotBrands[i].isCheckedTop = 0
            }
            for (let i = 1; i < that.data.ComprehensiveScreening[0].level.length; i++) {
              that.data.ComprehensiveScreening[0].level[i].isChecked = 0
            }
            if (that.data.QuickTabbarKey[0] == 1 || that.data.QuickTabbarKey[1] == 0) { //二级菜单处于热门品牌
              that.setData({
                hotBrands: that.data.hotBrands,
                currentData: that.data.hotBrands
              })
            }
          } else { //不限取消
            that.data.ComprehensiveScreening[0].level[0].isChecked = 0 //品牌连锁
            that.data.hotBrands[0].isCheckedTop = 0 // 热门品牌
          }
        }
      }
      that.data.ComprehensiveScreening[that.data.stairKey].level[LevelKey].isChecked = checked ? 0 : 1 //改变数据源选中状态
      that.setData({
        ComprehensiveScreening: that.data.ComprehensiveScreening,
        currentData: that.data.ComprehensiveScreening[that.data.stairKey].level,
        QuickTabbarKey: that.data.QuickTabbarKey,
        LevelKey: LevelKey,
        isLevel: isLevel,
        page: 1,

      })
      for (let i = 0; i < that.data.ComprehensiveScreening.length; i++) { //循环综合筛选数据
        for (let l of that.data.ComprehensiveScreening[i].level) { //综合筛选中level
          if (l.isChecked == 1) { //if 数据中的isChecked == 1
            SelectItem.push(l.title) //放入数组
          }
        }
      }
      SelectItem = SelectItem.join(',')
      that.setData({
        SelectItem: SelectItem
      })
      console.log(SelectItem)
      that.triggerEvent('ScreenFun', SelectItem)
    },
    emptyDetermineScreening() { //热门品牌-综合筛选-优惠促销 重置
      let that = this
      let SelectItem = []
      let stairId = that.data.stairKey;
      let types = that.data.types
      let LevelKey = that.data.isLevel[types];
      for (let i = 0; i < that.data.ComprehensiveScreening.length; i++) { //循环综合筛选数据
        for (let j = 0; j < that.data.ComprehensiveScreening[i].level.length; j++) {
          that.data.ComprehensiveScreening[i].level[j].isChecked = 0
        }
      }
      for (let t = 0; t < that.data.currentData.length; t++) {
        that.data.currentData[t].isCheckedTop = 0
      }
      that.setData({
        QuickTabbarKey: [0, 0, 0, 0],
        ComprehensiveScreening: that.data.ComprehensiveScreening,
        currentData: that.data.ComprehensiveScreening[stairId].level,
        currentData: that.data.currentData,
        'tabbar[3]': '综合筛选'
      })
      console.log('99999')
      for (let i = 0; i < that.data.currentData.length; i++) { //循环综合筛选数据
        console.log(that.data.currentData[i])
          if (that.data.currentData[i].isChecked == 1) { //if 数据中的isChecked == 1
            SelectItem.push(l.title) //放入数组
          }
      }
      SelectItem = SelectItem.join(',')
      that.triggerEvent('ScreenFun', SelectItem)
    },
    //综合筛选确定--热门品牌确定--优惠促销确定
    DetermineScreening: function (e) {
      let that = this;
      let com = []
      // let levelArr = []
      let pid = [] //品牌选中id
      let stitle = [] //设施选中标签title
      let ztitle = [] //主题推荐选中标签title
      let ytitle = [] //优惠促销选中标签title
      for (var i = 0; i < that.data.ComprehensiveScreening.length; i++) { //循环综合筛选数据
        if (that.data.ComprehensiveScreening[i].stair == '品牌连锁' || that.data.ComprehensiveScreening[i].stair == '设施服务' || that.data.ComprehensiveScreening[i].stair == "主题推荐" || that.data.ComprehensiveScreening[i].stair == '优惠促销') { //如果==品牌连锁，设施服务，主题推荐，优惠促销
          com.push(that.data.ComprehensiveScreening[i])
        }
      }
      for (var v = 0; v < com.length; v++) { //循环相应删数据
        if (com[v].stair == '品牌连锁') { //如果是品牌连锁
          for (const p of com[v].level) {
            if (p.isChecked == 1) { //如果选中
              pid.push(p.id)
            }
          }
          that.setData({
            brandId: pid.join(',')
          })

        } else if (com[v].stair == '设施服务') { //如果是设施服务
          for (const s of com[v].level) {
            if (s.isChecked == 1) { //如果选中
              stitle.push(s.id)
            }
          }
          that.setData({
            facilities: stitle.join(',')
          })
        } else if (com[v].stair == '主题推荐') { //如果是主题推荐
          for (const z of com[v].level) {
            if (z.isChecked == 1) { //如果选中
              ztitle.push(z.id)
            }
          }
          that.setData({
            theme: ztitle.join(',')
          })
        } else if (com[v].stair == '优惠促销') { //如果是优惠促销
          for (const y of com[v].level) {
            if (y.isChecked == 1) { //如果选中
              ytitle.push(y.id)
            }
          }
          that.setData({
            promotion: ytitle.join(',')
          })
        }
      }
      that.triggerEvent('ScreenFunPopup', false)
      that.triggerEvent('facilitiesFun', {
        facilities: that.data.facilities,
        brandId: that.data.brandId
      })
      that.setData({
        tabbarKey: [0, 0, 0, 0],
        QuickTabbarKey: [0, 0, 0, 0, 0, 0],

      })
    },
    //弹框消失
    hideModal(){
      this.setData({
        isScreening:false
      })
    },
  }
})