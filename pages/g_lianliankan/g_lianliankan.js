// pages/lianliankan/lianliankan.js
var app = getApp(), extra = require('g_extra'), util = app.util,ani = require("g_ani.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeLimit: 40,//答题限制时间
    imagesBaseUrl: util.url_images(),
    uiwidth: wx.getSystemInfoSync().windowWidth,
    uiheight: wx.getSystemInfoSync().windowHeight,
    myCanvas: 'huaxian',
    lineArray: [],//画线数组
    userNum: 0,
    otherNum: 0,
    row: [],
    imgType: [1, 2, 3, 4, 5, 6],
    status: [],//1正常 2点击 3空
    showImages: 0,
    bgImg: [
      [
        { imgType: "4.png", bg: true, status: false },
        { imgType: "3.png", bg: true, status: false },
        { imgType: "5.png", bg: true, status: false },
        { imgType: "1.png", bg: true, status: false },
        { imgType: "6.png", bg: true, status: false },
        { imgType: "5.png", bg: true, status: false },
        { imgType: "4.png", bg: true, status: false }
      ],
      [
        { imgType: "6.png", bg: true, status: false },
        { imgType: "1.png", bg: true, status: false },
        { imgType: "2.png", bg: true, status: false },
        { imgType: "4.png", bg: true, status: false },
        { imgType: "3.png", bg: true, status: false },
        { imgType: "1.png", bg: true, status: false },
        { imgType: "2.png", bg: true, status: false }
      ],
      [
        { imgType: "2.png", bg: true, status: false },
        { imgType: "1.png", bg: true, status: false },
        { imgType: "3.png", bg: true, status: false },
        { imgType: "5.png", bg: true, status: false },
        { imgType: "2.png", bg: true, status: false },
        { imgType: "4.png", bg: true, status: false },
        { imgType: "3.png", bg: true, status: false }
      ],
      [
        { imgType: "5.png", bg: true, status: false },
        { imgType: "1.png", bg: true, status: false },
        { imgType: "6.png", bg: true, status: false },
        { imgType: "1.png", bg: true, status: false },
        { imgType: "6.png", bg: true, status: false },
        { imgType: "2.png", bg: true, status: false },
        { imgType: "3.png", bg: true, status: false }
      ],
      [
        { imgType: "2.png", bg: true, status: false },
        { imgType: "3.png", bg: true, status: false },
        { imgType: "4.png", bg: true, status: false },
        { imgType: "5.png", bg: true, status: false },
        { imgType: "5.png", bg: true, status: false },
        { imgType: "4.png", bg: true, status: false },
        { imgType: "6.png", bg: true, status: false }
      ],
      [
        { imgType: '6.png', bg: true, status: false },
        { imgType: '1.png', bg: true, status: false },
        { imgType: '2.png', bg: true, status: false },
        { imgType: '1.png', bg: true, status: false },
        { imgType: '2.png', bg: true, status: false },
        { imgType: '3.png', bg: true, status: false },
        { imgType: '4.png', bg: true, status: false }
      ],
      [
        { imgType: '3.png', bg: true, status: false },
        { imgType: '2.png', bg: true, status: false },
        { imgType: '3.png', bg: true, status: false },
        { imgType: '5.png', bg: true, status: false },
        { imgType: '4.png', bg: true, status: false },
        { imgType: '1.png', bg: true, status: false }
      ],
      [
        { imgType: '1.png', bg: true, status: false },
        { imgType: '2.png', bg: true, status: false },
        { imgType: '4.png', bg: true, status: false },
        { imgType: '3.png', bg: true, status: false },
        { imgType: '5.png', bg: true, status: false },
        { imgType: '6.png', bg: true, status: false },
        { imgType: '6.png', bg: true, status: false },
        { imgType: '4.png', bg: true, status: false }
      ],
      [
        { imgType: '5.png', bg: true, status: false },
        { imgType: '5.png', bg: true, status: false },
        { imgType: '3.png', bg: true, status: false },
        { imgType: '4.png', bg: true, status: false },
        { imgType: '4.png', bg: true, status: false },
        { imgType: '1.png', bg: true, status: false },
        { imgType: '2.png', bg: true, status: false }
      ],
      [
        { imgType: '2.png', bg: true, status: false },
        { imgType: '3.png', bg: true, status: false },
        { imgType: '6.png', bg: true, status: false },
        { imgType: '6.png', bg: true, status: false },
        { imgType: '1.png', bg: true, status: false },
        { imgType: '5.png', bg: true, status: false },
        { imgType: '5.png', bg: true, status: false }
      ]
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
    /*提示*/
    tips: false,
    /*游戏时间*/
    // gameTimeWidth:0,
    // gameTime: 0,
    click_first: false,
    click_xy: [],
    click_result: [],
    click_resultimg: [],
    click_done: true,
    gameid: 0,

    /*匹配动画*/
    matchViewBox: {
      isHide: false,    /*显示隐藏*/
      matchEnd: false, /*匹配成功*/
      matchViewLeftAni: null,		//匹配后，左侧动画
      matchViewRightAni: null,	//匹配后右侧动画
    },
  },

  sendAnswerSocket: function () {
    app.socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":2,"connmsg":{"action":"game_answer","gameid":' + this.data.gameid + '}}');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //util.playsound('matching.mp3');
    /**
     * 开发连连看阶段
     * 直接存储测试数据
     */
    // var testOptions = {
    //   'uid' : 1,
    //   'secret': "8e07226f4b152b9f98f4d2810a65794500fd6325",
    //   'uid2':15,
    //   'time':176235172635,
    //   'tid':1,
    //   'gid':2
    // };
    // util.options = null;
    // wx.setStorageSync('options', JSON.stringify(testOptions));
    //开发阶段代码结束

    that.extra = new extra(that);
    /*添加表格数量*/
    that.extra.arrayNums();

    that.ani = new ani(that);
    that.ani.init();

    util.post('global/getuserinfo', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid2: options.uid2 }, function (resJson) {
      console.log(resJson);
      that.setData({
        'leftview.userinfo.avatar': resJson.data.userdata.avatarUrl,
        'leftview.userinfo.name': resJson.data.userdata.nickName,
        'rightview.userinfo.avatar': resJson.data.otherdata.avatarUrl,
        'rightview.userinfo.name': resJson.data.otherdata.nickName
      })
    })

    setTimeout(function () {
      app.socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":2,"connmsg":{"action":"game_ready","uidvs":' + options.uid2 + ',"tid":' + options.tid + ',"time":' + options.time + '}}');
    }, 1000);

    // /*VS匹配动画,如果匹配成功,就开始匹配动画*/
    // if (that.data.matchViewBox.isHide == false){
    //   that.ani.vsStartAni();
    //   s["matchViewBox.matchEnd"] = true;
    //   that.setData(s);
    // }
    // /*如果匹配结束,隐藏匹配并运行结束动画*/
    // clearTimeout(vsTime);
    // var vsTime = setTimeout(function(){
    //   that.ani.vsEndAni();
    //   s["matchViewBox.isHide"] = true;
    //   that.setData(s);
    // },5000)


    // var t = setInterval(function(){
    //   that.extra.times(that.data.gameTime);
    //   that.setData({ "gameTime": that.data.gameTime-1});
    //   if (0==that.data.gameTime){clearInterval(t);}
    // },1000);
  },

  /*点击游戏逻辑start*/
  btn_clicked: function (e) {
    var that = this;
    //util.playsound('btn_click.mp3');
    that.extra.game_item_click(that, e);
  },
  /*点击游戏逻辑end*/

  btn_help_clicked: function () {
    this.setData({
      tips: !this.data.tips
    })
  },

  btn_back_clicked: function () {
    wx.reLaunch({
      url: '../fight/fight',
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
    app.socket.sendSocketMessage('{"action":"glb_userstatus_quit"}');
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

  handleSocketMessage: function (resJson) {
    //console.log('lianliankan.js get socket' + JSON.stringify(resJson));
    switch (resJson.action) {
      case 'game_begin'://游戏开始
        var that = this;
        that.data.gameTime = that.data.timeLimit = resJson.timeLimit;
        that.data.gameid = resJson.gameid;

        //获取匹配用户，匹配到之后
        var uid = Number(util.getStorageSync('uid'));
        for (let i in resJson.userInfo) { //variable 为 index
          if (i != uid) {
            that.data.rightview.userinfo = {
              avatar: resJson.userInfo[i].avatarUrl,
              name: resJson.userInfo[i].nickName,
              level: resJson.userInfo[i].level,
              tiers: resJson.userInfo[i].sid,
            }
            break;
          }
        }
        that.setData(that.data);
        util.playsound('matchuser.mp3');
        return true;
      case 'game_answer_vs'://对手的答题数据
        var that = this;
        //console.log('收到对手数据：' + JSON.stringify(resJson));
        that.setData({ 'otherNum': that.data.otherNum + (100 / 35) });
        return true;
      case 'game_ticker'://答题记时
        //console.log('连连看答题记时 resJson.ticker=' + resJson.ticker);
        var that = this;
        if (resJson.ticker < 0) resJson.ticker = 0;
        if (that.extra.times) that.extra.times(resJson.ticker);
        return true;
      case 'game_end':
        //console.log('lianliankan.js game_end:' + util.getOption('tid') + '---' + util.getOption('time'));
        var that = this;
        wx.redirectTo({
          url: '/pages/online/online?tid=' + util.getOption('tid') + '&time=' + util.getOption('time') + "&point=" + encodeURIComponent(JSON.stringify(resJson.point)),
        })
        return true;
    }
    return false;
  },

})