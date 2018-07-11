module.exports = function (t) {
	var app = getApp(), s = {}, tween = app.tween;
	return {
		keep_shake: null,
		end_shake: null,

		//初始化
		init: function () {
			
		},

		//点击开始
		ready: function () {
			t.setData({ 'user.hide': false, 'ready.tipsHide': true, 'ready.bgHide': false });
		},

		//摇骰子
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
			item = parseInt(item), total = parseInt(total);
			var clickNumlist = t.data.fight.clickNumlist, clickNumlist2 = t.data.fight.clickNumlist2;

			//将数量组设置为锁住，去除点击状态
			clickNumlist.map(function (val) {
				if (val.id == 1 || val.id == total) val.clicked = false, val.locked = true; return val;
			});
			//将骰子组去除点击状态
			clickNumlist2.map(function (val) {
				val.clicked = false; return val;
			});
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
					'fight.clickNumlist': clickNumlist,
					'fight.clickNumlist2': clickNumlist2,
				});
				/*
				//测试用： 设置demo数据
				var ts = this;
				setTimeout(function(){
					var tmp = t.data.user.left.dialogData;
					tmp.total += 1;
					ts.showMsg('right', tmp.item, tmp.total)
				}, 1000);
				*/
			} else {
				//判断是否可以跟
				var leftDialogData = t.data.user.left.dialogData;
				t.setData({
					'user.right.dialogHide': false,
					'user.left.dialogHide': true,
					'fight.roundYou': false,
					'fight.roundSelf': true,
					'user.right.dialogData': { item: item, total: total },
					'fight.clickNumlistHide': false,
					'fight.clickNumlist2Hide': false,
					'fight.kaiGenHide': false,
					'fight.clickNumlist': clickNumlist,
					'fight.clickNumlist2': clickNumlist2,
					'fight.btn.kai': false,
					'fight.btn.kaiAct': true,
					'fight.btn.gen': leftDialogData.total >= 10,
					'fight.btn.genAct': leftDialogData.total < 10
				});
			}
		},

		//加载游戏后，初始化显示出牌方,left为自己，right为对手
		when_gameStart: function(who){
			this.share_end();	//停止摇动
			if(who == 'left'){
				t.setData({
					'fight.roundYou': false,
					'fight.roundSelf': true,
					'fight.clickNumlistHide': false,
					'fight.clickNumlist2Hide': false,
					'fight.kaiGenHide': false,
				});
			}else{
				t.setData({
					'fight.roundYou': true,
					'fight.roundSelf': false,
					'fight.clickNumlistHide': true,
					'fight.clickNumlist2Hide': true,
					'fight.kaiGenHide': true,
				});
			}	
		},

		//显示结果层，是否赢，骰子，总数
		showResult: function(iswin, item, total){
			t.setData({
				'fight.hide': false,
				'fight.clickNumlistHide': true,
				'fight.clickNumlist2Hide': true,
				'fight.kaiGenHide': true,
				'fight.timerHide': true,
				'result.iswin': iswin,
				'result.data': { item:item, total: total},
				'result.hide': false,
				'result.handshareHide': false
			});
		}
	}
}