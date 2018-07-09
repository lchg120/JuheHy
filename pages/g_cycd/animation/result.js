module.exports = function (t) {
	var s = {}, app = getApp(), tween = app.tween, util = app.util, e = tween.fastGet("ResultView");
	return {
		init: function () {
			s["matchViewBox.ishide"] = true;
			s["fightView.ishide"] = false;
			s["fightView.vsViewTimeHide"] = true
			s["fightView.vsViewQuestion"] = true
			s["fightView.vsViewAnswerHide"] = true
			s["fightView.resultViewHide"] = false
      s['fightView.vsTipsHide'] = true
			t.setData(s);
		},
    show: function (glod, exp, lv, goodsNum, goodsId,xing,result){
			util.playsound(result == 'fail' ? 'cd_fail' : 'cd_success')
			e.wait(500), e.call(function () {
				var RSiconAni = wx.createAnimation();
				RSiconAni.opacity(1).scale(1).step({
					timingFunction: "ease-in", duration: 100,
				});
				//s["resultView.iconBgHide"] = result == 'success' ? false : true;
				s["resultView.result"] = result;
				s["resultView.iconAni"] = RSiconAni.export()
				t.setData(s);

			}), e.wait(500), e.call(function () {
				var a = wx.createAnimation()
				a.scale(1).opacity(1).step({
					timingFunction: "ease-in", duration: 300,
				});
				s["resultView.glodAni"] = a.export();
				t.setData(s);
			}),
			//记分动画
			e.wait(800), e.call(function(){
				var a = {}, b = wx.createAnimation()
				b.scale(1.4).step({ timingFunction: "ease-in", duration: 100 });
				a["resultView.glodNumAni"] = b.export()
				t.setData(a)
			}),
			e.tweenCall(function (e) {
				var a = {}
				a["resultView.glodNum"] = Math.ceil(glod*e)//------------------------------------------------glod
				t.setData(a)
			}, 300),
			e.call(function(){
				var a = {}, b = wx.createAnimation()
				b.scale(1).step({ timingFunction: "ease-in", duration: 100 })
				a["resultView.glodNumAni"] = b.export();
				t.setData(a);
			}),
			//线动画
			e.wait(100), e.call(function(){
				var RSlineAni = wx.createAnimation();
				RSlineAni.opacity(1).step({
					timingFunction: "ease-in", duration: 80,
				})
				s["resultView.lineAni"] = RSlineAni.export();
				t.setData(s);
			}),
			e.wait(500), e.call(function(){
				var RSexpAni = wx.createAnimation();
				RSexpAni.scale(1).opacity(1).step({
					timingFunction: "ease-in", duration: 300,
				})
				s["resultView.expAni"] = RSexpAni.export();
				t.setData(s);
			}),
			//计经验动画
			e.wait(800), e.call(function () {
				var a = {}, b = wx.createAnimation()
				b.scale(1.4).step({ timingFunction: "ease-in", duration: 100 });
				a["resultView.expNumAni"] = b.export()
				t.setData(a)
			}),
			e.tweenCall(function (e) {
				var a = {}
				a["resultView.expNum"] = Math.ceil(exp * e)//--------------------------------------exp
				t.setData(a)
			}, 300),
			e.call(function () {
				var a = {}, b = wx.createAnimation()
				b.scale(1).step({ timingFunction: "ease-in", duration: 100 })
				a["resultView.expNumAni"] = b.export();
				t.setData(a);
			}),
      //计宝箱动画
      e.wait(800), e.call(function () {
        var a = {}, b = wx.createAnimation();
        b.scale(1).opacity(1).step({
          timingFunction: "ease-in", duration: 100,
        })
        a["resultView.goodsAni"] = b.export();
        t.setData(a);
      }),
      e.tweenCall(function (e) {
        var a = {}
        a["resultView.goodsNum"] = Math.ceil(goodsNum * e)//--------------------------------------goodsNum
        if (goodsNum)
        {
          a["resultView.goodsId"] = goodsId//--------------------------------------goodsId
        }else{
          a["resultView.goodsId"] = 3;
        }
        t.setData(a)
      }, 300),
      e.call(function () {
        var a = {}, b = wx.createAnimation()
        b.scale(1).opacity(1).step({ timingFunction: "ease-in", duration: 100 })
        a["resultView.goodsNumAni"] = b.export();
        t.setData(a);
      }),
      //计等级动画
      e.wait(800), e.call(function () {
        var a = {},b = wx.createAnimation();
        b.scale(1).opacity(1).step({
          timingFunction: "ease-in", duration: 100,
        })
        a["resultView.lvAni"] = b.export();
        t.setData(a);
      }),
      e.tweenCall(function (e) {
        var a = {}
        a["resultView.lvNum"] = Math.ceil(xing * e)//--------------------------------------------xing
        t.setData(a)
      }, 300),
      e.call(function () {
        var a = {}, b = wx.createAnimation()
        b.scale(1).opacity(1).step({ timingFunction: "ease-in", duration: 100 })
        a["resultView.lvNumAni"] = b.export();
        t.setData(a);
      }),
			//按钮动画
			e.wait(500),e.call(function(){
				var RScontinueAni = wx.createAnimation();
				RScontinueAni.scale(1).opacity(1).step({
					timingFunction: "ease-in", duration: 300,
				})
				s["resultView.continueAni"] = RScontinueAni.export();
				t.setData(s);
			}),e.wait(500), e.call(function () {
				var RSshareAni = wx.createAnimation();
				RSshareAni.opacity(1).scale(1.5, 1.5).step({
					timingFunction: "ease-in", duration: 300,
				}).scale(1, 1).step({
					timingFunction: "ease-in", duration: 150,
				})
				s["resultView.shareAni"] = RSshareAni.export();
				t.setData(s);
			}),
      //等级提升动画
      e.wait(500), e.call(function () {
        var RSlvUpAni = wx.createAnimation();
        RSlvUpAni.scale(1).opacity(1).step({
          timingFunction: "ease-in", duration: 300,
        })
        s["resultView.lvUpAni"] = RSlvUpAni.export();
        if(lv){
          s['lv'] = lv;//--------------------------------------------lv
          s['lvUpHide'] = false;
        }
        t.setData(s);
      })
		}
	}
}