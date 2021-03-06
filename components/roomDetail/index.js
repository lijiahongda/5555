// components/roomDetail/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        roomDetailInfo: {
            type: Object,
            value: {}
        },
        isShow: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        close: 'http://image.zhiding365.com/2020/9/9/9d484450-b311-4f56-b962-674cec3f7cb7.png',
        indicatorDots: false,
        autoplay: true,
        img: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-27/23/yuelvhui5CAsRBUuML1588000527.png'
    },

    /**
     * 组件的方法列表
     */
    methods: {
        close: function () {
            this.triggerEvent('closeRoomDetail')
        },
        lookBagImage: function (e) {
            let { cur, item } = e.currentTarget.dataset
            console.log(e)
            wx.previewImage({
                current: cur,
                urls: item
            })
        }
    }
})