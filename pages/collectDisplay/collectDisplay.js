var that;
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
	data: {

		choseQuestionBank: '',
		singleList: [],
		judgeList: [],
		choseType: '',
		nowQuestion: [],
		correctAnswer: '',
		userAnswer: '',
		loading: true,

		singleCollectSeq: [],
		hadCollect: null,
		nowQuestionNumber: 0,
		QuestionNum: 0,
		QuestionEndIntData: 0,
		IsDisplayQuesNum: null,



		judgeCollectSeq: [],
		judgeQuesNum: 0,
		judgeQuesEndIntData: 0,
		nowJudgeQuesNumber: 0,
		nowJudgeQues: [],
		judgeCorrectAnswer: '',
		// judgeUserAnswer: '',


		IsAnswerButton: true,
		showAnswer: false,

	},

  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function (options) {



		that = this;

		var choseQuestionBank = getApp().globalData.choseQuestionBank;
		// Not to display question number.
		that.setData({
			IsDisplayQuesNum: false,
			choseQuestionBank: choseQuestionBank,
		});



		var index = options.index;
		var choseType = options.choseType;

		var collectSingleNum = getApp().globalData.collectSingleNum
		var collectJudgeNum = getApp().globalData.collectJudgeNum

		if ((collectSingleNum < 1) && (collectSingleNum < 1)) {

			// Didn't has wrong question.
			that.setData({
				hadCollect: false,
				loading: false
			});

		}

		else {

			if (collectSingleNum > 0) {
				var singleCollectSeq = getApp().globalData.singleCollectSeq
				var QuestionNum = singleCollectSeq.length

				// It has wrong question.
				that.setData({
					singleCollectSeq: singleCollectSeq,
					QuestionNum: QuestionNum,
					QuestionEndIntData: parseInt(QuestionNum) - 1,
					choseType: choseType,
					hadCollect: true,
				});


				var nowQuestion = singleCollectSeq[index];
				var correctAnswer = nowQuestion.attributes.answer[0];

				that.setData({
					nowQuestionNumber: parseInt(options.index),
					nowQuestion: nowQuestion,
					correctAnswer: correctAnswer,
					loading: false
				});


			}

			if (collectJudgeNum > 0) {
				var judgeCollectSeq = getApp().globalData.judgeCollectSeq
				var judgeQuesNum = judgeCollectSeq.length


				// It has Collect question.
				that.setData({
					judgeCollectSeq: judgeCollectSeq,
					judgeQuesNum: judgeQuesNum,
					judgeQuesEndIntData: parseInt(judgeQuesNum) - 1,
					choseType: choseType,
					hadCollect: true,
				});


				var nowJudgeQues = judgeCollectSeq[index];
				var judgeCorrectAnswer = nowJudgeQues.attributes.answer[0];

				that.setData({
					nowJudgeQuesNumber: parseInt(options.index),
					nowQuestion: nowQuestion,
					judgeCorrectAnswer: judgeCorrectAnswer,
				});


				that.setData({
					loading: false,
				});

			}

		}


		wx.setNavigationBarTitle({
			title: '收藏(' + choseQuestionBank + ')'
		})



	},




	frontQuestion: function () {
		that = this;
		var nowQuestionNumber = that.data.nowQuestionNumber;
		nowQuestionNumber = nowQuestionNumber - 1;

		var nowQuestion = that.data.singleCollectSeq[nowQuestionNumber];
		var correctAnswer = nowQuestion.attributes.answer[0];

		that.setData({
			nowQuestion: nowQuestion,
			correctAnswer: correctAnswer,
			nowQuestionNumber: nowQuestionNumber,

			IsAnswerButton: true,
			showAnswer: false,
		});
	},





	afterQuestion: function () {
		that = this;

		var nowQuestionNumber = that.data.nowQuestionNumber;
		nowQuestionNumber = nowQuestionNumber + 1;

		var nowQuestion = that.data.singleCollectSeq[nowQuestionNumber];
		var correctAnswer = nowQuestion.attributes.answer[0];

		that.setData({
			nowQuestion: nowQuestion,
			correctAnswer: correctAnswer,
			nowQuestionNumber: nowQuestionNumber,

			IsAnswerButton: true,
			showAnswer: false,
		});

	},



	showQues: function (e) {
		that = this;

		var index = e.currentTarget.dataset.index;

		var nowQuestion = that.data.singleCollectSeq[index];
		var correctAnswer = nowQuestion.attributes.answer[0];

		// not To display question number.
		that.setData({
			nowQuestionNumber: index,
			nowQuestion: nowQuestion,
			correctAnswer: correctAnswer,
			choseType: 'singleQues',
			IsDisplayQuesNum: false,

			IsAnswerButton: true,
			showAnswer: false,
			});

	},






	TFfrontQuestion: function () {
		that = this;
		var nowJudgeQuesNumber = that.data.nowJudgeQuesNumber;
		nowJudgeQuesNumber = nowJudgeQuesNumber - 1;

		var nowJudgeQues = that.data.judgeCollectSeq[nowJudgeQuesNumber];
		var judgeCorrectAnswer = nowJudgeQues.attributes.answer[0];

		that.setData({
			nowJudgeQues: nowJudgeQues,
			judgeCorrectAnswer: judgeCorrectAnswer,
			nowJudgeQuesNumber: nowJudgeQuesNumber,

			IsAnswerButton: true,
			showAnswer: false,
		});
	},




	TFafterQuestion: function () {
		that = this;

		var nowJudgeQuesNumber = that.data.nowJudgeQuesNumber;
		nowJudgeQuesNumber = nowJudgeQuesNumber + 1;

		var nowJudgeQues = that.data.judgeCollectSeq[nowJudgeQuesNumber];
		var judgeCorrectAnswer = nowJudgeQues.attributes.answer[0];

		that.setData({
			nowJudgeQues: nowJudgeQues,
			judgeCorrectAnswer: judgeCorrectAnswer,
			nowJudgeQuesNumber: nowJudgeQuesNumber,

			IsAnswerButton: true,
			showAnswer: false,
		});

	},



	TFshowQues: function (e) {
		that = this;

		var index = e.currentTarget.dataset.index;
		var nowJudgeQues = that.data.judgeCollectSeq[index];
		var judgeCorrectAnswer = nowJudgeQues.attributes.answer[0];

		// not To display question number.
		that.setData({
			nowJudgeQuesNumber: index,
			nowJudgeQues: nowJudgeQues,
			judgeCorrectAnswer: judgeCorrectAnswer,
			choseType: 'judgeQues',
			IsDisplayQuesNum: false,

			IsAnswerButton: true,
			showAnswer: false,
				});

	},




	answerCard: function () {

		// To display question number.
		that.setData({
			IsDisplayQuesNum: true,
	
			IsAnswerButton: true,
			showAnswer: false,
		});

	},


	showAnswerTip: function () {
		that.setData({
			IsAnswerButton: false,
			showAnswer: true,
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
	onShareAppMessage: function () {

	}
})