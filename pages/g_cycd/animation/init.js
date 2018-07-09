module.exports = function(t){
	var app = getApp(), s = {}, tween = app.tween, socket = app.socket, util = app.util, e = tween.fastGet("fightView");
	return {
		jiguTimer:null,
		init: function(){	
			var _this = this;
      var e = tween.fastGet("MatchView");
      e.call(function () {
        t.setData({
          "matchViewBox.waitViewHide": true,
          "matchViewBox.matchViewHide": false
        });
      }),
      e.wait(200), e.call(function () {
        var leftani = wx.createAnimation();
        var rightani = wx.createAnimation();
        var vslogoani = wx.createAnimation();
        leftani.left("-294rpx").step({ timingFunction: "ease-in", duration: 150, delay: 0 });
        rightani.right("-294rpx").step({ timingFunction: "ease-in", duration: 150, delay: 200 });
        vslogoani.opacity(1).scale(.6).step({ timingFunction: "ease-in", duration: 300, delay: 600 }).scale(1).step({ timingFunction: "ease-out", duration: 150 });
        t.setData({
          "matchViewBox.waitViewHide": true,
          "matchViewBox.matchViewLeftAni": leftani.export(),
          "matchViewBox.matchViewRightAni": rightani.export(),
          "matchViewBox.matchViewLogoAni": vslogoani.export()
        });
        });
		},


	}
}