// equityCard/pages/TrainTickets/calendar/index.js


let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa: {
      "bg_color": "linear-gradient(0deg,rgba(255,86,84,1) 0%,rgba(247,48,55,1) 100%)",
      "color": "#fff",
      "flag": 1,
      "name": "选择日期"
    },
    change: {},
    options: {//设置参数
      isMultiSelect: false, //是否可以多选
      dateCount: 6,  //生成几个月的时间
      isDisable: false //尾部时间禁用
    },
    dateList: [],
    weeks: ["日", "一", "二", "三", "四", "五", "六"],
    selectedDate: "",
    LoadingStatus: true

  },
  backUpPage(selectedDay) {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];   //当前页面
    let prevPage = pages[pages.length - 2];  //上一个页面
    console.log("返回上一页,并设置参数");
    //{date: "2019-12-06", year: 2019, month: 12, day: "06", isDisable: false}
    let selectDay = new Date(selectedDay.date).getTime() / 1000 / 60 / 60 / 24;
    let toDay = Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24);
    let pastTime = selectDay - toDay;
    let subName;
    switch (pastTime) {
      case 0:
        subName = "今天";
        break;
      case 1:
        subName = "明天";
        break;
      case 2:
        subName = "后天";
        break;
      default:
        subName = "";
    }
    prevPage.setData({
      selectedDay,
      subName,
      scrollDate: selectedDay
    });
    wx.navigateBack({
      delta: 1
    });
  },
  //生成时间对象,默认6个月,默认从当前月数的1号开始
  createdDate() {
    let dateAllArr = []; //日历数据列表
    let { year, month, day, week, monday } = this.getYearMonthDayWeek(new Date());
    let dateCount = this.data.options.dateCount; //生成几个月的日期列表
    let everyDay = []; //每一天
    let disable = this.data.options.isDisable; //首尾禁用
    month -= 1; //包含本月
    for (let i = 0; i < dateCount; i++) { //循环创建月份 [2019-11,2019-12,2020-01,...]
      month = Number(month) + 1;
      if (month > 12) {
        year++;
        month -= 12;
      }
      const monthTitle = year + "-" + ((month < 10) ? "0" + month : month);
      let dayNum = this.getDayNumByYearMoth(year, month); //计算对应月份的总天数
      const _everyDay = []; //数组 每循环一次 添加一次时间对象
      for (let j = 0; j < dayNum; j++) {
        const day = j + 1;
        const date = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        let isDisable = false;
        //计算时间,过去的时间禁用
        const toDay = Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24);
        const everyTime = new Date(date).getTime() / 1000 / 60 / 60 / 24;
        const pastTime = everyTime - toDay; //每一天 减 今天 结果:小于0为昨天及更早的时间 等于0为今天 大于0为明天及以后的时间
        if (pastTime < 0 ||pastTime >= 30) {
          isDisable = true;
        }
        //尾部是否禁用 45天过后禁用

        _everyDay[j] = {
          date,
          year,
          month: month < 10 ? "0" + month : month,
          day: day < 10 ? "0" + day : day,
          isDisable,
          monday,
        };
        everyDay[i] = _everyDay;

      }
      const _dateAllArr = {
        yearMonth: monthTitle,//月份标题
        year,
        month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"][month - 1],
        startWeeks: new Date(monthTitle).getDay(),//每月第一天开始星期
        dayNum,
        everyDay: everyDay[i],
        monday
      };
      dateAllArr[i] = _dateAllArr;
    }
    this.setData({
      dateList: dateAllArr
    });
    console.log("生成的日历数据对象---", this.data.dateList);
  },
  //判断是否为闰年
  isLeapYear(year) {
    if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
      return true;
    } else {
      return false;
    }
  },
  //获取时间
  getYearMonthDayWeek(date) {
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    let day = new Date(date).getDate();
    let week = new Date(date).getDay();
    let time = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
    var days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let monday = days[new Date(date).getDay()]
    return { year, month, day, week, time, monday};
  },
  //计算每个月的天数
  getDayNumByYearMoth(year, month) {
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
        break;
      case 2:
        return this.isLeapYear(year) ? 29 : 28;
    }
  },
  //用户点选时间
  getSelectedDate(e) {
    let selectedDate = e.currentTarget.dataset.date;
    console.log("用户点击的时间", selectedDate)
    let isDisable = e.currentTarget.dataset.isdisable;
    if (isDisable) return;
    //判断是否改签页进来的
    // let changeType = app.globalData.change.type;
    // if (changeType) {
    //   let params = {
    //     date: selectedDate
    //   };
    //   wx.navigateTo({
    //     url: "/page/TrainTickets/pages/vehicleSelect/vehicleSelect?params=" + JSON.stringify(params)
    //   });
    //   this.setData({ selectedDate: selectedDate.date });
    //   return;
    // }
    //todo 目前只要单选...多选思路:在这个位置判断this.data.isMultiSelect
    this.setData({ selectedDate: selectedDate.date });
    this.backUpPage(selectedDate);
  },
  //获取价格日历
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let params = JSON.parse(options.params);
    console.log("datepick--onload设置options数据====", params);
    this.setData({ selectedDate: params.date.date, change: params });
    this.createdDate(); //生成6个月日历
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

  }
});