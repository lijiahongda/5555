var app = getApp();
/***
 * 用法 引入组件 
 * 传值
 * posterType:来源 非必传
 * posterUrl:必传项 图片地址
 * 绑定回调函数
 * 
 * 实例
 * 
* <poster posterType=”{{posterType}}“ posterUrl="{{posterUrl}}"  bind:handleCallBack="handleCallBack"></poster>
  图片保存成功回调val是1  
  保存失败 回调val 是0
*/
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posterType: {
      type: String,
      value: "",
    },
    status:{
      type:String,
      observer:function (newval,oldval){
        this.setData({
          showstatus:newval
        })
      }
    },
    posterUrl: {
      type: String,
      value:"",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showstatus:'0',
    isIphoneX:false
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // this.getCityInfo()

     let res = wx.getSystemInfoSync();
     console.log("系统---",res);


     if (res.model.indexOf('iPhone X') != -1) {
          this.setData({
            isIphoneX:true
          }) //不等于-1 就是----
    }
        
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showImg() {
      let that = this;
      wx.previewImage({
        current: that.properties.posterUrl, // 当前显示图片的http链接
        urls: [that.properties.posterUrl], // 需要预览的图片http链接列表
      });
    },
    handleSavePhoto() {
      let that = this;
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {
                // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
                console.log("获取成功");
              },
              fail(){
                wx.showModal({
                  title: '系统提示',
                  content: '请点击右上角,打开小程序设置,开启相册权限',
                  showCancel: false,
                  cancelText: '取消',
                  cancelColor: '#000000',
                  confirmText: '我知道了',
                  confirmColor: '#3CC51F',
                  success: (result) => {
                    if(result.confirm){
                      
                    }
                  },
                  fail: ()=>{},
                  complete: ()=>{}
                });
              }
            })
          }else{

            wx.showLoading({
              title: "保存中",
              mask: true,
              success: (result)=>{
                
              },
              fail: ()=>{},
              complete: ()=>{}
            });
            console.log(that.properties.posterUrl);
            wx.downloadFile({
              url: that.properties.posterUrl, //仅为示例，并非真实的资源
              success (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                  console.log(res.tempFilePath);
                  that.saveImg(res.tempFilePath);
                }else{
                  wx.showToast({
                    title: "网络错误,请稍后重试",
                    icon: "none",
                  });
                }
              }
            })
          }
        }
      })




   
    },
    saveImg(imgurl){
      let that = this;
      wx.saveImageToPhotosAlbum({
        filePath: imgurl,
        success: (result) => {
          wx.showToast({
            title: "保存成功",
            icon: "none",
          });

        },
        fail: (error) => {
          console.log(error);
          wx.showToast({
            title: "已取消保存",
            icon: "none",
          });

        },
        complete: () => {
          that.handleBox();
          wx.hideLoading();
        },
      });
    },
    handleBox(){
      this.triggerEvent("handleBox");
    }
  },
});
