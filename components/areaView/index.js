const app = getApp();
import {
  getAreaData
} from '../../api/hotel';
Component({
  properties: {
    marginTop: {
      type: String,
      value: '',
    },
    isArea: {
      type: Boolean,
      value: false
    },
    areaView: {
      type: Array,
      value: []
    }
  },
  data: {
    selectImage: 'https://yuetao-1300766538.cos.ap-beijing.myqcloud.com/yuetao/image/2020-04-19/21/yuelvhuixnigeBTYZo1587304498.png',
    stairKey: 0,
    isSecond: [0, 0, 0, 0, 0],
  },

  attached: function () {
    this.getAreaData()
  },
  methods: {
    //行政区数据
    getAreaData: function () {
      let that = this
      console.log('88888')
      getAreaData(wx.getStorageSync('city') ? wx.getStorageSync('city') : '北京').then(res => {
        console.log(res, '没进么')
        let item = res.data;
        let areaView = that.data.areaView;
        console.log(item)
        areaView[0].second = item.districts
        areaView[1].second = item.distance
        areaView[2].second = item.business
        areaView[3].second = item.stations
        areaView[4].second = item.hospitals
        // areaView[5].second = item.subway
        areaView[5].second = item.colleges
        areaView[6].second = item.centreSite
        // areaView[8].second = item.suburb
        areaView[7].second = item.showCentre
        // areaView[10].second = item.shopping
        that.setData({
          areaView: areaView,
          secondViewCell: item.districts,
          // subInfo: item.subway[0].subInfo,
          // subInfoStations: item.stations[0].subInfo
        })
      })
    },
    //行政区一级
    clickstairCell: function (e) {
      let stairId = e.currentTarget.dataset.id;
      let secondViewCell = this.data.areaView[stairId].second;

      let types = e.currentTarget.dataset.types;
      console.log(types)
      let secondKey = this.data.isSecond[types];
      if (this.data.isSecond[types] == 0) {
        secondKey = 0
      }

      this.setData({
        stairKey: stairId,
        secondViewCell: secondViewCell,
        secondKey: secondKey,
        isScroll: true
      })
    },
    //车站点击
    onsubInfoStations: function (e) {
      let index = e.currentTarget.dataset.index;
      let currentSubInfo = this.data.areaView[3].second[index].subInfo
      this.setData({
        subInfoStations: currentSubInfo,
        stationKey: index
      })
    },
    //地铁站二级菜单点击
    onSubwaySubMenuTap: function (e) {
      let index = e.currentTarget.dataset.id;
      let secondKey = e.currentTarget.dataset.index;
      console.log(this.data.areaView[5], this.data.areaView[5].second, index)
      let currentSubInfo = this.data.areaView[5].second[index].subInfo
      this.setData({
        subInfo: currentSubInfo,
        subwayKey: index
      })
    },
    //行政区二级
    clickSecondCell: function (e) {
      let secondKey = e.currentTarget.dataset.index;
      let keyword = e.currentTarget.dataset.title;
      let distance = e.currentTarget.dataset.title;
      let types = e.currentTarget.dataset.types;
      let isSecond = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let radius = ''
      isSecond[types] = secondKey;

      this.setData({
        secondKey: secondKey,
        keyword: keyword,
        'tabbar[2]': keyword,
        tabbarKey: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        conditionViewKey: 'none',
        isSecond: isSecond,
        page: 1,
        distance: distance,
        isScroll: true
      })
      if (this.data.stairKey == 1) {
        radius = keyword
      }
      this.triggerEvent('areaFun', {
        isArea: false,
        keyword: keyword,
        radius: radius,
        stairKey:this.data.stairKey
      })
    },
    hideModal(){
      this.setData({
        isArea:false
      })
    }
  }

})