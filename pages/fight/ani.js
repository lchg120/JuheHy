// pages/fight/fight.js
module.exports = function (t) {
  var s = {},app = getApp(), tween = app.tween;
  return {
    init: function () {
      var ts = this;
      var num = 0;
      var arrSetInterval = [];
      clearInterval(titleAni);
      clearInterval(vsAni);
      var titleAni = setInterval(function () { 
        num = Math.floor(Math.random() * 30);
        ts.userNumAni(num)
        },5000);
      arrSetInterval.push(titleAni);
      /*随机配对动画start*/
      var vsAni = setInterval(function () {
        var index = Math.floor(Math.random() * t.data.fight.length);
        var _nums = 0, time = 0;
        time = ts.timeMap(t.data.fight, time);
        _nums = Math.floor(Math.random() * 100);
        if (t.data.fight[index].isuse == 0) {
          var fightNum = t.data.fightNum + 1;
          ts.leftAni(_nums, index, time);
          ts.rightAni(_nums, index, time);
          t.setData({
            fightNum: fightNum
          })
        } else {
          ts.leftAni(_nums, index, time);
          ts.rightAni(_nums, index, time);
          //console.log(t.data.fight[index] + ",00000")
        }
        //console.log(t.data.fightNum)
        if (t.data.fightNum == t.data.fight.length){
          //console.log('restatrt');
          for (var i = 0; i < t.data.fight.length;i++){
            t.setData({
              ['fight[' + i + '].isuse']: 0,
              fightNum: 0
            })
          }
        }
      }, 3000);
      /*随机配对动画end*/
      arrSetInterval.push(vsAni);
      t.setData({
        arrSetInterval: arrSetInterval
      })
    },


    /*随机数动画*/
    userNumAni: function(num){
      var l = tween.fastGet("userNumAni");
      l.call(function () {
        var e = wx.createAnimation();
        e.scale(1.4).step({ timingFunction: "ease-in", duration: 200 });
        t.setData({ "userNumAni": e.export() })
      }),
      l.wait(300),
      l.call(function () {
        var e = wx.createAnimation();
        e.scale(1).step({ timingFunction: "ease-in", duration: 200 });
        t.setData({ "userNumAni": e.export() })
      })
      var userNum = t.data.userNum + num;
      t.setData({ userNum: userNum})
    },

    /*获取时间*/
    timeMap: function(e,time){
      // var arr = [];
      for (var j = 0; j < e.length; j++) {
        time = e[j].time;
      }
      return time;
    },


    /*机器人配对动画start*/
    leftAni: function (num, index, time) {
      t.setData({
        ['fight[' + index+'].isuse']:1
      });
      //console.log(t.data.fight[index])
      var l = tween.fastGet("leftAni");
      var key = "fight["+ index +"].leftAni";
      var ts = this;
      var e = wx.createAnimation();

      l.call(function () {
        e.width('0%').opacity(0).step({ timingFunction: "ease-in", duration: 0, })
        s[key] = e.export();
        s['fight[' + index + '].isuse'] = 1;
        t.setData(s)
      })
      l.wait(300)
      l.call(function () {
        e.width('0%').opacity(1).width(num + 2 + '%').step({ timingFunction: "ease-in", duration: 300 });
        s[key] = e.export();
        s['fight[' + index + '].isuse'] = 1;
        t.setData(s);
      }),
      l.wait(time)

    },

    rightAni: function (num, index, time) {
      var l = tween.fastGet("rightAni");
      var key = "fight[" + index + "].rightAni";
      var ts = this;
      var e = wx.createAnimation();
      l.call(function () {
        e.width('0%').opacity(0).step({ timingFunction: "ease-in", duration: 0, })
        s[key] = e.export();
        s['fight[' + index + '].isuse'] = 1;
        t.setData(s)
      })
      l.wait(300)
      l.call(function () {
        e.width('0%').opacity(1).width(100 - num  + '%').step({  timingFunction: "ease-in", duration: 300 })
        s[key] = e.export();
        s['fight[' + index + '].isuse'] = 1;
        t.setData(s)
      }),
      l.wait(time)
    },
    /*机器人配对动画end*/
  }
}