module.exports = function (t) {
  var app = getApp(), util = app.util
	return {

		//初始化页面数据，通过接口读取配置数据，设置动画元素位置等等
		init: function () {
			var ts = this;
		},
    getUserKey: function (t) {
      wx.showLoading({ title: '加载中', mask: true });
      var ts = t;
      var success = function (res) {
        wx.hideLoading();
        if (res.result != 'success') {
          util.showmsg(res.data.msg, function () { wx.reLaunch({ url: '../index/index' }) });
          return;
        }
        ts.setData({
          "userKey": res.data,
        });
      };
      var fail = function () {
        wx.hideLoading();
        //wx.reLaunch({ url: '../index/index' });
      }

      util.post('game/getuserkey',
        { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, success, fail);
    },

    getlist: function (t) {
      var ts = t;
      var success = function (res) {
        if (res.result != 'success') {
          util.showmsg(res.msg, function () { wx.reLaunch({ url: '../index/index' }) });
          return;
        }
        ts.setData({
          "friend": res.data,
        });
        console.log(res)
      };
      var fail = function () {
        wx.reLaunch({ url: '../index/index' });
      }

      util.post('user/getfriends',
        { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, success, fail);
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