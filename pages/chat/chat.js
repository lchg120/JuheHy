// pages/chat/chat.js
var app = getApp(), util = app.util, glb = app.global, tween = app.tween,extra = require('extra');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_msgtid: 0,
    new_msgshow: true,
    imagesBaseUrl: util.url_images(),
    uiheight: wx.getSystemInfoSync().windowHeight,
    userdata: {
      uid: '',
      nickName: '',
      avatarUrl: ''
    },
    navHead: [
      { text: '对战', active: false, url: '../index/index' },
      { text: '找人玩', active: false, url: '../fight/fight' },
      { text: '聊天', active: true, url: '../chat/chat' },
      { text: '好友', active: false, url: '../friend/index' },
    ],
    user: [
      // {tid:1, userImg: 'userHead1.png', name: '爱不爱来玩', time: '12:30', },
      // {tid:2, userImg: 'userHead2.png', name: '不爱也来玩玩', time: '10:30', },
      // {tid:3, userImg: 'userHead3.png', name: '不告诉你', time: '8:30', }
    ],
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    scrollHeight: 0,
    islastPage: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*公共头部导航动画*/
    var that = this;
    util.headAni(that, tween);
    console.log(that.data.pageNumber + "," + that.data.totalPage)
  },

  bindgetuserinfo_switch: function (data) {
    console.log('bindgetuserinfo');
    var that = this;
    glb.bindgetuserinfo(function () {
      wx.navigateTo({ url: that.data.index2Url })
    }, data);
  },

  /**
     * 第一级导航按钮
     */
  click_nav: function (e) {
    /*公共导航调用*/
    var _that = this;
    util.click_nav(e, _that.data.navHead, _that)
  },

  
  /*用户资料*/
  btn_user_clicked: function () {
    wx.navigateTo({
      url: '../user/user'
    })
  },
  
  /*添加好友*/
  btn_add_clicked: function () {
    wx.navigateTo({
      url: '../friend/friend'
    })
  },

  /*聊天页面跳转*/
  btn_online_clicked: function(e){
    // wx.navigateTo({ url: '../online/online' })
    var that = this;
    that.setData({
      pageNumber: 1,
      totalPage: 1,
      islastPage: false
    })
    wx.navigateTo({ url: '../online/online?tid=' + e.currentTarget.dataset.tid })
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.extra = new extra(that);
    this.extra.getlist(this);
    var ts = this;
    util.post('user/getData', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, function (data) {
      console.log(data)
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
    clearInterval(this.interval)
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
    var that = this;
    that.extra = new extra(that);
    that.extra.myonReachBottom(that);
    console.log(that.data.pageNumber + "," + that.data.totalPage)
  },

  handleGlobalMessage: function (resJson) {
    var _this = this;
    var date = new Date();
    this.lastSendTime = date.getTime();
    console.log('chat handleGlobalMessage');
    console.log(resJson);
    switch (resJson.action) {
      case 'glb_heart_check':
        //console.log('收到心跳包');
        _this.socketOpen = true;
        return true;
    }
  },
  /**
   * 有新消息进来时，点击新消息
   */
  newmsg_clik: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      pageNumber: 1,
      totalPage: 1,
      islastPage: false
    })
    var new_tid = e.currentTarget.dataset.current;
    wx.navigateTo({ url: '/pages/online/online?tid=' + new_tid })
  }
})