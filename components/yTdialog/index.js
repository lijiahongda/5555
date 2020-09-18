var app = getApp();
/***
 * 用法 引入组件 
 * 传值
 * posterType:来源 非必传
 * posterUrl:必传项 图片地址
 * 绑定回调函数
 * 
 * 实例
 * 
* <poster posterType=”{{posterType}}“ posterUrl="{{posterUrl}}"  bind:handleCallBack="handleCallBack"></poster>
  图片保存成功回调val是1  
  保存失败 回调val 是0
*/
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showstatus:{
      type:Number,
      observer:function (newval,oldval,path){
        console.log("监听",newval)
        this.setData({
          astatus:newval
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    astatus:0
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // this.getCityInfo()
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleBox() {
      this.triggerEvent("handleCallBack");
    }   
  }
});
