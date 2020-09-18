// page/videorecharge/list/index.js
import {videolist} from "../../../../api/Recharge"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[]
    },
    getlist(){
        videolist().then(res=>{
            console.log(res,'rrrrr')
            this.setData({
                list:res.data.video
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getlist();
    }
})