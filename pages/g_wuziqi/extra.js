module.exports = function (t) {
  var app = getApp(), util = app.util;
  /*游戏时间*/
  return {

    onloadHandle: function (options) {

    },

    /*计算时间倒计时*/
    times: function (timeSec) {
      var a = {};
      a["gameTime"] = timeSec
      a["gameTimeWidth"] = (timeSec / t.data.timeLimit) * 100;
      t.setData(a);
    }
  }
}