module.exports = function (t) {
  var app = getApp(),util = app.util
	return {

		//初始化页面数据，通过接口读取配置数据，设置动画元素位置等等
		init: function () {
			var ts = this;
		},

    getlist: function (t, suid) {
      wx.showLoading({ title: '加载中', mask: true });
      var ts = t;
      var success = function (res) {
        console.log(res)
        var avatarUrl = res.data.otherdata.avatarUrl;
        if (avatarUrl.indexOf('wx.qlogo.cn')>0){
          avatarUrl = avatarUrl.slice(0, avatarUrl.length - 3) + 0;
        }
        wx.hideLoading();
        if (res.result != 'success') {
          util.showmsg(res.msg, function () { wx.reLaunch({ url: '../index/index' }) });
          return;
        }
        var sex = '女';
        if (res.data.otherdata.sex == 1) {
          sex = '男';
        }
        var otherdata = {
          uid: res.data.otherdata.uid,
          nickName: res.data.otherdata.nickName,
          avatarUrl: avatarUrl,
          sex: sex,
          city: res.data.otherdata.city,
          friendState: res.data.otherdata.friendState
        }
        ts.setData({
          "otherdata": otherdata,//res.data.otherdata,
          "game": res.data.game
        });
        console.log(ts.data.otherdata)
        console.log(ts.data.game)
      };
      var fail = function () {
        wx.hideLoading();
      }
      util.post('user/getsearchuser',
        { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), suid: suid }, success, fail);
    },

    myonReachBottom: function (t) {
      console.log('myonReachBottom');
      var self = t;
      // 当前页+1
      var pageNumber = self.data.pageNumber + 1;

      self.setData({
        pageNumber: pageNumber,
      })

      if (pageNumber <= self.data.totalPage) {
        wx.showLoading({
          title: '加载中',
        })
        // 请求后台，获取下一页的数据。
        var success = function (res) {
          wx.hideLoading();
          self.setData({
            main: self.data.main.concat(res.data.items)
          });
          console.log(self.data.main);
        };
        var fail = function (res) {
          wx.hideLoading();
        };
        util.post('main/list?page=' + pageNumber,
          { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, success, fail);
      }
    },

	}
}