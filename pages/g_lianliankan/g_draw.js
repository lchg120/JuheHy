var d = {

}
d.line_x0 = function(x){
  var _x0 = [0, 49, 96, 148, 197, 247, 296];
  return _x0[x];
}
d.line_y0 = function(y){
  var _y0 = [0, 44, 88, 132, 176, 220, 264, 308, 352, 396];
  return _y0[y];
}
d.line_x = function(x){
  var _x = [19, 69, 119, 169, 217, 267, 317];
  return _x[x];
}
d.line_y = function(y){
  var _y = [19, 64, 108, 152, 196, 241, 285, 329, 372, 415];
  return _y[y];
}
//直线
d.drawline = function(_this,array){
  const ctx = wx.createCanvasContext(_this.data.myCanvas)
  ctx.setFillStyle('red');
  for(var i=0;i<array.length;i++){
    if (array[i].d == 'x') {
      var x = array[i].x*48;
      var y = d.line_y(array[i].y);
      ctx.fillRect(x, y, 48, 1);
    } else if (array[i].d == 'y') {
      var x = d.line_x(array[i].x);
      var y = array[i].y*48;
      ctx.fillRect(x, y, 1, 48);
    }
  }
  ctx.draw();
}
//检查方向
d.checkfx = function (xy, x1, y1, x2, y2) {
  var _d = null;//0:向右转下,1:向下转右,2:向右转上,3:向上转右,4:向左转下,5:向下转左,6:向左转上,7:向上转左
  // console.log('x1='+x1+',x2='+x2+',y1='+y1+',y2='+y2);
  // console.log(xy);
  if (x1 < x2) {
    if (y1 < y2) {
      //右下方
      if (xy.y == y1) {
        //向右转下
        _d = 0;
      } else {
        //向下转右
        _d = 1;
      }
    } else {
      //右上方
      if (xy.y == y1) {
        //向右转上
        _d = 2;
      } else {
        //向上转右
        _d = 3;
      }
    }
  } else {
    if (y1 < y2) {
      //左下方
      if (xy.y == y1) {
        //向左转下
        _d = 4;
      } else {
        //向下转左
        _d = 5;
      }
    } else {
      //左上方
      if (xy.y == y1) {
        //向左转上
        _d = 6;
      } else {
        //向上转左
        _d = 7;
      }
    }
  }
  return _d;
}
//转一个直角
d.drawjiao1 = function (_this, array , x1, y1, x2, y2) {
  const ctx = wx.createCanvasContext(_this.data.myCanvas)
  ctx.setFillStyle('red');
  //找转角下标和方向
  var index = {};
  var xy0 = '';
  var xy1 = '';
  var _d = null;
  if (array.length == 1){
    _d = d.checkfx({ x: array[0].x, y: array[0].y }, x1, y1, x2, y2);
    if (array[0].d == 'x'){
      array.push({ x: array[0].x, y: array[0].y, d: 'y' })
      index = {x:0,y:1,d:_d}
    }else{
      array.push({ x: array[0].x, y: array[0].y, d: 'x' })
      index = { x: 1, y: 0, d: _d }
    }
  }else{
    if (array[0].d == 'x'){
      for1:
      for (var n = 0; n < array.length; n++) {
        xy0 = array[n].x + ',' + array[n].y;
        for2:
        for (var m = n + 1; m < array.length; m++) {
          xy1 = array[m].x + ',' + array[m].y;
          if(xy0 == xy1){
            _d = d.checkfx({ x: array[m].x, y: array[m].y }, x1, y1, x2, y2);
            index = {x:n,y:m,d:_d};
            break for1;
          }
        }
      }
    }else{
      for1:
      for (var n = 0; n < array.length; n++) {
        xy0 = array[n].x + ',' + array[n].y;
        for2:
        for (var m = n + 1; m < array.length; m++) {
          xy1 = array[m].x + ',' + array[m].y;
          if (xy0 == xy1) {
            _d = d.checkfx({ x: array[m].x, y: array[m].y }, x1, y1, x2, y2);
            index = { x: m, y: n, d: _d };
            break for1;
          }
        }
      }
    }
  }
  // console.log(_d);
  // console.log(index)
  //画线
  for (var i = 0; i < array.length; i++) {
    if (array[i].d == 'x') {
      var x = d.line_x0(array[i].x);//array[i].x*48;
      var y = d.line_y(array[i].y);
      console.log(x+",,,"+y)
      if (i == index.x){//转角从标
        switch(index.d){
          case 0://向右转下
            ctx.fillRect(x, y, 24, 1);
            break;
          case 1://向下转右
            ctx.fillRect(x+24, y, 24, 1);
            break;
          case 2://向右转上
            ctx.fillRect(x, y, 24, 1);
            break;
          case 3://向上转右
            ctx.fillRect(x+24, y, 24, 1);
            break;
          case 4://向左转下
            ctx.fillRect(x+24, y, 24, 1);
            break;
          case 5://向下转左
            ctx.fillRect(x, y, 24, 1);
            break;
          case 6://向左转上
            ctx.fillRect(x+24, y, 24, 1);
            break;
          case 7://向上转左
            ctx.fillRect(x, y, 24, 1);
            break;
        }
      }else{
        ctx.fillRect(x, y, 48, 1);
      }
    } else if (array[i].d == 'y') {
      var x = d.line_x(array[i].x);
      var y = array[i].y*44;
      console.log('i='+i+',index.y='+index.y);
      if (i == index.y) {
        switch (index.d) {
          case 0://向右转下
            ctx.fillRect(x, y+24, 1, 24);
            console.log('y:向右转下');
            break;
          case 1://向下转右
            ctx.fillRect(x, y, 1, 24);
            console.log('y:向下转右');
            break;
          case 2://向右转上
            ctx.fillRect(x, y, 1, 24);
            console.log('y:向右转上,'+y);
            break;
          case 3://向上转右
            ctx.fillRect(x, y+24, 1, 24);
            console.log('y:向上转右,' + y);
            break;
          case 4://向左转下
            ctx.fillRect(x, y+24, 1, 24);
            console.log('y:向左转下,' + y);
            break;
          case 5://向下转左
            ctx.fillRect(x, y, 1, 24);
            console.log('y:向下转左,' + y);
            break;
          case 6://向左转上
            ctx.fillRect(x, y, 1, 24);
            console.log('y:向左转上,' + y);
            break;
          case 7://向上转左
            ctx.fillRect(x, y+24, 1, 24);
            console.log('y:向上转左,' + y);
            break;
        }
      } else {
        ctx.fillRect(x, y, 1, 44);
      }
    }
  }
  ctx.draw();
}
//转两个直角
d.drawjiao2 = function (_this, array, x1, y1, x2, y2) {
  const ctx = wx.createCanvasContext(_this.data.myCanvas)
  ctx.setFillStyle('red')
  //找转角下标和方向
  var xy0 = '';
  var xy1 = '';
  for (var n = 0; n < array.length; n++) {
    xy0 = array[n].x + ',' + array[n].y;
    for (var m = n + 1; m < array.length; m++) {
      xy1 = array[m].x + ',' + array[m].y;
      if (xy0 == xy1) {
        array[n].istr = 1;
        array[m].istr = 1;
      }
    }
  }
  console.log(array);
  //画线
  if(array[0].d == 'x'){
    for (var i = 0; i < array.length; i++) {
      if (array[i].d == 'x') {
        var x = d.line_x0(array[i].x);
        var y = d.line_y(array[i].y);
        if (array[i].istr == 1) {//转角坐标
          if (i == 0 || i == array.length - 1) {
            if (array[i].two == 1) {//第二次转角
              if (array[i].tr == 'r') {//向右
                ctx.fillRect(x + 24, y, 24, 1);
              } else {//向左
                ctx.fillRect(x, y, 24, 1);
              }
            } else {//第一次转角
              if (array[i].tr == 'r') {//向右
                ctx.fillRect(x, y, 24, 1);
              } else {//向左
                ctx.fillRect(x + 24, y, 24, 1);
              }
            }
          } else {
            if (array[i].two == 1) {//第二次转角
              if (array[i].tr == 'r') {//向右
                ctx.fillRect(x + 24, y, 24, 1);
              } else {//向左
                ctx.fillRect(x, y, 24, 1);
              }
            }else{
              if (array[i].tr == 'r') {//向右
                ctx.fillRect(x, y, 24, 1);
              } else {//向左
                ctx.fillRect(x + 24, y, 24, 1);
              }
            }
          }
        } else {
          ctx.fillRect(x, y, 48, 1);
        }
      } else if (array[i].d == 'y') {
        var x = d.line_x(array[i].x);
        var y = array[i].y * 44;
        if (array[i].istr == 1) {//转角坐标
          if (i == 0 || i == array.length - 1) {
            if (array[i].two == 1) {//第二次转角
              if (array[i].tr == 'd') {//向下
                ctx.fillRect(x, y + 24, 1, 24);
              } else {//向上
                ctx.fillRect(x, y, 1, 24);
              }
            } else {//第一次转角
              if (array[i].tr == 'd') {//向下
                ctx.fillRect(x, y, 1, 24);
              } else {//向上
                ctx.fillRect(x, y + 24, 1, 24);
              }
            }
          } else {
            if (array[i].tr == 'd') {//向下
              ctx.fillRect(x, y + 24, 1, 24);
            } else {//向上
              ctx.fillRect(x, y, 1, 24);
            }
          }
        } else {
          ctx.fillRect(x, y, 1, 44);
        }
      }
    }
  }else{
    for (var i = 0; i < array.length; i++) {
      if (array[i].d == 'x') {
        var x = d.line_x0(array[i].x);
        var y = d.line_y(array[i].y);
        if (array[i].istr == 1) {//转角坐标
          if (i == 0 || i == array.length - 1) {
            if (array[i].two == 1) {//第二次转角
              if (array[i].tr == 'r') {//向右
                ctx.fillRect(x + 24, y, 24, 1);
              } else {//向左
                ctx.fillRect(x, y, 24, 1);
              }
            } else {//第一次转角
              if (array[i].tr == 'r') {//向右
                ctx.fillRect(x, y, 24, 1);
              } else {//向左
                ctx.fillRect(x + 24, y, 24, 1);
              }
            }
          } else {
            if (array[i].tr == 'r') {//向右
              ctx.fillRect(x + 24, y, 24, 1);
            } else {//向左
              ctx.fillRect(x, y, 24, 1);
            }
          }
        } else {
          ctx.fillRect(x, y, 48, 1);
        }
      } else if (array[i].d == 'y') {
        var x = d.line_x(array[i].x);
        var y = array[i].y * 44;
        if (array[i].istr == 1) {//转角坐标
          if (i == 0 || i == array.length - 1) {
            if (array[i].two == 1) {//第二次转角
              if (array[i].tr == 'd') {//向下
                ctx.fillRect(x, y + 24, 1, 24);
              } else {//向上
                ctx.fillRect(x, y, 1, 24);
              }
            } else {//第一次转角
              if (array[i].tr == 'd') {//向下
                ctx.fillRect(x, y, 1, 24);
              } else {//向上
                ctx.fillRect(x, y + 24, 1, 24);
              }
            }
          } else {
            if (array[i].two == 1) {//第二次转角
              if (array[i].tr == 'd') {//向下
                ctx.fillRect(x, y + 24, 1, 24);
              } else {//向上
                ctx.fillRect(x, y, 1, 24);
              }
            }else{
              if (array[i].tr == 'd') {//向下
                ctx.fillRect(x, y, 1, 24);
              } else {//向上
                ctx.fillRect(x, y + 24, 1, 24);
              }
            }
          }
        } else {
          ctx.fillRect(x, y, 1, 44);
        }
      }
    }
  }
  ctx.draw();
}
//清聊除画线
d.drawclear = function (_this, array) {
  const ctx = wx.createCanvasContext(_this.data.myCanvas)
  ctx.setFillStyle('red')
  var a = 42;
  for (var i = 0; i < array.length; i++) {
    if (array[i].d == 'x') {
      var x = array[i].x * a + 5;
      var y = array[i].y;
      if (y == 0) {
        y = 25;
      } else {
        y = y * a + 21;
      }
      ctx.fillRect(x, y, 0, 0);
    } else if (array[i].d == 'y') {
      var x = array[i].x;
      if (x == 0) {
        x = 25;
      } else {
        x = x * a + 25;
      }
      var y = array[i].y * a;
      ctx.fillRect(x, y, 0, 0);
    }
  }
  ctx.draw();
}

module.exports = d