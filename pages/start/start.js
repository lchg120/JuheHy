var app = getApp();
Page({
  data: {
    //bgurl: app.util.getpic("start/start-bg.png"),
    //logourl: app.util.getpic("start/start-logo.png"),
  },
  onLoad: function (options) {
    if (!options.action || options.action == undefined) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
      return;
    }
    switch (options.action) {
      case 'wxinvite'://微信邀请好友
        //分享出去的连接/
        try { wx.setStorageSync('uid_parent', options.uid);} catch (e) { }
        wx.reLaunch({
          url: '/pages/index/index',
        })
        return;
    }
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onShow: function () {

  },

  // bindgetuserinfo : function(data){
  //   console.log('授权：' + JSON.stringify(data));
  //   if (data.detail.errMsg && data.detail.errMsg == 'getUserInfo:ok')
  //   {
  //     if (data.detail.userInfo)
  //     {
  //       console.log('2222222222');
  //       app.global.keepLoginAndSocket(function () {
  //         app.util.showmsg('登录成功');
  //       }, data.detail.userInfo);
  //     }
  //   }
  //   else
  //   {
  //     console.log('333333333333');
  //     app.util.showmsg('必须选择允许，才能正常使用所有功能');
  //   }
  // },

})