const app = getApp();
Component({
    properties: {
        ratePlan: {
            type: Array,
            value: []
        },
        roomDetailInfo: {
            type: Object,
            value: {}
        },
        hotelId: {
            type: Number,
            value: 0
        },
        roomNum:{
            type:Number,
            value:1
        },
        identity:{
            type:Number,
            value:''
        }
    },
    data: {
        top: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/17/yuelvhuignr29LZFyd1587462796.png',
        line: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/19/yuelvhui31zEAUtxGq1587468978.png',
        bottom: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-21/21/yuelvhuiYURJcP6xEh1587474092.png',
        isShow: false,
        hot:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-20/00/yuelvhuilvYT15flJU1592583460.png',
        huiyun:'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-06-22/21/yuelvhuihED382kzZx1592832947.png',
        isLevelState:''
    },
    attached: function () {

    },
    methods: {
        cardLevel:function(){
            cardLevel({}).then(res=>{
              console.log(res,'resresres')
              this.setData({
                isLevelState:res.data.isLevelState
              })
            })
          },
          // 关闭或显示开通会员
   BookNow(e){
    let { plans, roomid,type } = e.currentTarget.dataset
    this.setData({
        plans, roomid,type
    })
    if(this.data.isLevelState==1){ // 会员直接去购买
      this.handleBook( plans, roomid,type )
      return
    }else{
      this.setData({
        accessMember: !this.data.accessMember,
      })
    }
  },
  switch(){
    this.setData({
        accessMember: !this.data.accessMember,
      })
  },
  handleBook: function ( plans, roomid,type ) {
      if(!roomid){
          var plans=this.data.plans, roomid=this.data.roomid,type=this.data.type
      }
      console.log( plans, roomid,type ,'0000000')
            if (wx.getStorageSync('memberId')) {
                // type:1  -- 直订酒店预订按钮
                // type:2  -- 其他酒店预订按钮
                if(type == 2){
                    wx.navigateTo({
                        url: '/equityCard/pages/fullHotel/fullHotelOrder/fullHotelOrder?id=' + this.data.hotelId + '&roomTypeId=' + plans.roomTypeId + '&rpId=' + plans.ratePlanId + '&sourceType=' + plans.sourceType + '&roomId=' + roomid+'&roomNum='+this.data.roomNum 
                    })
                }else{
                    // if(this.data.identity >0){
                        wx.navigateTo({
                            url: '/equityCard/pages/fullHotel/fullHotelOrder/fullHotelOrder?id=' + this.data.hotelId + '&roomTypeId=' + plans.roomTypeId + '&rpId=' + plans.ratePlanId + '&sourceType=' + plans.sourceType + '&roomId=' + roomid+'&roomNum='+this.data.roomNum + '&oldSourceType=' + plans.oldSourceType
                        })
                    // }else{
                    //     wx.navigateTo({
                    //         url: '/hotel/pages/pmsList/pmsList',
                    //       })
                    // }
                          
                      
                }
            } else {
                console.log('memberId没有')
                wx.navigateTo({
                    url: '/pages/login/index'
                  })
            }

        },
        closeRoomDetail: function () {
            this.setData({
                isShow: false
            })
        },
        // 房间详情
        roomDetail: function (e) {
            console.log('4444')
            this.setData({
                isShow: true,
                roomDetailInfo: e.currentTarget.dataset.item
            })
            console.log(this.data.roomDetailInfo)
        },
        goButVip(){
            wx.navigateTo({
                url: '/hotel/pages/pmsList/pmsList',
            })
        },
        // rp收起展开
        Retract: function (e) {
            let list = this.data.ratePlan
            let {
                index
            } = e.currentTarget.dataset
            for (let l = 0; l < list.length; l++) {
                if (index == l) {
                    list[l].isSelect = list[l].isSelect ? false : true
                    this.setData({
                        ratePlan: list
                    })
                }
            }
        }
    }
})