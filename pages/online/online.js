// pages/online/online.js
var app = getApp(), util = app.util,socket = app.socket, extra = require('extra'), tween = app.tween, ani = require('./ani.js');
var yuyinMove = true;
var bb = '123';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagesBaseUrl: util.url_images(),
    uploadBaseUrl:util.url_upload(),
    uiheight: wx.getSystemInfoSync().windowHeight,
    tid:'',
    gid_last_play:0,//
    new_msgtid:0,
    new_msgshow: true,
    sendMsg:'',
    /*用户数据*/
    userdata: {
      // uid: '',
      // nickName: '',
      // avatarUrl: '',
      // sex: '男',
      // age: '18',
      // star: '双鱼座',
      // city: '南宁',
      // shengNum: 5
    },
    
    /*对手数据*/
    otherdata: {
      // uid: '',
      // nickName: '春不知冬寒',
      // avatarUrl: 'chat/userHead3.png',
      // sex: '女',
      // age: '18',
      // star: '天蝎座',
      // city: '北京',
      // shengNum: 0,
      // fight: '3',
      // isfriend: "0"
    },

    addFriend:false,

    /*时间框*/
    time: '15:35',
    /*倒计时*/
    insertTime: [],

    /*对话框*/

    /*推荐游戏数据*/
    gameRecommend: [
      { name: '小游戏4', bgUrl: 'index/item4.png' },
      { name: '小游戏5', bgUrl: 'index/item5.png' },
      { name: '小游戏6', bgUrl: 'index/item6.png' },
    ],

    /*游戏分类*/
    gameHidden: true,
    gameList: [
      // {gid: 1, name: '斗兽棋', bgUrl: 'index/item4.png' },
      // {gid: 2, name: '跳一跳', bgUrl: 'index/item5.png' },
      // {gid: 3, name: '蛋糕塔', bgUrl: 'index/item6.png' },
      // {gid: 4, name: '六角拼拼', bgUrl: 'index/item4.png' },
      // {gid: 5, name: '飞行棋', bgUrl: 'index/item3.png' },
      // {gid: 6, name: '中国象棋', bgUrl: 'index/item2.png' },
      // {gid: 7, name: '消消乐', bgUrl: 'index/item4.png' },
      // {gid: 8, name: '今晚吃鸡', bgUrl: 'index/item5.png' },
    ],
    
    /*按钮选择关键词*/
    keyWord: [
      // { text: '求开麦' },
      // { text: '游戏结束加个好友吧' },
      // { text: '方便开语音玩吗' },
    ],

    /*底部导航高亮状态*/
    active: true, 
    /*底部导航表情小图标*/
    biaoqing: [
      { bqImg: 'biaoqing/00.gif' },
      { bqImg: 'biaoqing/01.gif' },
      { bqImg: 'biaoqing/02.gif' },
      { bqImg: 'biaoqing/03.gif' },
      { bqImg: 'biaoqing/04.gif' },
      { bqImg: 'biaoqing/05.gif' },
      { bqImg: 'biaoqing/06.gif' },
      { bqImg: 'biaoqing/07.gif' },
      { bqImg: 'biaoqing/08.gif' },
      { bqImg: 'biaoqing/09.gif' },
      { bqImg: 'biaoqing/10.gif' },
      { bqImg: 'biaoqing/11.gif' },
      { bqImg: 'biaoqing/12.gif' },
      { bqImg: 'biaoqing/13.gif' },
      { bqImg: 'biaoqing/14.gif' },
      { bqImg: 'biaoqing/15.gif' },
    ],

    /*显示弹窗*/
    maskHidden: true,
    isfirst:true,

    /*对战结果数据start*/
    /*分数数据*/
    pveData: {
      nums: 378,
      ratio:  98,
      field:  5,
      vs:  5,
      shengNum: 5,
      state: '虐菜局',
    },
    /*结果数据*/
    pveState: [
      { text: '胜利', hidden: false, bg:'online/state_ying.png', class:'sheng' },
      { text: '平局', hidden: true, bg: 'online/state_ping.png', class:'ping' },
      { text: '失败', hidden: true, bg: 'online/state_shu.png', class:'shu' },
    ],
    /*按钮状态切换数据*/
    btnState: {
      hidden: false,
      user: true,
      other: true, 
      quit: false,
      aniEnd: false,
    },
    gamevs: {},
    /*对战结果数据end*/

    talk_timeout:60,
    /**
     * wxml界面根据这个数据显示，绑定函数
     */
    talk_data: [
      // {"talk_type": "1", "time": "08:02", "data":[
      //     { "uid": "7", "ofen_play": [{ "gid": "1", "img_path": "index/item4.png" }, { "gid": "2", "img_path": "index/item5.png" }] },
      //     { "uid": "2", "ofen_play": [{ "gid": "1", "img_path": "index/item5.png" }, { "gid": "2", "img_path": "index/item6.png" }] }
      //   ]
      // },
      // {"talk_type": "2", "time": "", "uid": "7", "data": "任何文字，如果是表情__4__" },
      // {"talk_type": "2", "time": "", "uid": "2", "data": "任何文字，如果是表情__5__" },
      // {"talk_type": "3", "time": "", "gamedata": { "gid": "1","gname":"跳一跳来了", "img_path":"index/item5.png"}, "data":[
      //       { "uid":"7", "talk_game_status": "7", "second":40},
      //       { "uid":"2", "talk_game_status": "5" }
      //     ]
      // },
      // { "talk_type": "2", "time": "", "uid": "2", "data": "任何文字，如果是表情__6__" },
      // { "talk_type": "2", "time": "", "uid": "7", "data": "任何文字，如果是表情__7__" },
      // { "talk_type": "2", "time": "", "uid": "7", "data": "任何文字，如果是表情__8__" },
      // { "talk_type": "2", "time": "", "uid": "2", "data": "任何文字，如果是表情__9__" },
    ],

    /*滚动高度*/
    scrollHeight:410,
    /*头部高度*/
    topHeight: 61,
    /*底部高度*/
    footHeight: 132,
    /*按钮框高度*/
    // btnBoxHeight: 

    /*获取按钮焦点高亮*/
    btnActive: false,
    /*当前设备操作系统 */
    nowSystem:'iOS',
    yy:{
      /*语音背景显示*/
      isyy: false,
      playing: [],
      /*语音按钮显示*/
      btnHidden: true,
      /*语音取消发送*/
      yyMove: true,
      /*语音动画定时器*/
      yyLineAniTime: 0,
      yyLineAni:null,
      /*录音设置*/
      yySet: 0
    },
    /*定时器变量*/
    dsqarr:[],
    newtime:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(wx.getSystemInfoSync().system)
    var os = wx.getSystemInfoSync().system;
    var nowSystem = '';
    if (os.indexOf('iOS') == 0){
      nowSystem = 'iOS';
    }else{
      nowSystem = 'Android';
    }
    that.setData({ nowSystem: nowSystem})
    console.log(JSON.stringify(that.data.insertTime));
    var uid = util.getStorageSync('uid');
    var secret = util.getStorageSync('secret');
    var tid = options.tid;
    var time = options.time;
    //游戏结果
    if (options.point != undefined) {
      var gamevs = {};
      var userdata = {};
      var otherdata = {};
      var point = JSON.parse(decodeURIComponent(options.point));
      if (point[0].uid == uid) {
        userdata = { shengNum: point[0].point }
        otherdata = { shengNum: point[1].point }
      } else {
        userdata = { shengNum: point[1].point }
        otherdata = { shengNum: point[0].point }
      }
      gamevs = { result:0, userdata: userdata, otherdata: otherdata }
      console.log(gamevs)
      that.setData({ gamevs: gamevs })
    }
    console.log(tid)
    console.log(secret)
    that.setData({tid:tid})
    that.extra = new extra(that);
    //读取聊天数据  聊天信息处理
    util.post('talk/talkdetail', {uid:uid,secret:secret,tid:tid,time:time}, function(resJson){
      //console.log('online onLoad talk/talkdetail');
      console.log(resJson)
      //找游戏对战输赢
      if (options.point != undefined) {
        resJson.talk_data.talk_data.forEach(function (item, index) {
          if(item.time == time && 3 == item.talk_type){
            var data = item.data;
            var result = 0;
            if (data[0].uid == uid && data[0].talk_game_status == 1){
              result = 1;
            } else if (data[1].uid == uid && data[1].talk_game_status == 1){
              result = 1;
            }
            if(result == 1){
              util.playsound('cd_success.mp3');
            }else{
              util.playsound('cd_fail.mp3');
            }
            that.data.gamevs.result = result;
            that.setData({ gamevs: that.data.gamevs, maskHidden: false, gid_last_play: item.gamedata.gid});
          }
        });
      }
      that.extra.talk_detail(that, time, resJson);
      that.extra.handle_accept_timeout();
      that.tHeight();
      that.fHeight();
      that.iHeight();
    });
    //获取所有游戏
    util.post("main/list", { uid: uid, secret: secret}, function (resJson) {
      console.log(resJson.data.items)
      that.setData({ gameList: resJson.data.items})
    });
  },


  /*底部导航切换*/
  btn_active_clicked: function (e) {
    var that = this;
    var gameHidden = that.data.gameHidden;
    gameHidden = !gameHidden;
    that.setData({
      "btnHidden": true,
      "active": true,
      "gameHidden": gameHidden,
      "yyMove": true
    })
    that.tHeight();
    that.fHeight();
    that.iHeight();
  },
  btn_biaoqing_clicked: function(e) {
    var that = this;
    var active = that.data.active;
    active = !active;
    that.setData({
      "btnHidden": true,
      "gameHidden": true,
      "yyMove": true,
      "active": active
      // "scrollHeight": that.data.uiheight - that.data.topHeight - that.data.footHeight
    })
    that.tHeight();
    that.fHeight();
    that.iHeight();
  },

  iHeight: function(){
    var query = wx.createSelectorQuery();
    var mainHeight = 0;
    var that = this;
    query.select('#main').boundingClientRect();
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      // console.log('iHeight '+JSON.stringify(res)+"...");
      mainHeight = res[0].height;
      console.log(mainHeight + ",..")
      that.setData({
        "mainHeight": mainHeight
      })
    });
  },

  tHeight: function () {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#top').boundingClientRect(function (res) {
      that.setData({
        topHeight: res.height
      })
    }).exec();
  },

  fHeight: function () {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#foot').boundingClientRect(function (res) {
      that.setData({
        footHeight: res.height
      })
    }).exec();
  },

  /*取消结果弹窗*/
  btn_back_clicked: function(e){
    this.setData({
      maskHidden: true,
      isfirst:false
    })
  }, 

  /*返回首页*/
  btn_index_clicked: function () {
    wx.reLaunch({ url: '../index/index' });
  }, 

  /*对方用户约战按钮*/
  btn_other_clicked: function(e){
    var btnState = e.currentTarget.dataset.state;
    btnState.other = false;
    btnState.hidden = true;
    this.setData({
        "btnState": btnState,
        "aniEnd": true
    })
  },

  /*自己约战按钮*/
  // btn_user_clicked: function (e) {
  //   var btnState = e.currentTarget.dataset.state;
  //   btnState.user = false;
  //   btnState.hidden = true;
  //   this.setData({
  //     "btnState": btnState,
  //     "aniEnd": true
  //   })
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ts = this;
    util.post('user/getData', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, function (data) {
      //console.log('online onshow getData'+JSON.stringify(data));
      if (data.result != 'success') return;
      ts.setData({
        'userdata.uid': data.userdata.uid,
        'userdata.userInfo.nickName': data.userdata.userInfo.nickName,
        'userdata.userInfo.avatarUrl': data.userdata.userInfo.avatarUrl,
        'userdata.userInfo.user_group': data.userdata.userInfo.user_group
      });
      //console.log(ts.data.userdata);
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this;
    if (that.data.dsqarr.length>0){
      for (var i = 0; i< that.data.dsqarr.length; i++){
        clearInterval(i);
      }
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function(){
    var that = this;
    console.log('onHide.....');
    if (that.data.dsqarr.length > 0) {
      for (var i = 0; i < that.data.dsqarr.length; i++) {
        clearInterval(i);
      }
    }
  },

  /**
   * 设置输入消息值
  */
  msgInput: function(e){
    var that = this;
    //var msg = that.data.sendMsg;
    //msg = msg + e.detail.value;
    var valLen = e.detail.value.length;
    var btnActive = that.data.btnActive;
    if (valLen > 0){
      btnActive = true
    }else {
      btnActive = false
    }
    that.setData({
      btnActive: btnActive,
      sendMsg: e.detail.value
    })
  },

  /**
   * 发送消息按钮
   */
  click_sendmsg: function(){
    var that = this
    var tid = that.data.tid
    //检查消息是否为空，
    var msg = that.data.sendMsg
    if(msg == ''){
      util.showmsg('发送消息不能为空')
      return;
    }
    socket.sendSocketMessage('{"action":"user_sendmsg","tid":' + tid + ',"talk_type":2,"data":"' + msg +'"}');//发送文本消息
    that.setData({
      active: true,
      btnActive: false,
      sendMsg: ''
    });//清空文本框
    that.tHeight();
    that.fHeight();
    that.iHeight();
  },

  /**
   * 发送语音消息
   */ 
  // btn_yuyin_clicked: function(){
  //   var that = this;
  //   that.setData({ btnHidden:false, "gameHidden": true, "active": true });
  // },
  move_yuyin_start: function(e){
    var that = this;
    var startX = e.changedTouches[0].clientX;
    var startY = e.changedTouches[0].clientY;
    if (startY < that.data.uiheight - that.data.footHeight) {
      yuyinMove = false;
    }else{
      yuyinMove = true;
    }
    that.setData({ 'yy.isyy': true, 'yy.yyMove': true});
  },
  click_yuyin_start: function(e){
    var that = this;
    var startX = e.changedTouches[0].clientX;
    var startY = e.changedTouches[0].clientY;
    var recorderManager = wx.getRecorderManager();
    var options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
    that.setData({ 'yy.yyLineAni': null, 'yy.yyLineAniTime': 0, 'yy.isyy': true, 'yy.yyMove': true});
    that.ani = new ani(that);
    that.ani.init();
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })

  },

  click_yuyin_end: function(e){
    var that = this;
    var recorderManager = wx.getRecorderManager();
    var startX = e.changedTouches[0].clientX;
    var startY = e.changedTouches[0].clientY;
    var _yyset = 0;
    if (startY < that.data.uiheight - that.data.footHeight) {
      _yyset = 1;
    }
    that.setData({yySet:_yyset});
    clearInterval(that.data.yyLineAniTime);
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res);
      clearInterval(that.data.yyLineAniTime);
      var tempFilePath = res.tempFilePath;
      var timelong = parseInt(res.duration / 1000);
      console.log(tempFilePath + ",timelong:" + timelong);
      that.setData({ 'yy.yySet': 0, 'yy.yyMove': true, 'yy.yyLineAni': null, 'yy.yyLineAniTime': 0, 'yy.isyy': false, 'yy.btnHidden': true});
      if (timelong < 1) {
        return;
      }
      if (that.data.yySet == 1) {
        return;
      }

      var tempFilePath = res.tempFilePath;
      var timelong = parseInt(res.duration / 1000);
      console.log(tempFilePath)
      var key = "talk/addaudio?uid=" + util.getStorageSync('uid') + "&secret=" + util.getStorageSync('secret') + "&tid=" + that.data.tid + "&timelong=" + timelong;
      console.log(util.url(key));
      wx.uploadFile({
        url: util.url(key),
        filePath: tempFilePath,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (res) {
          //console.log(res);
          //发送语音消息
          var data = JSON.parse(res.data);
          console.log(data);
          var fileUrl = data.data;//http超链接声音文件
          console.log(fileUrl)
          //发送语音消息
          //socket.sendSocketMessage('{"action":"user_sendmsg","tid":' + that.data.tid + ',"talk_type":5,"data":"' + fileUrl + '"}');
          socket.sendSocketMessage('{"action":"user_sendmsg","tid":' + that.data.tid + ',"talk_type":5,"data":{"fileUrl":"' + fileUrl + '","timelong":' + timelong + '}}');
        },
        fail: function (res) {
          console.log(res);
        }
      })
    });
  },

  /**
   * 播放声音
   */
  click_player: function(e){
    var that = this;
    var ikey = e.currentTarget.dataset.ikey;
    var playing = [];
    console.log(e)
    var url = e.currentTarget.dataset.url;
    var innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = url;
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      playing[ikey] = true;
      that.setData({ 'yy.playing': playing })
    })
    innerAudioContext.onEnded(()=>{
      playing[ikey] = false;
      that.setData({ 'yy.playing': playing })
    })
    innerAudioContext.onError((res) => {
      playing[ikey] = false;
      that.setData({ 'yy.playing': playing })
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  /**
   * 发送视频
   */
  click_vedio: function(e){
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log(res)
        // that.setData({
        //   src: res.tempFilePath
        // })
      }
    })
  },

  /**/
  click_other_friend: function(e){
    console.log(e.currentTarget.dataset.current)
    var suid = e.currentTarget.dataset.current;
    wx.navigateTo({
      url: '../other/other?suid='+suid,
    })
  },

  /*添加好友*/
  click_add_friend:function(){
    var that = this;
    var uid_friend = that.data.otherdata.uid;
    console.log(uid_friend)
    socket.sendSocketMessage('{"action":"user_add_friend","uid_friend":"' + uid_friend +'"}');
    util.showmsg('好友请求已经发送,请耐心等待对方处理')
  },

  /**
   * （做好游戏展开窗口后，绑定这个函数）点击游戏，邀请好友玩游戏
   * 需要gid参数 data-gid
   * 【再来一局也是这个函数】
   */
  click_game : function(e){
    var that = this;
    that.setData({maskHidden:true,gameHidden: true });
    var gid = e.currentTarget.dataset.current;
    var tid = that.data.tid;
    util.post('game/indexnv', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), gid: gid }, function (data) {
      console.log('游戏数据' + JSON.stringify(data))
      if (data.result == 'error') {
        util.showmsg(data.msg, function () {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        });
        return;
      }
      that.setData({
        gamedata: data.gamedata
      });
      //console.log('游戏数据' + JSON.stringify(that.data.gamedata))
      that.extra.game_invite(tid, gid);
      that.setData({ newtime: true });

    });
    that.tHeight();
    that.fHeight();
    that.iHeight();
  },

  /**
   * 玩完游戏  再来一战
   */
  click_play_again : function(){
    var that = this;
    console.log('再来一战：' + that.data.gid_last_play);
    that.extra.game_invite(that.data.tid, that.data.gid_last_play);
  },

  /**
   * 拒绝游戏
   */
  click_game_refuse : function(e){
    var that = this;
    var gid = e.currentTarget.dataset.gid;
    console.log(gid)
    var tid = that.data.tid;
    var index = e.currentTarget.dataset.id;
    var data = '{"action":"user_sendmsg","tid":' + tid + ',"talk_type":3,"data":{"gid":' + gid + ',"action":"refuse"},"keyindex":"' + index +'"}';
    console.log("请求的数据:" + data);
    socket.sendSocketMessage(data);//拒绝游戏
    that.setData({ btnActive: true})
  },
  /**
   * 接受游戏
   */
  click_game_accept: function (e) {
    var that = this;
    var gid = e.currentTarget.dataset.gid;
    console.log(gid)
    var tid = that.data.tid;
    var index = e.currentTarget.dataset.id;
    var data = '{"action":"user_sendmsg","tid":' + tid + ',"talk_type":3,"data":{"gid":' + gid + ',"action":"accept"},"keyindex":"'+index+'"}';
    console.log("请求的数据:" + data);
    socket.sendSocketMessage(data);//接受游戏
    that.setData({ btnActive: true})
  },

  /**
   * 快捷发送消息
   */
  click_quick_sendmsg : function(e){
    var that = this;
    var msg = e.currentTarget.dataset.current;
    console.log(msg);
    socket.sendSocketMessage('{"action":"user_sendmsg","tid":' + that.data.tid + ',"talk_type":2,"data":"' + msg + '"}');
    that.setData({ active: true })
    that.setData({
      btnActive: false,
      sendMsg: ''
    });//清空文本框
  },

  handleSocketMessage: function (resJson) {
    //console.log('收到socket消息' + JSON.stringify(resJson))
    var ts = this;
    switch (resJson.action) {
      case 'user_receive_msg'://收到消息  聊天信息处理*
        ts.extra.user_receive_msg(resJson);
        ts.iHeight();
        if (ts.data.newtime)
        {
          ts.setData({ newtime: false });
          console.log('收到user_receive_msg消息' + JSON.stringify(resJson))
          //如果是机器人随机等待 2 3 4 5 秒后直接开始游戏
          //ts.data.talk_data.length 倒计时器下标
          ts.extra.rebotAutoRecive(resJson.data.tid, resJson.data.gamedata.gid, resJson.data.time, ts.data.talk_data.length);
        }
        
        var twe = tween.fastGet(Math.random());
        twe.call(function(){
          ts.extra.user_receive_msg(resJson);
        });
        
        twe.wait(300);
        ts.iHeight();
        // twe.call(function(){
        //   ts.iHeight();
        //   console.log(ts.data.mainHeight + ",wait300")
        // });
        return true;
    }
  },
  /**
   * 发送邀请游戏超时
   */
  yqTimeout: function(gid,time){
    var that = this;
    console.log(gid+","+time)

    var _data = '{"action":"user_sendmsg","tid":' + that.data.tid + ',"talk_type":3,"data":{"gid":' + gid + ',"action":"timeout"},"keyindex":"' + time + '"}';
    console.log("请求的数据:" + _data);
    socket.sendSocketMessage(_data);//接受游戏
  },
  /**
   * 添加表情
   */
  addBiaoqing:function(e){
    var that = this
    // var tid = that.data.tid;
    // console.log(e.currentTarget.dataset.item.bqImg)
    // var msg = '__' + e.currentTarget.dataset.item.bqImg+'__';
    // socket.sendSocketMessage('{"action":"user_sendmsg","tid":' + tid + ',"talk_type":2,"data":"' + msg + '"}');//发送文本消息
    var _bq = e.currentTarget.dataset.item.bqImg;
    _bq = _bq.replace('biaoqing/','');
    _bq = _bq.replace('.gif', '');
    _bq = '/'+_bq+':e:/';
    var msg = that.data.sendMsg;
    msg = msg + _bq;
    that.setData({
      btnActive: true,
      sendMsg: msg
    })
  },
  /**
   * 有新消息进来时，点击新消息
   */
  newmsg_clik:function(e){
    console.log(e)
    var new_tid = e.currentTarget.dataset.current;
    wx.navigateTo({ url: '/pages/online/online?tid=' + new_tid })
  }
})