module.exports = function (t) {
  var app = getApp(), util = app.util, socket = app.socket
	return {

		//初始化页面数据，通过接口读取配置数据，设置动画元素位置等等
		init: function () {
			var ts = this;
		},

    /**
     * 收到socket聊天消息处理函数  聊天信息处理*
     */
    user_receive_msg : function(resJson){
      if (t.data.tid == resJson.data.tid){
        //如果是点击接受游戏  状态为9就跳转游戏
        var uid = util.getStorageSync('uid');
        var ts = this;
        if (resJson.data && resJson.data.data && resJson.data.data.forEach){
          resJson.data.data.forEach(function (item, index) {
            if (item.uid == uid && item.talk_game_status == 9) {
              var uid2 = index == 1 ? resJson.data.data[0].uid : resJson.data.data[1].uid;
              // wx.reLaunch({
              //   url: '/pages/index/index',
              // })
              //util.navigateToMiniProgram(resJson.data.gamedata.gid, resJson.data.gamedata.appId, resJson.data.gamedata.path + '?uid=' + uid + '&secret=' + util.getStorageSync('secret') + '&uid2=' + uid2 + '&time=' + resJson.data.time + '&tid=' + resJson.data.tid + '&gid=' + resJson.data.gamedata.gid);
              util.navigateToMiniProgram(resJson.data.gamedata.gid, uid2, resJson.data.time, resJson.data.tid);
              console.log('gid=' + resJson.data.gamedata.gid)
              return;
            }
          });
        }
        
        //resJson.data 形如  {"talk_type": 2, "time": 0, "uid": "发送者uid", "time": "", "data": "任何文字，如果是表情__4__" }
        //就是t.data.talk_data其中的一种消息
        //根据time 确定是把这个消息添加到t.data.talk_data 或者 更新其中的一条消息  如果time相同就更新
        //处理表情信息
        if (resJson.data.talk_type == 2) {
          if (resJson.data.data.indexOf(':e:') > 0) {
            //字符串中有表情
            var _str = resJson.data.data.split("/");
            var _strArr = [];
            for (var i = 0; i < _str.length; i++) {
              if (_str[i] != undefined && _str[i] != ''){
                if (_str[i].indexOf(':e:') > 0) {
                  //表情
                  var _img = 'biaoqing/' + _str[i].replace(':e:', '.gif');
                  var _url = t.data.imagesBaseUrl + _img
                  _strArr[i] = { istrue: 1, data: _url }
                } else {
                  //无表情
                  _strArr[i] = { istrue: 0, data: _str[i] }
                }
              }
            }
            resJson.data.data = _strArr;
            resJson.data.isbq = 1;
          }
        }
        //console.log(resJson.data)
        var ishas = 0;
        t.data.talk_data.forEach(function (item,index){
          if (item.time == resJson.data.time)
          {
            t.data.talk_data[index] = resJson.data;
            ishas = ishas + 1;
          }
        });
        var mainHeight = t.data.mainHeight;
        if (ishas == 0){
          console.log(resJson.data)
          t.data.talk_data[t.data.talk_data.length] = resJson.data;
          if(resJson.data.talk_type == 3){
            mainHeight = mainHeight + 227;
          }else{
            mainHeight = mainHeight + 30;
          }
        }
        console.log(mainHeight+",new");
        t.setData({ "talk_data": t.data.talk_data, mainHeight: mainHeight });
        //console.log(t.data.talk_data)
        //检查5分钟内是否有talk_type=3的消息以显示快捷回复
        var _keyword = [];
        for (var j = 0; j < t.data.talk_data.length; j++) {
          var _vals = t.data.talk_data[j];
          if (_vals.talk_type == 3) {
            var ntime = _vals.nowtime;
            var ctime = _vals.time;
            var _min = parseInt(ntime) - parseInt(ctime);//秒数
            if (_min < 300) {
              //5分钟==300秒
              if (_vals.data[0].uid == uid) {
                if (_vals.data[0].talk_game_status == 1) {
                  _keyword[0] = { text: '服不服？不服来战！' };//对战胜利
                  _keyword[1] = { text: '不要走，决战到天亮。' };
                  _keyword[2] = { text: '孤独求败中！' };
                }
                if (_vals.data[0].talk_game_status == 2) {
                  _keyword[0] = { text: '刚手机卡了！' };//对战失败
                  _keyword[1] = { text: '刚我只用了两层的功力！' };
                  _keyword[2] = { text: '我就静静的看着你装逼！' };
                }
                if (_vals.data[0].talk_game_status == 3) {
                  _keyword[0] = { text: '我现在不方便玩游戏！' };//拒绝
                  _keyword[1] = { text: '我要休息了！' };
                  _keyword[2] = { text: '我要约会去了！' };
                }
                if (_vals.data[0].talk_game_status == 4) {
                  _keyword[0] = { text: '为啥不应战？怕什么啊！' };//已经拒绝
                  _keyword[1] = { text: '不敢？' };
                  _keyword[2] = { text: '不会就来交学费！' };
                }
                if (_vals.data[0].talk_game_status == 5) {
                  _keyword[0] = { text: '刚没注意看消息？' };//未接受
                  _keyword[1] = { text: '再邀请一次？' };
                  _keyword[2] = { text: '刚再忙呢！' };
                }
                if (_vals.data[0].talk_game_status == 6) {
                  _keyword[0] = { text: '忙啊？' };//对方未接受
                  _keyword[1] = { text: '躲起来了？' };
                  _keyword[2] = { text: '上线玩游戏啊！' };
                }
                if (_vals.data[0].talk_game_status == 7) {
                  _keyword[0] = { text: '快点啊？' };//等待回应
                  _keyword[1] = { text: '接受接受！' };
                  _keyword[2] = { text: '快快快！' };
                }
                if (_vals.data[0].talk_game_status == 8) {
                  _keyword[0] = { text: '刚没注意看消息？' };//已经失效
                  _keyword[1] = { text: '再邀请一次？' };
                  _keyword[2] = { text: '刚再忙呢！' };
                }
                if (_vals.data[0].talk_game_status == 9) {
                  _keyword[0] = { text: '我有事先走了！' };//游戏中
                  _keyword[1] = { text: '无聊的游戏，我走了！' };
                  _keyword[2] = { text: '算你赢了！' };
                }
              } else if (_vals.data[1].uid == uid){
                if (_vals.data[1].talk_game_status == 1) {
                  _keyword[0] = { text: '服不服？不服来战！' };//对战胜利
                  _keyword[1] = { text: '不要走，决战到天亮。' };
                  _keyword[2] = { text: '孤独求败中！' };
                }
                if (_vals.data[1].talk_game_status == 2) {
                  _keyword[0] = { text: '刚手机卡了！' };//对战失败
                  _keyword[1] = { text: '刚我只用了两层的功力！' };
                  _keyword[2] = { text: '我就静静的看着你装逼！' };
                }
                if (_vals.data[1].talk_game_status == 3) {
                  _keyword[0] = { text: '我现在不方便玩游戏！' };//拒绝
                  _keyword[1] = { text: '我要休息了！' };
                  _keyword[2] = { text: '我要约会去了！' };
                }
                if (_vals.data[1].talk_game_status == 4) {
                  _keyword[0] = { text: '为啥不应战？怕什么啊！' };//已经拒绝
                  _keyword[1] = { text: '不敢？' };
                  _keyword[2] = { text: '不会就来交学费！' };
                }
                if (_vals.data[1].talk_game_status == 5) {
                  _keyword[0] = { text: '刚没注意看消息？' };//未接受
                  _keyword[1] = { text: '再邀请一次？' };
                  _keyword[2] = { text: '刚再忙呢！' };
                }
                if (_vals.data[1].talk_game_status == 6) {
                  _keyword[0] = { text: '忙啊？' };//对方未接受
                  _keyword[1] = { text: '躲起来了？' };
                  _keyword[2] = { text: '上线玩游戏啊！' };
                }
                if (_vals.data[1].talk_game_status == 7) {
                  _keyword[0] = { text: '快点啊？' };//等待回应
                  _keyword[1] = { text: '接受接受！' };
                  _keyword[2] = { text: '快快快！' };
                }
                if (_vals.data[1].talk_game_status == 8) {
                  _keyword[0] = { text: '刚没注意看消息？' };//已经失效
                  _keyword[1] = { text: '再邀请一次？' };
                  _keyword[2] = { text: '刚再忙呢！' };
                }
                if (_vals.data[1].talk_game_status == 9) {
                  _keyword[0] = { text: '我有事先走了！' };//游戏中
                  _keyword[1] = { text: '无聊的游戏，我走了！' };
                  _keyword[2] = { text: '算你赢了！' };
                }
              }
            }
          }
        }
        if(t.data.nowSystem == 'iOS'){
          var _scrollHeight = 430;
          if (_keyword.length > 0) {
            _scrollHeight = 410;
          }
        }else{
          var _scrollHeight = 400;
          if (_keyword.length > 0) {
            _scrollHeight = 380;
          }
        }
        t.setData({ 'keyWord': _keyword, 'scrollHeight': _scrollHeight });
        ts.handle_accept_timeout();
      }else{
        //util.showmsg('收到新消息');
        //根据tid查找该新消是否为自己
        util.post('talk/newmsgself', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), tid: resJson.data.tid}, function (resJson) {
          console.log(JSON.stringify(resJson))
          if (resJson.data == 1){
            //该新消息是自己的,显示提示框
            t.setData({
              new_msgtid: resJson.data.tid,
              new_msgshow:false
            });
            setTimeout(function () {
              t.setData({
                new_msgtid: 0,
                new_msgshow: true
              });
            },3000);//3秒钟后关闭提示框
          }
        });
      }
    },

    /**
     * 检查聊天信息是否有等待接受的信息，有就添加计时器，时间到就访问超时接口 聊天信息处理*
     */
    handle_accept_timeout: function (){
      //更新t.data.talk_data,
      //超时接口 talk/talkaccepttimeout
      var uid = util.getStorageSync('uid');
      
      t.data.talk_data.forEach(function (item, index) {
        if (item.talk_type == 3){
          var arr = item.data;
          arr.forEach(function (ite,ind){
            if (ite.uid == uid && ite.talk_game_status == 7){
              //等待接受
              var ntime = parseInt(item.nowtime);//当前时间截
              var ctime = parseInt(item.time);//创建数据的时间截
              var tmes = ntime - ctime;
              tmes = parseInt(tmes);//进行数字转换
              console.log(ntime+'-'+ctime+'='+tmes)
              console.log(util.timeformat(ntime*1000)+","+util.timeformat(ctime*1000))
              if(tmes>60){
                //清楚倒计时
                util.intervalclose(t, index)
                //执行timeout
                // util.post('talk/talkaccepttimeout', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), tid: t.data.tid, time: item.time}, function (resJson) {
                //   console.log(JSON.stringify(resJson) + ",tid:" + t.data.tid + ',time:' + item.time)
                // });
                var _data = '{"action":"user_sendmsg","tid":' + t.data.tid + ',"talk_type":3,"data":{"gid":' + item.gamedata.gid + ',"action":"timeout"},"keyindex":"' + item.time + '"}';
                console.log("请求的数据:" + _data);
                socket.sendSocketMessage(_data);//接受游戏
              }else{
                if (t.data.insertTime[index] > 0){
                  //已经有倒计时
                }else{
                  if (tmes > 0){
                    //清楚倒计时
                    util.intervalclose(t, index)
                    //倒计时开始
                    //剩余秒数
                    var _sec = 60 - tmes;
                    console.log(_sec)
                    util.interval(_sec, t, index, item.gamedata.gid, item.time)
                  }else{
                    util.interval(60, t, index, item.gamedata.gid, item.time)
                  }
                }
              }
            }else{
              if (ite.uid == uid && ite.talk_game_status != 5){
                //如果有倒计时清楚倒计时
                if (t.data.dsqarr.length > 0) {
                  for (var i = 0; i < t.data.dsqarr.length; i++) {
                    if (t.data.dsqarr[i] == index){
                      clearInterval(i);
                    }
                  }
                }
              }
            }
          })
        }
      });
    },

    game_invite : function(tid, gid){
      var data = '{"action":"user_sendmsg","tid":' + tid + ',"talk_type":3,"data":{"gid":' + gid + ',"action":"new"},"keyindex":"00000"}';
      socket.sendSocketMessage(data);//邀请游戏
    },
    //聊天详情初始封装
    talk_detail: function (_this, time, resJson){
      var uid = util.getStorageSync('uid');
      var kj = 0;
      var _keyword = [];
      var that = _this;
      var mainHeight = 0;
      for (var j = 0; j < resJson.talk_data.talk_data.length; j++) {
        var _vals = resJson.talk_data.talk_data[j];
        //检查表情
        if (_vals.talk_type == 2) {
          if (_vals.data.indexOf(':e:') > 0) {
            //字符串中有表情
            var _str = _vals.data.split("/");
            var _strArr = [];
            for (var i = 0; i < _str.length; i++) {
              if (_str[i] != undefined && _str[i] != '') {
                if (_str[i].indexOf(':e:') > 0) {
                  //表情
                  var _img = 'biaoqing/' + _str[i].replace(':e:', '.gif');
                  var _url = that.data.imagesBaseUrl + _img
                  _strArr[i] = { istrue: 1, data: _url }
                } else {
                  //无表情
                  _strArr[i] = { istrue: 0, data: _str[i] }
                }
              }
            }
            resJson.talk_data.talk_data[j].data = _strArr;
            resJson.talk_data.talk_data[j].isbq = 1;
          }
        }
        //检查5分钟内是否有talk_type=3的消息以显示快捷回复
        if (_vals.talk_type == 3) {
          var ntime = _vals.nowtime;
          var ctime = _vals.time;
          var _min = parseInt(ntime) - parseInt(ctime);//秒数
          if (_min < 300) {
            //5分钟==300秒
            if (_vals.data[0].uid == uid) {
              if (_vals.data[0].talk_game_status == 1) {
                _keyword[0] = { text: '服不服？不服来战！' };//对战胜利
                _keyword[1] = { text: '不要走，决战到天亮。' };
                _keyword[2] = { text: '孤独求败中！' };
              }
              if (_vals.data[0].talk_game_status == 2) {
                _keyword[0] = { text: '刚手机卡了！' };//对战失败
                _keyword[1] = { text: '刚我只用了两层的功力！' };
                _keyword[2] = { text: '我就静静的看着你装逼！' };
              }
              if (_vals.data[0].talk_game_status == 3) {
                _keyword[0] = { text: '我现在不方便玩游戏！' };//拒绝
                _keyword[1] = { text: '我要休息了！' };
                _keyword[2] = { text: '我要约会去了！' };
              }
              if (_vals.data[0].talk_game_status == 4) {
                _keyword[0] = { text: '为啥不应战？怕什么啊！' };//已经拒绝
                _keyword[1] = { text: '不敢？' };
                _keyword[2] = { text: '不会就来交学费！' };
              }
              if (_vals.data[0].talk_game_status == 5) {
                _keyword[0] = { text: '刚没注意看消息？' };//未接受
                _keyword[1] = { text: '再邀请一次？' };
                _keyword[2] = { text: '刚再忙呢！' };
              }
              if (_vals.data[0].talk_game_status == 6) {
                _keyword[0] = { text: '忙啊？' };//对方未接受
                _keyword[1] = { text: '躲起来了？' };
                _keyword[2] = { text: '上线玩游戏啊！' };
              }
              if (_vals.data[0].talk_game_status == 7) {
                _keyword[0] = { text: '快点啊？' };//等待回应
                _keyword[1] = { text: '接受接受！' };
                _keyword[2] = { text: '快快快！' };
              }
              if (_vals.data[0].talk_game_status == 8) {
                _keyword[0] = { text: '刚没注意看消息？' };//已经失效
                _keyword[1] = { text: '再邀请一次？' };
                _keyword[2] = { text: '刚再忙呢！' };
              }
              if (_vals.data[0].talk_game_status == 9) {
                _keyword[0] = { text: '我有事先走了！' };//游戏中
                _keyword[1] = { text: '无聊的游戏，我走了！' };
                _keyword[2] = { text: '算你赢了！' };
              }
            } else if (_vals.data[1].uid == uid) {
              if (_vals.data[1].talk_game_status == 1) {
                _keyword[0] = { text: '服不服？不服来战！' };//对战胜利
                _keyword[1] = { text: '不要走，决战到天亮。' };
                _keyword[2] = { text: '孤独求败中！' };
              }
              if (_vals.data[1].talk_game_status == 2) {
                _keyword[0] = { text: '刚手机卡了！' };//对战失败
                _keyword[1] = { text: '刚我只用了两层的功力！' };
                _keyword[2] = { text: '我就静静的看着你装逼！' };
              }
              if (_vals.data[1].talk_game_status == 3) {
                _keyword[0] = { text: '我现在不方便玩游戏！' };//拒绝
                _keyword[1] = { text: '我要休息了！' };
                _keyword[2] = { text: '我要约会去了！' };
              }
              if (_vals.data[1].talk_game_status == 4) {
                _keyword[0] = { text: '为啥不应战？怕什么啊！' };//已经拒绝
                _keyword[1] = { text: '不敢？' };
                _keyword[2] = { text: '不会就来交学费！' };
              }
              if (_vals.data[1].talk_game_status == 5) {
                _keyword[0] = { text: '刚没注意看消息？' };//未接受
                _keyword[1] = { text: '再邀请一次？' };
                _keyword[2] = { text: '刚再忙呢！' };
              }
              if (_vals.data[1].talk_game_status == 6) {
                _keyword[0] = { text: '忙啊？' };//对方未接受
                _keyword[1] = { text: '躲起来了？' };
                _keyword[2] = { text: '上线玩游戏啊！' };
              }
              if (_vals.data[1].talk_game_status == 7) {
                _keyword[0] = { text: '快点啊？' };//等待回应
                _keyword[1] = { text: '接受接受！' };
                _keyword[2] = { text: '快快快！' };
              }
              if (_vals.data[1].talk_game_status == 8) {
                _keyword[0] = { text: '刚没注意看消息？' };//已经失效
                _keyword[1] = { text: '再邀请一次？' };
                _keyword[2] = { text: '刚再忙呢！' };
              }
              if (_vals.data[1].talk_game_status == 9) {
                _keyword[0] = { text: '我有事先走了！' };//游戏中
                _keyword[1] = { text: '无聊的游戏，我走了！' };
                _keyword[2] = { text: '算你赢了！' };
              }
            }
          }
        }
      }
      if (t.data.nowSystem == 'iOS') {
        var _scrollHeight = 430;
        if (_keyword.length > 0) {
          _scrollHeight = 410;
        }
      } else {
        var _scrollHeight = 400;
        if (_keyword.length > 0) {
          _scrollHeight = 380;
        }
      }
      that.setData({
        'keyWord': _keyword,
        'talk_data': resJson.talk_data.talk_data,
        'userdata': resJson.talk_data.userdata,
        'otherdata': resJson.talk_data.otherdata,
        'addFriend': resJson.talk_data.ifHide,
        'scrollHeight': _scrollHeight
      });
      //console.log(resJson.talk_data);
    },

    /**
     * 如果是机器人
     */
    rebotAutoRecive : function(tid,gid,time,dsqindex){
      //console.log('比赛机器人自动接受函数');
      if (Number(t.data.otherdata.user_group) == 1) return;
      var wait = Math.floor(Math.random() * 5) + 2;
      console.log('机器人wait=' + wait)
      setTimeout(function(){
        if (t.data.dsqarr.length > 0) {
          for (var i = 0; i < t.data.dsqarr.length; i++) {
            if (t.data.dsqarr[i] == dsqindex-1){
              clearInterval(i);
            }
          }
        }
        clearInterval(t.data.dsqarr[dsqindex-1]);
        t.data.insertTime.splice(dsqindex-1, 1);
        t.setData({insertTime:t.data.insertTime});
        util.post('talk/rebotautoaccept', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'),tid:tid,gid:gid,time:time}, function(resJson){
          console.log('talk/rebotautoaccept success');
          console.log(resJson);
          //wx.reLaunch({url: 'pages/index/index'})
          //util.navigateToMiniProgram(t.data.gamedata.gid, t.data.gamedata.appId, t.data.gamedata.path + '?uid=' + util.getStorageSync('uid') + '&secret=' + util.getStorageSync('secret') + '&uid2=' + resJson.data.user_vs.uid + '&time=' + resJson.data.user_vs.time + '&tid=' + resJson.data.user_vs.tid + '&gid=' + t.data.gamedata.gid);
          util.navigateToMiniProgram(t.data.gamedata.gid, resJson.data.user_vs.uid, resJson.data.user_vs.time, resJson.data.user_vs.tid);
        });
      }, wait * 1000);
    }

	}
}