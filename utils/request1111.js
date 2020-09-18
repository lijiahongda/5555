import util from './util.js';
import {
  TOKENNAME
} from './../config.js';
/**
 * 发送请求
 */
export default function request(api, method, data, {
  ct = false,
  urlType = 2,
  isAppUse = false // 是否在App实例化前调用
}) {
  //api---接口
  //method ---请求方式
  //data ---参数。urlType：请求地址。
  let globalData = getApp().globalData
  // let globalData = isAppUse ? data.globalData : getApp().globalData
  let Url,
    header = {
      'Content-Type':'application/x-www-form-urlencoded',
    }
  
  if(ct){ // 重新定义Content-Type
    header = {
      'Content-Type':'application/json;charset=UTF-8',
    }
  }

  if (urlType == 1){
    Url = globalData.JavaUrl
  }
  if (urlType == 2){
    Url = globalData.PhpUrl
  }
  if (urlType == 3){
    Url = globalData.RobotUrl
  }
  
  data = data || {}
  data.dataType = 'zhiding'
  header[TOKENNAME] = wx.getStorageSync('token')

  return new Promise((reslove, reject) => {
    wx.showLoading({
      mask: true,
    })
    wx.request({
      url: Url + api,
      method: method || 'GET',
      header: header,
      data: data,
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 200) {
          reslove(res.data, res);
        }
        else if (res.statusCode == 200) {
          reslove(res.data, res);
          if ([410000, 410001, 410002].indexOf(res.data.status) > -1) { //需要退出登录
            util.logout()
          }
        }
        else {
          reject(res.data.msg || '系统错误');
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.log("错误信息",err);
        if(err.errMsg == 'request:fail timeout'){
          wx.showToast({
            title: '网络请求超时,请稍后重试',
            icon: 'none'
          });
        }
        reject(err);
      }
    })
  });
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
});