var p = {

}

/**
 * 坐标点是相邻
 */
p.point_xl = function(ts,x1,y1,x2,y2){
 var istrue = false;
 if(x1 == x2){//同一列
   if (y1 > y2 && y1 - y2 == 1) {//相邻
    istrue = true;
   } else if (y2 > y1 && y2 - y1 == 1) {//相邻
     istrue = true;
   }
 }else if(y1 == y2){
   if (x1 > x2 && x1 - x2 == 1) {//相邻
     istrue = true;
   } else if (x2 > x1 && x2 - x1 == 1) {//相邻
     istrue = true;
   }
 }
 return istrue;
}

/**
 * 在一条直线上中间没有其他图标
 */
p.point_line = function(ts, x1, y1, x2, y2){
  var istrue = true;
  var array = [];//画线数组
  if(x1 == x2){//同一列的直线
    if(y1>y2){
      for(var i=y1-1;i>y2;i--){
        array.push({x:x1,y:i,d:'y'});
        if (ts.data.row[i][x1] != '') {//中间有图标
          istrue = false;
          array = [];//重置画线数组
          console.log('false1')
          break;
        }
      }
      i = undefined;//释放i
    }else{
      for (var i = y1 + 1; i < y2; i++) {
        array.push({ x: x1, y: i, d: 'y' });
        if (ts.data.row[i][x1] != '') {//中间有图标
          istrue = false;
          array = [];//重置画线数组
          console.log('false2')
          break;
        }
      }
      i = undefined;//释放i
    }
  }else if(y1 == y2){//同一行的直线
    if (x1 > x2) {
      for (var i = x1 - 1; i > x2; i--) {
        array.push({ x: i, y: y1, d: 'x' });
        if (ts.data.row[y1][i] != '') {//中间有图标
          istrue = false;
          array = [];//重置画线数组
          console.log('false3')
          break;
        }
      }
      i = undefined;//释放i
    } else {
      for (var i = x1 + 1; i < x2; i++) {
        array.push({ x: i, y: y1, d: 'x' });
        if (ts.data.row[y1][i] != '') {//中间有图标
          istrue = false;
          array = [];//重置画线数组
          console.log('false4')
          break;
        }
      }
      i = undefined;//释放i
    }
  }else{
    istrue = false;
    array = [];//重置画线数组
    console.log('false5')
  }
  ts.setData({lineArray:array});
  console.log('return:'+istrue)
  return istrue;
}

/**
 * 转一次直角情况
 */
p.point_firstzj = function(ts,x1,y1,x2,y2){
  var istrue = true;
  var array = [];//画线数组
  if (x1 < x2) {//终点在右边
    if (y1 < y2) {//终点在右下方
      console.log('终点在右下方')
      //路径法1:优先向右直行在转角向下
      for (var i = x1 + 1; i <= x2; i++) {
        if (ts.data.row[y1][i] != '') {
          istrue = false;
          break;
        } else {
          array.push({ x: i, y: y1, d: 'x' });
          if (i == x2) {//转角处
            for (var j = y1; j < y2; j++) {
              if (ts.data.row[j][x2] != '') {
                istrue = false;
                break;
              }
              array.push({ x: x2, y: j, d: 'y' });
            }
            j = undefined;
          }
        }
      }//end 路径法1:优先向右直行在转角向下
      i = undefined;
      //路径法2:优先向下直行在转角向右
      if(istrue == false){
        array = [];//重置画线数组
        istrue = true;
        for (var i = y1 + 1; i <= y2; i++){
          if(ts.data.row[i][x1] != ''){
            istrue = false;
            break;
          }else{
            array.push({ x: x1, y: i, d: 'y' });
            if (i == y2) {//转角处
              for (var j = x1; j < x2; j++){
                if(ts.data.row[y2][j] != ''){
                  istrue = false;
                  break;
                }
                array.push({ x: j, y: y2, d: 'x' });
              }
              j = undefined;
            }
          }
        }
      }//end 路径法2:优先向下直行在转角向右
      i = undefined;
    } else if(y1 > y2) {//终点在右上方
      console.log('终点在右上方')
      //路径法1:优先向右直行在转角向上
      for (var i = x1 + 1; i <= x2; i++) {
        if(ts.data.row[y1][i] != ''){
          istrue = false;
          break;
        }else{
          array.push({ x: i, y: y1, d: 'x' });
          if (i == x2) {//转角处
            array.push({ x: i, y: y1, d: 'y' });
            for (var j = y1 - 1; j > y2; j--) {
              if(ts.data.row[j][x2] != ''){
                istrue = false;
                break;
              }
              array.push({ x: x2, y: j, d: 'y' });
            }
            j = undefined;
          }
        }
      }
      i = undefined;
      //路径法2:优先向上直行在转角向右
      if(istrue == false){
        array = [];//重置画线数组
        istrue = true;
        for (var i = y1 - 1; i >= y2; i--) {
          if(ts.data.row[i][x1] != ''){
            istrue = false;
            break;
          }else{
            array.push({ x: x1, y: i, d: 'y' });
            if (i == y2) {//转角处
              for (var j = x1; j < x2; j++) {
                if(ts.data.row[y2][j] != ''){
                  istrue = false;
                  break;
                }
                array.push({ x: j, y: y2, d: 'x' });
              }
              j = undefined;
            }
          }
        }
        i = undefined;
      }
    } else {
      array = [];//重置画线数组
      istrue = false;
    }
  }else if(x1 > x2){//终点在左边
    if (y1 < y2) {//终点在左下方
      console.log('终点在左下方')
      //路径法1:优先向左直行在转角向下
      for (var i = x1 - 1; i >= x2; i--) {
        if(ts.data.row[y1][i] != ''){
          istrue = false;
          break;
        }else{
          array.push({ x: i, y: y1, d: 'x' });
          if (i == x2) {//转角处
            for (var j = y1; j < y2; j++) {
              if(ts.data.row[j][x2] != ''){
                istrue = false;
                break;
              }
              array.push({ x: x2, y: j, d: 'y' });
            }
            j = undefined;
          }
        }
      }
      i = undefined;
      //路径法2:优先向下直行在转角向左
      if(istrue == false){
        console.log('路径法2:优先向下直行在转角向左')
        array = [];//重置画线数组
        istrue = true;
        for (var i = y1 + 1; i <= y2; i++) {
          if(ts.data.row[i][x1] != ''){
            istrue = false;
            break;
          }else{
            array.push({ x: x1, y: i, d: 'y' });
            if (i == y2) {//转角处
              for (var j = x1; j > x2; j--) {
                if(ts.data.row[y2][j] != ''){
                  istrue = false;
                  break;
                }
                array.push({ x: j, y: y2, d: 'x' });
              }
              j = undefined;
            }
          }
        }
        i = undefined;
      }
    } else if(y1 > y2) {//终点在左上方
      console.log('终点在左上方')
      //路径法1:优先向左直行在转角向上
      for (var i = x1 - 1; i >= x2; i--) {
        if (ts.data.row[y1][i] != '') {
          istrue = false;
          break;
        }else{
          array.push({ x: i, y: y1, d: 'x' });
          if (i == x2) {//转角处
            for (var j = y1; j > y2; j--) {
              if (ts.data.row[j][x2] != '') {
                istrue = false;
                break;
              }
              array.push({ x: x2, y: j, d: 'y' });
            }
            j = undefined;
          }
        }
      }
      i = undefined;
      //路径法2:优先向上直行在转角向左
      if(istrue == false){
        array = [];//重置画线数组
        istrue = true;
        for (var i = y1 - 1; i >= y2; i--) {
          if (ts.data.row[i][x1] != '') {
            istrue = false;
            break;
          }else{
            array.push({ x: x1, y: i, d: 'y' });
            if (i == y2) {//转角处
              for (var j = x1; j > x2; j--) {
                if (ts.data.row[y2][j] != '') {
                  istrue = false;
                  break;
                }
                array.push({ x: j, y: y2, d: 'x' });
              }
              j = undefined;
            }
          }
        }
        i = undefined;
      }
    } else {
      istrue = false;
      array = [];//重置画线数组
    }
  } else {
    istrue = false;
    array = [];//重置画线数组
  }
  console.log('return:' + istrue)
  ts.setData({ lineArray: array });
  return istrue;
}

/**
 * 转两次直角情况
 */
p.point_twozj = function (ts, x1, y1, x2, y2){
  var istrue = false;
  var array = [];//画线数组
  //路径1:优先向右侧查找
  for(var i = x1 + 1; i <= 6; i++){
    if(ts.data.row[y1][i] == ''){
      array.push({x: i, y: y1, d: 'x', tr: 'r' });
      if(y1 < y2){//向下查找
        var j0 = 0;
        for(var j = y1; j <= y2; j++){
          j0 = j0 + 1;
          if(ts.data.row[j][i] != ''){
            array.splice(-(array.length - 1), j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: i, y: j, d: 'y', tr: 'd' });
            if(j == y2) {//第二次转角处
              array[array.length - 1].tr = 'u';
              array[array.length - 1].two = 1;
              if(i < x2){//第二次向右转
                var j1 = 0;
                for(var n = i; n < x2; n++){
                  j1 = j1 + 1;
                  if(ts.data.row[j][n] != ''){
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: n, y: j, d: 'x', tr: 'r',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'r' });
                    }
                    if (n == x2 - 1) {//相邻了
                      ts.setData({ lineArray: array });
                      console.log('向右向下在向右')
                      return true;
                    }
                  }
                }
              } else {//第二次向左转
                var j1 = 0;
                for (var n = i; n > x2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[j][n] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if (n == i) {
                      array.push({x: n, y: j, d: 'x', tr: 'l',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'l' });
                    }
                    if (n == x2 + 1) {//相邻了
                      ts.setData({ lineArray: array });
                      console.log('向右向下在向左')
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      } else if (y1 > y2) {//在向上查找
        var j0 = 0;
        for (var j = y1; j >= y2; j--) {
          j0 = j0 + 1;
          if (ts.data.row[j][i] != '') {
            array.splice(-(array.length - 1), j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: i, y: j, d: 'y', tr: 'u' });
            if (j == y2) {//第二次转角处
              array[array.length - 1].tr = 'd';
              array[array.length - 1].two = 1;
              if (i < x2) {//第二次向右转
                var j1 = 0;
                for (var n = i; n < x2; n++) {
                  j1 = j1 + 1;
                  if (ts.data.row[j][n] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: n, y: j, d: 'x', tr: 'r',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'r' });
                    }
                    if (n == x2 - 1) {//相邻了
                      console.log('向右向上在向右')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              } else {//第二次向左转
                var j1 = 0;
                for (var n = i; n > x2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[j][n] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: n, y: j, d: 'x', tr: 'l',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'l' });
                    }
                    if (n == x2 + 1) {//相邻了
                      console.log('向右向上在向左')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      array = [];//重置画线数组
      break;
    }
  }
  i = undefined;
  j = undefined;
  n = undefined;
  //路径2:向左侧查找
  for(var i = x1 - 1; i >= 0; i--){
    if(ts.data.row[y1][i] == ''){
      array.push({x: i, y: y1, d: 'x', tr: 'l' });
      if(y1 < y2) {//向下查找
        var j0 = 0;
        for (var j = y1; j <= y2; j++) {
          j0 = j0 + 1;
          if (ts.data.row[j][i] != '') {
            array.splice(-(array.length - 1), j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: i, y: j, d: 'y', tr: 'd' });
            if (j == y2) {//第二次转角处
              array[array.length - 1].tr = 'u';
              array[array.length - 1].two = 1;
              if(i < x2) {//向右转
                var j1 = 0;
                for (var n = i; n < x2; n++) {
                  j1 = j1 + 1;
                  if (ts.data.row[j][n] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: n, y: j, d: 'x', tr: 'r',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'r' });
                    }
                    if (n == x2 - 1) {//相邻了
                      console.log('向左向下在向右')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              } else {//向左转
                var j1 = 0;
                for (var n = i; n > x2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[j][n] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: n, y: j, d: 'x', tr: 'l',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'l' });
                    }
                    if (n == x2 + 1) {//相邻了
                      console.log('向左向下在向左')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      } else if(y1 > y2) {//在向上查找
        var j0 = 0;
        for (var j = y1; j >= y2; j--) {
          j0 = j0 + 1;
          if (ts.data.row[j][i] != '') {
            array.splice(-(array.length - 1), j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: i, y: j, d: 'y', tr: 'u' });
            if (j == y2) {//第二次转角处
              array[array.length - 1].tr = 'd';
              array[array.length - 1].two = 1;
              if (i < x2) {//向右转
                var j1 = 0;
                for (var n = i; n < x2; n++) {
                  j1 = j1 + 1;
                  if (ts.data.row[j][n] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: n, y: j, d: 'x', tr: 'r',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'r' });
                    }
                    if (n == x2 - 1) {//相邻了
                      console.log('向左向上在向右')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              } else {//向左转
                var j1 = 0;
                for (var n = i; n > x2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[j][n] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: n, y: j, d: 'x', tr: 'l',two:1 });
                    }else{
                      array.push({x: n, y: j, d: 'x', tr: 'l' });
                    }
                    if (n == x2 + 1) {//相邻了
                      console.log('向左向上在向左')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      array = [];//重置画线数组
      break;
    }
  }
  i = undefined;
  j = undefined;
  n = undefined;
  //路径:3 向下查找
  console.log('路径:3 向下查找')
  for(var i = y1 + 1; i <= 9; i++){
    if(ts.data.row[i][x1] == ''){
      array.push({x: x1, y: i, d: 'y', tr: 'd' });
      if(x1 < x2) {//向右查找
        var j0 = 0;
        for(var j = x1; j <= x2; j++){
          j0 = j0 + 1;
          if(ts.data.row[i][j] != ''){
            array.splice(-(array.length - 1),j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: j, y: i, d: 'x', tr: 'r' });
            if (j == x2) {//第二次转角处
              array[array.length - 1].tr = 'l';
              array[array.length - 1].two = 1;
              if(i < y2) {//向下转
                var j1 = 0;
                for(var n = i; n < y2; n++){
                  j1 = j1 + 1;
                  if(ts.data.row[n][j] != ''){
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  }else{
                    if(n==i){
                      array.push({x: j, y: n, d: 'y', tr: 'd',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'd' });
                    }
                    if (n == y2 - 1) {//相邻了
                      console.log('向下向右在向下')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              } else {//向上转
                var j1 = 0;
                for (var n = i; n > y2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[n][j] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n==i){
                      array.push({x: j, y: n, d: 'y', tr: 'u',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'u' });
                    }
                    if (n == y2 + 1) {//相邻了
                      console.log('向下向右在向下')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      } else if(x1 > x2) {//向左查找
        var j0 = 0;
        for (var j = x1; j >= x2; j--) {
          j0 = j0 + 1;
          if (ts.data.row[i][j] != '') {
            array.splice(-(array.length - 1), j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: j, y: i, d: 'x', tr: 'l' });
            if (j == x2) {//第二次转角处
              array[array.length - 1].tr = 'r';
              array[array.length - 1].two = 1;
              if (i < y2) {//向下转
                var j1 = 0;
                for (var n = i; n < y2; n++) {
                  j1 = j1 + 1;
                  if (ts.data.row[n][j] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n==i){
                      array.push({x: j, y: n, d: 'y', tr: 'd',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'd' });
                    }
                    if (n == y2 - 1) {//相邻了
                      console.log('向下向左在向下')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              } else {//向上转
                var j1 = 0;
                for (var n = i; n > y2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[n][j] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n==i){
                      array.push({x: j, y: n, d: 'y', tr: 'u',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'u' });
                    }
                    if (n == y2 + 1) {//相邻了
                      console.log('向下向左在向下')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      array = [];//重置画线数组
      break;
    }
  }
  //路径:4 向上查找
  console.log('路径:4 向上查找')
  for (var i = y1 - 1; i >= 0; i--) {
    if (ts.data.row[i][x1] == '') {
      array.push({x: x1, y: i, d: 'y', tr: 'u' });
      if (x1 < x2) {//向右查找
        var j0 = 0;
        for (var j = x1; j <= x2; j++) {
          j0 = j0 + 1;
          if (ts.data.row[i][j] != '') {
            array.splice(-(array.length - 1), j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: j, y: i, d: 'x', tr: 'r' });
            if (j == x2) {//第二次转角处
              array[array.length - 1].tr = 'l';
              array[array.length - 1].two = 1;
              if (i < y2) {//向下转
                var j1 = 0;
                for (var n = i; n < y2; n++) {
                  j1 = j1 + 1;
                  if (ts.data.row[n][j] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: j, y: n, d: 'y', tr: 'd',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'd' });
                    }
                    if (n == y2 - 1) {//相邻了
                      console.log('向上向右在向下')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              } else {//向上转
                var j1 = 0;
                for (var n = i; n > y2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[n][j] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n == i){
                      array.push({x: j, y: n, d: 'y', tr: 'u',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'u' });
                    }
                    if (n == y2 + 1) {//相邻了
                      console.log('向上向右在向上')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      } else if(x1 > x2) {//向左查找
        var j0 = 0;
        for (var j = x1; j >= x2; j--) {
          j0 = j0 + 1;
          if (ts.data.row[i][j] != '') {
            array.splice(-(array.length - 1), j0);
            break;//跳出第二个循环，继续第一个循环
          } else {
            array.push({x: j, y: i, d: 'x', tr: 'l' });
            if (j == x2) {//第二次转角处
              array[array.length - 1].tr = 'r';
              array[array.length - 1].two = 1;
              if (i < y2) {//向下转
                var j1 = 0;
                for (var n = i; n < y2; n++) {
                  j1 = j1 + 1;
                  if (ts.data.row[n][j] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n==i){
                      array.push({x: j, y: n, d: 'y', tr: 'd',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'd' });
                    }
                    if (n == y2 - 1) {//相邻了
                      console.log('向上向左在向下')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              } else {//向上转
                var j1 = 0;
                for (var n = i; n > y2; n--) {
                  j1 = j1 + 1;
                  if (ts.data.row[n][j] != '') {
                    array.splice(-(array.length - 1), j1 - 1);
                    break;//跳出第三个循环，继续第二个循环
                  } else {
                    if(n==i){
                      array.push({x: j, y: n, d: 'y', tr: 'u',two:1 });
                    }else{
                      array.push({x: j, y: n, d: 'y', tr: 'u' });
                    }
                    if (n == y2 + 1) {//相邻了
                      console.log('向上向左在向上')
                      ts.setData({ lineArray: array });
                      return true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      array = [];//重置画线数组
      break;
    }
  }
  //console.log("return-:"+istrue)
  return istrue;
}

module.exports = p