import {post} from "../utils/api"

function retrunScene(scene, callback) {
  scene = decodeURIComponent(scene);
  let sceneArr = scene.split("&");
  let sceneObj = {};
  for (let i = 0; i < sceneArr.length; i++) {
    let sceneArr1 = sceneArr[i].split('=');
    sceneObj[sceneArr1[0]] = sceneArr1[1];
  }

  callback(sceneObj);
}

//获取url参数
function getQueryVariable(urlStr){
  if (typeof urlStr == "undefined") {
             var url = decodeURI(urlStr); //获取url中"?"符后的字符串
        } else {
            var url = "?" + urlStr.split("?")[1];
        }
        var theRequest = new Object();
       if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
       return theRequest;
}

function getCardCode(rName){
  //获取二维码上的参数
  return new Promise((resolve,reject)=>{
    post("/api/share/hb/getRedisUrl",{
      rName:rName
    },res=>{
      console.log('getCardCode',res)
      let _url = res.data.data.url;
      let paramsObj = new getQueryVariable(_url);
      let invitecode = paramsObj['C'];
      console.log(invitecode,3333)
      wx.setStorage({
        data: invitecode,
        key: 'inviteCode',
      })
      // wx.setStorageSync("inviteCode",invitecode)
      let goodid = paramsObj['G'] || '';
      let qid = paramsObj['Q'] || '';
      let cpsCustomerId = paramsObj['H'] || '';
      if(res.data.code == 200){
        resolve({
          G:goodid,
          Q:qid,//会员卡id
          H:cpsCustomerId,//邀请者 邀请者customer_id
        })  
      }
    })
  })
  


  
}
module.exports = {
  retrunScene,
  getQueryVariable,
  getCardCode
}