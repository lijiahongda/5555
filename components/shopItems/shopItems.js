// components/shopItems/shopItems.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Object,
      value:{
        id:"", //商品id
        name:"", //商品名字
        picurl:"",   //商品图片
        oprice:"",//原价
        vipPrice:"",//现价
        discount:"",//折扣/券价格
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
