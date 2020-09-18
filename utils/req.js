import { baseUrlObj } from "./baseUrl";
const app = getApp()
export function wxRequest(objData) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrlObj.url + objData.url, //仅为示例，并非真实的接口地址
      data: objData.data,
      method: objData.method || "GET",
      header: {
        Authorization: wx.getStorageSync("token"),
        "content-type":
          objData.contentType || "application/x-www-form-urlencoded", // 默认值
      },
      success(res) {
        // console.log(res)
        // console.log("resdata", res.data);
        if(res.data.code == "SUCCESS" && res.data.resultCode == "SUCCESS"){
          resolve(res.data.response)
        }
        else
        {
            wx.showToast({
              title: res.data.resultMessage,
              icon: 'none',
              mask: true
            });
            reject(res.data);
            
          }

      },
      fail(err) {
       
        reject(err);
      },
      complete() {
      },
    });
  });
}
function clearKeys(){
  let removeKeys = wx.getStorageInfoSync().keys;
  for(let i =0;i < removeKeys.length;i++){

    if(removeKeys[i] == 'dealerId'){

    }else if(removeKeys[i] == 'backurl'){

    }else{
      wx.removeStorageSync(removeKeys[i])
    }
  }
}
