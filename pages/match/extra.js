module.exports = function (t) {
  var app = getApp(), tween = app.tween, util = app.util;
	return {

		//初始化页面数据，通过接口读取配置数据，设置动画元素位置等等
		init: function () {
			var ts = this;
		},

    receive: function (resJson){
      var twe = tween.fastGet(Math.random());
      console.log(resJson)
      twe.call(function(){
        var sex = '';
        switch (resJson.user_vs.gender)
        {
          case '1':
            sex = '男';
            break;
          case '2':
            sex = '女';
            break;
          default:
            sex = '未知';
        }
        t.setData({
          userShow:true,
          'otherdata.avatarUrl': resJson.user_vs.avatarUrl,
          'otherdata.nickName': resJson.user_vs.nickName,
          'otherdata.sex': sex,
          'otherdata.city': resJson.user_vs.city,
          'otherdata.distance':'1042'
        });
      });
      twe.wait(1000);
      twe.call(function(){
        console.log('匹配跳转')
        if (t.data.gamedata.gid == 0)//找人玩匹配
        {
          wx.redirectTo({ url: '/pages/online/online?tid=' + resJson.tid});
          return;
        }
        //找人玩匹配结束
        wx.redirectTo({
          url: '/pages/index/index',
        })
        console.log('平台跳转小游戏数据：' + JSON.stringify(resJson));
        //util.navigateToMiniProgram(t.data.gamedata.gid, t.data.gamedata.appId, t.data.gamedata.path + '?uid=' + util.getStorageSync('uid') + '&secret=' + util.getStorageSync('secret') + '&uid2=' + resJson.user_vs.uid + '&time=' + resJson.user_vs.time + '&tid=' + resJson.user_vs.tid + '&gid=' + t.data.gamedata.gid);
        console.log('gid='+ t.data.gamedata.gid);
        util.navigateToMiniProgram(t.data.gamedata.gid, resJson.user_vs.uid, resJson.user_vs.time, resJson.user_vs.tid);
      });
    },

	}
}