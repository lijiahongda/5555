



import request from '../../utils/request';




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
        type: String,
        observer: function (news, olds, path) {
            console.log("新的值",news);
            this.setData({
                sonShowstatus:news
            })


            if(news == 1){


              

            }else{


               
            }




        }

    },
    posterType: {
      type: String,
      value: "",
    },
    posterUrl: {
      type: String,
      value:
        "https://yuelvdaren-1300766538.cos.ap-beijing.myqcloud.com/daren/2020/06/18/5eeaf01d193831592455197.jpg",
    },
    province:{
        type:Object,
        value:{
            id:"",
            name:""
        }
    },
    city:{
        type:Object,
        value:{
            id:"",
            name:""
        }
    },
    area:{
        type:Object,
        value:{
            id:"",
            name:""
        }
    },
    town:{
        type:Object,
        value:{
            id:"",
            name:""
        }
    }
  },
  data: {
      sonShowstatus:0,
      animationData:"",
      xzStatus:1,
      ldsatus:[1,0,0,0],
      provinceData:[],
      cityData:[],
      areaData:[],
      townData:[],
      pname:"",//省名字
      cname:"",//城市的名字
      aname:"", //区名字
      tname:"", //街道名字
      pid:"",
      cid:"",
      aid:"",
      tid:""
      
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      // this.getCityInfo()



        console.log("------------",this.properties);
        this.getProvince();
        setTimeout(()=>{
            if(this.properties.province.name){
                this.setData({
                    xzStatus:0,
                    pname:this.properties.province.name,
                    cname:this.properties.city.name,
                    aname:this.properties.area.name,
                    tname:this.properties.town.name || '',
                    pid:this.properties.province.id,
                    cid:this.properties.city.id,
                    aid:this.properties.area.id,
                    tid:this.properties.town.id || '',
                })
            }
        },1000)
    },
  },
  methods: {
    handleHeaderProvince(){
        this.setStatus(0);
    },
    handleHeaderCity(){
        if(!(this.data.cityData.length > 0)){
            this.getCity(this.data.pid);
        }
        this.setStatus(1);
    },
    handleHeaderArea(){
        if(!(this.data.areaData.length > 0)){
            this.getArea(this.data.cid);
        }
        this.setStatus(2);
    },
    handleHeaderTown(){
        if(!(this.data.townData.length > 0)){
            this.getTown(this.data.aid);
        }
        this.setStatus(3);
    },
    trueChooseData(){
        //触发选中的数据
    },  
    handleTabData(e){
        let {ins} = e.currentTarget.dataset;
        console.log("ins",ins);
    },
    handleHideStatus(){
        //通知父元素 隐藏该Dom
        this.triggerEvent("handleHideStatus")

    },
    getProvince(){
        //获取省
        let that = this;
        request.get('/app/mall/jd/getProvince', {}, (res) => {
   
        }).then(res=>{
            console.log(res);
           
            that.setData({
                provinceData:res.data
            })
        })
    },
    getCity(id){
        let that = this;
        request.get('/app/mall/jd/getCity', {
            province_id:id


        }, (res) => {
   
        }).then(res=>{
            console.log(res);
            that.setData({
                cityData:res.data
            })
        })
    },
    getArea(id){
        let that = this;
        request.get('/app/mall/jd/getArea', {
            city_id:id
        }, (res) => {
   
        }).then(res=>{
            console.log(res);
            that.setData({
                areaData:res.data
            })
        })
    },
    getTown(id){
        let that = this;
        return new Promise((resolve,reject)=>{
            request.get('/app/mall/jd/getTown', {
                area_id:id
            }, (res) => {
            }).then(res=>{
                console.log(res);
                that.setData({
                    townData:res.data
                })
                resolve(res);
            })
        })
       
    },
    handleTown(e){
        let {obj} = e.currentTarget.dataset;
        this.setData({
            tid:obj.id,
            tname:obj.name,
            xzStatus:0
        })
        this.handleCallBack();
    },
    handleCity(e){
        //城市列表点击事件
        let {obj} = e.currentTarget.dataset;
        console.log(obj);
        this.setData({
            xzStatus:1,
            cid:obj.id,
            cname:obj.name,
            aname:"",
            tname:""
        })
        this.setStatus(2)
        this.getArea(obj.id)
    },
    handleProvince(e){
        //所有省的点击事件
        let {obj} = e.currentTarget.dataset;
        console.log("---",obj)
        this.setData({
            xzStatus:1,
            pid:obj.id,
            pname:obj.name,
            cname:"",
            aname:"",
            tname:""
        })

        this.getCity(obj.id)
        this.setStatus(1)
    },
    handleArea(e){
        let {obj} = e.currentTarget.dataset;
        this.setData({
            aid:obj.id,
            aname:obj.name,
            tname:""
        })
        this.getTown(obj.id).then(res=>{
                console.log(res);
                if(res.data && res.data.length > 0){
                     this.setData({
                        xzStatus:1
                     })
                     this.setStatus(3)
                }else{
                    //隐藏弹窗 触发回调
                    this.handleCallBack();

                }
        })
    },
    handleCallBack(){
        this.setData({
            xzStatus:0
        })
        let res_data = {
            pname:this.data.pname,
            cname:this.data.cname,
            aname:this.data.aname,
            tname:this.data.tname,
            pid:this.data.pid,
            cid:this.data.cid,
            aid:this.data.aid,
            tid:this.data.tid || '',
        }
        console.log("触发回调",res_data);
        this.triggerEvent('handleCallBack',res_data);
    },
    setStatus(index){
        let _arr = [0,0,0,0];
        _arr[index] = 1;
        this.setData({
            ldsatus:_arr
        })
    }
  },
});
