var that;
var Bmob = require('../../utils/bmob.js');
Bmob.initialize("2c3521672357ab6e3a1c7a397d38134b", "d8e5e597ce2ef7680eccf479cd549c7e");

Page({


  data: { 
		choseQuestionBank: "点击选择",
		// choseQuestionBank:"集控值班员",
		 

		diaryList: [],


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

	chose: function (e){


		var user = new Bmob.User();//开始注册用户
		var newOpenid = wx.getStorageSync('openid')
		if (!newOpenid) {
			wx.login({
				success: function (res) {
					user.loginWithWeapp(res.code).then(function (user) {
						var openid = user.get("authData").weapp.openid;
						console.log(user, 'user', user.id, res);

						if (user.get("nickName")) {
							// 第二次访问
							console.log(user.get("nickName"), 'res.get("nickName")');

							wx.setStorageSync('openid', openid)
						} else {
							var User = Bmob.Object.extend("_User");
							var queryUser = new Bmob.Query(User);
							queryUser.get(user.id, {
								success: function (result) {
									result.set("register", false);
									result.save();

								},
								error: function (result, error) {

								}
							});




							//保存用户其他信息
						
								

							var userInfo = e.detail.userInfo;
									var nickName = userInfo.nickName;
									var userPic = userInfo.avatarUrl;
									console.log()
									var u = Bmob.Object.extend("_User");
									var query = new Bmob.Query(u);
									// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
									query.get(user.id, {
										success: function (result) {
											// 自动绑定之前的账号

											result.set('nickName', nickName);
											result.set("userPic", userPic);
											result.set("openid", openid);
											result.save();

										}
									});

							
						




						}

					}, function (err) {
						console.log(err, 'errr');
					});

				}
			});
		};



		

















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
							url: '../singleChoiceDetail/singleChoiceDetail?choseQuestionBank=' + choseQuestionBank
						});

            // wx.navigateTo({							
            //   url: '../singleChoiceExplain/singleChoiceExplain'
            // });


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