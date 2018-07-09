var g = {
	ver: "1.1",
  runMode: "test",
	domain: {
		dev: "http://localhost/juhe_php/public/",//本地
    pro: "https://www.shouyo.com/public/",//线上
    test: "https://www.shouyo.com/public/"//测试
	},
  cdn: {
    dev : "http://localhost/juhe_php/",
    pro : "http://juhe_cdn.shouyo.com/",
    test: "http://juhe_cdn.shouyo.com/"
  },
  socketAddr:{
		dev : 'ws://192.168.73.128:9090/?uid=3&secret=fjaosiehgasodij',
    pro: 'wss://www.shouyo.com/wss',
    test: 'wss://www.shouyo.com/wss'
  },
  envVersion: {
    dev: 'trial',
    pro: 'release',
    test: 'trial'
  },
  tween: { url: './Tween.js'}
}

g.url = function (key) {
  return g.domain[g.runMode] + key;
},
//获取图片地址用这个函数，用法：util.url_images() + 'new_skin/img_home_mask.png'
g.url_images = function ()
{
    return g.cdn[g.runMode] + 'images/';
}
//获取上传文件地址用这个函数，用法：util.url_images() + 'new_skin/img_home_mask.png'
g.url_upload = function () {
  return g.cdn[g.runMode];
}
g.post = function (query, data, succ, err) {
	wx.request({
		url: g.domain[g.runMode] + query,
		data: data || [],
		method: "POST",
		dataType: "json",
		success: function (e) {
          if(e.errMsg == 'request:ok')
          {
              succ(e.data);
          }
          else
          {
            if (err) {
              err();
              return;
            }
            wx.showToast({ title: '网络出错，query：' + query, icon: 'none', duration: 2000 })
          }
    },
    fail:function (){
        if (err)
        {
          err();
          return;
        }
        wx.showToast({
          title: '请求网络失败,query=' + query,
          icon: 'none', duration: 2000
        });
    }

	})
}

// g.getpic = function (n, s) {
//   var url = g.cdn[g.runMode] + "images/" + n + '?ver=' + g.ver;
//   return !s ? url : { url: url, style: s }
// }
g.getpic = function (n, s) {
  var url = g.cdn[g.runMode] + "images/" + n + '?ver=' + g.ver;
  return !s ? url : { url: url, style: s }
}

g.getStorageSync = function (KEY)
{
    var val = null;
    try {
        val = wx.getStorageSync(KEY);
    } catch (e) {
        val = null;
    }
    return val;
},
g.extend = function(target) {
	var sources = Array.prototype.slice.call(arguments, 1);
	for (var i = 0; i < sources.length; i += 1) {
		var source = sources[i];
		for (var key in source) {
			if (source.hasOwnProperty(key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
};
g.showmsg = function (msg, confirm, cancel){
	wx.showModal({
		title: '提示', content: msg,
    showCancel: cancel?true:false,
		success: function (res) {
      if (res.confirm && confirm)
        confirm()
      else if(cancel)
        cancel()
		}
	});
}
g.substr = function (str, len){
	var arr = str.split('');
	if (arr.length < len){
		return str
	}else{
		return arr.slice(0, len).join('') + '...'
	}
}
g.playsound = function (file) {
	var obj = wx.createInnerAudioContext();
	obj.autoplay = true;
  var url = g.url_images() + "sound/" + file;
  console.log(url);
  obj.src = url;
	obj.onError(function (res) { console.log(res.errCode) });
}

/**
 * 打开小程序
 */
g.navigateToMiniProgram = function (gid, vs_uid, time, tid) {
  var ts = this, app = getApp(), socket = app.socket;
  //socket.close();
  //访问常玩接口
  g.post('user/playoftenadd', { 'uid': g.getStorageSync('uid'), 'secret': g.getStorageSync('secret'),'gid':gid}, function(data){
    if(data.result == 'error')
    {
      console.log('user/playoftenadd error:' + JSON.stringify(data));
    }
  });
  var url = null;
  var gid = Number(gid);
  app.util.options = null;
  wx.setStorageSync('options', JSON.stringify({ uid2: vs_uid, time: time, tid: tid, gid:gid}));
  switch(gid){
    case 1://成语冲顶
      url = '/pages/g_cycd/cycd?uid=' + g.getStorageSync('uid') + "&uid2=" + vs_uid + "&time=" + time + "&tid=" + tid + "&gid=" + gid;
    break;
    case 2://连连看
      url = '/pages/g_lianliankan/g_lianliankan?uid=' + g.getStorageSync('uid') + "&uid2=" + vs_uid + "&time=" + time + "&tid=" + tid + "&gid=" + gid;
    break;
    case 3://五子棋
      url = '/pages/g_wuziqi/wuziqi?uid=' + g.getStorageSync('uid') + "&uid2=" + vs_uid + "&time=" + time + "&tid=" + tid + "&gid=" + gid;
    break;
    case 4://吹牛
      url = '/pages/g_chuiniu/chuiniu?uid=' + g.getStorageSync('uid') + "&uid2=" + vs_uid + "&time=" + time + "&tid=" + tid + "&gid=" + gid;
    break;
    case 5://斗兽棋
      url = '/pages/g_doushouqi/doushouqi?uid=' + g.getStorageSync('uid') + "&uid2=" + vs_uid + "&time=" + time + "&tid=" + tid + "&gid=" + gid;
    break;
    default:
    g.showmsg('游戏gid错误');
    return;
  }
  wx.redirectTo({
    url: url,
  });

  // wx.navigateToMiniProgram({
  //   appId: appId, // 要跳转的小程序的appid
  //   path: path, // 跳转的目标页面
  //   extarData: {
  //     foo: 'bar'
  //   },
  //   envVersion: g.envVersion[g.runMode],
  //   success(res) {
  //     if (suc) suc();
  //   }
  // })
}

/**倒计时器
 * @lastTime 开始倒计的秒数
 * @_this 页面
 * @index 组织下标
*/
g.interval = function(lastTime, _this, index,gid,time){
  var interval = setInterval(function () {
    var dsqarr = _this.data.dsqarr;
    //console.log(index + ",dsq," + interval);
    dsqarr[interval] = index;
    _this.setData({ dsqarr: dsqarr });
    //console.log("---," + interval + "," + _this.data.dsqarr.length);
    var insertTime = _this.data.insertTime;
    if (lastTime >= 0) {
      insertTime[index] = lastTime;
      _this.setData({ insertTime: insertTime });
      lastTime--
    }else{
      console.log("倒计时完成," + interval);
      insertTime[index] = '';
      _this.setData({ insertTime: insertTime });
      clearInterval(interval);
      //发送超时信息
      _this.yqTimeout(gid, time);
    }
  },1000);
}

/*公共头部导航动画*/
g.headAni = function (_this, tween) {
  var l = tween.fastGet("headAni");
  var e = wx.createAnimation();
  l.call(function () {
    e.left("33.33%").width("33.33%").step({ timingFunction: "ease-in", duration: 300 });
    _this.headAni = e.export();
    // console.log(_this.headAni)
    _this.setData({ headAni: _this.headAni})
  });
}




/**
 * 清除倒计时
 */
g.intervalclose = function (_this, index) {
  _this.data.insertTime.splice(index, 1,'');
  _this.setData({ insertTime: _this.data.insertTime });
}
/**
 * 时间截格式化
 */
g.timeformat = function (time) {
  // 声明变量
  var d, s;
  var _time = new Date().getTime();
  if(time != undefined){
    _time = time;
  }
  //console.log(_time);
  // 创建 Date 对象
  d = new Date(_time);
  s = d.getFullYear() + "-";
  s += ("0"+(d.getMonth()+1)).slice(-2) + "-";
  s += ("0"+d.getDate()).slice(-2) + " ";
  s += ("0"+d.getHours()).slice(-2) + ":";
  s += ("0" + d.getMinutes()).slice(-2) + ":";
  s += ("0"+d.getSeconds()).slice(-2) ;
  return s;
},
/**
 * 日期格式化
 */
g.dateformat = function (time) {
  //var date = '2018-06-05 14:44:02';
  // var time = new Date(date);
  time = time*1000;
  //console.log(time);

  var nowtime = new Date();
  //console.log(nowtime.getTime())

  var chatime = nowtime - time;//时间差
  //console.log(chatime)

  //days
  var daytime = 24 * 3600 * 1000;
  var days = parseInt(chatime / daytime);
  //console.log(days + "天前")
  var _hours = parseInt(chatime % daytime);
  var hours = parseInt(_hours / (3600 * 1000));
  //console.log(hours + "小时前");
  var _mins = parseInt(_hours % (3600 * 1000));
  var mins = parseInt(_mins / (60 * 1000));
  //console.log(mins + "分钟前")
  var _dt = '';
  if(days>0){
    _dt = days + "天前";
  }else if(hours>0){
    _dt = hours + "小时前";
  }else if(_mins>0){
    _dt = mins + "分钟前";
  }else{
    _dt = "刚刚";
  }
  return _dt;
},


g.options = null;
g.getOption = function (key) {
  if (!g.options) {
    var optionJsonStr = wx.getStorageSync('options');
    if (!optionJsonStr) {
      return null;
    }
    g.options = JSON.parse(optionJsonStr);
  }
  if (g.options[key])
    return g.options[key];
  else
    return null;
}

/**
 * 第一级导航按钮
 */
g.click_nav = function(key, item, _that) {
  var app = getApp(), glb = app.global, item = item;
  var index = key.currentTarget.dataset.index, url = item[index].url;
  for (var i = 0; i < item.length; i++) {
    item[i].active = false;
  }
  item[index].active = true;
  _that.setData({
    "item": item
  })
  wx.showLoading({
    title: '加载中……',
  })
  glb.bindgetuserinfo(function () {
    wx.hideLoading();
    wx.reLaunch({ url: url })
  }, key);
},


module.exports = g