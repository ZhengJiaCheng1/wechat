var Bmob = require('../../utils/bmob.js');
var utils = require('../../utils/util.js');
var that;


Page({


  data: {

    choseLevel:false,

    noInput:false,

    clickAdderButton:false,

    nowTimeArr:null,

    nowTimeStr: null,

    NotFinishedList:[
      
    ],

    HadFinishedList:[

    ],

    OverdueList:[

    ],

    checkList: []

  
  },

  onLoad: function (options) {
    that = this;
    that.getCheckList();
    var nowTimeArr = utils.getTimeArr();
    var nowTimeStr = utils.getTimeStr();
    that.setData({
      nowTimeArr: nowTimeArr,
      nowTimeStr: nowTimeStr,
    }); 
    console.log(nowTimeStr)
    console.log(that.data.nowTimeArr)

    // var currentUser = Bmob.User.current();
    // var currentUserId = currentUser.id;
    // var matterForm = Bmob.Object.extend("Matter");
    // var querymatterForm = new Bmob.Query(matterForm);
    // console.log(currentUserId);
    // querymatterForm.equalTo("belong", currentUserId);
    // querymatterForm.find({
    //   success: function (results) {
    //     console.log("共查询到 " + results.length + " 条记录");
    //     that.setData({
    //       checkList: results,
    //     });   
    //     that.getNotFinished();
    //   },
    //   error: function (error) {
    //     console.log("查询失败: " + error.code + " " + error.message);
    //   }
    // });
  },


  onShow: function () {
  
  },

  getCheckList:function(){
    var currentUser = Bmob.User.current();
    var currentUserId = currentUser.id;
    var matterForm = Bmob.Object.extend("Matter");
    var querymatterForm = new Bmob.Query(matterForm);
    console.log(currentUserId);
    querymatterForm.equalTo("belong", currentUserId);
    querymatterForm.find({
      success: function (results) {
        console.log("共查询到 " + results.length + " 条记录");
        that.setData({
          checkList: results,
        });
        that.classifyMatter();
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    
  },

  classifyMatter:function(){
    var matterForm = Bmob.Object.extend("Matter");
    var querymatterForm = new Bmob.Query(matterForm);
    var nowTimeArr = that.data.nowTimeArr;
    var nowTimeStr = that.data.nowTimeStr;
    var noChecked = new Array();
    var hadChecked = new Array();
    var overdue = new Array();
    var allItem = new Array();
    allItem = that.data.checkList;
    var length = allItem.length;
    for(var i=0;i<length;i++){
      if (allItem[i].attributes.selectStatus == false && allItem[i].attributes.createTimeStr == nowTimeStr){
        noChecked.push(allItem[i])
  
      }
      else if (allItem[i].attributes.selectStatus == true){
        hadChecked.push(allItem[i])
      }

      else if (allItem[i].attributes.selectStatus == false && allItem[i].attributes.createTimeStr != nowTimeStr)
        overdue.push(allItem[i]),
          querymatterForm.get(allItem[i].id, {
            success: function (result) {
              result.set('overdue', true);
              result.save();
            },
            error: function (object, error) {
            }
          });
      }
    console.log(overdue);
    noChecked = that.sortItem(noChecked);
    that.setData({
      NotFinishedList: noChecked,
      HadFinishedList: hadChecked,
      OverdueList: overdue
    });
  },



  sortItem: function (list) {
    var noLevel = new Array();
    var lowLevel = new Array();
    var middleLevel = new Array();
    var highLevel = new Array();
    for (var i = 0; i < list.length; i++) {
      if (list[i].attributes.matterLevel == 0) {
        noLevel.push(list[i]);
      }
      else if (list[i].attributes.matterLevel == 1) {
        lowLevel.push(list[i])
      }
      else if (list[i].attributes.matterLevel == 2) {
        middleLevel.push(list[i])
      }
      else if (list[i].attributes.matterLevel == 3) {
        highLevel.push(list[i])
      }
    }
    // console.log(noLevel);
    var list1 = highLevel.concat(middleLevel);
    var list2 = list1.concat(lowLevel);
    var list3 = list2.concat(noLevel);
    return list3;
  },

  check: function (e) {
    var matterForm = Bmob.Object.extend("Matter");
    var querymatterForm = new Bmob.Query(matterForm);
    var index = e.currentTarget.dataset.index;
    var matterObjectId = that.data.NotFinishedList[index].id;
    var hadChecked = that.data.HadFinishedList;
    var noChecked = that.data.NotFinishedList;
    noChecked[index].attributes.selectStatus = true;
    hadChecked.push(noChecked[index])
    noChecked.splice(index, 1)
    that.setData({
      HadFinishedList: hadChecked,
      NotFinishedList: noChecked
    });
    querymatterForm.get(matterObjectId, {
      success: function (result) {
        result.set('selectStatus', true);
        result.save();
      },
      error: function (object, error) {
      }
    });
  },


  uncheck: function (e) {
    var matterForm = Bmob.Object.extend("Matter");
    var querymatterForm = new Bmob.Query(matterForm);
    var index = e.currentTarget.dataset.index;
    var matterObjectId = that.data.HadFinishedList[index].id;
    var hadChecked = that.data.HadFinishedList;
    hadChecked[index].attributes.selectStatus = false;
    var noChecked = that.data.NotFinishedList;
    var overdue = that.data.OverdueList;
    var createTime = that.data.HadFinishedList[index].attributes.createTimeStr;
    var nowTimeStr=that.data.nowTimeStr;
    if (createTime == nowTimeStr){
      noChecked.push(hadChecked[index])
      hadChecked.splice(index, 1)
      noChecked = that.sortItem(noChecked);
      that.setData({
        HadFinishedList: hadChecked,
        NotFinishedList: noChecked
      });
    }
    else if (createTime != nowTimeStr){
      overdue.push(hadChecked[index])
      hadChecked.splice(index, 1)
      that.setData({
        HadFinishedList: hadChecked,
        OverdueList: overdue
      });
    }

    

    querymatterForm.get(matterObjectId, {
      success: function (result) {
        result.set('selectStatus', false);
        result.save();
      },
      error: function (object, error) {
      }
    });
  },

  uncheckOverdue: function (e) {
    var matterForm = Bmob.Object.extend("Matter");
    var querymatterForm = new Bmob.Query(matterForm);
    var index = e.currentTarget.dataset.index;
    var matterObjectId = that.data.OverdueList[index].id;
    var overdue = that.data.OverdueList;
    overdue[index].attributes.selectStatus = true;
    var hadChecked = that.data.HadFinishedList;
    hadChecked.push(overdue[index])
    overdue.splice(index, 1)
    that.setData({
      HadFinishedList: hadChecked,
      OverdueList: overdue
    });
    querymatterForm.get(matterObjectId, {
      success: function (result) {
        result.set('overdue', false);
        result.set('selectStatus', true);
        result.save();
      },
      error: function (object, error) {
      }
    });
  },



  deleteNotFinished:function(e){
    var matterForm = Bmob.Object.extend("Matter");
    var querymatterForm = new Bmob.Query(matterForm);
    var index = e.currentTarget.dataset.index;
    var matterObjectId = that.data.NotFinishedList[index].id;
    querymatterForm.equalTo("objectId", matterObjectId);
    querymatterForm.find().then(function (todos) {
      return Bmob.Object.destroyAll(todos);
    }).then(function (todos) {
      console.log(todos);
      // 删除成功
    }, function (error) {
      // 异常处理
    });
    var noChecked = that.data.NotFinishedList;
    that.data.NotFinishedList[index].scrollLeft = 0;
    noChecked.splice(index, 1) 
    that.setData({
      NotFinishedList: noChecked
    });
  },
 

 deleteHadFinished: function (e) {
   var matterForm = Bmob.Object.extend("Matter");
   var querymatterForm = new Bmob.Query(matterForm);
   var index = e.currentTarget.dataset.index;
   var matterObjectId = that.data.HadFinishedList[index].id;
   querymatterForm.equalTo("objectId", matterObjectId);
   querymatterForm.find().then(function (todos) {
     return Bmob.Object.destroyAll(todos);
   }).then(function (todos) {
     console.log(todos);
     // 删除成功
   }, function (error) {
     // 异常处理
   });
    var hadChecked = that.data.HadFinishedList;
    that.data.HadFinishedList[index].scrollLeft = 0;
    hadChecked.splice(index, 1)
    that.setData({
      HadFinishedList: hadChecked
    });
  },

 deleteOverdue: function (e) {
   var matterForm = Bmob.Object.extend("Matter");
   var querymatterForm = new Bmob.Query(matterForm);
   var index = e.currentTarget.dataset.index;
   var matterObjectId = that.data.OverdueList[index].id;
   querymatterForm.equalTo("objectId", matterObjectId);
   querymatterForm.find().then(function (todos) {
     return Bmob.Object.destroyAll(todos);
   }).then(function (todos) {
     console.log(todos);
     // 删除成功
   }, function (error) {
     // 异常处理
   });
   var overdue = that.data.OverdueList;
   that.data.OverdueList[index].scrollLeft = 0;
   overdue.splice(index, 1)
   that.setData({
     OverdueList: overdue
   });
 },


  // 触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,
  // 最后一次单击事件点击发生时间
  lastTapTime: 0,
  // 单击事件点击后要触发的函数
  lastTapTimeoutFunc: null,



  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },



  /// 长按
  longTap: function (e) {
    that.setData({
      clickAdderButton: true
    });
    console.log("long tap")
    wx.showModal({
      title: '提示',
      content: '长按事件被触发',
      showCancel: false
    })
    that.setData({
      clickAdderButton: false
    });
  },

  /// 单击、双击
  multipleTap: function (e) {
    that.setData({
      clickAdderButton: true
    });
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    // if (that.touchEndTime - that.touchStartTime < 350) {
    //   // 当前点击的时间
    //   var currentTime = e.timeStamp
    //   var lastTapTime = that.lastTapTime
    //   // 更新最后一次点击时间
    //   that.lastTapTime = currentTime

    //   // 如果两次点击时间在300毫秒内，则认为是双击事件
    //   if (currentTime - lastTapTime < 300) {
    //     console.log("double tap")
    //     // 成功触发双击事件时，取消单击事件的执行
    //     clearTimeout(that.lastTapTimeoutFunc);
    //     wx.navigateTo({
    //       url: '../addMatter/addMatter'
    //     })
    //     that.setData({
    //       clickAdderButton: false
    //     });
      // } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        that.lastTapTimeoutFunc = setTimeout(function () {
          that.setModalStatus(e);
          that.setData({
            clickAdderButton: false
          });
        }, 0);
      // }
    // }
    
  },

  setModalStatus: function (e) {
    console.log("设置显示状态，1显示0不显示", e.currentTarget.dataset.status);
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease-out",
      delay: 0
    })
    that.animation = animation
    animation.translateY(300).step()
    that.setData({
      animationData: animation.export()
    })
    if (e.currentTarget.dataset.status == 1) {
      that.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        that.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(that), 80)
  },

  

  tap: function (e) {
    this.setData({
      x: 30,
      y: 30
    });
  },

  quickAddMatter:function(e){
    var nowTimeArr = that.data.nowTimeArr;
    var nowTimeStr = that.data.nowTimeStr;
    var MatterForm = Bmob.Object.extend("Matter");
    var matterForm = new MatterForm();
    var addMatter = e.detail.value.addMatter;
    var noChecked = that.data.NotFinishedList;
    if (!addMatter){
      that.setData(
        {
          noInput: true
        }
      )
      that.lastTapTimeoutFunc = setTimeout(function () {
        that.setData({
          noInput: false
        });
      }, 1500);

    }
    else{
      matterForm.set("title", addMatter);
      matterForm.set("selectStatus", false);
      matterForm.set("overdue", false);
      matterForm.set("matterLevel", 0);
      matterForm.set("createTime", nowTimeArr);
      matterForm.set("createTimeStr", nowTimeStr);
      matterForm.set("belong", Bmob.User.current());
      matterForm.save(null, {
        success: function (result) {
          console.log("创建成功");
          that.getCheckList();
        },
        error: function (result, error) {
          console.log('创建失败');
        }
      });
      that.setData(
        {
          showModalStatus: false
        }
      );
    }
  },

  choseLevel:function(){
    that.setData(
      {
        choseLevel: true
      }
    )
  }

  


})
