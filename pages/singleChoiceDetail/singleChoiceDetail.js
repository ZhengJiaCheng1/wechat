var that;
var Bmob = require('../../utils/bmob.js');
var QuestionEndInt= 3;

Page({
  

  data: {
    choseQuestionBank: '',
    currentUserId: null,
    questionList:[],
    nowQuestion:[],
    nowQuestionNumber:'',
    choseCharacter:'',
    score:0,
    // blank:"blank",
    newMultiQuestionList:[],
    loading:true,
		QuestionNum:100,
		
  },

  
  onLoad: function () {
    that = this;
    var choseQuestionBank = getApp().globalData.choseQuestionBank;
    
    that.setData({
      choseQuestionBank: choseQuestionBank
    });
   
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var choseQuestionBank = that.data.choseQuestionBank;
    var loadQuestionBank;
    var questionList=new Array();
    var multiQuestionList = new Array();
   
/*
		if (choseQuestionBank == "集控值班员") {
			loadQuestionBank = "MainControl";
		}
		else if (choseQuestionBank == "脱硫值班员") {
			loadQuestionBank = "DesulfurMan";
		}
		else if (choseQuestionBank == "汽机题库") {
			loadQuestionBank = "TurbineRun";
		}
		else if (choseQuestionBank == "锅炉题库") {
			loadQuestionBank = "BoilerRun";
		}
		else if (choseQuestionBank == "电气题库") {
			loadQuestionBank = "ElectricRun";
		}
		else if (choseQuestionBank == "其他") {
			loadQuestionBank = "OtherBank";
		}


*/





    if (choseQuestionBank =="集控值班员"){
      loadQuestionBank="QB1";
    }
    else if (choseQuestionBank == "脱硫值班员"){
      loadQuestionBank = "QB2";
    }
    else if (choseQuestionBank == "汽机题库") {
      loadQuestionBank = "QB3";
    }
    else if (choseQuestionBank == "锅炉题库") {
      loadQuestionBank = "QB4";
    }
    else if (choseQuestionBank == "电气题库") {
      loadQuestionBank = "QB5";
    }
    else if (choseQuestionBank == "其他") {
      loadQuestionBank = "QB6";
    }




//  Get has how many questions.
		var QuestionNumBmob = Bmob.Object.extend(loadQuestionBank);
		var QuestionNumQuery = new Bmob.Query(QuestionNumBmob);	
		QuestionNumQuery.count().then(res => {
			// console.log(`record has ${res} item.`);
			that.setData({
				QuestionNum: res,			
			})

		});

		

    var QuestionBank = Bmob.Object.extend(loadQuestionBank);
    var querySingleQuestionBank = new Bmob.Query(QuestionBank);
    querySingleQuestionBank.equalTo("type", "SC");
    querySingleQuestionBank.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        for (var i = 0; i < results.length; i++) {
          questionList.push(results[i])
          questionList[i].attributes.userChose = "空";
        }

				// var newSingleQuestionList = that.getRandomSingleChoice(questionList, 25)
        var newSingleQuestionList = questionList;
				
				that.setData({
          questionList: newSingleQuestionList,
          nowQuestion: newSingleQuestionList[0],
					
          nowQuestionNumber:0
        })


				;

			//	console.log(nowQuestion.length);


      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

		
    var queryMultiQuestionBank = new Bmob.Query(QuestionBank);
    queryMultiQuestionBank.equalTo("type", "JD");
    queryMultiQuestionBank.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        for (var i = 0; i < results.length; i++) {
          multiQuestionList.push(results[i])
        }
				// var newMultiQuestionList = that.getRandomSingleChoice(multiQuestionList, 25)
        var newMultiQuestionList = multiQuestionList 
				for (i = 0; i < newMultiQuestionList.length;i++){
          newMultiQuestionList[i].attributes.userChose = "空";
        }
        that.setData({
          newMultiQuestionList: newMultiQuestionList,
          loading:false
        });
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    
  },


  getRandomSingleChoice: function (arr, count){
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  },
 
  onShow: function () {
  
  },




  choseA:function(){
    var questionList = that.data.questionList;
    var nowQuestionNumber = that.data.nowQuestionNumber;
    var answer = questionList[nowQuestionNumber].attributes.answer[0];
    if("A"==answer){
      getApp().globalData.score++;
      // var score = that.data.score + 1;
      questionList[nowQuestionNumber].attributes.answerResult = "correct";
      questionList[nowQuestionNumber].attributes.userChose = "A";
      that.setData({
        questionList: questionList,
        choseCharacter: "A",
        // score:score,
      });
      that.nextQuestion = setTimeout(function () {

				if (nowQuestionNumber == QuestionEndInt){
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt){
          var nextQuestionNumber = nowQuestionNumber + 1; 
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }
    else if("A"!=answer){
      questionList[nowQuestionNumber].attributes.answerResult = "error";
      questionList[nowQuestionNumber].attributes.userChose = "A";
      that.setData({
        questionList: questionList,
        choseCharacter: "A",
      });
      that.nextQuestion = setTimeout(function () {
				if (nowQuestionNumber == QuestionEndInt){
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt){
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }

  },


  choseB: function () {
    var questionList = that.data.questionList;
    var nowQuestionNumber = that.data.nowQuestionNumber;
    var answer = questionList[nowQuestionNumber].attributes.answer[0];
    if ("B" == answer) {
      getApp().globalData.score++;
      // var score = that.data.score + 1;
      questionList[nowQuestionNumber].attributes.answerResult = "correct";
      questionList[nowQuestionNumber].attributes.userChose = "B";
      that.setData({
        questionList: questionList,
        choseCharacter: "B",
        // score: score,
      });
      that.nextQuestion = setTimeout(function () {
				if (nowQuestionNumber == QuestionEndInt) {
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt){
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }
    else if ("B" != answer) {
      questionList[nowQuestionNumber].attributes.answerResult = "error";
      questionList[nowQuestionNumber].attributes.userChose = "B";
      that.setData({
        questionList: questionList,
        choseCharacter: "B",
      });
      that.nextQuestion = setTimeout(function () {
				if (nowQuestionNumber == QuestionEndInt) {
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt) {
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }
  },

  choseC: function () {
    var questionList = that.data.questionList;
    var nowQuestionNumber = that.data.nowQuestionNumber;
    var answer = questionList[nowQuestionNumber].attributes.answer[0];
    if ("C" == answer) {
      getApp().globalData.score++;
      // var score = that.data.score + 1;
      questionList[nowQuestionNumber].attributes.answerResult = "correct";
      questionList[nowQuestionNumber].attributes.userChose = "C";
      that.setData({
        questionList: questionList,
        choseCharacter: "C",
        // score: score,
      });
      that.nextQuestion = setTimeout(function () {
				if (nowQuestionNumber == QuestionEndInt) {
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt) {
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }
    else if ("C" != answer) {
      questionList[nowQuestionNumber].attributes.answerResult = "error";
      questionList[nowQuestionNumber].attributes.userChose = "C";
      that.setData({
        questionList: questionList,
        choseCharacter: "C",
      });
      that.nextQuestion = setTimeout(function () {
				if (nowQuestionNumber == QuestionEndInt) {
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt){
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }

  },

  choseD: function () {
    var questionList = that.data.questionList;
    var nowQuestionNumber = that.data.nowQuestionNumber;
    var answer = questionList[nowQuestionNumber].attributes.answer[0];
    if ("D" == answer) {
      getApp().globalData.score++;
      // var score = that.data.score + 1;
      questionList[nowQuestionNumber].attributes.answerResult = "correct";
      questionList[nowQuestionNumber].attributes.userChose = "D";
      that.setData({
        questionList: questionList,
        choseCharacter: "D",
        // score: score,
      });
      that.nextQuestion = setTimeout(function () {
				if (nowQuestionNumber == QuestionEndInt) {
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt) {
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }
    else if ("D" != answer) {
      questionList[nowQuestionNumber].attributes.answerResult = "error";
      questionList[nowQuestionNumber].attributes.userChose = "D";
      that.setData({
        questionList: questionList,
        choseCharacter: "D",
      });
      that.nextQuestion = setTimeout(function () {
				if (nowQuestionNumber == QuestionEndInt) {
          that.setData({
            nowQuestion: questionList[nowQuestionNumber],
            nowQuestionNumber: nowQuestionNumber,
          });
        }
				else if (nowQuestionNumber != QuestionEndInt) {
          var nextQuestionNumber = nowQuestionNumber + 1;
          that.setData({
            nowQuestion: questionList[nextQuestionNumber],
            nowQuestionNumber: nextQuestionNumber,
          });
        }
      }, 300);
      that.overSingleChoice(nowQuestionNumber);
    }

  },

  frontQuestion:function(){
    var questionList = that.data.questionList;
    var frontQuestionNumber = that.data.nowQuestionNumber-1;
    that.setData({
      nowQuestion: questionList[frontQuestionNumber],
      nowQuestionNumber: frontQuestionNumber,
    })
    console.log(that.data.questionList)
  },

  afterQuestion: function () {
    var nowQuestionNumber = that.data.nowQuestionNumber
    var questionList = that.data.questionList;
    var afterQuestionNumber = nowQuestionNumber + 1;
    if (questionList[nowQuestionNumber].attributes.answerResult==null){
      questionList[nowQuestionNumber].attributes.answerResult = "blank";
      questionList[nowQuestionNumber].attributes.userChose = "空";
      that.setData({
        nowQuestion: questionList[afterQuestionNumber],
        nowQuestionNumber: afterQuestionNumber,
        questionList: questionList
      })
    }
    else if (questionList[nowQuestionNumber].attributes.answerResult != null){
      that.setData({
        nowQuestion: questionList[afterQuestionNumber],
        nowQuestionNumber: afterQuestionNumber,
      })
    }
    console.log(that.data.questionList)
  },





  answerCard:function(){
    getApp().globalData.singleChoiceAnswerNow = that.data.questionList,
    getApp().globalData.multiChoiceAnswerNow = that.data.newMultiQuestionList;
    wx.navigateTo({
      url: '../answerCard/answerCard'
    });
  },

  overSingleChoice: function (questionNumber) {
    getApp().globalData.singleChoiceAnswerNow = that.data.questionList;
    getApp().globalData.multiChoiceAnswerNow = that.data.newMultiQuestionList;
		if (questionNumber == QuestionEndInt) {
      wx.redirectTo({
				url: '../multiChoiceDetail/multiChoiceDetail'
        // url: '../multiChoiceExplain/multiChoiceExplain'
      });
    }
  }
 
})