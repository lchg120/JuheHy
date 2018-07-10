module.exports = function (t) {
	var app = getApp(), s = {}, tween = app.tween;
	return {
		keep_shake: null,
		end_shake: null,
		init: function () {

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
		shake: function () {
			var _this = this;
			_this.keep_shake = true;
			_this.end_shake = false;
			const shakeAni = wx.createAnimation();
			const share = function (du) {
				shakeAni.rotate(du).step({ timingFunction: "ease", duration: 200 });
				t.setData({ 'ready.shakeAni': shakeAni.export() });
			}
			const oneShake = function () {
				var e = tween.fastGet(Math.random());
				e.wait(100), e.call(function () { share(-60) }),
				e.wait(100), e.call(function () { share(60) }),
				e.wait(100), e.call(function () { share(-50) }),
				e.wait(100), e.call(function () {
					share(50);
					_this.keep_shake ? oneShake() : (_this.end_shake = true);
				});
			}
			share(60)
			oneShake();
		},

		//摇色中结束
		share_end: function () {
			var _this = this;
			_this.keep_shake = false;
			const shakeAni = wx.createAnimation();
			const end = function () {
				if (_this.end_shake) {
					var end_e = tween.fastGet(Math.random());
					end_e.wait(100), end_e.call(function () {
						shakeAni.rotate(0).step({ timingFunction: "ease-out", duration: 50 });
						t.setData({ 'ready.shakeAni': shakeAni.export() });
					}),
					end_e.wait(200), end_e.call(function () {
						shakeAni.top('-500rpx').opacity(0).step({ timingFunction: "ease-out", duration: 400 });
							t.setData({ 'ready.shakeAni': shakeAni.export() });
						}),
						end_e.wait(510), end_e.call(function () {
							t.setData({ 'ready.hide': true, 'fight.hide': false });
					});
				} else {
					var e = tween.fastGet(Math.random());
					e.wait(200), e.call(function () { end() });
				}
			}
			end();
		},

		//显示消息： left为自己，right为对手。发送完毕后隐藏点击按钮。骰子，个数
		showMsg: function (who, item, total) {
			if (who == 'left') {
				t.setData({
					'user.left.dialogHide': false,
					'user.right.dialogHide': true,
					'user.left.dialogData': { item: item, total: total },
					'fight.roundYou': true,
					'fight.roundSelf': false,
					'fight.clickNumlistHide': true,
					'fight.clickNumlist2Hide': true,
					'fight.kaiGenHide': true,
				});
			} else {
				t.setData({
					'user.right.dialogHide': false,
					'user.left.dialogHide': true,
					'fight.roundYou': false,
					'fight.roundSelf': true,
					'user.right.dialogData': { item: item, total: total },
					'fight.clickNumlistHide': false,
					'fight.clickNumlist2Hide': false,
					'fight.kaiGenHide': false,
				});
			}
		},

		//加载游戏后，初始化显示出牌方
		when_gameStart: function(who){
			this.share_end();
			
		} 
	}
}