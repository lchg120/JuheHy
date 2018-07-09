module.exports = function (t) {
  var app = getApp(),util = app.util
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
        console.log('friend list')
        console.log(res);
        for (var i = 0; i < res.data.items.length; i++) {
          var _rows = res.data.items[i];
          res.data.items[i].times = _rows.time;
          res.data.items[i].time = util.dateformat(_rows.time)
        }
        ts.setData({
          "flist": res.data.items,
          "totalPage": res.data.total_pages
        });
      };
      var fail = function () {
        wx.hideLoading();
        wx.reLaunch({ url: '../index/index' });
      }
      util.post('talk/listfriends',
        { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, success, fail);
    },

    myonReachBottom: function (t) {
      console.log('myonReachBottom');
      var self = t;
      // 当前页+1
      var pageNumber = self.data.pageNumber + 1;
      if (pageNumber >= self.data.totalPage) {
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
            "flist": self.data.user.concat(res.data.items)
          });
          console.log(self.data.main);
          if (pageNumber == self.data.totalPage) {
            self.setData({
              "islastPage": true
            });
          }
        };
        var fail = function (res) {
          wx.hideLoading();
        };
        util.post('talk/listfriends?page=' + pageNumber, { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret') }, success, fail);
      }
    },
  }
}