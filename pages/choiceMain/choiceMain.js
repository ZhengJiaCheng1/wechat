var that;
var Bmob = require('../../utils/bmob.js');
Page({
  data: { 
    choseQuestionBank:"点击选择",

		array: ['集控值班员', '脱硫值班员', '汽机题库', '锅炉题库', '电气题库', '其他'],
	//	array: ['汽机运行员', '锅炉运行员',  '电气值班员'],
     




    objectArray: [

	/*
      {
        id: 0,
				name: '汽机运行员'
      },
      {
        id: 1,
				name: '锅炉运行员'
      },
      {
        id: 2,
				name: '电气值班员'
      },

		  */

			{
				id: 0,
				name: '集控值班员'
			},
			{
				id: 1,
				name: '脱硫值班员'
			},
			{
				id: 2,
				name: '汽机题库'
			},

      {
        id: 3,
        name: '锅炉题库'
      },
      {
        id: 4,
        name: '电气题库'
      },
      {
        id: 5,
        name: '其他'
      }

      








    ],
    index: 0,
    loading: true,
    currentUserId:''
  },

  onLoad: function () {
    that = this;

  },

  onShow: function () {

  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      choseQuestionBank: that.data.array[e.detail.value]
    })
  },

  chose:function(){
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var User = Bmob.Object.extend("_User");
    var queryUser = new Bmob.Query(User);
    queryUser.get(currentUserId, {
      success: function (result) {
        var register = result.get("register");
        console.log(currentUserId)
        if (register==true){
          var choseQuestionBank = that.data.choseQuestionBank;
          if (choseQuestionBank != "点击选择") {
            getApp().globalData.choseQuestionBank = choseQuestionBank;
            getApp().globalData.score = 0;

            wx.navigateTo({
              url: '../singleChoiceExplain/singleChoiceExplain'
            });
          }
          else if (choseQuestionBank == "点击选择") {
            wx.showToast({
              title: '请选择题库',
              image: '../../images/warn.png',
              duration: 2000
            })
          }
        }
        else{
          wx.showModal({
            title: '尚未完善信息',
            content: '请放心填写，您的隐私绝不会被泄露',
            confirmText: '立即注册',
            confirmColor: '#1bd0bd',
            showCancel:false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../register/register'
                })
              } else if (res.cancel) {
              }
            }
          })
        }
        that.setData({
          loading: false
        })
      },
      error: function (object, error) {
      }
    });
  },

 
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '发电部题库',
      path: '/pages/choiceMain/choiceMain',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
 
})