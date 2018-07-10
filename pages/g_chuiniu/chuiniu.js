var app = getApp(), util = app.util, glb = app.global, socket = app.socket, tween = app.tween, gameAni = require('gameAni'), startAni = require("g_ani");
var optionsData = {};
Page({
	data: {
		imagesBaseUrl: util.url_images(),
		gameAni: null,
		startAni: null,
		user: {
			hide: true,
			left: {
				dialogHide: true,
				dialogData: [], //item: 1, total: 3
			},
			right: {
				dialogHide: true,
				dialogData: [],	//item: 1, total: 3
			}
		},
		ready: {
			hide: false,
			tipsHide: false,
			bgimgHide: true,
			shakeAni: null
		},
		fight: {
			hide: true,
			roundSelf: true,
			roundYou: false,
			timer: 15,
			timerHide: false,
			numList: [1, 3, 4, 5, 2],
			clickNumlistHide: false,
			clickNumlist2Hide: false,
			kaiGenHide: false,
			clickNumlist: [
				{ id: 1, clicked: false, locked: false },
				{ id: 2, clicked: false, locked: false },
				{ id: 3, clicked: false, locked: false },
				{ id: 4, clicked: false, locked: false },
				{ id: 5, clicked: false, locked: false },
				{ id: 6, clicked: false, locked: false },
				{ id: 7, clicked: false, locked: false },
				{ id: 8, clicked: false, locked: false },
				{ id: 9, clicked: false, locked: false },
				{ id: 10, clicked: false, locked: false },
			],
			clickNumlist2: [
				{ id: 1, clicked: false },
				{ id: 2, clicked: false },
				{ id: 3, clicked: false },
				{ id: 4, clicked: false },
				{ id: 5, clicked: false },
				{ id: 6, clicked: false },
			],
			btn: {
				kai: true,
				kaiAct: false,
				gen: true,
				genAct: false
			},
		},
		result: {
			hide: true,
			handshareHide: true,
			iswin: true,
			data: { item: 1, total: 3 },	//设置数据，total个item
			leftData: [1, 3, 1, 5, 6],	//设置数据，item
			rightData: [2, 3, 4, 6, 1]	//设置数据，item
		},
		leftview: {
			userinfo: { avatar: '', name: '我的名字' },
		},
		rightview: {
			userinfo: { avatar: '', name: '加载中…' },
		},
		/*匹配动画*/
		matchViewBox: {
			isHide: false,    /*显示隐藏*/
			matchEnd: false, /*匹配成功*/
			matchViewLeftAni: null,		//匹配后，左侧动画
			matchViewRightAni: null,	//匹配后右侧动画
		}
	},

	onLoad: function (options) {
		var that = this;
		that.startAni = new startAni(that);
		that.startAni.init();
		that.gameAni = new gameAni(that);
		that.gameAni.init();
		util.post('global/getuserinfo', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid2: options.uid2 }, function (resJson) {
			//console.log(resJson);
			that.setData({
				'leftview.userinfo.avatar': resJson.data.userdata.avatarUrl,
				'leftview.userinfo.name': resJson.data.userdata.nickName,
				'rightview.userinfo.avatar': resJson.data.otherdata.avatarUrl,
				'rightview.userinfo.name': resJson.data.otherdata.nickName
			})
		})
		optionsData.uid2 = options.uid2;
		optionsData.tid = options.tid;
		optionsData.time = options.time;
		// setTimeout(function () {
		// 	app.socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":4,"connmsg":{"action":"game_ready","uidvs":' + options.uid2 + ',"tid":' + options.tid + ',"time":' + options.time + '}}');
		// }, 1000);
	},

	onUnload: function () {
		socket.sendSocketMessage('{"action":"glb_userstatus_quit"}');
	},

	//关闭游戏提示,直接开始摇骰子
	startReadAni: function () {
		this.gameAni.ready();
		this.gameAni.shake();
		app.socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":4,"connmsg":{"action":"game_ready","uidvs":' + optionsData.uid2 + ',"tid":' + optionsData.tid + ',"time":' + optionsData.time + '}}');
	},
	/*
	handleSocketMessage: function (resJson) {
		//console.log('收到socket消息：' + JSON.stringify(resJson));
		var _this = this;
		var uid = Number(util.getStorageSync('uid'));
		switch (resJson.action) {
			case 'game_begin'://游戏开始
				var that = this;
				that.data.timeLimit = resJson.timeLimit;
				that.data.gameid = resJson.gameid;
				//resJson.cur_play_uid 当前回合uid，resJson.shaizi_data 两边的色子数据，形如[{'uid'=>1, 'data'=> [5,4,3,2,1]},{'uid'=>2, 'data'=>[1,2,3,4,5]}]

				//处理摇到的筛子数据
				resJson.shaizi_data.forEach(function (element) {
					if (Number(element.uid) == uid) {
						_this.data.fight.numList = element.data;
						break;
					}
				});

				//处理先手后手roundSelf: false, roundYou: true,
				if (Number(resJson.cur_play_uid) == uid) {
					_this.data.fight.roundSelf = true;
					_this.data.fight.roundYou = false;
					//fight.clickNumlistHide=fase,clickNumlist2Hide=fase
				}
				else {
					_this.data.fight.roundSelf = false;
					_this.data.fight.roundYou = true;
					////fight.clickNumlistHide=fase,clickNumlist2Hide=fase
				}

				//获取匹配用户，匹配到之后
				for (let i in resJson.userInfo) { //variable 为 index
					if (i != uid) {
						that.data.rightview.userinfo = {
							avatar: resJson.userInfo[i].avatarUrl,
							name: resJson.userInfo[i].nickName,
							level: resJson.userInfo[i].level,
							tiers: resJson.userInfo[i].sid,
						}
						break;
					}
				}
				that.setData(that.data);
				that.gameAni.share_end();
				util.playsound('matchuser.mp3');
				return true;
			case 'game_ticker'://答题记时
				//console.log('连连看答题记时 resJson.ticker=' + resJson.ticker);
				var that = this;
				if (resJson.ticker < 0) resJson.ticker = 0;
				_this.setData({ 'fight.timer': resJson.ticker });
				return true;
			case 'game_answer_vs'://对手的答题数据
				//resJson.guess_data => ['nums' =>10, 'shaizi' => 2] 对方猜的数据，如果是开就是结果数据
				//resJson.game_user_status 0进行中 1胜利 2失败
				if (resJson.game_user_status != 0)//继续猜
				{
					//resJson.guess_data对方猜的数据

				}
				else//开
				{
					//显示结果
					t.setData({
						'fight.timerHide': true,
						'fight.clickNumlistHide': true,
						'fight.clickNumlist2Hide': true,
						'fight.handshareHide': false,
						'fight.kaiGenHide': true,
						'result.hide': false
					});
					//resJson.guess_data 实际结果数据
					//resJson.game_user_status 胜利或失败
				}
				return true;
			case 'game_huihe'://更换回合
				//resJson.cur_play_uid 当前回合的uid
				return true;
			case 'game_end'://游戏胜利失败
				setTimeout(function () {
					wx.redirectTo({
						url: '/pages/online/online?tid=' + util.getOption('tid') + '&time=' + util.getOption('time') + "&point=" + encodeURIComponent(JSON.stringify(resJson.point)),
					})
				}, 1000);
				return true;
		}
		return false;
	},
*/
	//点击数量按钮
	click_numlist: function (e) {
		var num = 0, index = e.currentTarget.dataset.index,
			clickNumlist2 = this.data.fight.clickNumlist2.filter(function (val) {
				return val.clicked == true;
			}),
			clickNumlist = this.data.fight.clickNumlist.map(function (val, i) {
				if (val.locked == false && i == index) {
					val.clicked = true;
					num = val.id;
				} else {
					val.clicked = false;
				}
				return val;
			});
		this.setData({ 'fight.clickNumlist': clickNumlist });
		if (num > 0 && clickNumlist2.length > 0) {
			this.gameAni.showMsg('left', clickNumlist2[0].id, num);  //显示消息
		}
	},

	//点击骰子按钮
	click_numlist2: function (e) {
		var item = 0, clickNumlist = this.data.fight.clickNumlist.filter(function (val) {
			return val.clicked == true;
		}),
			clickNumlist2 = this.data.fight.clickNumlist2.map(function (val, i) {
				if (i == e.currentTarget.dataset.index) {
					val.clicked = true;
					item = val.id;
				} else {
					val.clicked = false;
				}
				return val;
			});
		this.setData({ 'fight.clickNumlist2': clickNumlist2 });
		if (clickNumlist.length > 0) {
			this.gameAni.showMsg('left', item, clickNumlist[0].id);  //显示消息
		} else {
			//计算对手的值，通过改值判断数量组是否可以点击
			var rightDialogData = this.data.user.right.dialogData;
			if (typeof (rightDialogData.item) != 'undefined') {
				var curSum = parseInt(rightDialogData.item) * parseInt(rightDialogData.total);
				this.setData({
					'fight.clickNumlist': this.data.fight.clickNumlist.map(function (val) {
						//查出比对手出的数还要大的项, 如果大于解锁，如果小于直接锁上,如果是1，直接锁上
						val.locked = (val.id == 1) ? true : (val.id * item > curSum ? false : true);
						return val;
					})
				});
			}
		}
	},
	//跟: 获取队友发送的数据，将数量加1
	click_gen: function () {
		var data = this.data.user.right.dialogData;	//对方之前发送的数据
		data.total += 1;
		this.gameAni.showMsg('left', data.item, data.total);  //显示消息
	},
	//开
	click_kai: function () {
		console.log('开');
	},
	click_replay: function () {
		console.log('重新玩');
	},

	getUserInfo: function (e) {

	}
})
