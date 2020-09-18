import {wxRequest} from "../../utils/request"
import {
  post,get
} from "../../utils/api"
import {hotelGoodsShare} from "../../api/hotel"
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    posterType: {
      type: String,
      value: "",

    },
    fromtype:{
      type:String,
      observer:function (newval,oldval){
        this.setData({
          ftype:newval
        })
      }
    },
    goodObj:{
      type:Object,
      value:{}
    },
    hName:{
      type: String,
      value: "",
    },
    cpsCustomerId:{
      type: String,
      value: "",
    },
    cName:{
      type: String,
      value: "",
    },
    price:{
      type: String,
      value: "",
    },
    type:{
      type: String,
      value: "",
    },
    copyIcon:{
      type: Boolean,
      value: true,
    },
    status:{
      type:String,
      observer:function (newval,oldval){
        this.setData({
          showstatus:newval
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showstatus:'0',
    ftype:'',
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function () {
      // this.getCityInfo()

      console.log(this.data.copyIcon,'copyIcon')
        
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showversion(){
      let that = this;
      wxRequest({
        method: 'get',
        url: "/api/vip/card/version/upgrade/show",
        data: {
          version:'1.0.28',
        }
      }).then(res => {
        console.log(res)
        if(res.show == 0){  
          wx.showToast({
            title: '该功能暂未开放',
            icon: 'none'
          });
        }else {
          that.triggerEvent("handleShowPosterStatus");

        }

      }).catch(err => {
        wx.hideLoading()
        console.log(err)
      })
    },
    handleCloseDialog(){
      this.triggerEvent("handleCloseDialog");
    },
    handleShowPosterStatus(){
      this.showversion();
    },
    // 会员复制链接
    copyBtn(){
      console.log(wx.getStorageSync('customerId'),wx.getStorageSync('dealerId'),wx.getStorageSync('adminId'),"111")
      // ,"222")

      let that = this;
      console.log(that.data.ftype);
     
      if(that.properties.fromtype == 'ziying'){
        // console.log("商品自营");
        // console.log(this.properties.goodObj);
        let goodObj = this.properties.goodObj;
        let buyPrice = (goodObj.skuInfo['skuList'][0].price / 100).toFixed(2);
        hotelGoodsShare({
          uid:wx.getStorageSync("memberId"),
          delearId:wx.getStorageSync("dealerId"),
          goodsId:goodObj.id,
          price:buyPrice,
          hotelName:goodObj.splList.supplier_name,
          goodsName:goodObj.name

        }).then(res=>{
          console.log(res);
          if(res.code==200){
            // debugger;


           let copyObj = res.data;
           let copyText =  copyObj.goods_name+"\n"+copyObj.sale_desc+"\n"+copyObj.buy_desc+"\n"+copyObj.panic_link;

            wx.setClipboardData({
                //去找上面的数据
                data: copyText,
                success: function (res) {
                    wx.getClipboardData({
                      success (res) {
                        wx.showToast({
                          title:"复制成功",
                        });
                        that.triggerEvent("handleCloseDialog");
                      }
                    })
                }
            });
          }
        })  
      }else if(that.properties.fromtype == 'all'){
        let copyObj = that.properties.goodObj
        let copyText =  copyObj.goods_name+"\n"+copyObj.sale_desc+"\n"+copyObj.buy_desc+"\n"+copyObj.panic_link;

        wx.setClipboardData({
            //去找上面的数据
            data: copyText,
            success: function (res) {
                wx.getClipboardData({
                  success (res) {
                    wx.showToast({
                      title:"复制成功",
                    });
                    that.triggerEvent("handleCloseDialog");
                  }
                })
            }
        });
      }
      else{
        post('/apiH5/copyPath',{
          hName:this.data.hName,
          cName:this.data.cName,
          price:this.data.price,
          type:this.data.type,
          cpsCustomerId:this.data.cpsCustomerId,
          url:'http://pms.zhiding365.com/h5/member?dealerId='+wx.getStorageSync('dealerId')+'&customerId='+wx.getStorageSync('customerId')+'&adminId='+wx.getStorageSync('adminId')+'&cpsCustomerId='+wx.getStorageSync('memberId'),
        },(res)=>{
          // console.log(res,'lalalalalla')
          if(res.data.code==200){
            let copyPaht = res.data.data;
         
            let copyTexts = "👇👇👇"+"\n"+copyPaht.shareText+"\n"+copyPaht.price+"\n"+"入口"+ "👉 " +copyPaht.shareUrl
            wx.setClipboardData({
                //去找上面的数据
                data: copyTexts,
                success: function (res) {
                    wx.getClipboardData({
                      success (res) {
                        // console.log(res.data) // data
                        wx.showToast({
                          title:"复制成功",
                        });
                        that.triggerEvent("handleCloseDialog");
                      }
                    })
                }
            });
          }
        })
      }

     
        

    }
  },
});
