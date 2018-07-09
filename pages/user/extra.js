module.exports = function (t) {
	return {

		//初始化页面数据，通过接口读取配置数据，设置动画元素位置等等
		init: function () {
			var ts = this;
		},

    // receive: function (resJson){
    //   var twe = tween.fastGet(Math.random());
    //   twe.call(function(){
    //     var sex = '';
    //     switch (resJson.user_vs.gender)
    //     {
    //       case '1':
    //         sex += '男';
    //         break;
    //       case '2':
    //         sex += '女';
    //         break;
    //       default:
    //         sex += '未知';
    //     }
    //     t.setData({
    //       userShow:true,
    //       'other.headImg': resJson.user_vs.avatarUrl,
    //       'other.name': resJson.user_vs.nickName,
    //       'other.sex': sex,
    //       'other.city': resJson.user_vs.city,
    //     });
    //   });
    //   twe.wait(1000);
    //   twe.call(function(){
    //     console.log('匹配跳转')
    //     if (t.data.gamedata.gid == 0)//找人玩匹配
    //     {
    //       wx.redirectTo({ url: '/pages/online/online?tid=' + resJson.tid});
    //       return;
    //     }
    //     console.log('123456')
    //     //找人玩匹配结束
    //     wx.navigateToMiniProgram({
    //       appId: t.data.gamedata.appId, // 要跳转的小程序的appid
    //       path: t.data.gamedata.path +'?content=11111', // 跳转的目标页面
    //       extarData: {
    //         foo: 'bar'
    //       },
    //       envVersion: 'trial',
    //       success(res) {
    //         // 打开成功
    //       }
    //     })
    //   });
    // },
    getlist:function(){

    }
	}
}