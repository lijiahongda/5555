var app = getApp();
Component({
  properties: {
    isShow:{
      type:Boolean,
      value:false
    },
    colorSize: {
      type: Object,
      value: [{
        title: '顏色'
      }, {
        title: '尺碼'
      }]
    },
    statusArr: {
      type: Object,
      value: []
    },
    Specificationsimg: {
      type: String,
      value: ''
    },
    sizeSelectText:{
      type:String,
      value:''
    },
    ispay:{
      type:Number,
      value:1
    },
    goodPrice:{
      type:Number,
      value:0
    },
    cartNum:{
      type:Number,
      value:1
    },
    isFree:{
      type:Number,
      value:2
    },
    productSkuId:{
      type:String,
      value: ''
    },
    payButtonDesc:{
      type: String,
      value: ''
    }
  },
  data: {

  },
  attached: function () {},
  methods: {
    // 规格
    swichLabel: function (e) {
      let that = this
      //选中index
      var index = e.currentTarget.dataset.idx;
      //选中行index
      var data_index = e.currentTarget.dataset.index;
      app.selectLabel(index, data_index, that.data.colorSize, function (res) {
        console.log(res)
        that.setData({
          colorSize: res.colorSize,
          statusArr: res.statusArr,
          last_sku: res.last_sku[0],
          skuid: res.skuid,
          sizeSelectText: res.sizeSelectText,
          "isShow": true
        })
        // return
        console.log('ishow的值',that)
        console.log(res.skuid, 'skuid')
        that.triggerEvent('updateSkuid', {
          'skuid': res.skuid,
          'sizeSelectText':res.sizeSelectText,
          "isShow": true
        });
      });
    },
    sure:function(){
      console.log('确认按钮')
      this.triggerEvent('goCat', {
       
      });
      this.close()
    },
    close: function () {
      this.triggerEvent('updateSkuid', {
        'isShow': false
      });
    },
    CartNumDes: function () {
      this.triggerEvent('ChangeCartNum', false);
    },
    CartNumInt: function () {
      this.triggerEvent('ChangeCartNum', true);
    },
    // tapAttr: function (e) {
    //   //父级index
    //   var indexw = e.currentTarget.dataset.indexw;
    //   //子集index
    //   var indexn = e.currentTarget.dataset.indexn;
    //   //每次点击获得的属性
    //   var attr = this.data.productAttr[indexw].attr_value[indexn];
    //   //设置当前点击属性
    //   this.data.productAttr[indexw].checked = attr['attr'];
    //   this.setData({
    //     productAttr: this.data.productAttr,
    //   });
    //   var value = this.getCheckedValue().sort().join(',');
    //   this.triggerEvent('ChangeAttr', value);
    // },
    // getCheckedValue: function () {
    //   return this.data.productAttr.map(function (attr) {
    //     return attr.checked;
    //   });
    // },
    // ResetAttr: function () {
    //   for (var k in this.data.productAttr) this.data.productAttr[k].checked = '';
    //   this.setData({
    //     productAttr: this.data.productAttr
    //   });
    // },
  }
})