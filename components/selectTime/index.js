// import {  orderPay } from '../../api/order.js';
var Moment = require("../../utils/moment")
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
const app = getApp();

Component({
  properties: {
    isSelectTime: {
      type: Boolean,
      value: false,
    },
    sTime:{
      type: String,
      value: '',
    },
    eTime:{
      type: String,
      value: '',
    }
  },
  data: {
    clickDay: '',
    clickCount: 0,
    maxMonth: 3, //最多渲染月数
    dateList: [],
    systemInfo: {},
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    checkInDate: Moment(new Date()).format('YYYY-MM-DD'),
    checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
    markcheckInDate: false, //标记开始时间是否已经选择
    markcheckOutDate: false, //标记结束时间是否已经选择
    sFtv: [{
        month: 1,
        day: 1,
        name: "元旦"
      },
      {
        month: 2,
        day: 14,
        name: "情人节"
      },
      {
        month: 3,
        day: 8,
        name: "妇女节"
      },
      {
        month: 3,
        day: 12,
        name: "植树节"
      },
      {
        month: 3,
        day: 15,
        name: "消费者权益日"
      },
      {
        month: 4,
        day: 1,
        name: "愚人节"
      },
      {
        month: 5,
        day: 1,
        name: "劳动节"
      },
      {
        month: 5,
        day: 4,
        name: "青年节"
      },
      {
        month: 5,
        day: 12,
        name: "护士节"
      },
      {
        month: 6,
        day: 1,
        name: "儿童节"
      },
      {
        month: 7,
        day: 1,
        name: "建党节"
      },
      {
        month: 8,
        day: 1,
        name: "建军节"
      },
      {
        month: 9,
        day: 10,
        name: "教师节"
      },
      {
        month: 9,
        day: 28,
        name: "孔子诞辰"
      },
      {
        month: 10,
        day: 1,
        name: "国庆节"
      },
      {
        month: 10,
        day: 6,
        name: "老人节"
      },
      {
        month: 10,
        day: 24,
        name: "联合国日"
      },
      {
        month: 12,
        day: 24,
        name: "平安夜"
      },
      {
        month: 12,
        day: 25,
        name: "圣诞节"
      }
    ],
    right: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-16/02/yuelvhuicJ4c3BQf191586974710.png', //后一月
    left: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-16/02/yuelvhuioTaDua3w3h1586974804.png', //前一月
    close: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-16/22/yuelvhuisyCKcbeGIx1587047288.png', //关闭弹窗
    scrolly: true,

  },

  attached: function () {
    // 页面初始化 options为页面跳转所带来的参数
    // console.log('11333311',this,this.data.sTime)
    this.createDateListData();



    var _this = this;
    // 页面初始化 options为页面跳转所带来的参数
    var checkInDate = Moment(new Date()).format('YYYY-MM-DD');
    var checkOutDate = Moment(new Date()).add(1, 'day').format('YYYY-MM-DD');

    console.log("开始时间1", checkInDate);
    console.log("结束时间2", checkOutDate);

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          systemInfo: res,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        });
        wx.setStorageSync("ROOM_SOURCE_DATE", {
          checkInDate,
          checkOutDate
        })
      }
    })
    this.selectDataMarkLine()

  },
  methods: {
    closePoPup: function () {
      this.setData({
        isSelectTime: false,
        clickCount: 0,
        clickDay: ''
      })
    },
    FrontJanuary: function () {
      let cur = this.data.cur
      let dateList = this.data.dateList
      for (var i = 0; i < dateList.length; i++) {
        if (i == cur - 1) {
          this.setData({
            year: dateList[i].year + '年',
            month: dateList[i].month + '月',
            cur: i
          })
        }
      }
    },
    afterJanuary: function () {
      let cur = this.data.cur
      let dateList = this.data.dateList
      for (var i = 0; i < dateList.length; i++) {
        if (i == cur + 1) {
          this.setData({
            year: dateList[i].year + '年',
            month: dateList[i].month + '月',
            cur: i
          })
        }
      }
    },
    //选择的入住与离店时间段
    selectDataMarkLine: function () {
      let dateList = this.data.dateList;
      let {
        checkInDate,
        checkOutDate
      } = wx.getStorageSync("ROOM_SOURCE_DATE");
      console.log("=========checkInDate=============")
      console.log(checkInDate, checkOutDate)
      if (!checkInDate) {
        return
      }
      console.log("=========checkOutDate=============")
      let curreInid = checkInDate.substr(0, 4) + "-" + (checkInDate.substr(5, 2) < 10 ? checkInDate.substr(6, 1) : checkInDate.substr(5, 2)); //选择入住的id
      let curreOutid = checkOutDate.substr(0, 4) + "-" + (checkOutDate.substr(5, 2) < 10 ? checkOutDate.substr(6, 1) : checkOutDate.substr(5, 2)); //选择离店的id
      let dayIn = checkInDate.substr(8, 2) >= 10 ? checkInDate.substr(8, 2) : checkInDate.substr(9, 1); //选择入住的天id
      let dayOut = checkOutDate.substr(8, 2) >= 10 ? checkOutDate.substr(8, 2) : checkOutDate.substr(9, 1); //选择离店的天id
      let monthIn = checkInDate.substr(5, 2) >= 10 ? checkInDate.substr(5, 2) : checkInDate.substr(6, 1); //选择入店的月id
      let monthOut = checkOutDate.substr(5, 2) >= 10 ? checkOutDate.substr(5, 2) : checkOutDate.substr(6, 1); //选择离店的月id
      if (curreInid == curreOutid) { //入住与离店是当月的情况
        for (let i = 0; i < dateList.length; i++) {
          if (dateList[i].id == curreInid) {
            let days = dateList[i].days;
            for (let k = 0; k < days.length; k++) {
              if (days[k].day >= dayIn && days[k].day <= dayOut) {
                days[k].class = days[k].class + ' bgitem';
              }
              if (days[k].day == dayIn) {
                days[k].class = days[k].class + ' active';
                days[k].inday = true;
              }
              if (days[k].day == dayOut) {
                days[k].class = days[k].class + ' active';
                days[k].outday = true;
              }
            }
            this.setData({
              year: dateList[i].year + '年',
              month: dateList[i].month + '月',
              cur: i
            })
          }
        }
      } else { //跨月
        for (let j = 0; j < dateList.length; j++) {
          if (dateList[j].month == monthIn) { //入住的开始月份
            let days = dateList[j].days;
            for (let k = 0; k < days.length; k++) {
              if (days[k].day >= dayIn) {
                days[k].class = days[k].class + ' bgitem';
              }
              if (days[k].day == dayIn) {
                days[k].class = days[k].class + ' active';
                days[k].inday = true;
              }
            }
          } else { //入住跨月月份
            if (dateList[j].month < monthOut) { //离店中间的月份
              let days = dateList[j].days;
              for (let k = 0; k < days.length; k++) {
                days[k].class = days[k].class + ' bgitem';
              }
            } else if (dateList[j].month == monthOut) { //离店最后的月份
              let days = dateList[j].days;
              for (let k = 0; k < days.length; k++) {
                if (days[k].day <= dayOut) {
                  days[k].class = days[k].class + ' bgitem';
                }
                if (days[k].day == dayOut) {
                  days[k].class = days[k].class + ' active';
                  days[k].outday = true;
                }
              }
            }
          }
        }
      }
      this.setData({
        dateList: dateList
      })
    },
    createDateListData: function () {
      var dateList = [];
      var now = new Date();
      /*
        设置日期为 年-月-01,否则可能会出现跨月的问题
        比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
          原因是由于2月份没有31号，顺推下去变成了了03-03
      */
      now = new Date(now.getFullYear(), now.getMonth(), 1);
      var count = 0;
      var count1 = 0;
      for (var i = 0; i < this.data.maxMonth; i++) {
        var momentDate = Moment(now).add(this.data.maxMonth - (this.data.maxMonth - i), 'month').date;
        var year = momentDate.getFullYear();
        var month = momentDate.getMonth() + 1;

        var days = [];
        var totalDay = this.getTotalDayByMonth(year, month);
        var week = this.getWeek(year, month, 1);
        //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
        //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
        for (var j = -week + 1; j <= totalDay; j++) {
          var tempWeek = -1;
          if (j > 0)
            tempWeek = this.getWeek(year, month, j);
          var clazz = '';
          if (tempWeek == 0 || tempWeek == 6)
            clazz = 'week'
          if (j < DATE_DAY && year == DATE_YEAR && month == DATE_MONTH){
            //当天之前的日期不可用
            count++
            clazz = 'unavailable ' + clazz;
          }
          else{
            count1++
            clazz = '' + clazz
          }

          days.push({
            day: j,
            class: clazz
          })
        }
        
        var dateItem = {
          id: year + '-' + month,
          year: year,
          month: month,
          days: days
        }

        dateList.push(dateItem);
      }
      var sFtv = this.data.sFtv;
      for (let i = 0; i < dateList.length; i++) { //加入公历节日
        for (let k = 0; k < sFtv.length; k++) {
          if (dateList[i].month == sFtv[k].month) {
            let days = dateList[i].days;
            for (let j = 0; j < days.length; j++) {
              if (days[j].day == sFtv[k].day) {
                days[j].daytext = sFtv[k].name
              }
            }
          }
        }
      }
      console.log(count,'查看count')
      console.log(count1,'查看count')
      this.setData({
        dateList: dateList
      });
      DATE_LIST = dateList;
    },

    /*
     * 获取月的总天数
     */
    getTotalDayByMonth: function (year, month) {
      month = parseInt(month, 10);
      var d = new Date(year, month, 0);
      return d.getDate();
    },
    /*
     * 获取月的第一天是星期几
     */
    getWeek: function (year, month, day) {
      var d = new Date(year, month - 1, day);
      return d.getDay();
    },
    /**
     * 点击日期事件
     */
    onPressDate: function (e) {
      if (this.data.clickCount >= 2) {
        return
      }

      var {
        year,
        month,
        day
      } = e.currentTarget.dataset;
      console.log(day, '---------')
      if (day <= this.data.clickDay && typeof (this.data.clickDay) == 'number') {
        return
      }
      this.data.clickCount++
      //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
      if ((day < DATE_DAY && month == DATE_MONTH) || day <= 0) return;

      var tempMonth = month;
      var tempDay = day;
      if (month < 10) tempMonth = '0' + month
      if (day < 10) tempDay = '0' + day

      var date = year + '-' + tempMonth + '-' + tempDay;
      this.setData({
        clickDay: day
      })
      //如果点击选择的日期A小于入住时间，则重新渲染入住时间为A
      if ((this.data.markcheckInDate && Moment(date).before(this.data.checkInDate) || this.data.checkInDate === date)) {
        this.setData({
          markcheckInDate: false,
          markcheckOutDate: false,
          dateList: DATE_LIST.concat()
        });
      };
      if (this.data.markcheckOutDate && this.data.checkOutDate) {
        this.setData({
          markcheckInDate: false,
          markcheckOutDate: false,
          dateList: DATE_LIST.concat()
        });
      }

      if (!this.data.markcheckInDate) {
        console.log("===================markcheckInDate")
        this.setData({
          checkInDate: date,
          markcheckInDate: true,
          dateList: DATE_LIST.concat()
        });
      } else if (!this.data.markcheckOutDate) {
        console.log("===================markcheckOutDate")
        this.setData({
          checkOutDate: date,
          markcheckOutDate: true,
        });
        //设缓存，返回页面时，可在onShow时获取缓存起来的日期
        wx.setStorage({
          key: 'ROOM_SOURCE_DATE',
          data: {
            checkInDate: this.data.checkInDate,
            checkOutDate: this.data.checkOutDate
          }
        });

        setTimeout(() => {
          this.setData({
            isSelectTime: false,
            clickCount: 0,
            clickDay: ''
          })
          // 截取时间
          let checkInDate = this.data.checkInDate.substr(5, e.detail.length)
          let checkOutDate = this.data.checkOutDate.substr(5, e.detail.length)
          // 缓存入住时间及离店时间 用于展示
          wx.setStorageSync('CheckTime', checkInDate)
          wx.setStorageSync('leaveTime', checkOutDate);
          let nights = Moment(this.data.checkOutDate).differ(this.data.checkInDate)
          // 缓存几晚
          wx.setStorageSync('nights', nights)

          let Inselectday = new Date(this.data.checkInDate).getDay();
          let Ouselectday = new Date(this.data.checkOutDate).getDay();
          let Inweek = this.data.weekStr[Inselectday]
          let Ouweek = this.data.weekStr[Ouselectday]
          console.log(Inweek, Ouweek)
          this.triggerEvent('onLoadFun', {
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            nights: nights,
            Inweek: Inweek,
            Ouweek: Ouweek,
            year: year,
            sTime:year+'-'+checkInDate,
            eTime:year+'-'+checkOutDate,
          });
        }, 1000);
        // wx.navigateBack({
        //   delta: 1, // 回退前 delta(默认为1) 页面
        // });
      }
      console.log("year=========" + year + "=======month=====" + month + "=======day=====" + day)

      this.createDateListData(); //重新点击时数据初始化
      if (this.data.markcheckOutDate) {
        this.selectDataMarkLine()
      } else {
        this.renderPressStyle(year, month, day);
      }

    },
    renderPressStyle: function (year, month, day) {
      this.createDateListData(); //重新点击时数据初始化
      var dateList = this.data.dateList;
      //渲染点击样式
      for (var i = 0; i < dateList.length; i++) {
        var dateItem = dateList[i];
        var id = dateItem.id;
        if (id === year + '-' + month) {
          var days = dateItem.days;
          for (var j = 0; j < days.length; j++) {
            var tempDay = days[j].day;
            if (tempDay == day) {
              days[j].class = days[j].class + ' active';
              days[j].inday = true;
              break;
            }
          }
          break;
        }
      }
      this.setData({
        dateList: dateList
      });
    }
  }

})