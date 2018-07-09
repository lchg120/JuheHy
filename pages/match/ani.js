// pages/fight/fight.js
module.exports = function (t) {
  var app = getApp(), tween = app.tween;
  return {
    init: function () {
      var ts = this;

      /*随机配对动画start*/
      // ts.leftAni(num, index, time);
      // ts.rightAni(num, index, time);
      /*随机配对动画end*/
      setInterval(function () {
        ts.lineLeftAni();
        ts.lineRightAni();
      },2000)
      setInterval(function () {
        ts.headBgAni1();
        ts.headBgAni2();
        ts.headBgAni3();
      },900);
      setInterval(function () {
        ts.tipsAni1();
        ts.tipsAni2();
      }, 3000);
    },


    /*线条动画*/
    lineLeftAni: function(){
      var l = tween.fastGet("lineLeftAni");
      var e = wx.createAnimation();
      l.call(function () {
        e.opacity(1).width(0).step({ timingFunction: "ease-in", duration: 800 });
        t.setData({ 'lineLeftAni': e.export() })
      })
      l.wait(1200),
      l.call(function () {
        e.opacity(0).width(20).step({ timingFunction: "ease-in", duration: 0 });
        t.setData({ 'lineLeftAni': e.export() })
      })
    },
    lineRightAni: function () {
      var l = tween.fastGet("lineRightAni");
      var e = wx.createAnimation();
      l.call(function () {
        e.opacity(1).width(0).step({ timingFunction: "ease-in", duration: 800 });
        t.setData({ 'lineRightAni': e.export() })
      })
      l.wait(1200),
        l.call(function () {
        e.opacity(0).width(20).step({ timingFunction: "ease-in", duration: 0 });
          t.setData({ 'lineRightAni': e.export() })
        })
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
    

    /*提示动画*/
    tipsAni1: function () {
      var l = tween.fastGet("tipsAni1");
      var e = wx.createAnimation();
      l.call(function () {
        e.opacity(1).top(0).step({ timingFunction: "ease-in", duration: 600, });
        t.setData({ 'tipsAni1': e.export() })
      })
      l.wait(1500)
      l.call(function () {
        e.opacity(0).top(-20).step({ timingFunction: "ease-in", duration: 600,});
        t.setData({ 'tipsAni1': e.export() })
      })
    },
    tipsAni2: function () {
      var l = tween.fastGet("tipsAni2");
      var e = wx.createAnimation();
      l.call(function () {
        e.opacity(0).top(20).step({ timingFunction: "ease-in", duration: 600, });
        t.setData({ 'tipsAni2': e.export() })
      })
      l.wait(1500)
      l.call(function () {
        e.opacity(1).top(0).step({ timingFunction: "ease-in", duration: 600,});
        t.setData({ 'tipsAni2': e.export() })
      })
    }



    // userNumAni: function(){
    //   var l = tween.fastGet("userNumAni");
    //   l.call(function () {
    //     var e = wx.createAnimation();
    //     e.scale(1.4).step({ timingFunction: "ease-in", duration: 200 });
    //     t.setData({ "userNumAni": e.export() })
    //   }),
    //   l.wait(300),
    //   l.call(function () {
    //     var e = wx.createAnimation();
    //     e.scale(1).step({ timingFunction: "ease-in", duration: 200 });
    //     t.setData({ "userNumAni": e.export() })
    //   })
    // },

    // /*获取时间*/
    // timeMap: function(e,time){
    //   // var arr = [];
    //   for (var j = 0; j < e.length; j++) {
    //     time = e[j].time;
    //   }
    //   return time;
    // },


    // /*机器人配对动画start*/
    // leftAni: function (num, index, time) {
    //   t.setData({
    //     ['fight[' + index+'].isuse']:1
    //   });
    //   //console.log(t.data.fight[index])
    //   var l = tween.fastGet("leftAni");
    //   var key = "fight["+ index +"].leftAni";
    //   var ts = this;
    //   var e = wx.createAnimation();

    //   l.call(function () {
    //     e.width('0%').opacity(0).step({ timingFunction: "ease-in", duration: 0, })
    //     s[key] = e.export();
    //     s['fight[' + index + '].isuse'] = 1;
    //     t.setData(s)
    //   })
    //   l.wait(300)
    //   l.call(function () {
    //     e.width('0%').opacity(1).width(num + 2 + '%').step({ timingFunction: "ease-in", duration: 300 });
    //     s[key] = e.export();
    //     s['fight[' + index + '].isuse'] = 1;
    //     t.setData(s);
    //   }),
    //   l.wait(time)

    // },

    // rightAni: function (num, index, time) {
    //   var l = tween.fastGet("rightAni");
    //   var key = "fight[" + index + "].rightAni";
    //   var ts = this;
    //   var e = wx.createAnimation();
    //   l.call(function () {
    //     e.width('0%').opacity(0).step({ timingFunction: "ease-in", duration: 0, })
    //     s[key] = e.export();
    //     s['fight[' + index + '].isuse'] = 1;
    //     t.setData(s)
    //   })
    //   l.wait(300)
    //   l.call(function () {
    //     e.width('0%').opacity(1).width(100 - num  + '%').step({  timingFunction: "ease-in", duration: 300 })
    //     s[key] = e.export();
    //     s['fight[' + index + '].isuse'] = 1;
    //     t.setData(s)
    //   }),
    //   l.wait(time)
    // },
    /*机器人配对动画end*/
  }
}