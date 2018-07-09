module.exports = function (t) {
  var app = getApp(), util = app.util, path = require("g_path.js"), draw = require("g_draw.js");
  /*游戏时间*/
	return {

    onloadHandle: function (options) {
      
    },

    /*连连看点击逻辑start*/
    game_item_click: function(t,e){
      // console.log("done:" + t.data.click_done)
      if (t.data.click_done == false) {
        return;
      }
      var newImgUrl = 'active.png';
      // console.log(imgUrl)
      if (t.data.click_first == false) {
        if (t.data.row[e.currentTarget.dataset.y][e.currentTarget.dataset.x] == '') {
          return;//无效点击
        }
        console.log('1click')
        t.setData({ click_first: true, click_xy: [], click_result: [], click_resultimg: [] });
        t.data.click_xy.push({ x: e.currentTarget.dataset.x, y: e.currentTarget.dataset.y });
        //console.log(t.data.row[e.currentTarget.dataset.y][e.currentTarget.dataset.x])
        var imgUrl = '';
        var result = e.currentTarget.dataset.item.imgType;
        if (e.currentTarget.dataset.item.imgType.indexOf('_active.png') > 0) {
          imgUrl = e.currentTarget.dataset.item.imgType;
          result = e.currentTarget.dataset.item.imgType.replace('_active.png', '.png');
        } else {
          imgUrl = e.currentTarget.dataset.item.imgType.replace('.png', '_active.png');
        }
        t.data.click_result.push(result);
        t.data.click_resultimg.push(imgUrl);

        //设置第一次点击背景
        t.data.row[e.currentTarget.dataset.y][e.currentTarget.dataset.x].bg = true;
        t.data.row[e.currentTarget.dataset.y][e.currentTarget.dataset.x].imgType = imgUrl;
        t.setData({ row: t.data.row });

      } else {
        if (t.data.row[e.currentTarget.dataset.y][e.currentTarget.dataset.x] == '') {
          return;//无效点击
        }
        t.setData({ click_first: false, click_done: false });
        t.data.click_xy.push({ x: e.currentTarget.dataset.x, y: e.currentTarget.dataset.y });
        var imgUrl = '';
        var result = e.currentTarget.dataset.item.imgType;
        if (e.currentTarget.dataset.item.imgType.indexOf('_active.png') > 0) {
          imgUrl = e.currentTarget.dataset.item.imgType;
          result = e.currentTarget.dataset.item.imgType.replace('_active.png', '.png');
        } else {
          imgUrl = e.currentTarget.dataset.item.imgType.replace('.png', '_active.png');
        }
        t.data.click_result.push(result);
        t.data.click_resultimg.push(imgUrl);
        t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].bg = true;
        t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].imgType = imgUrl;
        t.setData({ row: t.data.row })
        //
        console.log(t.data.click_xy)
        console.log(t.data.click_result)
        console.log(t.data.click_resultimg)
        if (t.data.click_result[0] == t.data.click_result[1]) {
          //两次点击的图标是一样的
          // console.log('ok')
          var x1 = t.data.click_xy[0].x;
          var y1 = t.data.click_xy[0].y;
          var x2 = t.data.click_xy[1].x;
          var y2 = t.data.click_xy[1].y;
          if (x1 == x2 && y1 == y2) {
            console.log('两次点击同一个坐标的不做处理')
            //取消第一次点击设置背景
            t.data.row[y1][x1].bg = false;
            t.data.row[y1][x1].imgType = t.data.click_result[0];
            t.data.row[y2][x2].bg = false;
            t.data.row[y2][x2].imgType = t.data.click_result[0];
            t.setData({ row: t.data.row, click_done: true });
          } else {
            //设置第二次点击背景
            t.data.row[y2][x2].bg = true;
            t.data.row[y2][x2].imgType = imgUrl;
            t.setData({ row: t.data.row });
            //查找路径
            //判断是否相邻
            if (path.point_xl(t, x1, y1, x2, y2) == true) {//相邻
              var usernum = t.data.userNum + (100 / 35);
              t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].status = true;
              t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].imgType = newImgUrl;
              t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].status = true;
              t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].imgType = newImgUrl;
              t.setData({ row: t.data.row });

              setTimeout(function () {
                //消除连接
                t.data.row[t.data.click_xy[0].y].splice(t.data.click_xy[0].x, 1, '');
                t.data.row[t.data.click_xy[1].y].splice(t.data.click_xy[1].x, 1, '');
                t.setData({ row: t.data.row, userNum: usernum, click_done: true });
                util.playsound('addscore.mp3');
                t.sendAnswerSocket();
              }, 300);
              console.log('判断是否相邻')
            } else {//不相邻
              if (path.point_line(t, x1, y1, x2, y2) == true) {
                //情况1:在一条直线上中间没有其他图标
                var usernum = t.data.userNum + (100 / 35);
                t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].status = true;
                t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].imgType = newImgUrl;
                t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].status = true;
                t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].imgType = newImgUrl;
                t.setData({ row: t.data.row });

                setTimeout(function () {
                  //消除连接
                  t.data.row[t.data.click_xy[0].y].splice(t.data.click_xy[0].x, 1, '');
                  t.data.row[t.data.click_xy[1].y].splice(t.data.click_xy[1].x, 1, '');
                  t.setData({ row: t.data.row, userNum: usernum, click_done: true });
                  util.playsound('addscore.mp3');
                  t.sendAnswerSocket();
                }, 300);

                //画线
                if(t.data.lineArray.length>0){
                  console.log(t.data.lineArray)
                  // draw.drawline(t, t.data.lineArray);
                  // setTimeout(function () {
                  //   draw.drawclear(t, t.data.lineArray);
                  //   t.setData({ row: t.data.row, userNum: usernum, click_done: true });
                  //   t.sendAnswerSocket();
                  // }, 300);

                  t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x] = { imgType: "0.png", bg: false, status: false };
                  for (var k = 0; k < t.data.lineArray.length; k++) {
                    var tb = t.data.lineArray[k];
                    t.data.row[tb.y][tb.x] = { imgType: "0.png", bg: false, status: false };
                  }
                  t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x] = { imgType: "0.png", bg: false, status: false };
                  t.setData({ row: t.data.row });
                  setTimeout(function () {
                    t.data.row[t.data.click_xy[0].y].splice(t.data.click_xy[0].x, 1, '');
                    for (var k = 0; k < t.data.lineArray.length; k++) {
                      var tb = t.data.lineArray[k];
                      t.data.row[tb.y].splice(tb.x, 1, '');
                    }
                    t.data.row[t.data.click_xy[1].y].splice(t.data.click_xy[1].x, 1, '');
                    t.setData({ row: t.data.row });
                  }, 200);
                }
                console.log('情况1:在一条直线上中间没有其他图标')
              } else if (path.point_firstzj(t, x1, y1, x2, y2) == true) {
                //情况2: 不在一条直线上,需要转一次直角
                var usernum = t.data.userNum + (100 / 35);
                t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].status = true;
                t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].imgType = newImgUrl;
                t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].status = true;
                t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].imgType = newImgUrl;
                t.setData({ row: t.data.row });

                setTimeout(function () {
                  //消除连接
                  t.data.row[t.data.click_xy[0].y].splice(t.data.click_xy[0].x, 1, '');
                  t.data.row[t.data.click_xy[1].y].splice(t.data.click_xy[1].x, 1, '');
                  t.setData({ row: t.data.row, userNum: usernum, click_done: true });
                  util.playsound('addscore.mp3');
                  t.sendAnswerSocket();
                }, 300);

                //画线
                if (t.data.lineArray.length > 0) {
                  console.log(t.data.lineArray)
                  // draw.drawjiao1(t, t.data.lineArray, x1, y1, x2, y2);
                  // setTimeout(function () {
                  //   draw.drawclear(t, t.data.lineArray);
                  //   t.setData({ row: t.data.row, userNum: usernum, click_done: true });
                  // }, 300);

                  t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x] = { imgType: "0.png", bg: false, status: false };
                  for (var k = 0; k < t.data.lineArray.length; k++){
                    var tb = t.data.lineArray[k];
                    t.data.row[tb.y][tb.x] = { imgType: "0.png", bg: false, status: false };
                  }
                  t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x] = { imgType: "0.png", bg: false, status: false };
                  t.setData({row: t.data.row});
                  setTimeout(function () {
                    t.data.row[t.data.click_xy[0].y].splice(t.data.click_xy[0].x, 1, '');
                    for (var k = 0; k < t.data.lineArray.length; k++) {
                      var tb = t.data.lineArray[k];
                      t.data.row[tb.y].splice(tb.x, 1, '');
                    }
                    t.data.row[t.data.click_xy[1].y].splice(t.data.click_xy[1].x, 1, '');
                    t.setData({ row: t.data.row });
                  }, 200);
                }
                console.log('情况2: 不在一条直线上,需要转一次直角')
              } else if (path.point_twozj(t, x1, y1, x2, y2) == true) {
                //情况3: 不在一条直线上,需要转两次直角
                var usernum = t.data.userNum + (100 / 35);
                t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].status = true;
                t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].imgType = newImgUrl;
                t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].status = true;
                t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].imgType = newImgUrl;
                t.setData({ row: t.data.row });

                setTimeout(function () {
                  //消除连接
                  t.data.row[t.data.click_xy[0].y].splice(t.data.click_xy[0].x, 1, '');
                  t.data.row[t.data.click_xy[1].y].splice(t.data.click_xy[1].x, 1, '');
                  t.setData({ row: t.data.row, userNum: usernum, click_done: true });
                  util.playsound('addscore.mp3');
                  t.sendAnswerSocket();
                }, 300);

                //画线
                if (t.data.lineArray.length > 0) {
                  console.log(t.data.lineArray)
                  // draw.drawjiao2(t, t.data.lineArray, x1, y1, x2, y2);
                  // setTimeout(function () {
                  //   draw.drawclear(t, t.data.lineArray);
                  // }, 300);

                  t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x] = { imgType: "0.png", bg: false, status: false };
                  for (var k = 0; k < t.data.lineArray.length; k++) {
                    var tb = t.data.lineArray[k];
                    t.data.row[tb.y][tb.x] = { imgType: "0.png", bg: false, status: false };
                  }
                  t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x] = { imgType: "0.png", bg: false, status: false };
                  t.setData({ row: t.data.row });
                  setTimeout(function () {
                    t.data.row[t.data.click_xy[0].y].splice(t.data.click_xy[0].x, 1, '');
                    for (var k = 0; k < t.data.lineArray.length; k++) {
                      var tb = t.data.lineArray[k];
                      t.data.row[tb.y].splice(tb.x, 1, '');
                    }
                    t.data.row[t.data.click_xy[1].y].splice(t.data.click_xy[1].x, 1, '');
                    t.setData({ row: t.data.row });
                  }, 200);                  
                }
                console.log('情况3: 不在一条直线上,需要转两次直角')
              } else {
                console.log('没有符合条件的连线');
                setTimeout(function () {
                  //取消两次点击设置的背景
                  t.data.row[y1][x1].bg = false;
                  t.data.row[y2][x2].bg = false;
                  t.data.row[y1][x1].imgType = t.data.click_result[0];
                  t.data.row[y2][x2].imgType = t.data.click_result[0];
                  t.setData({ row: t.data.row, click_done: true });
                }, 300)
                console.log(t.data.row[y2][x2])
              }
            }
          }
        } else {
          //取得第一次点击设置的背景
          if (t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x] != '') {
            t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].bg = false;
            t.data.row[t.data.click_xy[0].y][t.data.click_xy[0].x].imgType = t.data.click_result[0];
          }
          if (t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x] != '') {
            t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].bg = false;
            t.data.row[t.data.click_xy[1].y][t.data.click_xy[1].x].imgType = t.data.click_result[1];
          }
          t.setData({ row: t.data.row, click_done: true });
        }
      }
    },
    /*连连看点击逻辑end*/


    /*添加表格数量start*/
    arrayNums: function(){
      var arr = [];
      for (var k = 0; k < 35; k++) {
        var index = Math.floor((Math.random() * t.data.imgType.length));
        arr.push(index);
        arr.push(index);
      }
      // console.log(arr);
      arr.sort(function () { return 0.5 - Math.random() });//打乱数据图标
      // console.log(arr);

      //创建表格
      var n = 0;
      var row = new Array();
      var ix;
      for (var i = 0; i < 10; i++) {
        var col = new Array();
        for (var j = 0; j < 7; j++) {
          //console.log("n=" + n);
          ix = arr[n];
          //console.log("|--ix=" + ix);
          var _arr = { imgType: t.data.imgType[ix] + ".png", bg: false, status: false };
          col.push(_arr);
          n = n + 1;
        }
        // console.log(col)
        row.push(col);
      }
      t.setData({
        row: row
      })
    },
    /*添加表格数量end*/

    /*计算时间倒计时*/
    times: function (timeSec){
      var a = {};
      a["gameTime"] = timeSec
      a["gameTimeWidth"] = (timeSec / t.data.timeLimit) * 100;
      t.setData(a);
    },

	}
}