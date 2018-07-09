module.exports = function (t) {
  var app = getApp(), util = app.util, canvas = require('canvas')
	return {

		//初始化页面数据，通过接口读取配置数据，设置动画元素位置等等
		init: function () {
			var ts = this;
		},

    getlist: function (t) {
      wx.showLoading({ title: '加载中', mask: true });
      var ts = t;
      var success = function (res) {
        wx.hideLoading();
        if (res.result != 'success') {
          util.showmsg(res.msg, function () { wx.reLaunch({ url: '../index/index' }) });
          return;
        }
        for (var i = 0; i < res.data.items.length; i++){
          var _rows = res.data.items[i];
          // console.log(_rows.time)
          res.data.items[i].times = _rows.time;
          res.data.items[i].time = util.dateformat(_rows.time)
        }
        ts.setData({
          "user": res.data.items,
          "totalPage": res.data.total_pages
        });
        for (var i = 0; i < ts.data.user.length; i++) {
          console.log(i)
          canvas.canvasClock(i, ts.data.user[i].times,ts);
        }
      };
      var fail = function () {
        wx.hideLoading();
        wx.reLaunch({ url: '../index/index' });
      }
      util.post('talk/list',
        { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, success, fail);
    },

    myonReachBottom: function (t) {
      console.log('myonReachBottom');
      var self = t;
      // 当前页+1
      var pageNumber = self.data.pageNumber + 1;
      if (pageNumber >= self.data.totalPage){
        pageNumber = self.data.totalPage
      }

      self.setData({
        pageNumber: pageNumber,
      })

      if (pageNumber <= self.data.totalPage && self.data.islastPage == false) {
        wx.showLoading({
          title: '加载中',
        })
        // 请求后台，获取下一页的数据。
        var success = function (res) {
          console.log('reachbottom sccc');
          wx.hideLoading();
          for (var i = 0; i < res.data.items.length; i++) {
            var _rows = res.data.items[i];
            res.data.items[i].times = _rows.time;
            res.data.items[i].time = util.dateformat(_rows.time)
          }
          self.setData({
            "user": self.data.user.concat(res.data.items)
          });
          for (var i = 0; i < self.data.user.length; i++) {
            canvas.canvasClock(i, self.data.user[i].times, self);
          }
          console.log(self.data.main);
          if (pageNumber == self.data.totalPage){
            self.setData({
              "islastPage": true
            });
          }
        };
        var fail = function (res) {
          wx.hideLoading();
        };
        util.post('talk/list?page=' + pageNumber,{ uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, success, fail);
      }
    },
	}
  /*绘制时钟*/
  
  /*canvas绘制时针end*/
}