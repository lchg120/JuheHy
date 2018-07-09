App({
	util: null,
	global: null,
	socket: null,
  tween: null,
  testtime:0,
	onLaunch: function (options) {
		this.util = require('./utils/util');
		this.global = require('./utils/global');
		this.socket = require('./utils/socket');
    this.tween = require('./utils/Tween');
	},
	onShow: function (options) {
    var _this = this;
    _this.global.keepLoginAndSocket();
    console.log('app.js onshow:' + JSON.stringify(options));
    if(options.action && options.action != undefined)
    {
      return;
    }
    if (options.referrerInfo && options.referrerInfo.extraData)
    {
      // switch (options.referrerInfo.extraData.action) {
      //   case 'gameresult'://游戏返回结果
      //     //发送消息到
      //     //{需要什么参数随便添加}
      //     var tid = options.referrerInfo.extraData.tid;
      //     var time = options.referrerInfo.extraData.time;
      //     var point = JSON.stringify(options.referrerInfo.extraData.point)
      //     wx.navigateTo({
      //       url: '/pages/online/online?tid=' + tid + '&time=' + time + "&point=" + point,
      //     })
      //     return;
      // }
    }
	},
	onHide: function () {
    console.log('app.js hide');
		this.socket.close();
    console.log('socket close app.js 40');
	},
	onError: function (msg) {
		
	},
  // online: function (callback) {
  //   wx.request({
  //     method: 'POST',
  //     url: this.util.url('online'),
  //     success: function (res) {
  //       if (res.errMsg == 'request:ok' && res.data.success) {
  //         if (callback) callback(res.data.payload);
  //       }
  //     },
  //     fail: function () {
  //       showerror('获取在线人数出错')
  //     }
  //   })
  // }
})