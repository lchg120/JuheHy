// pages/g_doushouqi/doushouqi.js
var app = getApp(), s = {}, util = app.util, glb = app.global, socket = app.socket, tween = app.tween, ani = require("g_ani.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imagesBaseUrl: util.url_images(),

    /*棋子数据*/
    qizi: [
      /*id:判断动物大小值, bgUrl动物背景, name动物名字, vs(用户和对手):初始值true, sure(确定值):初始值false, isClick(确定点击):初始值false*/
      { id: 0, bgUrl: 'id0.png', name: '鼠', vs: true, sure: true,  isClick: 0 },
      { id: 1, bgUrl: 'id1.png', name: '猫', vs: true, sure: false, isClick: 0 },
      { id: 2, bgUrl: 'id2.png', name: '狗', vs: true, sure: false, isClick: 0 },
      { id: 3, bgUrl: 'id3.png', name: '狼', vs: true, sure: false, isClick: 0 },
      { id: 4, bgUrl: 'id4.png', name: '豹', vs: true, sure: false, isClick: 0 },
      { id: 5, bgUrl: 'id5.png', name: '虎', vs: true, sure: false, isClick: 0 },
      { id: 6, bgUrl: 'id6.png', name: '狮', vs: true, sure: false, isClick: 0 },
      { id: 7, bgUrl: 'id7.png', name: '象', vs: true, sure: false, isClick: 0 },
      { id: 0, bgUrl: 'id0.png', name: '鼠', vs: false, sure: false, isClick: 0 },
      { id: 1, bgUrl: 'id1.png', name: '猫', vs: false, sure: false, isClick: 0 },
      { id: 2, bgUrl: 'id2.png', name: '狗', vs: false, sure: true, isClick: 0 },
      { id: 3, bgUrl: 'id3.png', name: '狼', vs: false, sure: false, isClick: 0 },
      { id: 4, bgUrl: 'id4.png', name: '豹', vs: false, sure: false, isClick: 0 },
      { id: 5, bgUrl: 'id5.png', name: '虎', vs: false, sure: false, isClick: 0 },
      { id: 6, bgUrl: 'id6.png', name: '狮', vs: false, sure: false, isClick: 0 },
      { id: 7, bgUrl: 'id7.png', name: '象', vs: false, sure: false, isClick: 0 }
    ],


    //左侧显示的是自己
    leftview: {
      userinfo: {
        avatar: '',
        name: '我的名字',
      },
    },
    //右侧显示的是对手
    rightview: {
      userinfo: {
        avatar: '',
        name: '加载中…',
      },
    },
    /*匹配动画*/
    matchViewBox: {
      isHide: false,    /*显示隐藏*/
      matchEnd: false, /*匹配成功*/
      matchViewLeftAni: null,		//匹配后，左侧动画
      matchViewRightAni: null,	//匹配后右侧动画
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.ani = new ani(that);
    that.ani.init();
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
  
  },

  click_sure: function(e){
    var ts = this;
    var qizi = ts.data.qizi;
    var index = e.currentTarget.dataset.index;
    var cNums = qizi[index].isClick;
    var sure = qizi[index].sure;
    /*判断初始值*/
    if(sure == true){
      if (cNums > 2 % 1 == 1) {
        cNums = 0;
      } else {
        /*切换高亮状态*/
        for (var i = 0; i < qizi.length;i++){
          qizi[i].isClick = 0;
          s["qizi["+i+"].isClick"] = 0;
          ts.setData(s)
        }
        cNums++;
      }
    }
    s["qizi[" + index + "].sure"] = true;
    s["qizi[" + index + "].isClick"] = cNums;
    ts.setData(s)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})