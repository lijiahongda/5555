// components/searchInput/searchInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type:{
      type:String,
      value:''
    },
    default:{
      type:String,
      value:'爆款芒果10元一斤'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchVal:'',
    default:'爆款芒果10元一斤',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    searchBind:function(e){
      if(e.detail.value){
        this.triggerEvent('searchBind', e.detail.value)
      }else{
        this.triggerEvent('searchBind', this.data.default)
      }
    },
  }
})
