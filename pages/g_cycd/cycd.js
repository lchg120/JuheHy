var app = getApp(), util = app.util, glb = app.global, socket = app.socket, 
  a = require('./animation/init.js'), b = require('./animation/vs.js'), c = require('./animation/result.js');
Page({
  data: {
    imagesBaseUrl: util.url_images(),
    curState: null, //当前舞台，可以使用animation定义好的方法，以便交互后端
    gameid: 0,

    matchViewBox:{
      ishide: false
    },
    //对战
    fightView: {
      ishide: true,
      // startTime: 15,
      // timeLimit: 15,
      // timeWidth: 100,
      fightViewUserAni: null,
      vsViewTimeHide: true,
      vsViewQuestion: true,
      vsViewAnswerHide: true,
      vsTipsHide: true,
      resultViewHide: true,
      questionAni: null,
      topicAni: null,
      dijitiHide: true,
      dijitiPic: 0,
    },
    //当前题目和答案
    // questionCurrent:0,
    // questionTotal: 2,	//切题到最后一道题时，切换到结果统计场景动画
    question: {
      tips: {
        text: '多用于形容湖水',   //问题提示
        order: '顺接'
      },
      truephrase: [],
      phrase: [
        { text: "夏", icon: 'true' },
        { text: "末", icon: 'false' },
        { text: "将", icon: 'false' },
        { text: "至", icon: 'true' },
      ],
      answer: [
        { text: "夏", bg: 'nomal', showicon: 'false', icon: 'true' },
        { text: "复", bg: 'nomal', showicon: 'false', icon: 'false' },
        { text: "湖", bg: 'nomal', showicon: 'false', icon: 'false' },
        { text: "枪", bg: 'nomal', showicon: 'false', icon: 'false' },
        { text: "无", bg: 'nomal', showicon: 'false', icon: 'false' },
        { text: "果", bg: 'nomal', showicon: 'false', icon: 'false' },
        { text: "忘", bg: 'nomal', showicon: 'false', icon: 'false' },
        { text: "弹", bg: 'nomal', showicon: 'false', icon: 'false' },
        { text: "至", bg: 'nomal', showicon: 'false', icon: 'true' },
      ],
      new_tips: ''
    },
    list: [
      // {
      // 	id: 1,
      // 	bgcolor: "#26bc34",
      // 	name: '特殊语法',
      // 	level: 25,
      // 	items: '10',
      // 	func: '得分+25%',
      // 	glodNeed: 200,
      // 	desc: '使用后增加10%',
      // }
    ],
    clickAnswer: false,	//是否已经点击了答案
    clickAnswerList: [],
    //左侧显示的是自己
    leftview: {
      userinfo: {
        avatar: '',
        name: '',
        level: 0,
        tiers: 1, 		//相框
      },
      costAni: null,			//进场分数减少变化
      currScore: 0,			//当前分数
      currSelect: null,		//当前选择
      currScoreAni: null,
      curraddScore: 0,		//本题增加的分数动
      curraddScoreAni: null,	//本题增加分数的动画
      useTime: 0,				//用时
    },
    //右侧显示的是对手
    rightview: {
      userinfo: {
        avatar: '',
        name: '加载中…',
        level: 0,
        tiers: 1, 	//相框
      },
      currScore: 0,
      currSelect: null,
      currScoreAni: null,
      addScore: 0,
      addScoreAni: null,
      useTime: 0,
      clickAnswer: ''
    },
  },

  onLoad: function (options) {
    var that = this;
    that.stateChange('StateInit')
    //util.playsound('matching.mp3');
    util.post('global/getuserinfo', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid2: options.uid2 }, function (resJson) {
      console.log(resJson);
      var leftName = resJson.data.userdata.nickName;
      var rightname = resJson.data.otherdata.nickName;
      console.log("leftName=" + leftName + 
        ' rightname=' + rightname);
      that.setData({
        'leftview.userinfo.avatar': resJson.data.userdata.avatarUrl,
        'leftview.userinfo.name': leftName,
        'rightview.userinfo.avatar': resJson.data.otherdata.avatarUrl,
        'rightview.userinfo.name': rightname
      })
    })

    setTimeout(function () {
       socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":1,"connmsg":{"action":"game_ready","uidvs":' + options.uid2 + ',"tid":' + options.tid + ',"time":' + options.time + '}}');
    }, 2000);

    /*
    //8888获取当前用户信息和对手信息
    util.post('global/getuserinfo', { uid: util.getStorageSync('uid'), secret: util.getStorageSync('secret'), uid2: util.getOption('uid2') }, function (resJson) {
      //console.log('getuserinfo success');
      //console.log(resJson);
      that.setData({
        'leftview.userinfo.avatar': resJson.data.userdata.avatarUrl,
        'leftview.userinfo.name': resJson.data.userdata.nickName,
        'rightview.userinfo.avatar': resJson.data.otherdata.avatarUrl,
        'rightview.userinfo.name': resJson.data.otherdata.nickName
      })
    })

    // var twe = app.tween.fastGet(Math.random());
    // twe.wait(2000);
    // twe.call(function(){
    setTimeout(function () {
      socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":1,"connmsg":{"action":"game_ready","uidvs":' + util.getOption('uid2') + ',"tid":' + util.getOption('tid') + ',"time":' + util.getOption('time') + '}}');
    }, 2000);
    // });*/
  },

  onUnload: function () {
    socket.sendSocketMessage('{"action":"glb_userstatus_quit"}');
    
  },
  onShow: function () {

  },

  handleSocketMessage: function (resJson) {
    //console.log('fight.js get socket' + JSON.stringify(resJson));
    switch (resJson.action) {
      // case 'game_matching':
      //   var _this = this;
      //   var fontStr = resJson.msg?resJson.msg:'等待对手进入';
      //   _this.setData({
      //     'matchViewBox.doingInfo': fontStr
      //   });
      //   return true;
      case 'game_quschg'://切换题目过度
        var that = this;
        that.curState.chgQusBefore();
        return true;
      case 'game_begin'://游戏开始
        var that = this;
        that.data.fightView.startTime = resJson.timeLimit;
        that.data.gameid = resJson.gameid;
        //that.data.question = resJson.question;
        //that.data.rightview.clickAnswer = '';

        //获取匹配用户，匹配到之后
        var uid = Number(util.getStorageSync('uid'));
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
        that.stateChange('StateFight');
        util.playsound('matchuser.mp3');
        //初始化第一题题目 setData
        return true;
      case 'game_question'://如果有上题就公布上题答案   如果有下题就出题/没有就处理结果
        var that = this;
        //显示对手答案和分数
        that.data.question = resJson.question;
        // console.log(this.data.question.answer);
        that.curState.changeQuestion(that.data.question.phrase, that.data.question.answer, that.data.question.tips, that.data.question.new_tips);
        return true;
      case 'game_answer_vs'://对手的答题数据
        var that = this;
        //console.log('收到对手数据：' + JSON.stringify(resJson));
        that.data.rightview.clickAnswer = resJson.data.answer;
        if (resJson.data.plus_point > 0)
          that.curState.changeScoreR(resJson.data.plus_point);
        return true;
      case 'game_answer_self'://自己的答题数据
        var that = this;
        //console.log('自己得分：' + JSON.stringify(resJson));
        if (resJson.data.plus_point > 0)
          that.curState.changeScoreL(resJson.data.plus_point);
        return true;
      case 'game_ticker'://答题记时
        //console.log('答题记时 resJson.ticker=' + resJson.ticker);
        var that = this;
        if (that.curState.timeChange) that.curState.timeChange(resJson.ticker);

        // 每道题到时间了
        if (resJson.ticker < 1) {
          that.showAnswer();
        }
        return true;
      case 'game_end':
        console.log('fight.js game_end:' + util.getOption('tid') + '---' + util.getOption('time'));
        var that = this;
        wx.redirectTo({
          url: '/pages/online/online?tid=' + util.getOption('tid') + '&time=' + util.getOption('time') + "&point=" + encodeURIComponent(JSON.stringify(resJson.point)),
        })
        return true;
    }
    return false;
  },

  //切换舞台：t为场景的名称，对应的是animation目录的对应文件。
  stateChange: function (t) {
    var that = this;
    var e = null;
    switch (t) {
      case "StateInit":
        e = new a(that);
        break;
      case "StateFight":
        e = new b(that);
        break;
      case "StateResult":
        e = new c(that);
        break;
      default: e = new a(that)
    }
    // console.log("当前舞台:" + t);
    that.curState = e, that.curState.init()
  },

  //点击了九宫格答案
  click_answer_text: function (e) {
    var that = this;
    //console.log(e)
    if (that.data.clickAnswer == true) {
      return;
    }
    //点击声音
    util.playsound('btn_click.mp3');
    var s = {}, index = e.currentTarget.dataset.index, truephrase = that.data.question.truephrase;
    var clickAnswerList = that.data.clickAnswerList, phrase = that.data.question.phrase;
    var answerList = that.data.question.answer, answerText = answerList[index]['text']
    var CNA = truephrase[clickAnswerList.length]
    truephrase[clickAnswerList.length]['fill'] = index
    s["question.truephrase"] = truephrase;
    s["question.phrase"] = phrase.map(function (e, i) {
      if (e.text == CNA.text && i == CNA.index) {
        e.text = answerText
        e.icon = 'false'
      }
      return e;
    })
    clickAnswerList.push(index);
    s['clickAnswerList'] = clickAnswerList
    that.setData(s);

    //答案已经锁定，开始计算并显示答案
    if (clickAnswerList.length == truephrase.length) {
      var a = {}
      a["clickAnswer"] = true;
      a["question.answer"] = answerList.map(function (e, i) {
        //读取刚才点击的答案，进行判断
        var tmp = truephrase.filter(function (v) { return v.fill == i });
        if (tmp.length > 0) {
          e.showicon = 'true';
          e.bg = tmp[0]['text'] != e['text'] ? 'false' : 'true';
          e.icon = tmp[0]['text'] != e['text'] ? 'false' : 'true';

        }
        return e;
      });
      a["question.phrase"] = phrase.map(function (e, i) {
        var tmp = truephrase.filter(function (v) { return v.index == i });
        if (tmp.length > 0 && tmp[0]['text'] != e['text']) {
          e.showicon = 'true';
        }
        return e;
      })
      var answerClicked = '';
      for (var i = 0; i < clickAnswerList.length; i++) {
        answerClicked += answerList[clickAnswerList[i]]['text']
      }
      //socket.sendSocketMessage('{"action":"game_answer","gameid":' + this.data.gameid + ',"answer":"' + answerClicked + '","login_secret":"' + util.getStorageSync('secret') + '"}');
      socket.sendSocketMessage('{"action":"glb_clienttohttp","gid":1,"connmsg":{"action":"game_answer","gameid":' + that.data.gameid + ',"answer":"' + answerClicked + '","login_secret":"' + util.getStorageSync('secret') + '"}}');
      that.setData(a);
    }
  },

  //显示对手答案，在指定区域显示正确答案，并且显示对手点击的答案
  showAnswer: function () {
    var that = this;
    var truephrase = that.data.question.truephrase, userAnswer = that.data.rightview.clickAnswer
    that.setData({
      "clickAnswer": true,
      //题目显示正确答案
      "question.phrase": that.data.question.phrase.map(function (item, i) {
        var checkTrue = truephrase.filter(function (e) { return e.index == i });
        if (checkTrue.length > 0) {
          item.text = checkTrue[0]['text']
          item.icon = 'false';
        }
        return item
      }),
      //检查对手答案
      "question.answer": that.data.question.answer.map(function (item) {
        if (userAnswer.indexOf(item.text) > -1) {
          item.bg = 'false_vs';
        }
        return item
      })
    });
  },

})