// page/videorecharge/index/index.js
import {getNewLifeCharge,videolist} from "../../../../api/Recharge"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]
    },
    list(){
        let that = this;
        videolist().then(res=>{
            if(res.code==200){
                that.setData({
                    list:res.data.video
                })

            }
        })
    },
    jump(e){
        let project_id= e.currentTarget.dataset.project_id;
        wx.navigateTo({
            url: '/page/Recharge/videorecharge/detail/index?project_id='+project_id,
        })
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.list();
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