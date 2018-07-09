// pages/index/index.js
var app = getApp(), util = app.util, glb = app.global, socket = app.socket, tween = app.tween, extra = require('extra');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    new_msgtid: 0,
    new_msgshow: true,
    userdata: {
      uid:'',
      nickName:'',
      avatarUrl:''
    },
    imagesBaseUrl: util.url_images(),
    navHead: [
      { text: '对战', active: true, url: '../index/index'},
      { text: '找人玩', active: false, url: '../fight/fight' },
      { text: '聊天', active: false, url: '../chat/chat' },
      { text: '好友', active: false, url: '../friend/index' },
    ],
    nav: [
      { text: '邀请好友', bg: 'index/navBg1.png', url:"../invite/invite", hide: false },
      { text: '排行榜', bg: 'index/navBg2.png', url: "../ranking/ranking", hide: true  },
      { text: '查找好友', bg: 'index/navBg3.png', url: "../friend/friend", hide: false  },
      { text: '最近在玩', bg: 'index/navBg4.png', url: "../playGame/playGame", hide: false },
    ],
    main: [
      // { text: '容嬷嬷来了', bg: 'item1.png', num: '10818', gid:1 },
      // { text: '斗兽棋', bg: 'item2.png', num: '13474', gid:1},
      // { text: '跳一跳', bg: 'item3.png', num: '15718', gid:1},
      // { text: '六角拼拼', bg: 'item4.png', num: '11237', gid:1},
      // { text: '吃鸡游戏', bg: 'item5.png', num: '13782', gid:1},
      // { text: '连连看', bg: 'item6.png', num: '17828', gid:1},
      // { text: '娃娃机', bg: 'item7.png', num: '18818', gid:1},
      // { text: '跳冰箱', bg: 'item8.png', num: '19558', gid:1},
      // { text: '一起跳舞', bg: 'item9.png', num: '11345', gid:1},
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
    util.headAni(that,tween);
   
  },

  handleSocketMessage: function (resJson) {
    switch (resJson.action) {
      case 'match_ok':
        
        return true;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ts = this;
    var uid = util.getStorageSync('uid');
    var secret = util.getStorageSync('secret');
    util.post('user/getData', { uid: uid, secret: secret}, function(data){
      if (data.result == 'error' && data.msg == 'login_error' && (uid || secret))
      {
        try { wx.removeStorageSync('uid'), wx.removeStorageSync('secret') } catch (e) { }
        socket.close();
        console.log('socket close index.js 86');
        util.showmsg('需要重新登录！', function(){
          wx.navigateTo({
            url: '/pages/start/start'
          })
        });
        return;
      }
      if(data.result != 'success') return;
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.extra.myonReachBottom(this);
  },

  /**
   * 点击有戏列表按钮
   */
  click_game : function(e){
    wx.showLoading({
      title: '加载中……',
    })
    glb.bindgetuserinfo(function(){
      //登陆成功 和邀请者互相添加为好友 user/addfriconfirm
      var uid_friend = util.getStorageSync('uid_parent');
      if (uid_friend && uid_friend != util.getStorageSync('uid'))
      {
        console.log('bindgetuserinfo uid_friend=' + uid_friend);
        util.post('user/addfriconfirm',
          { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), 
            uid_friend: uid_friend,action:'autobecomefriends' },
          function (res) {
            if (res.result != 'success') return;
            try { wx.removeStorageSync('uid_parent') } catch (e) { }
          });
      }
      wx.hideLoading();
      wx.navigateTo({
        url: '/pages/match/match?gid=' + e.currentTarget.dataset.gid,
      })
    }, e);
  },
  
  /*用户资料*/
  btn_user_clicked: function(){
    wx.navigateTo({
      url: '../user/user'
    })
  },
  /*添加好友*/
  btn_add_clicked: function(e){
    wx.showLoading({
      title: '加载中……',
    })
    glb.bindgetuserinfo(function () {
      wx.hideLoading();
      wx.navigateTo({
        url: '../friend/friend'
      })
    }, e);
  },

  click_form:function(e)
  {
    util.post('user/pushformid', {
      "formid": e.detail.formId,
      uid: util.getStorageSync('uid'),
      secret: util.getStorageSync('secret')
    },
      function (res) {
      }
    );
  },

  /**
   * 第一级导航按钮
   */
  click_nav: function(e){
    /*公共导航调用*/
    var _that = this;
    util.click_nav(e, _that.data.navHead, _that)
  },
  

  /**
   * 第二级导航按钮
   */
  click_sec_nav: function(e){
    var url = e.currentTarget.dataset.url;
    wx.showLoading({
      title: '加载中……',
    })
    glb.bindgetuserinfo(function () {
      wx.hideLoading();
    }, e);
    wx.navigateTo({
      url: url
    })
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