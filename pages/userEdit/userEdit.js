// pages/userEdit/userEdit.js
var app = getApp(), util = app.util, extra = require('extra');
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
      sex: '男',
      age: '',
      star: '',
      city: '南宁',
      qianming: '',
    },
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
    var ts = this;
    util.post('user/getData', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, function (data) {
      console.log(data)
      if (data.result != 'success') return;
      var sex = '女';
      if (data.userdata.userInfo.gender == 1){
        sex = '男';
      }
      ts.setData({
        'userdata.uid': data.userdata.uid,
        'userdata.nickName': data.userdata.userInfo.nickName,
        'userdata.avatarUrl': data.userdata.userInfo.avatarUrl,
        'userdata.sex':sex,
        'userdata.city': data.userdata.userInfo.city,
      });
    });
  },

  /*保存按钮*/
  btn_save_clicked: function(){
    wx.navigateTo({ url: '../userEdit/userEdit'})
  },
  btn_back_clicked: function () {
    wx.reLaunch({ url: '../index/index' })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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