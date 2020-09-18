// components/HotelHomeList/index.js
Component({
    properties: {
        isHotelList: {
            type: Boolean,
            value: false,
        },
        HotelList: {
            type: Array,
            value: []
        },
        gnCity: {
            type: String,
            value: ''
        },
        isPrice: {
            type: Boolean,
            value: false
        },
        brand: {
            type: Boolean,
            value: false
        },
    },
    data: {
        locImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/01/yuelvhuiLOelairLiw1587057788.png', //定位icon
        Label: [{
            name: '直订补贴'
        }],
        FullReductionImage: "https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-17/01/yuelvhuiBKI3p4ncyk1587059322.png",
    },

    attached: function () {

    },
    methods: {


        // 酒店详情
        HotelDetail: function (e) {
            console.log(this.data.brand, e)
            wx.setStorageSync('dealerId', e.currentTarget.dataset.id)
            wx.navigateTo({
                url: '/equityCard/pages/fullHotel/fullHotelDetail/fullHotelDetail?hotelType='+e.currentTarget.dataset.hoteltype
            })
        },
    }

})