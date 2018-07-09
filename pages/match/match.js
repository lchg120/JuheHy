// pages/match/match.js
var app = getApp(), util = app.util, socket = app.socket, extra = require('extra'), ani = require('./ani.js'),senondTimer=null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    new_msgtid: 0,
    new_msgshow: true,
    imagesBaseUrl: util.url_images(),
    /*是否匹配成功*/
    pveShow: false,

    /*用户数据*/
    userdata: {
      uid: '',
      nickName: '',
      avatarUrl: '',
      sex: '男',
      age: '18',
      star: '双鱼座',
      city: '南宁',
      shengNum: 5,
      distance: '0'
    },

    /*对方用户数据*/
    otherdata: {
      uid: '',
      nickName: '匹配中',
      avatarUrl: '',
      sex: '未知',
      age: '20',
      star: '天蝎座',
      city: '未知',
      shengNum: 0,
      distance: '未知'
    },
    
    /*游戏数据*/
    gamedata:{
      gid:0,
      name:'',
      appId:'',
      path:''
    },

    /*等待时间*/
    waitTime:0,

    /*游戏提示*/
    tips: [
      // '按照大小顺序吃掉对方的棋子',
      // '老鼠可以吃大象'
    ],

    /*线条动画*/
    lineLeftAni: null,
    lineRightAni: null,

    /*头像加载等待动画*/
    headBgAni: null,

    /*提示动画*/
    tipsAni1: null,
    tipsAni2: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var s = {};
    var ts = this;
    ts.extra = new extra(ts);
    ts.ani = new ani(ts);
    ts.ani.init();
    if(options.gid && options.gid != undefined)//指定游戏匹配
    {
      util.post('game/indexnv', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), gid: options.gid }, function (data) {
        console.log(data)
        if (data.result == 'error') {
          util.showmsg(data.msg, function () {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          });
          return;
        }
        socket.lastMsg = '{"action":"match","gid":' + options.gid + '}';
        socket.sendSocketMessage(socket.lastMsg);
        ts.setData({
          gamedata: util.extend({ gid: options.gid }, data.gamedata),
          tips: data.gamedata.tip
        });
      }, function () {
        util.showmsg('获取游戏数据接口出错', function(){
          wx.reLaunch({
            url: '/pages/index/index',
          })
        });
      });
    }
    else//找人玩匹配
    {
      socket.lastMsg = '{"action":"match","gid":0}';
      socket.sendSocketMessage(socket.lastMsg);
    }

    /*等待时间*/
    var waitTime = this.data.waitTime;
    if (senondTimer != null) clearInterval(senondTimer);
    senondTimer = setInterval(function () {
      if (waitTime < 17){
        waitTime++;
        s["waitTime"] = waitTime;
        if (waitTime >= 10)
        {
          socket.close();
          console.log('socket close matching.js 120');
          socket.sendSocketMessage(socket.lastMsg);
        }
      }else {
        clearInterval(senondTimer);
        util.showmsg('长时间匹配不到人，可能是服务器在维护，请您稍后重试！', function(){
          wx.reLaunch({ url: '../index/index' });
        });
        return;
      }
      ts.setData(s);
    }, 1000); 
  },

  /**
   * 取消匹配按钮
   */
  btn_back_clicked: function(){
    wx.reLaunch({ url: '../index/index' });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ts = this;
    util.post('user/getData', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret')}, function(data){
      console.log(data)
      if(data.result != 'success') return;
      var sex = '女';
      if(data.userdata.userInfo.gender == 1){
        sex = '男';
      }
      ts.setData({
        'userdata.uid': data.userdata.uid,
        'userdata.nickName': data.userdata.userInfo.nickName,
        'userdata.avatarUrl': data.userdata.userInfo.avatarUrl,
        'userdata.city':data.userdata.userInfo.city,
        'userdata.sex':sex
      });
    });
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    socket.sendSocketMessage('{"action":"glb_userstatus_quit"}');
    if (senondTimer != null)
    {
      clearInterval(senondTimer);
      senondTimer = null;
    }
  },

  handleSocketMessage: function (resJson) {
    //console.log('收到socket消息' + JSON.stringify(resJson))
    var ts = this;
    switch (resJson.action) {
      case 'match_ok'://匹配到人
        ts.extra.receive(resJson);
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