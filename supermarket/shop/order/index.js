//index.js
//获取应用实例
import{getDefautAddressInfo,createOrder}from "../../../api/order"
import {productDetail} from "../../../api/personal"
const app = getApp();

Page({
  data: {
    w_goodsArr:"",
    goodsArr:[],
    isaddress:{},
    id: "", //商品id
    currSKUindex:"",
    num:"",//购买数量
    mallOrderType:"",//订单类型  5是虚拟商品
    totalPrice:"",
    shopData:"",
    addressIds:''

  },
  handleChooseAddress(){
    //选择地址
    wx.navigateTo({
      url: "/supermarket/shop/address/index"
    });
  },
  nextUrl(e) {
    console.log(e);
    let obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: "/supermarket/shop/detail/index?sid=" + obj.id,
    });
  },
  handleBuy(){
      let that = this;
      let isaddress = that.data.isaddress;


      if(that.data.mallOrderType == 1){

      
        if(!that.data.isaddress||isaddress.proviceId==undefined){
          wx.showToast({
            title: '请选择收货地址',
            icon:'none'
          })
          return;
        }
    }
     //构造参数对象
      let peopleObj = {
        contact : isaddress.receiverName,
        telPhone : isaddress.mobile,
        addressDetail :isaddress.address,
        provinceId : isaddress.proviceId,
        cityId :isaddress.cityId,
        countyId : isaddress.zoneId,
        postCode : isaddress.postalCode,
        townId:isaddress.townId?isaddress.townId:0
      }
      console.log("联系人对象",peopleObj);


      let goodsArr = that.data.w_goodsArr;
  
      let model = {
        memberId:wx.getStorageSync("memberId"), 
        totalAmount: parseInt(that.data.totalPrice) * 100, //订单原始金额
        preferentialAmount: 0, //订单总优惠金额
        logisticsAmount: 0, //订单总物流费用
        orderAmount: parseInt(that.data.totalPrice) * 100, //订单应付金额
        cancelFlag: 1, //订单可否取消 1可以 0不可以
        receiveInfo: peopleObj,
        list: [
          {
            mallOrderType:that.data.mallOrderType, //商品分类 5是虚拟 1是食物
            supplierId: that.data.shopData.splList.id, //酒店对应的供应商id
            supplierName: that.data.shopData.splList.supplier_name,
            subLogisticsAmount: 0,
            // userMessage: "", //用户留言
            goodsList: goodsArr //商品信息
          }
        ]
      };
      // debugger;
      if(that.data.mallOrderType == 5){
        model.receiveInfo = {};
      }

      console.log("构造的请求对象",model);
      
      wx.showLoading({
        title:"创建订单中",
        mask:true
      })

      setTimeout(()=>{
        this.ajaxCreateOrder(model);
      },1000)




  },
getDefaultAddress(){
  getDefautAddressInfo({}).then(res=>{
    console.log(res,'resresresres')
    this.setData({
      isaddress:res.data,
      addressIds:res.data.areaIds
    })
  })
},
  getMallDetail() {
    //获取客房列表
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let self = this;
    productDetail({
      productId: self.data.id
    })
      .then((res) => {
        console.log("请求成功1111", res);
        let currSKUindex = self.data.currSKUindex;
        let tmpinfo = res.data;

        // debugger
        // this.shopData = tmpinfo;
        let   mallOrderType;
        if (tmpinfo.categoryList[1].id == 50133) {
          // debugger;
          mallOrderType = 5;
       
        } else {
          mallOrderType = 1;
        }

        self.setData({mallOrderType})
        console.log("商品数据", tmpinfo);
        let sku = tmpinfo["skuInfo"].skuList[currSKUindex];
        console.log("sku对象", sku);

        let goodsObj = {
          goodsId: tmpinfo.id,
          goodsName: tmpinfo.name,
          spuName: tmpinfo.splList.supplier_name, //酒店名称
          spuId: tmpinfo.splList.id,
          skuId: sku.id, //规格id
          skuName: sku.product_sale_value_name,
          goodsNum: parseInt(self.data.num),
          goodsPrice: (sku.price/100).toFixed(2),
          goodsBuyPrice: (sku.buy_price/100).toFixed(2), //分转元
          imageUrl: tmpinfo.imageList[0].path || sku.sku_image_url,
        };
       // self.goodsInfo.push(goodsObj);
       let goodsArr = [];
       let totalPrice = "";
       goodsArr.push(goodsObj);
        console.log("商品对象",goodsObj);
        
        totalPrice = ((sku.price * self.data.num) / 100).toFixed(
          2
        );


        let w_goodsArr = [];

        let obj = {};
        goodsArr.forEach(val=>{
  
          obj = val;
          obj.goodsBuyPrice = obj.goodsBuyPrice *100;
          obj.goodsPrice = obj.goodsPrice *100;
          w_goodsArr.push(obj);
        })  



        self.setData({goodsArr,w_goodsArr,totalPrice,shopData:res.data},function(){
          //这一步主要是为了避免用户点击速度太快 导致创建订单失败


        


          setTimeout(()=>{
            wx.hideLoading();
          },1500)
        });
        
        
     
      })
      .catch((err) => {
        console.log("请求失败", err);
       wx.hideLoading();
      });
  },
  ajaxCreateOrder(model){
    createOrder(model).then(res=>{
      wx.hideLoading();

      console.log("创建订单",res);
      let hid = wx.getStorageSync("shid") ;// 注意 这里的hid 是商户id 不是酒店id
      let dealerId = wx.getStorageSync("dealerId");
      if(res.data.totalAmount == 0){
        wx.redirectTo({
          url:"/supermarket/shop/orderDetail/index?oid="+res.data.orderNo
        }); 
      }else{
        wx.redirectTo({   
          url:"/hotel/pages/pay/index?oid="+res.data.orderNo+"&lastprice="+this.data.totalPrice+"&hid="+dealerId+"&type=10"
        })
      }

     
    }).catch(err=>{
      console.log("err",err);



      wx.hideLoading();

    })
  },
  onLoad(query) {
    console.log("query", query);
    let id = query.sid;
    let currSKUindex = query.currSKUindex;
    let num = query.num;
    let memberId = wx.getStorageSync("memberId");
    this.setData({ id,currSKUindex,num,memberId });
    this.getMallDetail();
    this.getDefaultAddress()
  },
  onShow(){
    console.log(this.data.isaddress,'adddddd',this.data.addressIds)
   
  }
});
