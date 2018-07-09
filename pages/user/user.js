// pages/user/user.js
var app = getApp(), util = app.util;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_msgtid: 0,
    new_msgshow: true,
    imagesBaseUrl: util.url_images(),
    userdata: {
      avatarUrl: '',
      sex: '男',
      age: '18',
      star: '双鱼座',
      city: '南宁',
    },
    game: [
      // {gid:1, gname: '容嬷嬷来了', gimg: 'index/item1.png', sheng: '10', fu: '10' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.extra = new extra(that);
    // this.extra.getlist(this);
  },

  btn_edit_clicked: function () {
    wx.navigateTo({
      url: '../userEdit/userEdit'
    })
  },
  btn_back_clicked: function () {
    wx.reLaunch({
      url: '../index/index'
    })
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

    app.global.keepLoginAndSocket();
    // console.log(util.getStorageSync('uid') + "," + util.getStorageSync('secret'))
    util.post('user/getData',
      { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') },
      function (data) {
        console.log(data)
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
          'userdata.city': data.userdata.userInfo.city,
          'game': data.userdata.play_often
        });
        // console.log(data.userdata)
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
   * 点击常玩的游戏去到配对界面
   */
  game_click:function(e){
    console.log(e.currentTarget.dataset.item.gid)
    var gid = e.currentTarget.dataset.item.gid;
    wx.navigateTo({
      url: '/pages/match/match?gid=' + gid,
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