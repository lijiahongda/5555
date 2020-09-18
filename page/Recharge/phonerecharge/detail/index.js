// page/phonerecharge/detail/index.js
import {
    getPhoneInfo,
    phonePay
} from "../../../../api/Recharge"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: "",
        payprice: 0,
        current: 100,
        data: "",
        item_id: ""
    },
    phoneinput(e) {
        console.log(e);
        let value = e.detail.value;
        this.setData({
            phone: value
        })
    },
    getdetail() {
        let that = this;
        getPhoneInfo().then(res => {
            that.setData({
                data: res.data,
                phone:res.data.phone
            })

        })
    },
    selectCard(e) {
        let index = e.currentTarget.dataset.index;
        let item_id = e.currentTarget.dataset.item_id;
        let data = this.data.data;
        console.log(data);
        this.setData({
            payprice: data.list[index].price,
            current: index,
            item_id: item_id
        })
    },
    pay() {
        let phone = this.data.phone;
        let item_id = this.data.item_id;
        let payprice = this.data.payprice;
        if (phone == "") {
            wx.showToast({
                title: '请输入手机号码',
                icon: "none"
            })
            return false;
        };
        if (payprice == 0) {
            wx.showToast({
                title: '请选择充值金额',
                icon: "none"
            })
            return false;
        }
        let data = {
            phone: phone,
            pay_source: 1,
            item_id: item_id,
            openId:wx.getStorageSync('openId')
        }
        phonePay(data).then(res => {
            if (res.code == 200) {
                wx.requestPayment({
                    nonceStr: res.data.pay.getwayBody.nonceStr,
                    package: res.data.pay.getwayBody.package,
                    paySign: res.data.pay.getwayBody.paySign,
                    signType: 'MD5',
                    timeStamp: res.data.pay.getwayBody.timeStamp,
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
                }, )
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getdetail();
    }

  
})