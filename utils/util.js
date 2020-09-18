import { TOKENNAME } from './../config.js';
import hexMD5 from './md5.js'
var utilMD5 = require('./md5.js')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 交集
Array.intersect = function (arr1, arr2) {
  if (Object.prototype.toString.call(arr1) === "[object Array]" && Object.prototype.toString.call(arr2) === "[object Array]") {
    return arr1.filter(function (v) {
      return arr2.indexOf(v) !== -1
    })
  }
}
const $h = {
  //除法函数，用来得到精确的除法结果
  //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
  //调用：$h.Div(arg1,arg2)
  //返回值：arg1除以arg2的精确结果
  Div: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length; } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length; } catch (e) { }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
  },
  //加法函数，用来得到精确的加法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  //调用：$h.Add(arg1,arg2)
  //返回值：arg1加上arg2的精确结果
  Add: function (arg1, arg2) {
    arg2 = parseFloat(arg2);
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(100, Math.max(r1, r2));
    return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
  },
  //减法函数，用来得到精确的减法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
  //调用：$h.Sub(arg1,arg2)
  //返回值：arg1减去arg2的精确结果
  Sub: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
  },
  //乘法函数，用来得到精确的乘法结果
  //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  //调用：$h.Mul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果
  Mul: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


const wxgetUserInfo = function () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      lang: 'zh_CN',
      success(res) {
        resolve(res);
      },
      fail(res) {
        reject(res);
      }
    })
  });
}

const checkLogin = function () {
  let res = getApp().globalData.token ? true : false;
  let res1 = getApp().globalData.isLog;
  let res2 = res && res1;
  if (res2) {
    let newTime = Math.round(new Date() / 1000);
    if (getApp().globalData.expiresTime < newTime) return false;
  }
  return res2;
}

const logout = function () {
  wx.setStorageSync('uid', '')
  wx.setStorageSync('token', '')
  wx.setStorageSync('myRecode', '')
}



/**
 * 
 * 授权过后自动登录
*/
const autoLogin = function () {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'cache_key',
      success(res) {
        wxgetUserInfo().then(userInfo => {
          userInfo.cache_key = res.data;
          return resolve(userInfo);
        }).catch(res => {
          return reject(res);
        })
      },
      fail() {
        getCodeLogin((code) => {
          wxgetUserInfo().then(userInfo => {
            userInfo.code = code;
            return resolve(userInfo);
          }).catch(res => {
            return reject(res);
          })
        });
      }
    });
  })
}

const getCodeLogin = function (successFn) {
  wx.login({
    success(res) {
      successFn(res);
    }
  })
}

/*
* 合并数组
*/
const SplitArray = function (list, sp) {
  if (typeof list != 'object') return [];
  if (sp === undefined) sp = [];
  for (var i = 0; i < list.length; i++) {
    sp.push(list[i]);
  }
  return sp;
}

/**
  * opt  object | string
  * to_url object | string
  * 例:
  * this.Tips('/pages/test/test'); 跳转不提示
  * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
  * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
  * tab=1 一定时间后跳转至 table上
  * tab=2 一定时间后跳转至非 table上
  * tab=3 一定时间后返回上页面
  * tab=4 关闭所有页面跳转至非table上
  * tab=5 关闭当前页面跳转至table上
  */
const Tips = function (opt, to_url) {
  if (typeof opt == 'string') {
    to_url = opt;
    opt = {};
  }
  var title = opt.title || '', icon = opt.icon || 'none', endtime = opt.endtime || 2000;
  if (title) wx.showToast({ title: title, icon: icon, duration: endtime })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      var tab = to_url.tab || 1, url = to_url.url || '';
      switch (tab) {
        case 1:
          //一定时间后跳转至 table
          setTimeout(function () {
            wx.switchTab({
              url: url
            })
          }, endtime);
          break;
        case 2:
          //跳转至非table页面
          setTimeout(function () {
            wx.navigateTo({
              url: url,
            })
          }, endtime);
          break;
        case 3:
          //返回上页面
          setTimeout(function () {
            wx.navigateBack({
              delta: parseInt(url),
            })
          }, endtime);
          break;
        case 4:
          //关闭当前所有页面跳转至非table页面
          setTimeout(function () {
            wx.reLaunch({
              url: url,
            })
          }, endtime);
          break;
        case 5:
          //关闭当前页面跳转至非table页面
          setTimeout(function () {
            wx.redirectTo({
              url: url,
            })
          }, endtime);
          break;
      }

    } else if (typeof to_url == 'function') {
      setTimeout(function () {
        to_url && to_url();
      }, endtime);
    } else {
      //没有提示时跳转不延迟
      setTimeout(function () {
        wx.navigateTo({
          url: to_url,
        })
      }, title ? endtime : 0);
    }
  }
}

/**
 * 移除数组中的某个数组并组成新的数组返回
 * @param array array 需要移除的数组
 * @param int index 需要移除的数组的键值
 * @param string | int 值
 * @return array
 * 
*/
const ArrayRemove = (array, index, value) => {
  const valueArray = [];
  if (array instanceof Array) {
    for (let i = 0; i < array.length; i++) {
      if (typeof index == 'number' && array[index] != i) {
        valueArray.push(array[i]);
      } else if (typeof index == 'string' && array[i][index] != value) {
        valueArray.push(array[i]);
      }
    }
  }
  return valueArray;
}
/**
 * 生成海报获取文字
 * @param string text 为传入的文本
 * @param int num 为单行显示的字节长度
 * @return array 
*/
const textByteLength = (text, num) => {
  let strLength = 0;
  let rows = 1;
  let str = 0;
  let arr = [];
  for (let j = 0; j < text.length; j++) {
    if (text.charCodeAt(j) > 255) {
      strLength += 2;
      if (strLength > rows * num) {
        strLength++;
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    } else {
      strLength++;
      if (strLength > rows * num) {
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    }
  }
  arr.push(text.slice(str, text.length));
  return [strLength, arr, rows]   //  [处理文字的总字节长度，每行显示内容的数组，行数]
}

/**
 * 获取分享海报
 * @param array arr2 海报素材
 * @param string store_name 素材文字
 * @param string price 价格
 * @param function successFn 回调函数
 * 
 * 
*/
const PosterCanvas = (arr2, store_name, price, successFn) => {
  wx.showLoading({ title: '海报生成中', mask: true });
  const ctx = wx.createCanvasContext('myCanvas');
  ctx.clearRect(0, 0, 0, 0);
  /**
   * 只能获取合法域名下的图片信息,本地调试无法获取
   * 
  */
  wx.getImageInfo({
    src: arr2[0],
    success: function (res) {
      const WIDTH = res.width;
      const HEIGHT = res.height;
      ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
      ctx.drawImage(arr2[1], 0, 0, WIDTH, WIDTH);
      ctx.save();
      let r = 90;
      let d = r * 2;
      let cx = 40;
      let cy = 990;
      ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(arr2[2], cx, cy, d, d);
      ctx.restore();
      const CONTENT_ROW_LENGTH = 40;
      let [contentLeng, contentArray, contentRows] = textByteLength(store_name, CONTENT_ROW_LENGTH);
      if (contentRows > 2) {
        contentRows = 2;
        let textArray = contentArray.slice(0, 2);
        textArray[textArray.length - 1] += '……';
        contentArray = textArray;
      }
      ctx.setTextAlign('center');
      ctx.setFontSize(32);
      let contentHh = 32 * 1.3;
      for (let m = 0; m < contentArray.length; m++) {
        ctx.fillText(contentArray[m], WIDTH / 2, 820 + contentHh * m);
      }
      ctx.setTextAlign('center')
      ctx.setFontSize(48);
      ctx.setFillStyle('red');
      ctx.fillText('￥' + price, WIDTH / 2, 860 + contentHh);
      ctx.draw(true, function () {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          fileType: 'png',
          destWidth: WIDTH,
          destHeight: HEIGHT,
          success: function (res) {
            wx.hideLoading();
            successFn && successFn(res.tempFilePath);
          }
        })
      });
    },
    fail: function () {
      wx.hideLoading();
      Tips({ title: '无法获取图片信息' });
    }
  })
}

const md5 = (type, key, timestamp) => {
  let str = ''
  switch (type) {
    case 0:
      str = '2001.' + timestamp + '.' + key
      // let md = MD5;
      let password;
      return password = hexMD5.hexMD5(str);
      break
    case 1:

      str = key
      return str
      break
  }

}
/**
 * 数字变动动画效果
 * @param float BaseNumber 原数字
 * @param float ChangeNumber 变动后的数字
 * @param object that 当前this
 * @param string name 变动字段名称
 * */
const AnimationNumber = (BaseNumber, ChangeNumber, that, name) => {
  var difference = $h.Sub(ChangeNumber, BaseNumber) //与原数字的差
  var absDifferent = Math.abs(difference) //差取绝对值
  var changeTimes = absDifferent < 6 ? absDifferent : 6 //最多变化6次
  var changeUnit = absDifferent < 6 ? 1 : Math.floor(difference / 6);
  // 依次变化
  for (var i = 0; i < changeTimes; i += 1) {
    // 使用闭包传入i值，用来判断是不是最后一次变化
    (function (i) {
      setTimeout(() => {
        that.setData({
          [name]: $h.Add(BaseNumber, changeUnit)
        })
        // 差值除以变化次数时，并不都是整除的，所以最后一步要精确设置新数字
        if (i == changeTimes - 1) {
          that.setData({
            [name]: $h.Add(BaseNumber, difference)
          })
        }
      }, 100 * (i + 1))
    })(i)
  }
}

// 倒计时
//取倒计时（天时分秒）
const getTimeLeft = (datetimeTo) => {
  // console.log(datetimeTo)
  // 计算目标与现在时间差（毫秒）
  let time1 = new Date(datetimeTo).getTime();
  let time2 = new Date().getTime();
  let mss = time1 - time2;

  // 将时间差（毫秒）格式为：天时分秒
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((mss % (1000 * 60)) / 1000);

  return days + "天" + hours + ":" + minutes + ":" + seconds
}

function initSelected(colorsize, skuid, wxThis){
  let arr = new Array(colorsize.length)
  for (let i = 0; i < colorsize.length; i++) {
    for (let j = 0; j < colorsize[i].buttons.length; j++) {
      // colorsize[i].buttons[j].isEnable = true
      if (colorsize[i].buttons[j].skuList.indexOf(Number(skuid)) > -1) {
        // this.data.statusArr[i] = j
        this.selectLabel(i, j, wxThis);
      }
    }
  }
}

function selectLabel(index, data_index ,wxThis) {
  let that = wxThis;
  let colorSize = that.data.colorSize;
  var idx = index;
  // let arr=[]
  //选中sku
  var sku = colorSize[index].buttons[data_index]['skuList']
  //选中第几行第几个
  console.log(that.data.statusArr)
  that.data.statusArr[index] = data_index
  console.log(that.data.statusArr[index])
  //取出其他sku
  let m = []
  that.setData({
    sizeSelectText: []
  })
  var is_selected_skus = {};
  that.data.statusArr.map((b, a) => {
    if (a != idx && (typeof that.data.statusArr[a] != "undefined")) {
      is_selected_skus[a] = colorSize[a].buttons[that.data.statusArr[a]].skuList;
    }
    that.data.sizeSelectText.push(colorSize[a].buttons[that.data.statusArr[a]].text)
    console.log(colorSize[a].buttons[that.data.statusArr[a]].text)
  })
  for (let i = 0; i < colorSize.length; i++) {
    var channel_data = colorSize[i].buttons;

    for (let j = 0; j < channel_data.length; j++) {
      if (i != idx) {
        var sku_isists = Array.intersect(sku, channel_data[j].skuList);
        for (let [c, d] in is_selected_skus) {
          if (c != i) {
            sku_isists = Array.intersect(sku_isists, is_selected_skus[c]); //is_selected_skus非当前行其他行选中的元素
          }
        }
        if (sku_isists.length) {
          colorSize[i].buttons[j].isEnable = true;
        } else {
          colorSize[i].buttons[j].isEnable = false;
        }
      } else {
        if (j == data_index) {
          colorSize[i].buttons[j].isEnable = true;
        } else if (colorSize.length == 1) {
          colorSize[i].buttons[j].isEnable = true;
        }
      }
    }
  }
  let last_sku = sku
  for (let [c, d] in is_selected_skus) {
    last_sku = Array.intersect(last_sku, is_selected_skus[c]);
  }
  console.log(that.data.statusArr)
  that.setData({
    statusArr: that.data.statusArr,
    colorSize: colorSize,
    last_sku: last_sku[0],
    skuid: last_sku[0],
    sizeSelectText: that.data.sizeSelectText
  })
  console.log(that.data.sizeSelectText, that.data.statusArr)
  that.skuidDetil()
}

function retrunScene(scene, callback) {
  scene = decodeURIComponent(scene);
  let sceneArr = scene.split("&");
  let sceneObj = {};
  for (let i = 0; i < sceneArr.length; i++) {
    let sceneArr1 = sceneArr[i].split('=');
    sceneObj[sceneArr1[0]] = sceneArr1[1];
  }
}
module.exports = {
  getTimeLeft: getTimeLeft,
  formatTime: formatTime,
  retrunScene:retrunScene,
  $h: $h,
  Tips: Tips,
  SplitArray: SplitArray,
  ArrayRemove: ArrayRemove,
  PosterCanvas: PosterCanvas,
  AnimationNumber: AnimationNumber,
  getCodeLogin: getCodeLogin,
  checkLogin: checkLogin,
  wxgetUserInfo: wxgetUserInfo,
  autoLogin: autoLogin,
  logout: logout,
  initSelected
}
