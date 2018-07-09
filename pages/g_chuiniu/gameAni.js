module.exports = function (t) {
  var app = getApp(), s = {}, tween = app.tween;
  return {
    //初始化动画
    init: function () {
      const e = tween.fastGet("welcomView"),
        iconAni1 = wx.createAnimation(),
        iconAni2 = wx.createAnimation(),
        iconAni3 = wx.createAnimation(),
        logoAni = wx.createAnimation(),
        playbtnAni = wx.createAnimation();
        iconAni1.opacity(.3).top("-500rpx").step({ timingFunction: "step-start", duration: 0 }),
        iconAni2.opacity(.3).top("-600rpx").step({ timingFunction: "step-start", duration: 0 }),
        iconAni3.opacity(.3).top("-700rpx").step({ timingFunction: "step-start", duration: 0 }),
        logoAni.scale(6).opacity(0).top("-500rpx").step({ timingFunction: "step-start", duration: 0 }),
        playbtnAni.scale(10).opacity(0).step({ timingFunction: "step-start", duration: 0 }),
        t.setData({
          'welcome.iconAni1': iconAni1.export(),
          'welcome.iconAni2': iconAni2.export(),
          'welcome.iconAni3': iconAni3.export(),
          'welcome.logoAni': logoAni.export(),
          'welcome.playbtnAni': playbtnAni.export()
        });
      e.wait(600), e.call(function () {
        iconAni1.opacity(1).top(0).step({ timingFunction: "ease-in", duration: 360 });
        t.setData({ 'welcome.iconAni1': iconAni1.export() });
      }),
        e.wait(500), e.call(function () {
          iconAni2.opacity(1).top('30rpx').step({ timingFunction: "ease-in", duration: 300 });
          t.setData({ 'welcome.iconAni2': iconAni2.export() });
        }),
        e.wait(500), e.call(function () {
          iconAni3.opacity(1).top('100rpx').step({ timingFunction: "ease-in", duration: 200 });
          t.setData({ 'welcome.iconAni3': iconAni3.export() });
        }),
        e.wait(300), e.call(function () {
          logoAni.opacity(1).top('0rpx').scale(1).step({ timingFunction: "ease-in", duration: 200 });
          t.setData({ 'welcome.logoAni': logoAni.export() });
        }),
        e.wait(300), e.call(function () {
          playbtnAni.opacity(1).scale(1).step({ timingFunction: "ease-in", duration: 200 });
          t.setData({ 'welcome.playbtnAni': playbtnAni.export() });
        })
    },
    ready: function () {
      t.setData({ 'user.hide': false, 'ready.tipsHide': true, 'ready.bgHide': false });
      const e = tween.fastGet("readyView");
      e.wait(500), e.call(function () {
        t.setData({
          'ready.bgimgHide': false
        });
      }),
      
      e.wait(1500), e.call(function () {
        t.setData({
          'ready.bgHide': true
          // 'user.hide': false,
          // 'user.left.dialogHide': true,
          // 'user.right.dialogHide': true
        });
      });
    },
    showMsg: function (direction, itemNum, itemTotal) {

    },
    // timer: function () {
    //   var timer = setInterval(function () {
    //     var time = parseInt(t.data.fight.timer);
    //     if (time > 1) {
    //       time--;
    //     } else {
    //       clearInterval(timer);
    //       //显示结果
    //       t.setData({
    //         'fight.timerHide': true,
    //         'fight.clickNumlistHide': true,
    //         'fight.clickNumlist2Hide': true,
    //         'fight.handshareHide': false,
    //         'fight.kaiGenHide': true,
    //         'result.hide': false
    //       });
    //     }
        
    //   }, 1000);
    // },

		/**
		 * 摇色钟
		 */
		keep_shake:null,
		end_shake:null,
    shake: function () {
			var _this = this;
			_this.keep_shake = true;
			_this.end_shake = false;
      const shakeAni = wx.createAnimation();
      const share = function (du) {
        shakeAni.rotate(du).step({ timingFunction: "ease", duration: 200 });
        t.setData({ 'ready.shakeAni': shakeAni.export() });
      }
			const oneShake = function(){
				var e = tween.fastGet(Math.random());
				e.wait(100), e.call(function () { share(-60) }),
				e.wait(100), e.call(function () { share(60) }),
				e.wait(100), e.call(function () { share(-50) }),
				e.wait(100), e.call(function () {
					share(50);
					if (_this.keep_shake)
					{
						oneShake();
					}
					else
					{
						_this.end_shake = true;
					}
				});
			}
			share(60)
			oneShake();
      
      //计时器
      //this.timer();
    },

		/**
		 * 摇色中结束
		 */
		share_end : function(){
			var _this = this;
			_this.keep_shake = false;
			const shakeAni = wx.createAnimation();
			const end = function(){
				if (_this.end_shake) {
					var end_e = tween.fastGet(Math.random());
					end_e.wait(100), end_e.call(function () {
						shakeAni.rotate(0).step({ timingFunction: "ease-out", duration: 200 });
						t.setData({ 'ready.shakeAni': shakeAni.export() });
					}),
					end_e.wait(200), end_e.call(function () {
						shakeAni.top('-500rpx').opacity(0).step({ timingFunction: "ease-out", duration: 400 });
						t.setData({ 'ready.shakeAni': shakeAni.export() });
					}),
					end_e.wait(510), end_e.call(function () {
						t.setData({ 'ready.hide': true, 'fight.hide': false });
					});
				}
				else
				{
					var e = tween.fastGet(Math.random());
					e.wait(400)
					e.call(function(){
						end();
					});
				}
			}
			end();
			
		},

  }
}