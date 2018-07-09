// pages/playGame/playGame.js
var app = getApp(), util = app.util, glb = app.global, tween = app.tween, extra = require('extra');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imagesBaseUrl: util.url_images(),
    userdata: {
      uid: '',
      nickName: '',
      avatarUrl: ''
    },
    navHead: [
      { text: '对战', active: true, url: '../index/index' },
      { text: '找人玩', active: false, url: '../fight/fight' },
      { text: '聊天', active: false, url: '../chat/chat' },
      { text: '好友', active: false, url: '../friend/index' },
    ],
    main: [
      // { text: '容嬷嬷来了', bg: '../index/item1.png', num: '10818', gid:1 },
      // { text: '斗兽棋', bg: '../index/item2.png', num: '13474', gid:1},
      // { text: '跳一跳', bg: '../index/item3.png', num: '15718', gid:1},
      // { text: '六角拼拼', bg: '../index/item4.png', num: '11237', gid:1},
      // { text: '吃鸡游戏', bg: '../index/item5.png', num: '13782', gid:1},
      // { text: '连连看', bg: '../index/item6.png', num: '17828', gid:1},
      // { text: '娃娃机', bg: '../index/item7.png', num: '18818', gid:1},
      // { text: '跳冰箱', bg: '../index/item8.png', num: '19558', gid:1},
      // { text: '一起跳舞', bg: '../index/item9.png', num: '11345', gid:1},
    ],
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    scrollHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.extra = new extra(that);
    this.extra.getlist(this);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    
    /*公共头部导航动画*/
    util.headAni(that, tween);
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
    this.extra.myonReachBottom(this);
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

  /**
     * 第一级导航按钮
     */
  click_nav: function (e) {
    /*公共导航调用*/
    var _that = this;
    util.click_nav(e, _that.data.navHead, _that)
  },

  /**
   * 第二级导航按钮
   */
  click_game: function (e) {
    wx.showLoading({
      title: '加载中……',
    })
    glb.bindgetuserinfo(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/match/match?gid=' + e.currentTarget.dataset.gid,
      })
    }, e);
  },
  /**
   * 点击常玩的游戏去到配对界面
   */
  game_click: function (e) {
    console.log(e.currentTarget.dataset.current)
    var gid = e.currentTarget.dataset.current;
    wx.navigateTo({
      url: '/pages/match/match?gid=' + gid,
    })
  }
})