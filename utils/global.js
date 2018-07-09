var g = {}, util = require('./util.js'), socket = require('./socket.js');

//获取用户微信信息（从微信获取）
// g.getuserinfo = function (func) {
// 	wx.getUserInfo({
// 		lang: 'zh_CN',
// 		success: function (res) {
// 			func(res.userInfo);
// 		},
// 		fail: function () {
//       wx.showModal({
//         title: '提示',
//         content: '必须授权“使用我的用户信息”才能正常使用小程序',
//         success: function (res) {
//           if (res.confirm) {
//             wx.openSetting({
//               success: (res) => {
//               }
//             })
//           }
//         }
//       });
// 		}
// 	})
// }

//登陆：两个回调函数
g.keepLoginAndSocket = function (succ, resUserinfo) {
  var uid = util.getStorageSync('uid');
  var secret = util.getStorageSync('secret');
  succ = succ || function (e) { };
  if(uid && secret)
  {
    //socket.close();
    //socket.initConn();
    socket.openSocket(uid, secret);
    succ();
    return;
  }

  if (!resUserinfo)
  {
    return;
  }

	wx.checkSession({
		success: function (res) {
			
			if (!uid || !secret) {
				try {wx.removeStorageSync('uid'), wx.removeStorageSync('secret')}catch (e) {}
        if (resUserinfo) g.doLogin(succ, resUserinfo);
			}else {
				socket.openSocket(uid, secret), succ();
			}
		},
		fail: function () {
			try { wx.removeStorageSync('uid'), wx.removeStorageSync('secret') } catch (e) { }
      if (resUserinfo)
        g.doLogin(succ, resUserinfo);
      else
        succ();
		}
	})
}

//重新登陆
g.doLogin = function (succ, resUserinfo) {
  // succ();
  //改成新版post函数
	wx.login({
		success: function (res) {
			console.log(res)
      if (res.code) {
        var uid = util.getStorageSync('uid_parent');
					wx.request({
						url: util.url('user/login'),
						method: 'POST',
            data: util.extend({ 'uid': uid}, resUserinfo, res),
						success: function (resLogin) {
							console.log(resLogin)
              if (resLogin.errMsg == 'request:ok') {
								if (resLogin.data.result == 'success') {
									try {
										wx.setStorageSync('uid', resLogin.data.uid);
										wx.setStorageSync('secret', resLogin.data.secret);
                    socket.close();
                    console.log('socket close global.js 87');
                    socket.initConn();
										socket.openSocket(resLogin.data.uid, resLogin.data.secret);
										succ();
									} catch (e) {
										util.showmsg('存储登录信息出错')
									}
								} else {
                  util.showmsg('登录出错' + resLogin.data.msg)
								}
							} else {
                util.showmsg('登录失败' + resLogin.errMsg)
							}
						},
						fail: function () {
              util.showmsg('登录服务器出错')
						}
					})
				//});
			}else {
        util.showmsg('微信登录出错')
			}
		},
		fail: function () {
      util.showmsg('微信登陆失败')
		}
	})
}

g.bindgetuserinfo = function(succ,data) {
  succ = succ || function (e) {};
  if (data.detail.errMsg && data.detail.errMsg == 'getUserInfo:ok') {
    if (data.detail.userInfo) {
      this.keepLoginAndSocket(function () {
        succ();
      }, data.detail.userInfo);
    }
  }
  else {
    util.showmsg('必须选择允许，才能正常使用所有功能');
  }
}
module.exports = g;