// pages/fight/fight.js
module.exports = function (t) {
  var app = getApp(), tween = app.tween;
  return {
    init: function () {
      var ts = this;
      clearInterval(yyLineAniTime);
      var yyLineAniTime = setInterval(function(){
        ts.yyLineAni(1);
        ts.yyLineAni(2);
        ts.yyLineAni(3);
        ts.yyLineAni(4);
        ts.yyLineAni(5);
      },1500)
      t.setData({ "yyLineAniTime": yyLineAniTime })
    },

    yyLineAni: function (index) {
      var l = tween.fastGet("yyLineAni" + index);
      var ts = this;
      var e = wx.createAnimation();
      var yyLineAni = [];
      l.call(function () {
        e.opacity(0).step({ timingFunction: "ease-in", duration: 0 })
        yyLineAni[index] = e.export();
        t.setData({ "yyLineAni": yyLineAni })
      })
      l.wait(index*200)
      l.call(function () {
        e.opacity(1).step({ timingFunction: "ease-in", duration: 0 })
        yyLineAni[index] = e.export();
        t.setData({ "yyLineAni": yyLineAni })
      })
    },
  }
}