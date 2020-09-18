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
        picurl:"",   //商品图片
        coupon:[], //优惠券放在数组里，避免以后出现多个优惠券的情况  结构  {name:"",id:""}
        sale_num:"0",//已售多少件
        oprice:"",//原价
        vipPrice:"",//现价
        promote_price:"",//推广赚多少钱  如果不显示这个数据 请传字符串 empty
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleDetail(){
      console.log("触发立即购买");
      this.triggerEvent("handleDetail",this.properties.shopItemData);
    }
  },
})