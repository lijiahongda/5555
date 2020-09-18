// page/HotelOther/pages/hotelDetailHew/hotelDetailHew.js
const app = getApp()
import {
    facilities,feedback,sureCollect
} from '../../../../api/hotel';
var WxParse = require('../../../../components/wxParse/wxParse.js');
// WxParse.wxParse('article', 'html', article, that, 5);
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab: [true, false,false],
        show:false,
        erroeMsg:[{text:'酒店信息有误',id:0},{text:'酒店已停业',id:1},{text:'酒店装修中',id:2}],
        ifShow:false,
        errorMsg:'酒店已停业'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            id:options.id
        })
        this.initDetail()
    },
    // 收藏
    sureCollect(){
        sureCollect({
            mid:wx.getStorageSync('memberId'),
            hotelId:wx.getStorageSync('dealerId')
        }).then(res=>{
            console.log(res)
            this.setData({
                iscollect:res.data.isCollect
            })
        })
    },
    // 举报
    report(){
        this.setData({
            show:true
        })
    },
    // 错误信息
    errormsg(e){
        let item=e.currentTarget.dataset.item
        if(item.id==0){
            // 酒店信息有误
            this.setData({
                show:false,
                ifShow:false,
            })
                wx.navigateTo({
                  url: '/hotel/pages/hotelErrorMsg/hotelErrorMsg?hotelAddress='+this.data.sell.address+'&hotelName='+this.data.sell.hotelName+'&hotelPhone='+this.data.sell.phone,
                })
        }else if(item.id==1){
            // 酒店已停业
            this.setData({
                show:false,
                ifShow:true,
                errorMsg:item.text,
                type:item.id
            })
        }else if(item.id==2){
            // 酒店装修中
            this.setData({
                show:false,
                ifShow:true,
                errorMsg:item.text,
                type:item.id
            })
        }
    },
    clones(){
        this.setData({
            show:true,
            ifShow:false,
        })
    },
    sures(){
        console.log('确认提交信息')
        let data={
            mid:wx.getStorageSync('memberId'),//用户ID
            hotelId:wx.getStorageSync('dealerId'),//酒店id
            hotelName:this.data.sell.hotelName,//酒店名称
            hotelAddress:this.data.sell.address,//酒店地址
            content:'',//反馈内容
            type:this.data.type,//问题类型0酒店信息有误1酒店已停业2酒店装修中
        }
        feedback(data).then(res=>{
            console.log(res)
            if(res.code==200){
                wx.showToast({
                  title: '提交成功',
                  icon:'none'
                })
                setTimeout(()=>{
                    this.setData({
                        show:false,
                        ifShow:false
                    })
                },1000)
            }
        })
    },
    // 取消举报
    showFalse(){
        this.setData({
            show:false
        })
    },
    changetab(e) {
        var idx = e.currentTarget.dataset.idx;
        // if (idx == 0) {
        //   this.getMallList()
        // }
        // if (idx == 1) {
        //   this.ficList()
        // }
        var mk = []
        this.data.tab.forEach((item, index) => {
          if (index == idx) {
            mk.push(true)
          } else {
            mk.push(false)
          }
        })
        this.setData({
          tab: mk,
          tabidx:idx
        })
      },
    // 酒店详情接口
    initDetail: function () {
        facilities({hotelId:wx.getStorageSync('dealerId'),mid:wx.getStorageSync('memberId')}).then(res=>{
            console.log(res,'facilities')
            this.setData({
                facilities:res.data.facilities,
                policy:res.data.policy,
                sell:res.data.sell,
                iscollect:res.data.sell.isCollect
            })
        })
    },
    call(){
        wx.makePhoneCall({
          phoneNumber:this.data.sell.phone
        })
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }
})