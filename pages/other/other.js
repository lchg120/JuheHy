// pages/other/other.js
var app = getApp(), util = app.util, socket = app.socket, extra = require('extra');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_msgtid: 0,
    new_msgshow: true,
    imagesBaseUrl: util.url_images(),
    userdata: {
      // uid: '',
      // nickName: '',
      // avatarUrl: '',
      // sex: '男',
      // age: '18',
      // star: '双鱼座',
      // city: '南宁',
    },
    /*对手信息*/
    otherdata: {
      // uid: '111',
      // nickName: '真真假假',
      // avatarUrl: 'common/userHead.png',
      // sex: '男',
      // age: '18',
      // star: '双鱼座',
      // city: '南宁',
      // friendState: false,
    },
    /*对手常玩游戏*/                                                                                                 
    game: [
      // {gid:1, gname: '容嬷嬷来了', gimg: 'index/item1.png', sheng: '10', fu: '10' },
    ],
    /*设置对手状态*/
    otherState: [
      { text: '屏蔽' },
      { text: '删除' },
      { text: '举报' },
    ],
    stateHidden: true,
    addFriend: true,
  },
  /*聊天页面跳转*/
  btn_online_clicked: function (e) {
    //获取和好友之间的聊天tid
    var that = this;
    util.post('talk/gettid', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid_friend: that.data.otherdata.uid},
    function(res){
      if (res.result != 'success') return;
      console.log('../online/online?tid=' + res.data.tid)
      wx.navigateTo({ url: '../online/online?tid='+ res.data.tid})
    });
  },
  btn_edit_clicked: function(){
    this.setData({
      'stateHidden': false
    })
  },
  btn_hidden_clicked: function(){
    this.setData({
      'stateHidden': true
    })
  },
  btn_add_clicked: function(){
    this.setData({
      'addFriend': false
    })
  },
  btn_quit_clicked: function () { 
    this.setData({
      'addFriend': true
    })
  },
  btn_enter_clicked: function () {
    this.setData({
      'addFriend': true
    })
    socket.sendSocketMessage('{"action":"user_add_friend","uid_friend":"' + this.data.otherdata.uid + '"}');
    util.showmsg('好友请求已经发送,请耐心等待对方处理');
  },
  btn_back_clicked: function(){
    wx.navigateTo({
      url: '../friend/friend',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.extra = new extra(that);
    this.extra.getlist(that, options.suid);
    
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
    util.post('user/getData', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, 
    function (data) {
      var avatarUrl = data.userdata.userInfo.avatarUrl;
      if (data.result != 'success') return;
      var sex = '女';
      if (data.userdata.userInfo.gender == 1) {
        sex = '男';
      }
      ts.setData({
        'userdata.uid': data.userdata.uid,
        'userdata.nickName': data.userdata.userInfo.nickName,
        'userdata.avatarUrl': avatarUrl.slice(0, avatarUrl.length - 3) + 0,
        'userdata.sex': sex,
        'userdata.city': data.userdata.userInfo.city
      });
    });
  },

  /**
   * 点击常玩的游戏去到配对界面
   */
  game_click: function (e) {
    var gid = e.currentTarget.dataset.item.gid;
    wx.navigateTo({
      url: '/pages/match/match?gid=' + gid,
    })
    console.log(e.currentTarget.dataset.item.gid)
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