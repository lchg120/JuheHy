var util = require('./util.js');
//socket.sendSocketMessage('{"action":"game_ready","login_secret":"' + util.getStorageSync('secret') + '"}');
var g = {
  socketOpen: false,//socket是否已经打开
  socketOpening: false,//是否正在连接socket
  socketMsgQueue: [],
  lastMsg: '',
  lastSendTime: 0,
  //lastSendTimer: null,//心跳包计时器
  uid_: '',
  secret_: '',
  gameid_: '',
  //heart_check:false,
  openSocket: function (uid, secret, gameid) {
    var _this = this;
    if (_this.socketOpen || _this.socketOpening) {
      return;
    }
    _this.uid_ = uid;
    _this.secret_ = secret;
    _this.gameid_ = gameid ? gameid:-1;
    _this.socketOpening = true;
    wx.connectSocket({
      url: util.socketAddr[util.runMode],
      header: {
        'content-type': 'application/json'
      },
      method: "CONNECT",
      success: function () {
        //console.log('connectSocket success');
      },
      fail: function () {
        _this.initConn();
        _this.openSocket(_this.uid_, _this.secret_, _this.gameid_);
        console.log('openSocket wx.connectSocket fail');
      }
    });
    wx.onSocketMessage(function (res) {
      var resJson = null;
      try {
        resJson = JSON.parse(res.data);
        //console.log(JSON.stringify(resJson))
      } catch (exception) {
        wx.showModal({ title: '错误信息', content: 'websocket返回数据出错', showCancel: false });
        return;
      }

      var page = getCurrentPages();
      if (page.length > 0) {
        if (page[page.length - 1].handleSocketMessage) {
          if (page[page.length - 1].handleSocketMessage(resJson)) {
            return;
          }
        }
      }

      if (_this.handleGlobalMessage(resJson)) {
        return;
      }
      //wx.showModal({title: '未知消息',content: JSON.stringify(resJson),showCancel : false});
      //console.log('未知socket消息：' + JSON.stringify(resJson));
    });
    wx.onSocketOpen(function (res) {
      _this.socketOpen = true;
      _this.socketOpening = false;
      _this.sendSocketMessage('{"action":"glb_join_room","openid":"' + _this.uid_ + '","login_secret":"' + _this.secret_ + '","gameid":' + _this.gameid_ + '}');
      //_this.sendSocketMessage('{"action":"game_match_lv","lv":3,"login_secret":"' + secret + '"}');
      for (var i = 0; i < _this.socketMsgQueue.length; i++) {
        _this.sendSocketMessage(_this.socketMsgQueue[i])
      }
      _this.socketMsgQueue = [];
      // if (_this.lastSendTimer) {
      //   clearInterval(_this.lastSendTimer);
      //   _this.lastSendTimer = null;
      // }
      // _this.lastSendTimer = setInterval(function () {
      //   var curDate = new Date();
      //   if ((curDate.getTime() - _this.lastSendTime) >= 30000) {
      //     _this.sendSocketMessage('{"action":"glb_heart_check"}');
      //     _this.heart_check = false;
      //     setTimeout(function(){
      //       if (_this.heart_check) return;
      //       _this.close();
      //     }, 50000);
      //   }
      // }, 30000);
    });

    wx.onSocketError(function (res) {
      // if (_this.lastSendTimer) {
      //   clearInterval(_this.lastSendTimer);
      //   _this.lastSendTimer = null;
      // }
      //_this.close();
      console.log('socket close socket.js 95');
    });
    wx.onSocketClose(function (res) {
      // if (_this.lastSendTimer) {
      //   clearInterval(_this.lastSendTimer);
      //   _this.lastSendTimer = null;
      // }
      _this.socketOpen = false;
      _this.socketOpening = false;
      _this.openSocket(_this.uid_, _this.secret_, _this.gameid_);
      console.log('openSocket wx.onSocketClose');
    });

    //3秒后检查socket是否还是连上
    setTimeout(function () {
      if (!_this.socketOpen) {
        _this.close();
        console.log('socket close socket.js 112');
      }
    }, 3000);
    //
  },
  initConn: function () {
    var _this = this;
    _this.socketOpen = false;
    _this.socketOpening = false;
  },
  /**
   * 调用close后  无法再连（除非小调用opensocket） 也不会自动连
   */
  close: function () {
    var _this = this;
    // if (_this.lastSendTimer) {
    //   clearInterval(_this.lastSendTimer);
    //   _this.lastSendTimer = null;
    // }
    if (_this.socketOpen)
    {
      wx.closeSocket({
        fail: function () {
          _this.initConn();
          _this.openSocket(_this.uid_, _this.secret_, _this.gameid_);
          console.log('openSocket wx.closeSocket fail');
        }
      });
    }
    _this.socketOpen = false;
    _this.socketOpening = false;
  },
  sendSocketMessage: function (msg) {
    console.log('sendSocketMessage :' + msg);
    //修复多平台连接socket问题
    var msgJson = JSON.parse(msg);
    msgJson['p'] = 'cycd';
    msg = JSON.stringify(msgJson);

    var _this = this;
    if (this.socketOpen) {
      wx.sendSocketMessage({
        data: msg,
        fail: function () {
          console.log('socket发送失败重新处理');
          _this.socketMsgQueue.push(msg);
          _this.close();
          console.log('socket close socket.js 159');
        }
      })
    } else {
      _this.socketMsgQueue.push(msg);
      _this.close();
      console.log('socket close socket.js 165');
      console.log('openSocket wx.sendSocketMessag socketOpen false');
    }
  },
  /*
   * @returns {true : 已经处理,false : 未处理} 
   */
  handleGlobalMessage: function (resJson) {
    var _this = this;
    var date = new Date();
    this.lastSendTime = date.getTime();
    switch (resJson.action) {
      case 'user_receive_msg'://收到消息  聊天信息处理*
        var page = getCurrentPages();
        var t = page[0];
        if (page.length > 0) {
          t = page[page.length - 1];
        }
        //根据tid查找该新消是否为自己
        util.post('talk/newmsgself', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), tid: resJson.data.tid }, function (rJson) {
          if (rJson.data == 1) {
            //该新消息是自己的,显示提示框
            t.setData({
              new_msgtid: resJson.data.tid,
              new_msgshow: false
            });
            setTimeout(function () {
              t.setData({
                new_msgtid: 0,
                new_msgshow: true
              });
            }, 3000);//3秒钟后关闭提示框
          }
        });
        return true;
      case 'glb_heart_check':
        //console.log('收到心跳包');
        //_this.heart_check = true;
        return true;
      case 'glb_status_error_self'://状态不正确
        wx.showModal({
          title: '提示',
          content: resJson.msg,
          success: function (res) {
            if (res.confirm) {
              _this.sendSocketMessage('{"action":"glb_userstatus_init,"login_secret":"' + util.getStorageSync('secret') + '"}');
            }
          }
        });
        return true;
      case 'glb_error'://显示错误信息
        if (resJson.msg.length == 0) {
          return;
        }
        wx.showModal({
          title: '错误信息',
          content: resJson.msg,
          showCancel: false,
          success: function (res) {
            if (!resJson.code || resJson.code != 1) wx.reLaunch({ url: '../index/index' });//不存在code或code不等于1才跳转
          }
        });
        return true;
      case 'glb_userstatus_init'://初始化用户状态回掉
        if (resJson.result == 'success') {
          _this.sendSocketMessage(_this.lastMsg);
        }
        return true;
      case 'user_add_friend'://添加好友申请
        util.showmsg('有人请求添加您为好友，是否现在处理？', function () {
          wx.navigateTo({
            url: '/pages/friend/friend',
          })
        });
        return true;
      case 'glb_game_accept'://接受游戏，可以开始对战
        util.showmsg('收到glb_game_accept，开始跳转到游戏');
        //util.navigateToMiniProgram(t.data.gamedata.appId, t.data.gamedata.path + '?content=11111');
        return true;
    }
    return false;
  },
  //    handleMessage : function (func){
  //        var _this = this;
  //        wx.onSocketMessage(function(res) {
  //            console.log('服务器收到：' + res.data);
  //            var resJson = JSON.parse(res.data);
  //            if(_this.handleGlobalMessage(resJson))
  //            {
  //                return;
  //            }
  //            func(resJson);
  ////            var resJson = JSON.parse(res);
  ////            switch (resJson.action) {
  ////                case 'jfsos':
  ////                    console.log('fjasodi');
  ////                    break;
  ////                    
  ////                default:
  ////                    
  ////                    break;
  ////            }
  //        });
  //    }
}

module.exports = g