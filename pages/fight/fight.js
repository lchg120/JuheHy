// pages/fight/fight.js
var s = {}, app = getApp(), util = app.util, tween = app.tween, extra = require('extra'), a = require('./ani.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_msgtid: 0,
    new_msgshow: true,
    imagesBaseUrl: util.url_images(),
    /*用户数据*/
    userdata: {
      uid: '',
      nickName: '',
      avatarUrl: ''
    },

    /*头部导航数据*/
    navHead: [
      { text: '对战', active: false, url: '../index/index' },
      { text: '找人玩', active: true, url: '../fight/fight' },
      { text: '聊天', active: false, url: '../chat/chat' },
      { text: '好友', active: false, url: '../friend/index' },
    ],

    /*关键词数据:最近匹配的人*/
    userKey: [
        // { name: '爱不爱', headImg: 'chat/userHead2.png', sex: '男', show: true, sheng: 20, fu: 10, dataDel: false, nums: 0 },
        // { name: '爱不爱', headImg: 'chat/userHead1.png', sex: '女', show: true, sheng: 10, fu: 20, dataDel: false, nums: 0 },
        // { name: '爱不爱', headImg: 'chat/userHead2.png', sex: '男', show: true, sheng: 20, fu: 10, dataDel: false, nums: 0 },
        // { name: '爱不爱', headImg: 'chat/userHead1.png', sex: '女', show: true, sheng: 10, fu: 20, dataDel: false, nums: 0 },
        // { name: '爱不爱', headImg: 'chat/userHead1.png', sex: '女', show: true, sheng: 10, fu: 20, dataDel: false, nums: 0 },
        // { name: '爱不爱', headImg: 'chat/userHead1.png', sex: '女', show: true, sheng: 10, fu: 20, dataDel: false, nums: 0 },
    ],
    userKeyNull: false,

    /*随机在线人数*/
    userNum: '888888',
    /*人数动画*/
    userNumAni: null,

    /*配对动画数据*/
    
    fight: [
      // { leftAni:null, rightAni:null, name1: '春来到', headImg1: 'chat/userHead1.png', name2: '爱不爱来玩', headImg2: 'chat/userHead2.png', time: 1500, id: 1, isuse:0 },
      // { leftAni: null, rightAni: null, name1: '机器人', headImg1: 'chat/userHead1.png', name2: '冬天不玩', headImg2: 'chat/userHead3.png', time: 1800, id: 2, isuse:0 },
      // { leftAni: null, rightAni: null, name1: '真真假假', headImg1: 'chat/userHead2.png', name2: '天真无邪', headImg2: 'chat/userHead3.png', time: 2100, id: 3, isuse:0 },
      // { leftAni: null, rightAni: null, name1: '夏天来了', headImg1: 'chat/userHead2.png', name2: '可以看看看看', headImg2: 'chat/userHead1.png', time: 2400, id: 4, isuse:0},
      // { leftAni: null, rightAni: null, name1: '秋天来了', headImg1: 'chat/userHead3.png', name2: '真的吗', headImg2: 'chat/userHead1.png', time: 2700, id: 5, isuse:0 },
    ],

    fightNum:0,

    /*底部按钮筛选start*/
    /*按钮条件数据*/
    sex: [
      { text: '不限', active: true },
      { text: '男', active: false },
      { text: '女', active: false },
    ],
    age: [
      { text: '不限', active: true },
      { text: '同龄人', active: false },
      { text: '更大', active: false },
      { text: '更小', active: false },
    ],
    screen: { sex: '不限', age: '不限'},
    /*底部筛选条件弹窗层*/
    maskHidden: true,
    /*底部按钮筛选end*/
    // 当前页
    pageNumber: 1,
    // 总页数
    totalPage: 1,
    scrollHeight: 0,
    longtap:false,
    
    /*定时器数组*/
    arrSetInterval: [],
    /*定时器再次开启*/
    setIntervalShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.extra = new extra(that);
    that.extra.getUserKey(that);
    that.extra.getlist(that);

    /*公共头部导航动画*/
    util.headAni(that, tween);
   
    // setInterval(function(){
    //   that.extra.getlist(that);
    // },5000);

    
    // that.ani = new a(that);
    // that.ani.init();
    
  },


  listenerStorageSyncGet: function () {
    // var that = this;
    var value = wx.getStorageSync('fight.name1');
    this.setData({
      storageSyncContent: value
    })
    console.log(value)
  },

  /**
     * 第一级导航按钮
     */
  
  click_nav: function (e) {
    /*公共导航调用*/
    var _that = this;
    util.click_nav(e, _that.data.navHead, _that)
  },

  /*点击选择性别*/
  btn_sex_clicked: function(e){
    var index = e.currentTarget.dataset.i;
    var itemText = e.currentTarget.dataset.item.text;
    var screen = this.data.screen;
    var sex = this.data.sex;
    screen.sex = itemText;
    for (var i = 0; i < sex.length; i++) {
      sex[i].active = false;
    }
    sex[index].active = true;
    this.setData({
      "sex": sex,
      "screen": screen
    })
  },

  /*点击选择年龄*/
  btn_age_clicked: function (e) {
    var index = e.currentTarget.dataset.i;
    var itemText = e.currentTarget.dataset.item.text;
    var screen = this.data.screen;
    var age = this.data.age;
    for (var i = 0; i < age.length; i++) {
      age[i].active = false;
    }
    age[index].active = true;
    screen.age = itemText;
    this.setData({
      "age": age,
      "screen": screen
    })
  },

  /*点击显示底部弹窗*/
  btn_maskShow_clicked:function(){
    this.setData({
      "maskHidden": false
    })
  },
  /*点击隐藏底部弹窗*/
  btn_maskHidden_clicked: function(e){
    this.setData({
      "maskHidden": true
    })
  },

  btn_headShow_clicked:function (e){
    if (this.data.longtap){
      return ;
    }
    this.setData({longtap:false});
    console.log(e.currentTarget.dataset.item.uid_match);
    var tid = 0;
    util.post('talk/gettid',
       { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid_friend:e.currentTarget.dataset.item.uid_match },
       function (e){
         console.log(e);
         tid = e.data.tid;
         wx.navigateTo({ url: '../online/online?tid=' + tid });
       }, function(e){});
    
  },

  /*点击顶部头像显示删除按钮*/
  btn_headShow_longtap: function (e) {
    this.setData({ longtap: true });
    var index = e.currentTarget.dataset.i;
    var show = e.currentTarget.dataset.item.show;
    var userKey = this.data.userKey;

    for (var i = 0; i < userKey.length; i++) {
      userKey[i].show = true;
    }
    userKey[index].show = false;
    this.setData({
      "userKey": userKey
    })
  },

  /*点击删除按钮删除匹配的人*/
  btn_delData_clicked: function (e) {
    var that = this;
    
    if (that.touchEndTime - that.touchStartTime < 350)
    {
      return ;
    }
    
    var uid = util.getStorageSync('uid');
    var secret = util.getStorageSync('secret');
    var uid_match = e.currentTarget.dataset.item.uid_match;
    util.post('user/deletebestmatch', { uid: uid, secret:secret, uid_match: uid_match }, function (resJson) {
      console.log(resJson)
      var index = e.currentTarget.dataset.i;
      var dataDel = e.currentTarget.dataset.item.show;
      var userKey = that.data.userKey;
      var index = e.currentTarget.dataset.i;
      console.log(index)
      var userKey = that.data.userKey;
      userKey[index].dataDel = true;
      var _userKey = new Array();
      for (var i = 0; i < userKey.length; i++) {
        if (userKey[i].dataDel == false) {
          _userKey.push(userKey[i]);
        }
      }
      that.setData({
        "userKey": _userKey
      });
    })
  },
  
  /*用户资料*/
  btn_user_clicked: function () {
    wx.navigateTo({
      url: '../user/user'
    })
  },

  /*添加好友*/
  btn_add_clicked: function(){
    wx.navigateTo({
      url: '../friend/friend'
    })
  },

  /*快速匹配*/
  click_match: function (e) {
    var that = this;
    for (var i = 0; i < that.data.arrSetInterval.length; i++) {
      clearInterval(that.data.arrSetInterval[i]);
    }
    that.setData({
      setIntervalShow: true
    })
    wx.navigateTo({
      url: '/pages/match/match',
    });
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ts = this;
    if (ts.data.setIntervalShow == true){
      ts.ani.init();
    }
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