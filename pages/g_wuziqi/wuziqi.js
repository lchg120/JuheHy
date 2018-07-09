//index.js
var app = getApp(), util = app.util, glb = app.global, socket = app.socket, extra = require('extra'), tween = app.tween, ani = require('ani.js'), winner = require('winner'), oldx = 0, oldy = 0, moldx = -1, moldy = -1;
Page({
  data: {
    imagesBaseUrl: util.url_images(),
    gameid: 3,
    //左侧显示的是自己
    leftview: {
      userinfo: {
        uid: 7,
        avatar: '',
        name: '我的名字',
      },
    },
    //右侧显示的是对手
    rightview: {
      userinfo: {
        uid: 0,
        avatar: 'http://juhe_cdn.shouyo.com/upload/image/2018/06/05/152816345042939294795212601277.jpg',
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
    topHeight: 168,
    /*游戏时间*/
    gameTimeWidth: 100,
    gameTime: 40,
    timeLimit: 40,//答题限制时间

    /*五子棋数据start*/
    confIsdisabled: false,
    uiwidth: wx.getSystemInfoSync().windowWidth,
    uiheight: wx.getSystemInfoSync().windowHeight,
    gzwh: parseInt((wx.getSystemInfoSync().windowWidth - 10) / 13),
    draw: [], //棋盘数据
    drawMy: [], //自己落子数据
    drawVs: [], //对手落子数据
    xyArray: [], //棋盘坐标系
    succXY: [], //胜利坐标
    everywLen: 0, //格子宽度
    everyhLen: 0, //格子高度
    movepointImg: { left: 174, top: 163.875, color: 'white', hidden: true },
    movepointUse: { left: 174, top: 163.875, color: 'white', hidden: true },
    huiheMy: true,
    huiheVs: false,
    colorMy: 'white',
    colorVs: 'black',
    userHuihe: true,
    otherHuihe: false,
    tipsHide: true, //提示窗口显示隐藏
    btnState: true //移动下子状态
    /*五子棋数据end*/
	},

	onLoad: function (options) {
    var that = this;
    //util.playsound('matching.mp3');

    that.ani = new ani(that);
    that.ani.init();

    that.extra = new extra(that);

    //计算顶部高度
    var query = wx.createSelectorQuery();
    query.select('.user-vs').boundingClientRect(function (res) {
      that.setData({
        topHeight: res.height
      })
    }).exec();
    var equery = wx.createSelectorQuery();
    equery.select('.td').boundingClientRect(function (res) {
      //console.log(res)
      that.setData({
        everywLen: res.width,
        everyhLen: res.height
      });
      //计算棋盘坐标
      for (var i = 0; i < 14; i++) {
        var arrXY = [];
        for (var j = 0; j < 14; j++) {
          arrXY.push({
            y: i * res.height,
            x: j * res.width,
            pointX: j,
            pointY: i
          });
        }
        that.data.xyArray.push(arrXY);
      }
      that.setData({ xyArray: that.data.xyArray });
    }).exec();

    util.post('global/getuserinfo', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid2: options.uid2 }, function (resJson) {
      //console.log(resJson);
      that.setData({
        'leftview.userinfo.uid': util.getStorageSync('uid'),
        'leftview.userinfo.avatar': resJson.data.userdata.avatarUrl,
        'leftview.userinfo.name': resJson.data.userdata.nickName,
        'rightview.userinfo.uid': options.uid2,
        'rightview.userinfo.avatar': resJson.data.otherdata.avatarUrl,
        'rightview.userinfo.name': resJson.data.otherdata.nickName
      });
    })

    setTimeout(function () {
      app.socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":3,"connmsg":{"action":"game_ready","uidvs":' + options.uid2 + ',"tid":' + options.tid + ',"time":' + options.time + '}}');
    }, 1000);

	},
	onReady: function() {
		var that = this;
	},
  onUnload: function () {
    socket.sendSocketMessage('{"action":"glb_userstatus_quit"}');
  },


  /*提示按钮*/
  click_tips_show: function () {
    var that = this;
    that.setData({ "tipsHide": false })
    console.log(1)
  },
  click_tips_hide: function () {
    var that = this;
    that.setData({ "tipsHide": true })
    console.log(1)
  },


  //触碰棋盘开始
  touchStart: function (e) {
    var that = this;
    if (that.data.huiheMy == true && moldx < 0) {
      //console.log(JSON.stringify(e.touches[0]));
      var pageX = e.touches[0].pageX;
      var pageY = e.touches[0].pageY - that.data.topHeight;
      oldx = pageX;
      oldy = pageY;
      var movePoint = { pageX: pageX, pageY: pageY };
      var mvP = that.movePoint(movePoint);
      //console.log(mvP);
      moldx = mvP.x - 0.8;
      moldy = mvP.y - 0.8;
      var color = '';
      color = that.data.colorMy;
      mvP.color = color;
      that.setData({
        "userHuihe": true,
        "otherHuihe": false,
        "movepointImg.left": mvP.x - 0.8,
        "movepointImg.top": mvP.y - 0.8,
        "movepointImg.color": color,
        "movepointImg.hidden": false,
        "movepointImg.xy": mvP,
        "btnState": false
      });
      //console.log("start"+JSON.stringify(that.data.movepointImg))
    }
  },

  changeTouchMove: function (e) {
    var that = this;
    if (that.data.huiheMy == true){
      var pageX = e.touches[0].pageX;
      var pageY = e.touches[0].pageY - that.data.topHeight;// - that.data.everyhLen * 3;
      if (Math.abs(oldx - pageX) > Math.abs(oldy - pageY)) {//左右移动
        if (Math.abs(oldx - pageX) > that.data.everywLen || Math.abs(oldy - pageY) > that.data.everyhLen){
          var movePoint = { pageX: pageX, pageY: moldy};
          var mvP = that.movePoint(movePoint);
          if(mvP){
            var color = '';
            color = that.data.colorMy;
            mvP.color = color;
            that.setData({
              "movepointImg.left": mvP.x - 0.8,
              "movepointImg.top": mvP.y - 0.8,
              "movepointImg.color": color,
              "movepointImg.hidden": false,
              "movepointImg.xy": mvP,
              "btnState": false
            });
            oldx = pageX;
            oldy = pageY;
          }
        }
      } else if (Math.abs(oldx - pageX) < Math.abs(oldy - pageY)) {//上下移
        if (Math.abs(oldx - pageX) > that.data.everywLen || Math.abs(oldy - pageY) > that.data.everyhLen) {
          var movePoint = { pageX: moldx, pageY: pageY };
          var mvP = that.movePoint(movePoint);
          if(mvP){
            var color = '';
            color = that.data.colorMy;
            mvP.color = color;
            that.setData({
              "movepointImg.left": mvP.x - 0.8,
              "movepointImg.top": mvP.y - 0.8,
              "movepointImg.color": color,
              "movepointImg.hidden": false,
              "movepointImg.xy": mvP,
              "btnState": false
            });
            oldx = pageX;
            oldy = pageY;
          }
        }
      }
      console.log("oldx:"+oldx,"oldy:"+oldy);
    }
  },

  movePoint: function (po) {
    var that = this;
    var everywLen = that.data.everywLen;
    var everyhLen = that.data.everyhLen;
    for (var i = 0; i < 14; i++) {
      for (var j = 0; j < that.data.xyArray[i].length; j++) {
        if (Math.abs(that.data.xyArray[i][j].x - po.pageX) < everywLen / 2 && Math.abs(that.data.xyArray[i][j].y - po.pageY) < everyhLen / 2) {
          // 将棋盘精确坐标保存到当前持棋方数组
          return that.data.xyArray[i][j];
          break;
        }
      }
    }
  },

  //触碰棋盘结束
  touchEnd: function (e) {
    var that = this;
    if (that.data.huiheMy == true) {
      moldx = that.data.movepointImg.left;
      moldy = that.data.movepointImg.top;
      that.setData({ "confIsdisabled": false, "btnState": true});
    }
  },

  //确定落子
  confirm: function () {
    var that = this;
    if (that.data.huiheMy == true){
      moldx = -1;
      moldy = -1;
      var draw = that.data.movepointImg.xy;
      //console.log(draw);
      that.data.draw.push(draw);
      that.data.drawMy.push(draw);
      that.setData({
        "draw": that.data.draw,
        "drawMy": that.data.drawMy,
        "movepointImg.left": 0,//-30,
        "movepointImg.top": 0,
        "movepointImg.color": '',
        "movepointImg.hidden": true,
        "confIsdisabled": true,
        "userHuihe": false,
        "otherHuihe": true
      });
      //
      // if (that.data.drawMy.length >= 5 && winner.checkWinner(that,that.data.drawMy)) {
      //   that.lxPoint(that.data.succXY);
      //   util.showmsg("小程序判断输赢: 己方胜利");
      // }

      //新下子坐标
      var xy = draw.pointX + "," + draw.pointY;
      app.socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":3,"connmsg":{"action":"game_answer","gameid":' + that.data.gameid + ',"xy":"' + xy + '"}}');
    }
  },

  //清除悔棋棋子
  clearHuiqi: function (po) {
    var that = this;
    var len = that.data.draw.length;
    for(var i=0;i<len;i++){
      if (that.data.draw[i].pointX == po.x && that.data.draw[i].pointY == po.y){
        //清除
        that.data.draw.splice(i,1);
        that.setData({draw:that.data.draw});
        break;
      }
    }
  },

  /*认输*/
  click_back: function(){
    wx.reLaunch({
      url: '../index/index'
    })
  },


	/**
	 * 悔棋点击函数
	 */
	changeUndo : function(){
		var that = this;
		util.showmsg('确定要请求悔棋吗？', function(){
      socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":3,"connmsg":{"action":"game_huiqi_request","gameid":' + that.data.gameid + ',"uid":' + util.getStorageSync('uid') + '}}');
		});
	},

  //根据坐标查找位置
  checkPoint: function (po) {
    var that = this;
    var everywLen = that.data.everywLen;
    var everyhLen = that.data.everyhLen;
    for (var i = 0; i < 14; i++) {
      for (var j = 0; j < that.data.xyArray[i].length; j++) {
        if (that.data.xyArray[i][j].pointX == po.x && that.data.xyArray[i][j].pointY == po.y) {
          // 将棋盘精确坐标保存到当前持棋方数组
          that.data.draw.push(that.data.xyArray[i][j]);
          that.data.draw[that.data.draw.length-1].color = po.color;
          that.data.drawVs.push(that.data.draw[that.data.draw.length - 1]);
          that.setData({draw:that.data.draw,drawVs:that.data.drawVs});
          break;
        }
      }
    }
    // if (that.data.drawVs.length >= 5 && winner.checkWinner(that,that.data.drawVs)) {
    //   that.lxPoint(that.data.succXY);
    //   util.showmsg("小程序判断输赢: 对手胜利");
    // }
  },

  //把胜利的五个子连起来
  lxPoint: function (po) {
    var that = this;
    var draw = that.data.draw;
    for(var j=0;j<po.length;j++){
      for(var i=0;i<draw.length;i++){
        if (po[j].x == draw[i].pointX && po[j].y == draw[i].pointY){
          draw[i].color = 'red';
        }
      }
    }
    that.setData({draw:draw});
  },

	handleSocketMessage: function (resJson) {
    //console.log('受到socket消息：' + JSON.stringify(resJson));
		var _this = this;
    var uid = Number(util.getStorageSync('uid'));
    var color = ['','black','white'];
		switch (resJson.action) {
			case 'game_begin'://游戏开始
				var that = this;
				that.data.timeLimit = resJson.timeLimit; 
				that.data.gameid = resJson.gameid;
				//888* resJson.cur_play_uid 当前回合uid，resJson.qi_type 黑白分配数组形如[[uid=>1, qi_type=>1],[uid=>1, qi_type=>1]] 1黑 2白
        if (uid == resJson.cur_play_uid) {
          _this.setData({
            huiheMy: true,
            huiheVs: false,
            userHuihe: true,
            otherHuihe: false
          });
        } else {
          _this.setData({
            huiheMy: false,
            huiheVs: true,
            userHuihe: false,
            otherHuihe: true
          });
        }
        if (uid == resJson.qi_type[0].uid){
          _this.setData({
            colorMy: color[resJson.qi_type[0].qi_type],
            colorVs: color[resJson.qi_type[1].qi_type]
          });
        } else {
          _this.setData({
            colorMy: color[resJson.qi_type[1].qi_type],
            colorVs: color[resJson.qi_type[0].qi_type]
          });
        }
        console.log("my:" + _this.data.colorMy + ",vs:" + _this.data.colorVs);
				//获取匹配用户，匹配到之后
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
			case 'game_ticker'://答题记时
				//console.log('连连看答题记时 resJson.ticker=' + resJson.ticker);
				var that = this;
				if (resJson.ticker < 0) resJson.ticker = 0;
				if (that.extra.times) that.extra.times(resJson.ticker);
				return true;
      case 'game_answer_self':
        console.log("自己的所有落子:" + JSON.stringify(_this.data.drawMy));
        console.log('收到自己数据：' + JSON.stringify(resJson));
        //resJson.xy 新下子坐标， qipan_status 下子的黑或白，game_status 1进行中，2胜利，3失败，success_xy 连成5个的棋坐标
        console.log('棋盘数据：' + JSON.stringify(_this.data.draw));
        if (resJson.data.game_status != 1) {
          //显示连成功的5个子动画
          _this.lxPoint(resJson.data.success_xy);
        }
        return true;
      case 'game_answer_vs'://对手的答题数据
				var that = this;
        console.log("对手的所有落子:" + JSON.stringify(_this.data.drawVs));
        console.log('收到对手数据：' + JSON.stringify(resJson));
				//resJson.xy 新下子坐标， qipan_status 下子的黑或白，game_status 1进行中，2胜利，3失败，success_xy 连成5个的棋坐标
        //console.log("对手已答题:" + resJson.data.xy);
        console.log('棋盘数据：' + JSON.stringify(_this.data.draw));
        var _xy = resJson.data.xy;
        if (_xy != undefined && _xy != ''){
          _xy = _xy.split(',');
          var xy = { x: _xy[0], y: _xy[1], color: _this.data.colorVs};
          //console.log(xy);
          _this.checkPoint(xy);
        }
        if (resJson.data.game_status != 1)
				{
					//显示连成功的5个子动画
            _this.lxPoint(resJson.data.success_xy);
				}
				return true;
			case 'game_huihe'://更换回合
				//resJson.cur_play_uid 当前回合的uid
        moldx = -1;
        moldy = -1;
        _this.setData({
          "movepointImg.left": -30,
          "movepointImg.top": 0,
          "movepointImg.color": '',
          "movepointImg.hidden": true
        });
        if (uid == resJson.cur_play_uid){
          _this.setData({
            huiheMy:true,
            huiheVs:false,
            userHuihe: true,
            otherHuihe: false
          });
        } else {
          _this.setData({
            huiheMy: false,
            huiheVs: true,
            userHuihe: false,
            otherHuihe: true
          });
        }
				return true;
			case 'game_huiqi_request'://悔棋请求
				//resJson.uid 悔棋者uid
				util.showmsg('对手请求悔棋，是否允许？', function(){
					socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":3,"connmsg":{"action":"game_huiqi_agree","gameid":' + _this.data.gameid + ',"uid":' + resJson.uid + '}}');
				});
				return true;
      case 'game_huiqi_suc':
        //xy:1,1
        var _xy = resJson.xy;
        if (_xy){
          _xy = _xy.split(',');
          var xy = { x: _xy[0], y: _xy[1] };
          _this.clearHuiqi(xy);
        }
        return true;
			case 'game_end'://游戏胜利失败
				//console.log('lianliankan.js game_end:' + util.getOption('tid') + '---' + util.getOption('time'));
				var that = this;
				setTimeout(function(){
          wx.redirectTo({
            url: '/pages/online/online?tid=' + util.getOption('tid') + '&time=' + util.getOption('time') + "&point=" + encodeURIComponent(JSON.stringify(resJson.point)),
          });
          return true;
        },1000);
		}
		return false;
	},

})
