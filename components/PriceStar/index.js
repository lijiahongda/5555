// import {  orderPay } from '../../api/order.js';

const app = getApp();

Component({
  properties: {
    showModalStatus: {
      type: Boolean,
      value: false,
    },
    marginTop: {
      type: String,
      value: '',
    }
  },
  data: {
    priceText: '价格',
  },
  attached: function () {
    this.setData({
      price: app.globalData.price,
      starList: app.globalData.starList
    })
    console.log(app.globalData.starList)
  },
  methods: {
    _onOption:function(starList,price){
      this.setData({
        starList:starList,
        price:price
      })
    },
    //选择价格
    clickPrice: function (e) {
      let price = app.globalData.price
      let id = e.currentTarget.dataset.id;
      price[id].key = 1;
      // 更新本地存储的星级状态
      for (let i = 0; i < price.length; i++) {
        if (i != id) {
          price[i].key = 0;
        }
      }
      for (let n of price) {
        if (n.key == 1) {
          for (let s = 0; s < app.globalData.screen.length; s++) {
            if (s == 1) {
              app.globalData.screen[s].name = n.text
            }
          }
        }

      }
      this.setData({
        price: price,
      })
      app.globalData.price = price
      this.triggerEvent('PriceFun',id)
    },
    //清空
    emptyPriceStar: function () {
      let price = [{
          'text': '不限',
          'max': '',
          'min': '',
          'key': '1'
        },
        {
          'text': '¥150元以下',
          'max': '',
          'min': '150',
          'key': '0'
        },
        {
          'text': '¥150-¥300',
          'max': '150',
          'min': '300',
          'key': '0'
        },
        {
          'text': '¥301-¥450',
          'max': '301',
          'min': '450',
          'key': '0'
        },
        {
          'text': '¥451-¥600',
          'max': '451',
          'min': '600',
          'key': '0'
        },
        {
          'text': '¥601-¥1000',
          'max': '601',
          'min': '1000',
          'key': '0'
        },
        {
          'text': '¥1000以上',
          'max': '1000',
          'min': '100000',
          'key': '0'
        }
      ];

      let starList = [{
          name: '不限',
          condition: '1'
        },
        {
          name: '经济',
          condition: '0'
        },
        {
          name: '三星舒适',
          condition: '0'
        },
        {
          name: '四星高档',
          condition: '0'
        },
        {
          name: '五星豪华',
          condition: '0'
        }
      ];

      this.setData({
        starList: starList,
        price: price,
      })
     
      this.triggerEvent('empy', {
        screen:1
      });
    },
    // 星级选择
    clickStarList: function (e) {
      let starId = e.currentTarget.dataset.id;//选中的index
      let starList = this.data.starList;
      if (starList[starId].condition == 0) {
        starList[starId].condition = '1';//设置选中状态
        if (starId > 0) {
          starList[0].condition = '0';//删除不限的选中状态
        } else {//恢复成不限
          starList = [{
              name: '不限',
              condition: '1'
            },
            {
              name: '经济',
              condition: '0'
            },
            {
              name: '三星舒适',
              condition: '0'
            },
            {
              name: '四星高档',
              condition: '0'
            },
            {
              name: '五星豪华',
              condition: '0'
            }
          ];
        }
      } else {//反选
        starList[starId].condition = '0';
        let num = 0;
        for (let key in starList) {
          if (starList[key].condition == 0) {
            num = num + 1;
          }
        }
        if (num == 5) {//如果选了5个 恢复默认
          starList = [{
              name: '不限',
              condition: '1'
            },
            {
              name: '经济',
              condition: '0'
            },
            {
              name: '三星舒适',
              condition: '0'
            },
            {
              name: '四星高档',
              condition: '0'
            },
            {
              name: '五星豪华',
              condition: '0'
            }
          ];
        }
      }
      this.setData({
        starList: starList,
      })
      app.globalData.starList = starList
      console.log(app.globalData.starList)
      this.triggerEvent('starFun')
    },
    // 确认
    confirmPriceStar: function () {
      let that = this
      let starList = this.data.starList; //星级选择
      let starRate = '';
      let highRate = '';
      let star = []
      for (let key in starList) {
        if (starList[key].condition == 1) {

          if (key == 1) {
            starRate = '0,1,2';
          } else if (key == 2) {
            starRate = starRate + ',3';
          } else if (key == 3) {
            starRate = starRate + ',4';
          } else if (key == 4) {
            starRate = starRate + ',5';
          }
          star.push(starList[key].name)
        }
        that.setData({
          starRateName: star.join(',')
        })
      }
      starRate = starRate == '0,1,2,3,4,5' ? '' : starRate;
      let lowRate = '';
      let priceText = ''
      for (let key in that.data.price) {
        if (that.data.price[key].key == 1) {
          lowRate = that.data.price[key].min;
          highRate = that.data.price[key].max;
          priceText = that.data.price[key].text
        }
      }
      setTimeout(() => {
        this.setData({
          showModalStatus: false
        })
        this.triggerEvent('PriceStarFun', {
          priceText: priceText,
          lowRate: lowRate,
          highRate: highRate,
          starRate: starRate,
          starRateName: star.join(',')
        });
      }, 1000);
    },
    //弹框消失
    hideModal(){
      this.setData({
        showModalStatus:false
      })
    },
  }

})