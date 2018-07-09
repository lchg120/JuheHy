var d = {}

d.canvasClock = function (i, time, _that) {
  var that = _that;
  // console.log(i+","+time);
  var ctx = wx.createContext()
  //重置画布函数
  function reSet() {
    // ctx.height = ctx.h;
    ctx.translate(20, 20);  //坐标轴点
    ctx.save(); //保存中点坐标
  }
  //绘制中心圆和外面大圆
  function circle() {
    var circlePI = 2 * Math.PI; //优化canvas的计算次数
    //外面大圆
    ctx.setStrokeStyle('#cccccc');
    ctx.setLineWidth(2);
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, circlePI, true);
    ctx.closePath();
    ctx.stroke();
  }
  //指针运行函数
  function move() {
    // var t = new Date(); 
    time = new Date(time * 1000);
    var h = time.getHours(); //小时
    h = h > 12 ? (h - 12) : h;   //将24小时转化为12小时
    var m = time.getMinutes(); //分针
    var s = time.getSeconds(); //秒针
    var tR = -Math.PI / 2;  //计算时间的PI
    var hR = (Math.PI / 6) * (h + m / 60 + s / 3600); //计算时针的PI
    var mR = (Math.PI / 30) * (m + s / 60); //计算分针的PI
    ctx.rotate(tR); //时间从3点开始，倒转90度
    ctx.save(); //再次保存
    ctx.setLineWidth(2);
    ctx.beginPath();
    //绘制时针
    ctx.rotate(hR);
    ctx.setStrokeStyle('#cccccc');
    ctx.moveTo(0, 0);
    ctx.lineTo(7, 0);
    ctx.stroke();
    ctx.restore();  //恢复到2，避免旋转叠加
    ctx.save(); //3
    //绘制分针
    ctx.setLineWidth(2);
    ctx.beginPath();
    ctx.rotate(mR);
    ctx.setStrokeStyle('#aaaaaa');
    ctx.moveTo(0, 0);
    ctx.lineTo(9, 0);
    ctx.stroke();
    ctx.restore();  //恢复到3, 最初状态
    ctx.save();
  }
  //调用
  function drawClock() {
    reSet();
    circle();
    move();
  }
  drawClock();
  wx.drawCanvas({
    canvasId: 'myCanvas_' + i,
    actions: ctx.getActions()
  });
  setTimeout(function () {
    ctx.draw(false, wx.canvasToTempFilePath({
      width: 35,
      height: 36,
      canvasId: 'myCanvas_' + i,
      success: function (resImg) {
        console.log("img......" + i)
        console.log(resImg)
        that.data.user[i].timeimg = resImg.tempFilePath;
        that.setData({ user: that.data.user });
      },
      fail: function (e) {
        console.log(e)
      }
    }, this))
  }, 1000)
}

module.exports = d;