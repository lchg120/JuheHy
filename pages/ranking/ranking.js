// pages/ranking/ranking.js
var app = getApp(), util = app.util, glb = app.global, socket = app.socket, extra = require('extra');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagesBaseUrl: util.url_images(),
    userdata: {
      uid: '',
      nickName: '',
      avatarUrl: '',
      nums: '8888', 
      winning: '99.99',
      state: '未上榜'
    },
    rankdata: [
      { rank: '1', rankBg: 'common/icon_one.png', name: '爱与不爱', headImg:'common/userHead.png', nums: '8888', winning: '99.99' },
      { rank: '2', rankBg: 'common/icon_two.png', name: '爱与不爱', headImg: 'common/userHead.png', nums: '888', winning: '50.50' },
      { rank: '3', rankBg: 'common/icon_three.png', name: '爱与不爱', headImg: 'common/userHead.png', nums: '888', winning: '40' },
      { rank: '4', rankBg: 'nomal', name: '爱与不爱', headImg: 'common/userHead.png', nums: '8', winning: '10' },
      { rank: '5', rankBg: 'nomal', name: '爱与不爱', headImg: 'common/userHead.png', nums: '5', winning: '10' },
      { rank: '6', rankBg: 'nomal', name: '爱与不爱', headImg: 'common/userHead.png', nums: '3', winning: '10' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.extra = new extra(that);
    this.extra.getlist(this);
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
    var ts = this;
    util.post('user/getData', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, function (data) {
      if (data.result != 'success') return;
      ts.setData({
        'userdata.uid': data.userdata.uid,
        'userdata.nickName': data.userdata.userInfo.nickName,
        'userdata.avatarUrl': data.userdata.userInfo.avatarUrl
      });
    });
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
  
  },

})