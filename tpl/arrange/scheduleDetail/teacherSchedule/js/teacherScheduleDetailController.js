;(function (window, undefined) {
    'use strict';

	window.arrange_teacherScheduleDetailController = function ($scope, $http, $stateParams, $timeout, baseinfo_generalService, alertService, app) {
		
		// 将传过来的json字符串转换为json格式数据
		var stateParams = JSON.parse($stateParams.params);
		
		$scope.teacherName = stateParams.teacherName;
		
		$scope.isClickChangeSemester = false;
		
		// 获取基础资源的学年学期
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message, data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
        });

		// 获取当前学年学期
		$http({
			method: "get",
			url: app.api.address + "/arrange/teacherSchedule/selectCurrentSemester"
		}).then(function(response) {
			$scope.academicYear = response.data.data;
			if($scope.isClickChangeSemester == false){
				$timeout(function(){
					document.getElementById($scope.academicYear).style.backgroundColor = "#03a9f4";
	            },1000);
			}
			$scope.semesterIdQuery = response.data.data;
			$scope.getCourse("1");
		}, function(response) {
			console.log(response);
		});
		
		// 左侧动画效果
		$scope.studentLeft = function() {
			if($('.all-left').find($('.fa-outdent')).length > 0) {
				$(".all-left .fa-outdent").removeClass('fa-outdent').addClass('fa-indent')
				$('.all-left').css('width', "50px");
				$('.all-left_wrap').css('display', "none");
				$('.all-right').css('width', "calc(100% - 60px)");
				$('.footer').css({
					'width': "calc(100% - 60px)",
					'margin-left': "50px"
				});
			} else {
				$(".all-left .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
				$('.all-left').css('width', "230px");
				$('.all-right').css('width', "calc(100% - 240px)");
				$('.footer').css({
					'width': "calc(100% - 230px)",
					'margin-left': "230px"
				});
				clearTimeout(rur);
				var rur = setTimeout(function() {
					$('.all-left_wrap').fadeIn();
				}, 500)
			}
		};

		// 宽度
		var navWidth = $(".tabs-all").width();
		$scope.liWidth = navWidth / 10;

		// 我的课表的周次滑动效果
		$scope.weeklyShow = function() {
			//周次切换
			var i = 10; //定义每个面板显示8个菜单
			var len = $scope.weeklyList.length; //获得LI元素的个数
			var page = 1;
			var maxpage = Math.ceil(len / i);
			$scope.next = function() {
				if(!$(".tabs-all .nav").is(":animated")) {
					if(page == maxpage) {
						$(".tabs-all .nav").stop();
					} else {
						$(".tabs-all .nav").animate({
							left: "-=" + navWidth + "px"
						}, 1500);
						page++;;
					}
				}
			};
			$scope.pre = function() {
				if(!$(".tabs-all .nav").is(":animated")) {
					if(page == 1) {
						$(".tabs-all .nav").stop();
					} else {
						$(".tabs-all .nav").animate({
							left: "+=" + navWidth + "px"
						}, 1500);
						page--;;
					}
				}
			};
		};
    
		// 显示节次信息
		$scope.sectionList = {};
		$http({
			method: "get",
			url: app.api.address + '/arrange/teacherTimeDemand',
			params: {
				type : 'selectSection',
				semesterId : '2017-2018-1'
			}
		}).then(function(response) {
			$scope.sectionList = response.data.data.rows;
		}, function(response) {
			console.log(response);
		});
		
		// 获取当前周次和周次名称【因为这是查历史，所以默认选中第一周】
		$scope.weekly = "";
		$scope.weeklyList = {};
		$http({
			method: "get",
			url: app.api.address + "/arrange/teacherSchedule",
			params: {
				type : 'selectSectionList',
				pageSize : '50'
			}
		}).then(function(response) {
			$scope.weeklyList = response.data.data.rows;
			$scope.currentWeekly = "1"; // 默认为第一周次
//			$scope.currentWeekly = response.data.data.rows[0].currentWeekly; // 当前周次
			
			if($scope.currentWeekly == undefined || $scope.currentWeekly == 'undefined') {
				$scope.currentWeekly = "1";	// 默认初始化为1
			}
			
			$scope.weeklyShow();
			$scope.getCourse($scope.currentWeekly);
		}, function(response) {
			console.log(response);
		});
		
		// 点击左侧的学年学期并时刻改变
		$scope.changeSemesterId = function(params){
			document.getElementById($scope.academicYear).style.backgroundColor = "";
			$scope.semesterIdQuery = params;
			$scope.academicYear = params;
			$scope.getCourse($scope.currentWeekly);
		};
		
		// 改变左侧ul li的样式
		$scope.changeSemesterCss = function($event){
			$scope.isClickChangeSemester = true;
	        $("ul[id=changeSemesterCss] >li").removeClass("all-left-wrap-active");
	        $("ul[id=changeSemesterCss] >li >label").removeClass("all-left-wrap-active");
	        if($event.target.localName == "li"){
	        	$($event.target).addClass("all-left-wrap-active");
	        }else{
	        	$($event.target.parentElement).addClass("all-left-wrap-active");
	        }
		};
		
		$scope.weekTimeMap = {};
//		// 获取周次的信息并刷新数据，每次点击重新请求数据【参数：当前学年学期    & 所选周次】
		$scope.getCourse = function(weekly) {
			$scope.weekly = weekly;
			var academicYear = $scope.academicYear;
			//课程信息
			//加载动画
			$scope.showLoading = true;
			$http({
				method: "get",
				url: app.api.address + "/arrange/teacherSchedule",
				params: {
					type: 'selectTeachStateSchedule',
					teacherNum: stateParams.teacherId,
					weekly: weekly,
					semesterId: $scope.semesterIdQuery
				}
			})
			.then(function(response) {
				var data = response.data.data.rows;
				var j = 0;
				$scope.courseList = [];
				for(var i = 0; i < $scope.sectionList.length; i++) {
					if(data[j] != undefined && "" + (i + 1) == data[j].section) {
						$scope.courseList[i] = data[j];
						j++;
					} else {
						$scope.courseList[i] = {};
					}
				}
				$scope.showLoading = false;
			}, function(response) {
				console.log(response);
			});
			
			//获取周的开始时间和结束时间【（2017-12-03至2017-12-09）】 不需要学年学期Id，只需要周次
			$http({
				method: "get",
				url: app.api.address + "/arrange/teacherSchedule",
				params: {
					type: 'selectMaxMinTime',
					weekly: $scope.weekly
				}
			})
			.then(function(response) {
				$scope.weekTimeMap = response.data.data.rows[0];
			}, function(response) {
				console.log(response);
			});
		};

	};
	arrange_teacherScheduleDetailController.$inject = ['$scope', '$http', '$stateParams', '$timeout', 'baseinfo_generalService', 'alertService', 'app'];

})(window);
