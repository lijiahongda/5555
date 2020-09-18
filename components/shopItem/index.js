var app = getApp();

// pages/getCityData/getCityData.js
Component({
  /**
   * 组件的属性列表
   * 组件用法
  *<shop-item shopItemData="{{shopItemData}}"  bind:handleBuy="handleBuy" bind:handleAdd="handleAdd" bind:handleCopy="handleCopy" bind:handleShare="handleShare"></shop-item>
   * 
   */
  properties: {
    shopItemData:{
      type:Object,
      value:{
        id:"", //商品id
        name:"", //商品名字
        minilogo:"",
        sortIndex:"",
        picurl:"",   //商品图片
        progress_num:"0", //如果不显示进度条 传个字符窜 empty
        coupon:[], //优惠券放在数组里，避免以后出现多个优惠券的情况  结构  {name:"",id:""}
        comment_num:"0", //不显示就传empty   //评论数量
        avatar:[], //购买人的头像 结构 {url:""}
        buy_num:"empty",//已购买人数
        oprice:"",//原价
        vipPrice:"",//现价
        promote_price:"",  //不显示就传empty  //推广赚多少钱  如果不显示这个数据 请传字符串 empty
        btype:['share','add','copy','buy','my','qiang','remove','see']
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isExclusiveRobot:0, // 是否有专属机器人
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      this.setData({
        isExclusiveRobot:app.globalData.isExclusiveRobot
      })
      console.log("专属机器人状态",app.globalData.isExclusiveRobot);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleBuy(){
      console.log("触发立即购买");
      this.triggerEvent("handleBuy",this.properties.shopItemData);
    },
    handleShare(){
      console.log("触发立即分享");
      this.triggerEvent("handleShare",this.properties.shopItemData);
    },
    handleAdd(){
      console.log("触发加入助理");
      this.triggerEvent("handleAdd",this.properties.shopItemData);
    },
    handleCopy(){
      console.log("触发复制事件");
      this.triggerEvent("handleCopy",this.properties.shopItemData);
    },
    handleAdd(){
      console.log("触发加入助理");
      this.triggerEvent("handleAdd",this.properties.shopItemData);
    },
    handleMyShop(){
      console.log("触发我要了");
      this.triggerEvent("handleMyShop",this.properties.shopItemData);
    },
    handleQiang(){
      console.log("触发马上抢");
      this.triggerEvent("handleQiang",this.properties.shopItemData);
    },
    handleRemove(){
      console.log("触移除助理");
      this.triggerEvent("handleRemove",this.properties.shopItemData);
    },
    handleSee(){
      console.log("触移除助理");
      this.triggerEvent("handleSee",this.properties.shopItemData);
    }
  },
})