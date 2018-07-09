var w = {};
w.checkTransverse = function(t,arr, po) { //横向检查
  var len = arr.length - 1;
  var count = 1;
  var succ = [{ x: po.pointX, y: po.pointY }];
  // 东。（检查 棋子数组，）
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX - i && arr[j].pointY == po.pointY) {
        count++;
        succ.push({ x: arr[j].pointX, y:arr[j].pointY});
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
  // 西
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX + i && arr[j].pointY == po.pointY) {
        count++;
        succ.push({ x: arr[j].pointX, y: arr[j].pointY });
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
}
w.checkPortrait = function (t,arr, po) { //纵向检查
  var len = arr.length - 1;
  var count = 1;
  var succ = [{ x: po.pointX, y: po.pointY }];
  // 南
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX && arr[j].pointY == po.pointY - i) {
        count++;
        succ.push({ x: arr[j].pointX, y: arr[j].pointY });
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
  // 北
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX && arr[j].pointY == po.pointY + i) {
        count++;
        succ.push({ x: arr[j].pointX, y: arr[j].pointY });
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
}
w.checkNortheast = function (t,arr, po) { //45度
  var len = arr.length - 1;
  var count = 1;
  var succ = [{ x: po.pointX, y: po.pointY}];
  // 西南
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX - i && arr[j].pointY == po.pointY - i) {
        count++;
        succ.push({ x: arr[j].pointX, y: arr[j].pointY });
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
  // 东北
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX + i && arr[j].pointY == po.pointY + i) {
        count++;
        succ.push({ x: arr[j].pointX, y: arr[j].pointY });
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
}
w.checkNorthwest = function (t,arr, po) { //135度
  var len = arr.length - 1;
  var count = 1;
  var succ = [{ x: po.pointX, y: po.pointY }];
  // 西北
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX - i && arr[j].pointY == po.pointY + i) {
        count++;
        succ.push({ x: arr[j].pointX, y: arr[j].pointY });
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
  // 东南
  for (var i = 1; i < 5; i++) {
    for (var j = 0; j < len; j++) {
      if (arr[j].pointX == po.pointX + i && arr[j].pointY == po.pointY - i) {
        count++;
        succ.push({ x: arr[j].pointX, y: arr[j].pointY });
      }
    }
  }
  if (count == 5) {
    t.setData({ succXY: succ });
    return true;
  }
}
w.checkWinner = function (t,arr){
  console.log("checkWinner" + JSON.stringify(arr));
  var currentPo = arr[arr.length - 1]; // 最后1个下子 的元素
  var win1 = w.checkTransverse(t,arr, currentPo);
  var win2 = w.checkPortrait(t,arr, currentPo);
  var win3 = w.checkNortheast(t,arr, currentPo);
  var win4 = w.checkNorthwest(t,arr, currentPo);
  if (win1 || win2 || win3 || win4) {
    return true;
  } else {
    return false;
  }
}
module.exports = w;