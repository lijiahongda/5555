// import {  orderPay } from '../../api/order.js';
const app = getApp();
Component({
  properties: {
    isShow: {
      type: Boolean,
      value: false,
    },
    price:{
      type:Number,
      value:0
    }
  },
  data: {
    close: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-16/22/yuelvhuisyCKcbeGIx1587047288.png', //关闭弹窗
  },

  attached: function () {
   

  },
  methods: {
    closePoPup:function(){
      this.triggerEvent('ClosePopup',false)
    }
  }

})