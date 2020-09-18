// page/My/My.js
const app = getApp();
import { ajaxSyDetail } from "../../../../api/Wallet";
import * as echarts from "../../../../utils/ec-canvas/echarts";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    allData: "",
    typename:"我的总收益",
    profitList: [],
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true,
    },
    defautChooseDate: {
      t1: "",
      t2: "",
    },
    tabDataIndex: 0,
    params: {
      memberId:wx.getStorageSync('memberId'),
      startTime: "",
      endTime: "",
      type: "",
    },
    tabData: [
      {
        name: "近7天",
        id: 0,
      },
      {
        name: "近30天",
        id: 1,
      },
      {
        name: "自定义",
        id: 2,
      },
    ],
  },
  onReady: function () {
    // 获取组件
    // this.ecComponent  = ;
  },
  setOption(chart, val) {
    var option = {
      title: {
        // text: '测试下面legend的红色区域不应被裁剪',
        // left: 'center'
      },
      color: ["#F7263C"],
      legend: {
        // data: ['A', 'B', 'C'],
        // top: 50,
        // left: 'center',
        // backgroundColor: 'red',
        // z: 100
      },
      grid: {
        containLabel: true,
      },
      tooltip: {
        show: true,
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: val.creatTimeArr,
        // show: false
      },
      yAxis: {
        x: "center",
        type: "value",
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        // show: false
      },
      series: [
        {
          name: "收益详情",
          type: "line",
          data: val.sumCommissionArr,
        },
      ],
    };
    chart.setOption(option);
  },
  init: function (val) {
    this.selectComponent("#mychart-dom-bar").init(
      (canvas, width, height, dpr) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr, // new
        });
        this.setOption(chart, val);

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.chart = chart;
        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      }
    );
  },
  handleSerach() {
    if (!this.data.defautChooseDate.t1) {
      wx.showToast({
        title: "请选择开始时间",
        icon: "none",
      });
      return;
    }
    if (!this.data.defautChooseDate.t2) {
      wx.showToast({
        title: "请选择结束时间",
        icon: "none",
      });
      return;
    }
    this.setData({
      "params.startTime": this.data.defautChooseDate.t1,
      "params.endTime":this.data.defautChooseDate.t2,
    });
    this.getTongjiData();
  },
  getTongjiData() {
    let params = this.data.params;
    return new Promise((resolve, reject) => {
      ajaxSyDetail(params).then((res) => {
        if (res.code == 200) {
          console.log("res----", res.data);

          let response = res.data;
          this.setData({
            allData: response,
          });
          let profitList = response.profitList;
          let creatTimeArr = [];
          let sumCommissionArr = [];
          profitList.forEach((val) => {
            creatTimeArr.push(val.create_time);
            sumCommissionArr.push(val.sumCommission);
          });
          let obj = {
            creatTimeArr,
            sumCommissionArr,
          };
          this.setData({
            profitList,
          });
          if (profitList.length) {
            this.init(obj);
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    });
  },
  bindStartDateChange(e) {
    //开始时间切换事件
    console.log("picker发送选择改变，开始时间携带值为", e.detail.value);

    this.setData({
      "defautChooseDate.t1": e.detail.value,
    });
  },
  bindEndDateChange(e) {
    //开始时间切换事件
    console.log("picker发送选择改变，开始时间携带值为", e.detail.value);
    this.setData({
      "defautChooseDate.t2": e.detail.value,
    });
  },
  handleTabMy(e) {
    let { id } = e.currentTarget.dataset;
    this.setData({
      tabDataIndex: id,
    });
    if (id == 0) {
      let sevenObj = this.timeForMat(7);
      this.setData({
        sevenObj,
        "params.startTime": sevenObj.t2,
        "params.endTime": sevenObj.t1,
      });
      this.getTongjiData();
    }
    if (id == 1) {
      //近30天
      let thirdObj = this.timeForMat(30);

      this.setData({
        thirdObj,
        "params.startTime": thirdObj.t2,
        "params.endTime": thirdObj.t1,
      });
      this.getTongjiData();
    }
  },

  timeForMat(count) {
    // 拼接时间
    let time1 = new Date();
    time1.setTime(time1.getTime() - 24 * 60 * 60 * 1000);
    let Y1 = time1.getFullYear();
    let M1 =
      time1.getMonth() + 1 > 10
        ? time1.getMonth() + 1
        : "0" + (time1.getMonth() + 1);
    let D1 = time1.getDate() > 10 ? time1.getDate() : "0" + time1.getDate();
    let timer1 = Y1 + "-" + M1 + "-" + D1; // 当前时间
    let time2 = new Date();
    time2.setTime(time2.getTime() - 24 * 60 * 60 * 1000 * count);
    let Y2 = time2.getFullYear();
    let M2 =
      time2.getMonth() + 1 > 10
        ? time2.getMonth() + 1
        : "0" + (time2.getMonth() + 1);
    let D2 = time2.getDate() > 10 ? time2.getDate() : "0" + time2.getDate();
    let timer2 = Y2 + "-" + M2 + "-" + D2; // 之前的7天或者30天
    return {
      t1: timer1,
      t2: timer2,
    };
  },

  filterTimeStamp(data) {
    //时间转秒
    return Date.parse(data) / 1000; //s
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let sevenObj = this.timeForMat(7);
    let type = options.type == 0 ? "" : options.type;
    let _title = "加载中";
    let _typename = '';
    if (type == 1) {
      _title = "总收益详情";
      _typename = '总收益';
    }
    if (type == 2) {
      _title = "推广收益详情";
      _typename = '推广收益';

    }
    if (type == 3) {
      _title = "平台奖励详情";
      _typename = '平台奖励';

    }
    wx.setNavigationBarTitle({
      title: _title,
    });

    this.setData({
      typename:_typename,
      sevenObj,
      "params.type": type,
      "params.startTime": sevenObj.t2,
      "params.endTime": sevenObj.t1,
    });
    this.echartsComponnet = this.selectComponent("#mychart-dom-bar");
    this.getTongjiData();
  },
  onShow() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  onPageScroll(obj) {},
});
