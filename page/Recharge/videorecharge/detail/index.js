// page/videorecharge/detail/index.js
import {getCardInfo,videoPay} from "../../../../api/Recharge"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        projectid:'',
        data:"",
        payprice:0,
        phone:"",
        current:100,
        p_id:"",
    },
    phoneinput(e){
        let value = e.detail.value;
        this.setData({
            phone:value
        })
    },
    getdetail(){
        let that = this;
        let data={project_id:this.data.project_id}
        getCardInfo(data).then(res=>{
            that.setData({
                data:res.data,
                phone:res.data.mobile
            })
           
        })
    },
    pay(){
        let phone = this.data.phone;
        let payprice= this.data.payprice;
        let p_id= this.data.p_id;
        if(phone==""){
            wx.showToast({
              title: '请输入手机号码',
              icon:"none"
            })
            return false;
        };
        if(payprice==0){
            wx.showToast({
                title: '请选择充值金额',
                icon:"none"
            })
            return false;
        }
        let data={
            p_type:1,
            phone:phone,
            p_id:p_id,
            openId:wx.getStorageSync('openId')
        }
        videoPay(data).then(res=>{
            if(res.code==200){
                wx.requestPayment({
                  nonceStr: res.data.pay.getwayBody.nonceStr,
                  package: res.data.pay.getwayBody.package,
                  paySign: res.data.pay.getwayBody.paySign,
                  timeStamp: res.data.pay.getwayBody.timeStamp,
                  signType: 'MD5',
                  success (res) { 
                    console.log("支付成功",res);
                    wx.redirectTo({
                      url: '/hotel/pages/paySuccess/index'
                    });
                  },
                  fail (res) { 
                    wx.redirectTo({
                      url: "/hotel/pages/payFail/index"
                    });
                  }
                })
            }else{
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
            }
        })
    },
    selectCard(e){
        let index = e.currentTarget.dataset.index;
        let p_id = e.currentTarget.dataset.p_id;
        let data = this.data.data;
        this.setData({
            payprice:data.list[index].buyPrice,
            current:index,
            p_id:p_id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.project_id){
            this.setData({
                project_id:options.project_id
            })
        }
        this.getdetail();
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