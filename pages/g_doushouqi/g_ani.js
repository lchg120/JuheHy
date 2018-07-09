// pages/fight/fight.js
module.exports = function (t) {
  var app = getApp(), s = {}, tween = app.tween;
  return {
    init: function () {
      var ts = this;
      /*头像等待加载动画*/
      clearInterval(headLoad);
      var headLoad =  setInterval(function () {
        ts.headBgAni1();
        ts.headBgAni2();
        ts.headBgAni3();
      }, 900);

      /*匹配之后开始显示配对弹窗层，执行开始动画*/
      if (t.data.matchViewBox.isHide == false) {
        ts.vsStartAni();
        // ts.vsEndAni();
        // s["matchViewBox.isHide"] = true;
        // t.setData(s);
        console.log(' vsStartAni');
      }
      /*匹配成功之后开始执行结束动画，定时器根据数据匹配成功之后删除定时器即可*/
      if (t.data.matchViewBox.loadEnd = true) {
        setTimeout(function () {
          ts.vsEndAni();
          console.log(' vsEndAni');
        }, 2000)
        /*模拟匹配成功之后取消动画, 真实数据直接删除定时器即可*/
        setTimeout(function () {
          s["matchViewBox.isHide"] = true;
          t.setData(s);
          console.log('isHide = true');
        }, 3000)
      }
      

    },

    /*匹配成功动画*/
    vsStartAni: function () {
      var leftani = wx.createAnimation();
      var rightani = wx.createAnimation();
      leftani.left("-40%").step({ timingFunction: "ease-in", duration: 300 });
      rightani.right("-40%").step({ timingFunction: "ease-in", duration: 300, delay: 300 });
      s["matchViewBox.loadEnd"] = true;
      s["matchViewBox.matchViewLeftAni"] = leftani.export();
      s["matchViewBox.matchViewRightAni"] = rightani.export();
      t.setData(s);
    },
    /*匹配结束动画*/
    vsEndAni: function () {
      var leftani = wx.createAnimation();
      var rightani = wx.createAnimation();
      leftani.left("-110%").step({ timingFunction: "ease-in", duration: 300});
      rightani.right("-110%").step({ timingFunction: "ease-in", duration: 300});
      s["matchViewBox.loadEnd"] = false;
      s["matchViewBox.matchViewLeftAni"] = leftani.export();
      s["matchViewBox.matchViewRightAni"] = rightani.export();
      t.setData(s);
    },



    /*头像加载等待动画*/
    headBgAni1: function () {
      var l = tween.fastGet("headBgAni1");
      var e = wx.createAnimation();
      l.call(function () {
        e.opacity(1).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni1': e.export() })
      })
      l.wait(300)
      l.call(function () {
        e.opacity(0.6).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni1': e.export() })
      })
      l.wait(300)
      l.call(function () {
        e.opacity(0.3).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni1': e.export() })
      })
    },
    headBgAni2: function () {
      var l = tween.fastGet("headBgAni2");
      var e = wx.createAnimation();
      l.call(function () {
        e.opacity(0.6).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni2': e.export() })
      })
      l.wait(300)
      l.call(function () {
        e.opacity(0.3).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni2': e.export() })
      })
      l.wait(300)
      l.call(function () {
        e.opacity(1).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni2': e.export() })
      })
    },
    headBgAni3: function () {
      var l = tween.fastGet("headBgAni3");
      var e = wx.createAnimation();
      l.call(function () {
        e.opacity(0.3).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni3': e.export() })
      })
      l.wait(300)
      l.call(function () {
        e.opacity(1).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni3': e.export() })
      })
      l.wait(300)
      l.call(function () {
        e.opacity(0.6).step({ timingFunction: "ease-in", duration: 300 });
        t.setData({ 'headBgAni3': e.export() })
      })
    },
  }
}