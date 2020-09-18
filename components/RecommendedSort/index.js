// import {  orderPay } from '../../api/order.js';

const app = getApp();

Component({
  properties: {
    recommendCell: {
      type: Array,
      value: []
    },
    isSort:{
      type:Boolean,
      value:false
    },
    marginTop:{
      type:String,
      value:''
    }
  },
  data: {
    selectImage:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-19/21/yuelvhuixnigeBTYZo1587304498.png'
  },
  attached: function () {
 
  },
  methods: {
   // 推荐排序
   clickrecommend: function(e) {
    let cellrId = e.currentTarget.dataset.id;
    let recommendCell = this.data.recommendCell;
    for (let i = 0; i < recommendCell.length; i++) {

      if (cellrId == i) {
        //添加图片
        recommendCell[i].src = '';
        recommendCell[i].condition = '1'
      } else {
        recommendCell[i].src = '';
        recommendCell[i].condition = '0'
      }
    }
    let sort = 'Default';
    if (cellrId == 0) {
      sort = 1;
    } else if (cellrId == 1) {
      sort = 4;
    } else if (cellrId == 2) {
      sort = 3;
    } else if (cellrId == 3) {
      sort = 2;
    }
    this.triggerEvent('sortFun',{
      recommendCell: recommendCell,
      sort: sort,
      isSort:false
    })
   },
   hideModal(){
     this.setData({
       isSort:false
     })
   }
    
  }

})