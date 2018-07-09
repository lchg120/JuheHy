// pages/friend/friend.js
var app = getApp(), util = app.util,extra = require('extra');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_msgtid: 0,
    new_msgshow: true,
    imagesBaseUrl: util.url_images(),
    userdata: {
      uid: '',
      nickName: '',
      avatarUrl: '',
    },
    searchHide: true,
    otherName: '',
    friend: [
      // { name: '爱不爱来玩', headImg: 'common/userHead.png', state: '已添加' },
      // { name: '来玩', headImg: 'common/userHead.png', state: '未添加' },
      // { name: '不来玩', headImg: 'common/userHead.png', state: '等待验证' },
      // { name: '快点来玩', headImg: 'common/userHead.png', state: '1' },
    ],
    usrInput: [],
    inputSearch:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.extra = new extra(that);
    that.extra.getlist(that);
  },
  btn_confirm_clicked: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    util.post('user/addfriconfirm',
     {uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid_friend: item.uid}, 
     function (res) {
        var friend = that.data.friend;
        if (res.result != 'success') return;
        try { wx.removeStorageSync('uid_parent')} catch (e) { }
        friend[index].state = '已经添加';
        that.setData({
          "friend": friend
        })
     });
  },
  btn_user_clicked: function () {
    wx.navigateTo({ url: '../user/user' })
  },
  btn_other_clicked: function(e){
    var suid = e.currentTarget.dataset.suid;
    console.log(suid)
    wx.navigateTo({ url: '../other/other?suid=' + suid })
  },
  btn_back_clicked: function () {
    wx.reLaunch({url: '../index/index'})
  },
  userInput: function (e) {
    this.setData({
      otherName: e.detail.value
    });
    console.log(this.data.otherName);
  },
  btn_search_clicked: function () {
    var that = this;
    //var otherName = 18978134780;
    // this.setData({
    //   otherName: otherName
    // })
    //console.log(that.data.inputSearch)
    var suid = that.data.inputSearch;
    wx.navigateTo({ url: '../other/other?suid=' + suid })
  },
  btn_searchShow_clicked: function (e) {
    var that = this;
    var query = wx.createSelectorQuery();
    var valLen = e.detail.value.length;
    var searchHide = this.data.searchHide;
    query.select('#searchBack').boundingClientRect()
    query.exec(function (res) {
      if (valLen > 0){
        searchHide = false;
      }else {
        searchHide = true;
      }
      that.setData({
        searchHide: searchHide,
        inputSearch: e.detail.value,
        otherName: e.detail.value
      })
    });
  },
  btn_searchHide_clicked: function () {
    this.setData({
      searchHide: true,
      inputSearch:''
    })
  },

  btn_invite_cliked:function()
  {
    wx.navigateTo({ url: '../invite/invite' });
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

  /**
   * 有新消息进来时，点击新消息
   */
  newmsg_clik: function (e) {
    console.log(e)
    var new_tid = e.currentTarget.dataset.current;
    wx.navigateTo({ url: '/pages/online/online?tid=' + new_tid })
  }
})