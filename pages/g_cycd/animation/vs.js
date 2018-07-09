module.exports = function (t) {
	var app = getApp(), tween = app.tween, util = app.util, e = tween.fastGet("fightView");
	var s = {}, present = 100, timestart = 0;
	return {
		init: function () {
			var ts = this;
			e.wait(1000),
				e.call(function () {
					var matchOut = wx.createAnimation();
					matchOut.scale(0).step({
						timingFunction: "ease-in", duration: 200
					}).opacity(0).step({
						timingFunction: "ease-out", duration: 200
					});
					s["matchViewBox.matchViewBoxAni"] = matchOut.export();
					t.setData(s);
				}),
				//进入对战界面
				e.wait(420),
				e.call(function () {
					s["matchViewBox.ishide"] = true;
					s["matchViewBox.waitViewHide"] = true;
					s["fightView.ishide"] = false;
					s["fightView.vsViewTimeHide"] = false;
					// s["fightView.vsViewQuestion"] = false;
					// s["fightView.vsViewAnswerHide"] = false;
					t.setData(s);
				});
				//直接显示第一题
				// e.call(function () {
        //   ts.chgQusBefore();
				// })
        // e.wait(2000)
        // e.call(function(){
        //   ts.changeQuestion(t.data.question.phrase, t.data.question.answer, t.data.question.tips, t.data.question.new_tips, true);
        // });
		},

		//实时推送时间过来:9 8 7 6 5 4 3 2 1 0
		timeChange: function (timeSec) {
			var a = {};
			a["fightView.timeLimit"] = timeSec
			a["fightView.timeWidth"] = (timeSec / t.data.fightView.startTime) * 100;
			t.setData(a);
		},
		timeAni: function () {
			var ts = this; clearInterval(timechange)
			timechange = setInterval(function () {
				if (i < timestart) {
					i++;
					showNum = timestart - i, present = (i / 10) * 100;
					s["fightView.timeLimit"] = showNum
					s["fightView.timeWidth"] = present;
					t.setData(s);
				}
			}, 1000);
		},

    //切换题目过度
    chgQusBefore : function()
    {
      var dijitiPic = Number(t.data.fightView.dijitiPic);
      dijitiPic++;
      var e = tween.fastGet(Math.random());
      if (dijitiPic > 1)
      {
        e.call(function () {
          var ani = wx.createAnimation();
          ani.left('-500rpx').opacity(0).step({
            timingFunction: "ease-in", duration: 150,
          }).left('0').step({
            timingFunction: "step-start", duration: 0
          });
          t.setData({
            "fightView.questionAni": ani.export()
          });
        }),
        e.wait(1000);
      }
      e.call(function () {
        var a = wx.createAnimation();
        a.opacity(1).step({
          timingFunction: "ease-in", duration: 100
        });

        t.setData({
          'fightView.vsTipsHide': true,
          "fightView.dijitiHide": false,
          "fightView.dijitiPic": dijitiPic,
          "fightView.vsViewQuestion": true,
          "fightView.vsViewAnswerHide": true,
          "fightView.questionAni": a.export(),
        });
      });
    },

		//切换下一题动画
		changeQuestion: function (phrase, answer, tips, new_tips, isfirst) {
			var truephrase = [];
			for (var i = 0; i < phrase.length; i++) {
				if (phrase[i]['icon'] == 'true') {
					truephrase.push({ "index": i, "text": phrase[i]['text'] });
				}
			}
			var e = tween.fastGet(Math.random())
      e.call(function () {
        var ani = wx.createAnimation();
        ani.left('-500rpx').opacity(0).step({
          timingFunction: "ease-in", duration: 150,
        }).left('0').step({
          timingFunction: "step-start", duration: 0
        });
        t.setData({
          "fightView.questionAni": ani.export()
        });
      }),
      e.wait(1000),
      e.call(function () {
        var a = wx.createAnimation();
        a.opacity(1).step({
          timingFunction: "ease-in", duration: 100
        });
        t.setData({
          "clickAnswer": false,
          "clickAnswerList": [],
          "question.truephrase": truephrase,
          "rightview.clickAnswer": '',

          'fightView.vsTipsHide':false,
          "fightView.dijitiHide": true,
          "fightView.vsViewQuestion": false,
          "fightView.vsViewAnswerHide": false,

          "question.phrase": phrase,
          "question.answer": answer,
          "question.tips": tips,
          "question.new_tips": new_tips,
          
          "clickAnswer": false,

          "fightView.questionAni": a.export(),
        });
      }),
			e.wait(1000),
			e.call(function(){
				var ani = wx.createAnimation()
				ani.scale(1.4).step({ timingFunction: "ease-in", duration: 100 });
        ani.scale(1).step({ timingFunction: "ease-in", duration: 100, delay:100 });
				t.setData({'fightView.topicAni':ani.export()});
			});
			// e.wait(100);
			// e.call(function () {
			// 	var ani = wx.createAnimation()
			// 	ani.scale(1).step({ timingFunction: "ease-in", duration: 100 });
			// 	t.setData({ 'fightView.topicAni': ani.export() });
			// });
		},

		//分数改变动画：自己的分数
		changeScoreL: function (num) {
			util.playsound('addscore.mp3');
			var ts = this;
			var l = tween.fastGet("fightViewLeft")
			l.call(function () {
				var b = wx.createAnimation(), c = wx.createAnimation();
				b.scale(1.4).step({ timingFunction: "ease-in", duration: 100 });
				c.opacity(.8).top('-10rpx').step({ timingFunction: "ease-in", duration: 200 });
				t.setData({
					"leftview.addScore": num,
					"leftview.currScoreAni": b.export(),
					"leftview.addScoreAni": c.export()

				})
			})
			l.wait(100)
			var lastE = 0;
			l.tweenCall(function (e) {
				var curE = Math.floor(e * 10);
				var curPoint = parseFloat(t.data.leftview.currScore) + ((curE - lastE) / 10 * num);
				curPoint = curPoint.toFixed(1)
				t.setData({ "leftview.currScore": parseInt(curPoint)})
				t.data.leftview.currScore = curPoint;
				lastE = curE;
			}, 300)
			l.wait(200)
			l.call(function () {
				var b = wx.createAnimation(), c = wx.createAnimation();
				b.scale(1).step({ timingFunction: "ease-in", duration: 100 })
				c.opacity(0).top('58rpx').step({ timingFunction: "ease-in", duration: 10 })
				t.setData({ "leftview.currScoreAni": b.export(), "leftview.addScoreAni": c.export() });
			});
			tween.removeTweens(l)
		},
		//分数改变动画：对手的分数
		changeScoreR: function (num) {
			var ts = this;
			var l = tween.fastGet("fightViewRight")
			l.call(function () {
				var b = wx.createAnimation(), c = wx.createAnimation();
				b.scale(1.4).step({ timingFunction: "ease-in", duration: 100 });
				c.opacity(.8).top('-10rpx').step({ timingFunction: "ease-in", duration: 200 });
				t.setData({
					"rightview.addScore": num,
					"rightview.currScoreAni": b.export(),
					"rightview.addScoreAni": c.export()

				})
			}),
			l.wait(100)
			var lastE = 0;
			l.tweenCall(function (e) {
				var curE = Math.floor(e * 10);
				var curPoint = parseFloat(t.data.rightview.currScore) + ((curE - lastE) / 10 * num);
				curPoint = curPoint.toFixed(1)
				t.setData({ "rightview.currScore": parseInt(curPoint) })
				t.data.rightview.currScore = curPoint;
				lastE = curE;
			}, 300)
			l.wait(200),
			l.call(function () {
				var b = wx.createAnimation(), c = wx.createAnimation();
				b.scale(1).step({ timingFunction: "ease-in", duration: 100 })
				c.opacity(0).top('58rpx').step({ timingFunction: "ease-in", duration: 10 })
				t.setData({
					"rightview.currScoreAni": b.export(),
					"rightview.addScoreAni": c.export()
				});
			});
			tween.removeTweens(l)
		}
	}
}