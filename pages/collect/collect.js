var that;
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
	data: { 
		questionList: [],
		choseQuestionBank: '',
		historyQuestionBank: [],
		hadHistory: null,
		QuestionNum: 100,
		quesUserChose: [],
		loadFinish: false,
	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {
		that = this;
		var historyQuestionBank = new Array();
		var currentUser = Bmob.User.current();
		var currentUserId = currentUser.id;
		var History = Bmob.Object.extend("history");
		var queryHistory = new Bmob.Query(History);
		queryHistory.equalTo("user", currentUserId);
		queryHistory.find({
			success: function (results) {
				if (results.length == 0) {
					that.setData({
						hadHistory: false,
					});
				}
				else {
					that.setData({
						hadHistory: true,
					});
					console.log("共查询到 " + results.length + " 条记录");
					for (var i = 0; i < results.length; i++) {
						historyQuestionBank[i] = results[i];
					}

				}
				console.log(historyQuestionBank);
				that.setData({
					historyQuestionBank: historyQuestionBank,
				});


				that.setData({
					loadFinish: true,
				});


			},

			error: function (error) {
				console.log("查询失败: " + error.code + " " + error.message);
			}
		});


	},












	showDetail: function (e) {
		that = this;
		var singleCollectSeq = new Array();
		var questionList = new Array();
		var currentUser = Bmob.User.current();
		var currentUserId = currentUser.id;
		var loadQuestionBank;
		var index = e.currentTarget.dataset.index;
		var objectId = that.data.historyQuestionBank[index].id;
		var choseQuestionBank = that.data.historyQuestionBank[index].attributes.choseQuestionBank;
		getApp().globalData.choseQuestionBank = choseQuestionBank;
		that.setData({
			choseQuestionBank: choseQuestionBank
		});


		if (choseQuestionBank == "集控值班员") {
			loadQuestionBank = "QB1";
		}
		else if (choseQuestionBank == "脱硫值班员") {
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



		//  Get has how many questions, Single.	     
		const pmquestionList = new Promise((resolve, reject) => {
			var QuestionNumQuery = new Bmob.Query(Bmob.Object.extend(loadQuestionBank))
			QuestionNumQuery.equalTo("type", "SC");
			QuestionNumQuery.limit(980);
			QuestionNumQuery.ascending("Seq"); //升序
			QuestionNumQuery.find({
				success: (results) => {
					resolve(results);
					console.log(results);

				},
				// error: function (error) {
				// 	console.log("查询失败: " + error.code + " " + error.message);
				// }				
			});
		})

		const pmCollect = new Promise((resolve, reject) => {
			var queryHistory = new Bmob.Query(Bmob.Object.extend("history"))
			queryHistory.get(objectId).then(result => {
				resolve(result);

			});

		})





		//  Get has how many questions, Single.	     
		const pmJudgeList = new Promise((resolve, reject) => {
			var JudgeQuesNumQuery = new Bmob.Query(Bmob.Object.extend(loadQuestionBank))
			JudgeQuesNumQuery.equalTo("type", "JD");
			JudgeQuesNumQuery.limit(980);
			JudgeQuesNumQuery.ascending("Seq"); //升序
			JudgeQuesNumQuery.find({
				success: (results) => {
					resolve(results);
					console.log(results);
				},

			});
		})


		//  Get has how many questions, short answer.	     
		const pmSAList = new Promise((resolve, reject) => {
			var SAQuesNumQuery = new Bmob.Query(Bmob.Object.extend(loadQuestionBank))
			SAQuesNumQuery.equalTo("type", "SA");
			SAQuesNumQuery.limit(980);
			SAQuesNumQuery.ascending("Seq"); //升序
			SAQuesNumQuery.find({
				success: (results) => {
					resolve(results);
					console.log(results);
				},

			});
		})


		singleCollectSeq = [];
		Promise.all([pmquestionList, pmCollect, pmJudgeList, pmSAList]).then((val) => {
			var collectSingle = new Array();
			var collectJudge = new Array();
			var collectSA = new Array();
			var collectShortAns = new Array();
			console.log(val);
			questionList = val[0];
			collectSingle = val[1].attributes.collectSingle;
			collectJudge = val[1].attributes.collectJudge;
			collectShortAns = val[1].attributes.collectShortAns;
			var collectType = val[1].attributes.ansProgress[0].collectType;
			var collectIndex = val[1].attributes.ansProgress[0].collectIndex;

			var collectSingleNum = 0;  // The num of single Collect question.
			for (var i = 0; i < collectSingle.length; i++) {
				// First, must not to be '空', it means user hasn't answer yet.
				if (collectSingle[i] != '空') {
					// if user has collect , set value.
					singleCollectSeq.push(questionList[i])
					collectSingleNum = collectSingleNum + 1

				}
			}

			// Set value to global, use to display.
			getApp().globalData.singleCollectSeq = singleCollectSeq;
			getApp().globalData.collectSingleNum = collectSingleNum;

			// get  the Collect question of judge type.
			var JudgeQuesList = new Array();
			var judgeCollectSeq = new Array();
			JudgeQuesList = val[2];

			var collectJudgeNum = 0;  // The num of judge wrong question.
			for (var i = 0; i < collectJudge.length; i++) {
				// First, must not to be '空', it means user hasn't set it as collect.
				if (collectJudge[i] != '空') {
					// if user set it as collect, set value.
					judgeCollectSeq.push(JudgeQuesList[i])
					collectJudgeNum = collectJudgeNum + 1
				}
			}

			if (collectJudgeNum >= 1) {
				// If didn't had single wrong question, then set it to display judge wrong question.
				if (collectSingleNum < 1) { collectType = "judgeQues" }
				
			}
			// Set value to global, use to display.
			getApp().globalData.judgeCollectSeq = judgeCollectSeq;
			getApp().globalData.collectJudgeNum = collectJudgeNum;



			// get  the Collect question of short  answer type.
			var SAQuesList = new Array();
			var SACollectSeq = new Array();
			SAQuesList = val[3];

			var collectSANum = 0;  // The num of collect short answer question.
			for (var i = 0; i < collectShortAns.length; i++) {
				// First, must not to be '空', it means user hasn't set it as collect.
				if (collectShortAns[i] != '空') {
					// if user set it as collect, set value.
					SACollectSeq.push(SAQuesList[i])
					collectSANum = collectSANum + 1
				}
			}

			if (collectSANum >= 1) {
				// If didn't had single and judge collect question, then set it to display sa collect  question.
				if ((collectSingleNum < 1) && (collectJudgeNum < 1)) { collectType = "shortAnswerQues" }

			}
			// Set value to global, use to display.
			getApp().globalData.SACollectSeq = SACollectSeq;
			getApp().globalData.collectSANum = collectSANum;



			wx.navigateTo({				
				url: '../collectDisplay/collectDisplay?choseType=' + collectType + '&index=' + collectIndex
			});

		});


	},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
	onReady: function () {

	},

  /**
   * 生命周期函数--监听页面显示
   */
	onShow: function () {

	},

  /**
   * 生命周期函数--监听页面隐藏
   */
	onHide: function () {

	},

  /**
   * 生命周期函数--监听页面卸载
   */
	onUnload: function () {

	},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
	onPullDownRefresh: function () {

	},

  /**
   * 页面上拉触底事件的处理函数
   */
	onReachBottom: function () {

	},

  /**
   * 用户点击右上角分享
   */
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			console.log(res.target)
		}
		return {
			title: '大唐雷电',
			path: '/pages/choiceMain/choiceMain',
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},

})