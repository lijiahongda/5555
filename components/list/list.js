Component({
  properties: {
    // {
    //   imageUrl:'',商品图片
    //   productName:'商品名称',
    //   price:99.9,//会员价 
    //   originPrice:'49',//原价
    //   type:'',// 商品类型 1京东   2虚拟商品   3实体商品
    //   label:'',//商品标签  0 其他 1 入店即送   2 开通会员
    // },
    list: {
      type: Object,
      value: []
    },
    changeStyle: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    commodityShow(e){
      let obj =  e.currentTarget.dataset.obj
      console.log(obj)
      if(obj.type=='2'){ // 虚拟商品
        wx.navigateTo({
          url: '/supermarket/mall/shopVR/detail?id=' + obj.cardId,
        })
        return
      }
      wx.navigateTo({
        url: "/supermarket/shop/detail/index?sid="+obj.productId+"&shopid="+wx.getStorageSync("shid")+"&dealerId="+wx.getStorageSync("dealerId")
      });
    }
  }
})