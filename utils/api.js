/*
 *  get请求
 *  url:请求地址
 *  params:参数
 *  callback:回调函数
 *  urlType:域名
 * */

const get = (url, params, callback, urlType = 1) => {
  if (urlType === 1) {
    if (url.indexOf('http') == -1) {
      url = 'https://yuecheng-api.yuelvhui.com' + url; //dev
      // url = 'http://test-api2.yuelvhui.com' +url;//dev
    }
  } else if (urlType === 2) {
    if (url.indexOf('http') == -1) {
      // url = 'https://yuecheng-api.yuelvhui.com' + url; //正式
      url = 'https://private-api.yuelvhui.com' +url;//dev
    }
  } else if (urlType === 3) {
    if (url.indexOf('http') == -1) {
      url = 'https://pms.zhiding365.com' + url; //正式
      // url = 'http://pms.zhiding365.testcom' +url;//dev
    }
  }
  if (params) {
    let paramsArray = [];
    Object.keys(params).forEach(key => paramsArray.push(params[key]))
    if (url.search(/\?/) === -1) {
      url += '/' + paramsArray.join('/')
    } else {
      url += '/' + paramsArray.join('/')
    }
  }

  if (url[url.length - 1] == '/') {
    url = url.substr(0, url.length - 1);
  }
  //请求
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    method: 'GET',
    header: {
      'Authorization':  wx.getStorageSync('token')
    },
    success: function (res) {
      callback(res)
    }
  })
}


/*
 *  post请求
 *  url:请求地址
 *  params:参数,这里的参数格式是：{param1: 'value1',param2: 'value2'}
 *  callback:回调函数
 *  urlType:请求域名
 * */
const post = (url, params, callback, urlType = 1) => {
  
  if (urlType === 1) {
    if (url.indexOf('http') == -1) {
      url = 'https://yuecheng-api.yuelvhui.com' + url; //正式
      // url = 'http://yuecheng-api.yuelvhui.testcn' +url;//dev
    }
  } else if (urlType === 2) {
    if (url.indexOf('http') == -1) {
      // url = 'https://yuecheng-api.yuelvhui.com' + url; //正式
      url = 'https://private-api.yuelvhui.com' +url;//dev
    }
  } else if (urlType === 3) {
    if (url.indexOf('http') == -1) {
      url = 'https://pms.zhiding365.com' + url; //正式
      // url = 'http://pms.zhiding365.testcom' +url;//dev
    }
  }
  
  //请求
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    method: 'POST',
    data: params,
    header: {
      'Authorization':  wx.getStorageSync('token')
    },
    success: function (res) {
      callback(res)
    }
  })
}
module.exports = {
  get: get,
  post: post,
}