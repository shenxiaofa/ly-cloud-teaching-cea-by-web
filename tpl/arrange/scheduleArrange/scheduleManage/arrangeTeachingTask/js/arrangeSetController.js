/**
 * 教学任务安排
 */
;(function (window, undefined) {
    'use strict';

	window.arrange_arrangeSetController = function ($compile, $http, $scope, $rootScope, $uibModal, $uibModalInstance, item, arrange_arrangeSetService, formVerifyService, alertService, app) {
        
        $scope.arrangeTeachingTask = {}; // 本不需要初始化的，通过初始化后才可以从html页面获取到
        $scope.searchSubmitIsClick = false;	// 检测是否点了查询按钮，并且成功查询到数据
        $scope.emptyDataIsExist = true;	// 检测清空部分的数据是否存在
        $scope.scrollViewIsExistence = false;
		$scope.courseName = item.courseName;
		$scope.openDeptId = item.openDeptId;
		$scope.openDeptName = item.openDeptName;
		$scope.credit = item.credit;
		$scope.totalHour = item.totalHour;
        $scope.notArrangeNum = item.notArrangeNum;
		$scope.room = {};	// 从选择上课地点的页面返回的
		
        // 基础资源获取学年学期Id
        //$scope.teacherId = [];
        // arrange_arrangeSetService.getTeacherId(function (error,message,data) {
        //     $scope.teacherId = data.data;
        //     var html = ''
        //     	+  '<select ui-select2 '
        //         +  ' ng-model="arrangeTeachingTask.teacherId" ng-required="true" id="teacherId" name="teacherId" '
        //         +  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" '
        //         +  ' ui-chosen="arrangeSetSearchForm.teacherId"> '
        //         +  '<option value="">==请选择==</option> '
        //         +  '<option  ng-repeat="a in teacherId" value="{{a.num}}">{{a.name}}</option> '
        //         +  '</select>';
        //     angular.element("#teacherId").parent().empty().append(html);
        //     $compile(angular.element("#teacherId").parent().contents())($scope);
        // });
        $scope.selectTeacher = function () {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/arrange/scheduleArrange/scheduleManage/arrangeTeachingTask/teacherSelector.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return $scope.arrangeTeachingTask;
                    }
                },
                controller: arrange_teacherSelectController
            });
        }
	    
		// 查询参数
        $scope.queryParamsForSituation = function (params) {
            var pageParam = {
                type : 'selectPeriodArrange',
                way : item.way,
                value : item.id,
                semesterId : item.semesterId,
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.arrangeTeachingTask);
        };
        
        // 初始化星期 以及 统计数据 数组
        var weekArray = [];
        var statisticsArray = [];
        // 初始化25个对应的星期数据
        var statistics1,statistics2,statistics3,statistics4,statistics5,
        	statistics6,statistics7,statistics8,statistics9,statistics10,
        	statistics11,statistics12,statistics13,statistics14,statistics15,
        	statistics16,statistics17,statistics18,statistics19,statistics20,
        	statistics21,statistics22,statistics23,statistics24,statistics25;
        
		/* start 学时安排情况开始 */
        $scope.semesterArrangeSituatiomTable = {
            url: app.api.address + '/arrange/scheduleArrange',
            method: 'get',
            cache: false,
            height: 0,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            search: false,
            idField : "section", // 指定主键列
            uniqueId: "section", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParamsForSituation,//传递参数（*）
            clickToSelect: true,
			formatLoadingMessage: function () {  
			    return "请稍等，正在加载中...";
			},
            onLoadSuccess: function() {
                $compile(angular.element('#semesterArrangeSituatiomTable').contents())($scope);
				// 获取当前table并通过dom的方式隐藏 除了第二行外的其他所有内容
				var tableObj = document.getElementById("semesterArrangeSituatiomTable");	// 获取到当前表格
				var tbody = tableObj.getElementsByTagName("tbody").item(0);	// 获取到第一个tbody对象
				for (var i = 0; i < tbody.rows.length; i++) {    // 遍历Table的所有Row
					// 获取到标签 为 data-index的所有行
					tbody.rows[i].getAttribute('data-index');
					// 只保留第二行的数据
					if(tbody.rows[i].getAttribute('data-index') == 1){
						
					}else{
						tbody.rows[i].style.display  = 'none';
					}
			    }
            },
            responseHandler: function(data) {
            	// 再加前分别存储week和statistics到两个指定的数组中
                if(data.data.rows.length!=0){
                    for(var i=0; i<data.data.rows.length; i++){
                        // 把数据存储到 星期 和 统计 两个数组
                        weekArray.push(data.data.rows[i].week);
                        statisticsArray.push(data.data.rows[i].statistics);
                        // 判断25个星期是否存在，存在则获取到对应的 统计 的数据到25个对象中
                        if(weekArray[i] == 1){	statistics1 = statisticsArray[i];	}
                        if(weekArray[i] == 2){	statistics2 = statisticsArray[i];	}
                        if(weekArray[i] == 3){	statistics3 = statisticsArray[i];	}
                        if(weekArray[i] == 4){	statistics4 = statisticsArray[i];	}
                        if(weekArray[i] == 5){	statistics5 = statisticsArray[i];	}
                        if(weekArray[i] == 6){	statistics6 = statisticsArray[i];	}
                        if(weekArray[i] == 7){	statistics7 = statisticsArray[i];	}
                        if(weekArray[i] == 8){	statistics8 = statisticsArray[i];	}
                        if(weekArray[i] == 9){	statistics9 = statisticsArray[i];	}
                        if(weekArray[i] == 10){	statistics10 = statisticsArray[i];	}
                        if(weekArray[i] == 11){	statistics11 = statisticsArray[i];	}
                        if(weekArray[i] == 12){	statistics12 = statisticsArray[i];	}
                        if(weekArray[i] == 13){	statistics13 = statisticsArray[i];	}
                        if(weekArray[i] == 14){	statistics14 = statisticsArray[i];	}
                        if(weekArray[i] == 15){	statistics15 = statisticsArray[i];	}
                        if(weekArray[i] == 16){	statistics16 = statisticsArray[i];	}
                        if(weekArray[i] == 17){	statistics17 = statisticsArray[i];	}
                        if(weekArray[i] == 18){	statistics18 = statisticsArray[i];	}
                        if(weekArray[i] == 19){	statistics19 = statisticsArray[i];	}
                        if(weekArray[i] == 20){	statistics20 = statisticsArray[i];	}
                        if(weekArray[i] == 21){	statistics21 = statisticsArray[i];	}
                        if(weekArray[i] == 22){	statistics22 = statisticsArray[i];	}
                        if(weekArray[i] == 23){	statistics23 = statisticsArray[i];	}
                        if(weekArray[i] == 24){	statistics24 = statisticsArray[i];	}
                        if(weekArray[i] == 25){	statistics25 = statisticsArray[i];	}
                    }
                }else{
                    statistics1 ="";
                    statistics2 ="";
                    statistics3 = "";
                    statistics4 = "";
                    statistics5 = "";
                    statistics6 = "";
                    statistics7 = "";
                    statistics8 = "";
                    statistics9 = "";
                    statistics10 = "";
                    statistics11 = "";
                    statistics12 = "";
                    statistics13 = "";
                    statistics14 = "";
                    statistics15 = "";
                    statistics16 = "";
                    statistics17 = "";
                    statistics18 = "";
                    statistics19 = "";
                    statistics20 = "";
                    statistics21 = "";
                    statistics22 = "";
                    statistics23 = "";
                    statistics24 = "";
                    statistics25 = "";
                }

				// 当数据为空时，传一个假的json格式数据过去 目的是让行数显示出来
				var tempRow = [{
						"statistics": "1",
						"week": "1"
					},{
						"statistics": "1",
						"week": "1"
					}];
				// 若传回来的数据不为空，则得到对应数据
            	if(data.data.rows.length !== 0){
	                // return {
	                //     "total": data.data.total,//总页数
	                //     "rows": data.data.rows   //数据
	                // };
                    return data.data;
            	}
            	// 若传回来的数据为空，则得到假数据，目的是让行数显示出来
            	if(data.data.rows.length == 0){
	                return {
	                    "total": 0,//总页数
	                    "rows": tempRow   //数据
	                };
            	}
            },
            columns: [
                {field: "week",title: "周次",align: "center",valign: "middle",width: "14%",
                    formatter: function(value, row, index) {
                    	if(weekArray.length == 0 && weekArray == 'undefined'){
            				return "周次安排情况";
						}
                    	return "周次安排情况";
                    }
                },
                {field: "statistics1",title: "1",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
                    	if(statistics1 == undefined){
            				return "";
						}	return statistics1;
                    }
                },
                {field: "statistics2",title: "2",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics2 == undefined){
            				return "";
						}	return statistics2;
                    }
                },
                {field: "statistics3",title: "3",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics3 == undefined){
            				return "";
						}	return statistics3;
                    }
                },
                {field: "statistics4",title: "4",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics4 == undefined){
            				return "";
						}	return statistics4;
                    }
                },
                {field: "statistics5",title: "5",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics5 == undefined){
            				return "";
						}	return statistics5;
                    }
                },
                {field: "statistics6",title: "6",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics6 == undefined){
            				return "";
						}	return statistics6;
                    }
                },
                {field: "statistics7",title: "7",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics7 == undefined){
            				return "";
						}	return statistics7;
                    }
                },
                {field: "statistics8",title: "8",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics8 == undefined){
            				return "";
						}	return statistics8;
                    }
                },
                {field: "statistics9",title: "9",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics9 == undefined){
            				return "";
						}	return statistics9;
                    }
                },
                {field: "statistics10",title: "10",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics10 == undefined){
            				return "";
						}	return statistics10;
                    }
                },
                {field: "statistics11",title: "11",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics11 == undefined){
            				return "";
						}	return statistics11;
                    }
                },
                {field: "statistics12",title: "12",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics12 == undefined){
            				return "";
						}	return statistics12;
                    }
                },
                {field: "statistics13",title: "13",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics13 == undefined){
            				return "";
						}	return statistics13;
                    }
                },
                {field: "statistics14",title: "14",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics14 == undefined){
            				return "";
						}	return statistics14;
                    }
                },
                {field: "statistics15",title: "15",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics15 == undefined){
            				return "";
						}	return statistics15;
                    }
                },
                {field: "statistics16",title: "16",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics16 == undefined){
            				return "";
						}	return statistics16;
                    }
                },
                {field: "statistics17",title: "17",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics17 == undefined){
            				return "";
						}	return statistics17;
                    }
                },
                {field: "statistics18",title: "18",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics18 == undefined){
            				return "";
						}	return statistics18;
                    }
                },
                {field: "statistics19",title: "19",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics19 == undefined){
            				return "";
						}	return statistics19;
                    }
                },
                {field: "statistics20",title: "20",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics20 == undefined){
            				return "";
						}	return statistics20;
                    }
                },
                {field: "statistics21",title: "21",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics21 == undefined){
            				return "";
						}	return statistics21;
                    }
                },
                {field: "statistics22",title: "22",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics22 == undefined){
            				return "";
						}	return statistics22;
                    }
                },
                {field: "statistics23",title: "23",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics23 == undefined){
            				return "";
						}	return statistics23;
                    }
                },
                {field: "statistics24",title: "24",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics24 == undefined){
            				return "";
						}	return statistics24;
                    }
                },
                {field: "statistics25",title: "25",align: "center",valign: "middle",width: "3.4%",
                    formatter: function(value, row, index) {
						if(statistics25 == undefined){
            				return "";
						}	return statistics25;
                    }
                }
            ]
        };
		/* end 学时安排情况结束  */
        
		// 查询参数
        $scope.queryParams = function (params) {
            var pageParam = {
                type : 'selectSection',
                semesterId : item.semesterId,
                pageSize : params.pageSize,   //页面大小
                pageNo : params.pageNumber  //页码
            };
            return angular.extend(pageParam, $scope.arrangeTeachingTask);
        };
        
        // 获取所有的sectionId 为了在下面循环所有的方格并且制空
        var allSectionId = [];
        var allSection = [];
		/* start 时间地点安排 */
        $scope.timeRoomArrangeTable = {
            url: app.api.address + '/arrange/teacherTimeDemand',
            method: 'get',
            cache: false,
            height: 0,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pageSize: 10,
            pageNumber: 1,
            pageList: [5, 10, 20, 50],
            search: false,
            idField : "section", // 指定主键列
            uniqueId: "section", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
			formatLoadingMessage: function () {  
			    return "请稍等，正在加载中...";
			},  
            onLoadSuccess: function() {
                $compile(angular.element('#timeRoomArrangeTable').contents())($scope);
            },
            clickToSelect: true,
            responseHandler: function(data) {
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
            },
            columns: [
                {field: "section",title: "小节次名称",align: "center",valign: "middle",width:"30%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempSection = row.section + "   " + row.beginTime + "~" + row.endTime;
                        allSection.push(row.section);
                        allSectionId.push(row.sectionId);
                        return tempSection;
                    }
                },
                {field: "monday",title: "星期一",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempId = "1_"+row.sectionId+"_section"+row.section;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" '+
                        		' ng-click=\'changeButtonCss('+ angular.toJson(tempId) +');$event.stopPropagation();\' id='+tempId+'></button>';
                    }
                },
                {field: "tuesday",title: "星期二",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempId = "2_"+row.sectionId+"_section"+row.section;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" '+
                        		' ng-click=\'changeButtonCss('+ angular.toJson(tempId) +');$event.stopPropagation();\' id='+tempId+'></button>';
                    }
                },
                {field: "wednesday",title: "星期三",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempId = "3_"+row.sectionId+"_section"+row.section;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" '+
                        		' ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+'></button>';
                    }
                },
                {field: "thursday",title: "星期四",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempId = "4_"+row.sectionId+"_section"+row.section;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" '+
                        		' ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+'></button>';
                    }
                },
                {field: "friday",title: "星期五",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempId = "5_"+row.sectionId+"_section"+row.section;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" '+
                        		' ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+'></button>';
                    }
                },
                {field: "saturday",title: "星期六",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempId = "6_"+row.sectionId+"_section"+row.section;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" '+
                        		' ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+'></button>';
                    }
                },
                {field: "sunday",title: "星期日",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
                    	row.section = row.section.substring(1, row.section.length-1);
                        var tempId = "7_"+row.sectionId+"_section"+row.section;
                        return '<button type="button" name="timeSelect" class="btn_selectButton" '+
                        		' ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+'></button>';
                    }
                }
            ]
        };
		/* end 时间地点安排 */
		
        // 查询提交表单
        $scope.searchSubmit = function (form) {
        	// 把显示的节次数处理成0
        	$scope.weekSectionCount = 0;
			// 处理前验证input输入框以及下拉框
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
          	$scope.searchSubmitIsClick = true;	// 在验证了输入框不为空后，方格才能点击
			if($scope.arrangeTeachingTask.startWeek <= 0 || $scope.arrangeTeachingTask.endWeek <= 0){
            	alertService('【开始周次】或【结束周次】必须为正数！');
			}else if(parseInt($scope.arrangeTeachingTask.startWeek, 10) > parseInt($scope.arrangeTeachingTask.endWeek, 10)){
            	alertService('【开始周次】不能大于【结束周次】！');
			}else{
				// 获取不可排的信息
				$http({
					method: 'GET',
					url: app.api.address + '/arrange/scheduleArrange',
					params: {
						type : 'selectCannotArrange',
					  	teacherId : $scope.arrangeTeachingTask.teacherId,
					  	startWeek : $scope.arrangeTeachingTask.startWeek,
					  	endWeek : $scope.arrangeTeachingTask.endWeek,
					  	oddEvenWeek : $scope.arrangeTeachingTask.oddEvenWeek,
                		classId : item.classId,
                		courseId : item.courseId,
                		semesterId : item.semesterId,
                		way : item.way,
                		value : item.id
					}
	          	}).then(function successCallback(response) {
					var unArranges = response.data.data.rows;	// 获取到
					// 循环所有的方格的Id 然后对所有颜色进行匹配，如果有蓝色和灰色，改为白色
					for(var i=1; i<=7; i++){
						for(var j=0; j<allSectionId.length; j++){
							var tempSectionId = i + "_"+ allSectionId[j]+"_section"+allSection[j];
							tempSectionId = angular.element('#' + tempSectionId);
        					var color = tempSectionId.css('background-color');
							// 如果有蓝色或者灰色，都处理为白色
							if(color == "rgb(3, 169, 244)"){
								$(tempSectionId).css("background","rgb(255, 255, 255)");
								$(tempSectionId).css("cursor","");
							}else if(color == "rgb(204, 204, 204)"){
								$(tempSectionId).css("background","rgb(255, 255, 255)");
								$(tempSectionId).css("cursor","");
							}
						}
					}
					// 对右侧的数组清空
            		$scope.weekSectionData.splice(0, $scope.weekSectionData.length);	// 清空原有的数组
            		angular.element('#weekSectionTable').bootstrapTable('refresh');		// 每次查询 刷新星期节次的表格
            		$scope.scrollViewIsExistence = false;
	                // 遍历结果并将对应的数据循环整理到数组中
					angular.forEach(unArranges, function(unArrange) {
						if(unArrange.weekDay != null && unArrange.sectionId != null){
							// 拼接tempSectionId
							var tempSectionId = unArrange.weekDay + "_" + unArrange.sectionId;
							tempSectionId = angular.element('#' + tempSectionId);
							// 初始化让所有被查到的变为灰色
							$(tempSectionId).css("background","rgb(204, 204, 204)");
						}
					});
				}, function errorCallback(response) {

				});
			}
        };

        // 初始化星期节次最终的数组
        $scope.weekSectionData = [];
        $scope.weekSectionCount = 0;

        // 按钮变色处理 通过获取颜色改变颜色 存储数据并push到weekSectionData
        $scope.changeButtonCss = function(tempId){
            var tempWeek = "";		// 临时week
            var tempSection = "";	// 临时section
            var tempSectionId = "";	// 临时sectionId
            // 通过tempId 将星期的数字转换为星期的汉字
            var weenNum = tempId.substring(0, tempId.indexOf("_"));		// LastIndexOf
            if(weenNum == 1){
                weenNum = "一";
            }else if(weenNum == 2){
                weenNum = "二";
            }else if(weenNum == 3){
                weenNum = "三";
            }else if(weenNum == 4){
                weenNum = "四";
            }else if(weenNum == 5){
                weenNum = "五";
            }else if(weenNum == 6){
                weenNum = "六";
            }else if(weenNum == 7){
                weenNum = "日";
            }
            // 拼接 星期  节次名称
            tempWeek = "星期" + weenNum;
            tempSection = "第" + tempId.substring(tempId.lastIndexOf("_")+8, tempId.length) + "小节";
            tempSectionId = tempId.substring(tempId.indexOf("_")+1, tempId.lastIndexOf("_"));
            // 初始化临时的数据 用于数据传递到最终的数组中
            $scope.weekSectionTempData = {
            	objectId : tempId,			// 存储点击的对象的Id
                tempId : tempSectionId,		// 存储节次Id
                week : tempWeek,
                section : tempSection
            };
            // 转换成jquery的id
			tempId = angular.element('#' + tempId);
            // 改变样式css 并做操作最终的数组
            var color = tempId.css('background-color');
            if($scope.searchSubmitIsClick == false 
		            	|| $scope.arrangeTeachingTask.startWeek == null 
		            	|| $scope.arrangeTeachingTask.endWeek == null
            			|| $scope.arrangeTeachingTask.teacherId == null
//      				|| $scope.room.roomId == null
            ){
            	alertService('请先通过 【查询】 筛选掉不可排的星期节次，再选星期节次！');
            }else{
            	// 颜色判断
	            if(color == "rgb(204, 204, 204)"){		// 灰色点击没反应【优先】
					$(tempId).css("background","rgb(204, 204, 204)");	// 变灰色
					$(tempId).css("cursor","no-drop");	// "no-drop"无法点击【因为这个对象没有被定义，所以不被执行】
	            	return;		// 跳出来，不会执行以下的代码 
	            }
	            if(color == "rgb(3, 169, 244)") {	// 蓝色点击变为白色
					$(tempId).css("background","rgb(255, 255, 255)");	// 变白
	                var tempData = [];	// 初始化临时数组 【删除操作】
	                /*	for(var k=0;k<$scope.weekSectionData.length;k++){
	               		if($scope.weekSectionData[k].tempId !== $scope.weekSectionTempData.objectId){
	               			tempData.push($scope.weekSectionData[k]);
	               		}
	               }*/
	                	angular.forEach($scope.weekSectionData, function(data, index, array){	// 临时的数组获取数据
	                    if (data.objectId !== $scope.weekSectionTempData.objectId) {
	                        tempData.push(data);
	                    }
	                });
	                
	               
	                $scope.weekSectionData.splice(0, $scope.weekSectionData.length);	// 清空原有的数组
	                angular.forEach(tempData, function(data, index, array){				// 清空了的数组获取临时的数组
	                    $scope.weekSectionData.push(data);
	                });
	                $scope.weekSectionCount = $scope.weekSectionData.length;			// 节次数-1
	                angular.element('#weekSectionTable').bootstrapTable('refresh');		// 每次操作 刷新星期节次的表格
	            }
	            if(color == "rgb(255, 255, 255)") {		// 白色点击变蓝色 
					$(tempId).css("background","rgb(3, 169, 244)");	// 变蓝色 
	                // 变蓝时push进数组 【添加操作】
	                $scope.weekSectionData.push($scope.weekSectionTempData);
	                $scope.weekSectionCount = $scope.weekSectionData.length;			// 节次数+1
	                angular.element('#weekSectionTable').bootstrapTable('refresh');		// 每次操作 刷新星期节次的表格
	            }
	            // 当没星期节次时，隐藏scrollView
	            if($scope.weekSectionCount > 0){
	            	$scope.scrollViewIsExistence = true;
	            }if($scope.weekSectionCount == 0){
	            	$scope.scrollViewIsExistence = false;
	            }
            }
        };
        
        /**
         * 最后提交所有信息
         */
        $scope.ensureRoomAndTime = function (form) {
        	// 定义蓝色方格的数量，初始化为0
        	var blueSquareCount = 0;
			// 初始化最终需要传递的数组对象 把最后的结构push到该数组中
			var arrangeTeachingTaskFinalResult = [];
			// 循环所有的方格的sectionId 然后对所有颜色进行匹配，如果有蓝色，改为白色 
			for(var i=1; i<=7; i++){
				for(var j=0; j<=allSectionId.length; j++){
					var tempSectionId = i + "_"+ allSectionId[j]+"_section"+allSection[j];
					tempSectionId = angular.element('#' + tempSectionId);
					var color = tempSectionId.css('background-color');
					// 如果有蓝色
					if(color == "rgb(3, 169, 244)"){
						blueSquareCount++;
					}
				}
			}
        	// 判断并检查是否把该操作的操作好   除了地点roomId，因为可能是实习期间，不需要地点或者还不确定地点
        	if($scope.searchSubmitIsClick == false 
	        		|| $scope.arrangeTeachingTask.startWeek == null 
	        		|| $scope.arrangeTeachingTask.endWeek == null
        			|| $scope.arrangeTeachingTask.teacherId == null
//      			|| $scope.room.roomId == null
        	){
            	alertService('请先通过"查询"筛选掉不可排的星期节次，再选星期节次！');
            }else if(blueSquareCount == 0){
            	alertService('请选择星期节次！');
			}else{
				// 处理前验证input输入框
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				}
				// 执行获取所有信息的方法
				getArrangeTeachingTaskFinalResult(arrangeTeachingTaskFinalResult);
				// 添加操作
				if(arrangeTeachingTaskFinalResult.length !== 0 && arrangeTeachingTaskFinalResult !== 'undefined'){
                   // for(var i=0;i<arrangeTeachingTaskFinalResult.length;i++){
                        var startWeek = arrangeTeachingTaskFinalResult[0].startWeek;
                        var endWeek = arrangeTeachingTaskFinalResult[0].endWeek;
                        var dayNum = 0;
                        //全部"" 单周"1" 双周"2"
                        if(arrangeTeachingTaskFinalResult[0].oddEvenWeek==""){
                            dayNum = arrangeTeachingTaskFinalResult[0].endWeek-arrangeTeachingTaskFinalResult[0].startWeek;
                        }
                        if(arrangeTeachingTaskFinalResult[0].oddEvenWeek=="1"){
                            if(startWeek%2==1){
                                dayNum+=1;
                            }
                            if(endWeek%2==1){
                                dayNum+=1;
                            }
                            dayNum=(dayNum+(endWeek-startWeek))/2;
                        }
                        if(arrangeTeachingTaskFinalResult[0].oddEvenWeek=="2"){
                            if(startWeek%2==0){
                                dayNum+=1;
                            }
                            if(endWeek%2==0){
                                dayNum+=1;
                            }
                            dayNum=(dayNum+(endWeek-startWeek))/2;
                        }
                        //dayNum = (arrangeTeachingTaskFinalResult.endWeek-arrangeTeachingTaskFinalResult.startWeek);
                        var newCredit = arrangeTeachingTaskFinalResult[0].weekDaySectionId.split(',').length*dayNum;
                        if(newCredit>$scope.notArrangeNum){
                            alertService('安排失败，安排学时超过最大学时！');
                            return;
                        }
                   // }

                    $rootScope.showLoading = true; // 开启加载提示
                    arrange_arrangeSetService.add(arrangeTeachingTaskFinalResult, function(error, message){
                        $rootScope.showLoading = false; // 关闭加载提示
						if(error) {
							alertService(message);
							return;
						}
						// 不需要刷新任何页面，仅仅添加到总表
            			angular.element('#semesterArrangeSituatiomTable').bootstrapTable('refresh');		// 每次查询 刷新星期节次的表格
						alertService('success', '安排成功');
					});
				}else{
					alertService('安排失败，请选择节次！');
	        	}
			}
		};
		
		// 把获取最终的结果的方法抽取出来
		var getArrangeTeachingTaskFinalResult = function(arrangeTeachingTaskFinalResult){
			var weekDaySectionId = "";		// 单个字符串，不断添加到最终字符串
			var finalWeekDaySectionId = "";	// 最终把结果拼接成一段字符串
			// 初始化传给后台的对象
			var arrangeTeachingTask = {};
			// 数组作用： 存储数据并凑成长以“,”为分割的字符串
			var mondaySectionArray = [];	// 周一数组
			var tuesdaySectionArray = [];	// 周二数组
			var wednesdaySectionArray = [];	// 周三数组
			var thursdaySectionArray = [];	// 周四数组
			var fridaySectionArray = [];	// 周五数组
			var saturdaySectionArray = [];	// 周六数组
			var sundaySectionArray = [];	// 周日数组
			$("button[name='timeSelect']").each(function(j,item){
				// 以蓝色作为标识，识别被选中的参数
				if(item.style.backgroundColor == "rgb(3, 169, 244)") {
					var weekDay = item.id.substring(item.id.indexOf("_")-1,item.id.indexOf("_"));// 获取周几
					var section = item.id.substring(item.id.indexOf("_")+1);	// 获取小节的id
					// 根据不同星期添加对应星期的节次,并将数组转换成字符串
					if(weekDay == 1){
						mondaySectionArray.push(section);
					}if(weekDay == 2){
						tuesdaySectionArray.push(section);
					}if(weekDay == 3){
						wednesdaySectionArray.push(section);
					}if(weekDay == 4){
						thursdaySectionArray.push(section);
					}if(weekDay == 5){
						fridaySectionArray.push(section);
					}if(weekDay == 6){
						saturdaySectionArray.push(section);
					}if(weekDay == 7){
						sundaySectionArray.push(section);
					}
				}
			});
			// 判断数组是否为空  通过局部的数组push结果  然后通过“,”分开数组里面的内容  最后通过添加到全局的一个字符串  用“&”连接起来
			if(mondaySectionArray.length !== 0 && mondaySectionArray !== 'undefined'){
				var weekSectionArrayTemp = [];
				for(var i=0; i < mondaySectionArray.length; i++){
					weekSectionArrayTemp.push("1-" + mondaySectionArray[i]);		// 拼接出来 获取到被选中的内容
				}
				weekDaySectionId = weekSectionArrayTemp.join(",");	// 通过“，”分割开并传到字符串中
				finalWeekDaySectionId += weekDaySectionId + "&";
			}
			if(tuesdaySectionArray.length !== 0 && tuesdaySectionArray !== 'undefined'){
				var weekSectionArrayTemp = [];
				for(var i=0; i < tuesdaySectionArray.length; i++){
					weekSectionArrayTemp.push("2-" + tuesdaySectionArray[i]);		// 拼接出来 获取到被选中的内容
				}
				weekDaySectionId = weekSectionArrayTemp.join(",");	// 通过“，”分割开并传到字符串中
				finalWeekDaySectionId += weekDaySectionId + "&";
			}
			if(wednesdaySectionArray.length !== 0 && wednesdaySectionArray !== 'undefined'){
				var weekSectionArrayTemp = [];
				for(var i=0; i < wednesdaySectionArray.length; i++){
					weekSectionArrayTemp.push("3-" + wednesdaySectionArray[i]);		// 拼接出来 获取到被选中的内容
				}
				weekDaySectionId = weekSectionArrayTemp.join(",");	// 通过“，”分割开并传到字符串中
				finalWeekDaySectionId += weekDaySectionId + "&";
			}
			if(thursdaySectionArray.length !== 0 && thursdaySectionArray !== 'undefined'){
				var weekSectionArrayTemp = [];
				for(var i=0; i < thursdaySectionArray.length; i++){
					weekSectionArrayTemp.push("4-" + thursdaySectionArray[i]);		// 拼接出来 获取到被选中的内容
				}
				weekDaySectionId = weekSectionArrayTemp.join(",");	// 通过“，”分割开并传到字符串中
				finalWeekDaySectionId += weekDaySectionId + "&";
			}
			if(fridaySectionArray.length !== 0 && fridaySectionArray !== 'undefined'){
				var weekSectionArrayTemp = [];
				for(var i=0; i < fridaySectionArray.length; i++){
					weekSectionArrayTemp.push("5-" + fridaySectionArray[i]);		// 拼接出来 获取到被选中的内容
				}
				weekDaySectionId = weekSectionArrayTemp.join(",");	// 通过“，”分割开并传到字符串中
				finalWeekDaySectionId += weekDaySectionId + "&";
			}
			if(saturdaySectionArray.length !== 0 && saturdaySectionArray !== 'undefined'){
				var weekSectionArrayTemp = [];
				for(var i=0; i < saturdaySectionArray.length; i++){
					weekSectionArrayTemp.push("6-" + saturdaySectionArray[i]);		// 拼接出来 获取到被选中的内容
				}
				weekDaySectionId = weekSectionArrayTemp.join(",");	// 通过“，”分割开并传到字符串中
				finalWeekDaySectionId += weekDaySectionId + "&";
			}
			if(sundaySectionArray.length !== 0 && sundaySectionArray !== 'undefined'){
				var weekSectionArrayTemp = [];
				for(var i=0; i < sundaySectionArray.length; i++){
					weekSectionArrayTemp.push("7-" + sundaySectionArray[i]);		// 拼接出来 获取到被选中的内容
				}
				weekDaySectionId = weekSectionArrayTemp.join(",");	// 通过“，”分割开并传到字符串中
				finalWeekDaySectionId += weekDaySectionId + "&";
			}
			// 删了字符串最后的字符&
			finalWeekDaySectionId = finalWeekDaySectionId.substring(0, finalWeekDaySectionId.length-1);
			// 凑齐json对象
			arrangeTeachingTask = {
				"way" : item.way,
				"value" : item.id,
				"semesterId" : item.semesterId,
				
				"startWeek" : $scope.arrangeTeachingTask.startWeek,
				"endWeek" : $scope.arrangeTeachingTask.endWeek,
				// 后端: 全部"2" 单周"1" 双周"0"
				// 前端: 全部"" 单周"1" 双周"2"
				"oddEvenWeek" : ($scope.arrangeTeachingTask.oddEvenWeek ? $scope.arrangeTeachingTask.oddEvenWeek : 2),
				"weekDaySectionId" : finalWeekDaySectionId,
				"teacherId" : $scope.arrangeTeachingTask.teacherId,
				"roomId" : ($scope.room.roomId ? $scope.room.roomId : null),
				
				"courseId" : item.courseId,
				"classId" : item.classId
			};
			// 最终结果存于json对象中
			arrangeTeachingTaskFinalResult.push(arrangeTeachingTask);
			return arrangeTeachingTaskFinalResult;
		};
				
		/* start 已安排时间地点 */
        $scope.weekSectionTable = {
        	// 虽然不需要作请求，但是必须给它一个空的骨架
            url: 'data_test/arrange/tableview_arrangeTeachingTaskWeekSection.json',
            method: 'get',
            toolbar: '#toolbar',  //工具按钮用哪个容器
            cache: false,	//是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            sortable: false, // 禁用排序
            striped: false, //是否显示行间隔色
            showColumns: false,	// 取消勾选
            showHeader: false,	// 隐藏标题
            sortName: 'classId', // 默认排序字段
            sortOrder: 'desc', // 默认排序方式
            idField : 'classId', // 指定主键列
            uniqueId: 'classId', // 每行唯一标识
            rowStyle: function (row, index) {
                return {
                    css: {
                        "border": "none"
                    }
                };
            },
            formatNoMatches: function(){		// 设置没有数据时候的内容
                return;
            },
            responseHandler:function(response){
                return $scope.weekSectionData;
            },
            clickToSelect: false,
            columns: [
                {field: "classId",visible: false},
                {field: "week",align: "center",valign: "middle",width:"50%"},
                {field: "section",align: "center",valign: "middle",width:"50%"}
            ]
        };
		/* end 已安排时间地点 */

		// 查询参数
        $scope.queryParamsForAlready = function (params) {
            var pageParam = {
                type : 'selectCompletedContent',
                way : item.way,
                value : item.id,
                semesterId : item.semesterId,
                pageSize : 300,   //页面大小
                pageNo : 1  //页码
            };
            return angular.extend(pageParam, $scope.arrangeTeachingTask);
        };
        
		/* start 已安排时间地点 */
        $scope.timeRoomAlreadyArrangeTable = {
            url: app.api.address + '/arrange/scheduleArrange',
            method: 'get',
            cache: false,
            height: 337,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            search: false,
            onLoadSuccess: function() {
                $compile(angular.element('#timeRoomAlreadyArrangeTable').contents())($scope);
            },
            clickToSelect: true,
            idField : "number", // 指定主键列
            uniqueId: "number", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParamsForAlready,//传递参数（*）
			formatLoadingMessage: function () {  
			    return "请稍等，正在加载中...";
			},  
            responseHandler: function(data) {
				// 若传回来的数据不为空
            	if(data.data.rows.length !== 0){
            		$scope.emptyDataIsExist = true;
                    return data.data;
            	}
            	// 若传回来的数据为空，则清空时显示“当前没数据可清空”
            	if(data.data.rows.length == 0){
            		$scope.emptyDataIsExist = false;
	                return data.data;
            	}
            },
            columns: [
				{field : 'number',title : '序号',align: "center",valign: "middle",width:"5%",
	                formatter : function(value, row, index) {  
	                    var page = angular.element('#timeRoomAlreadyArrangeTable').bootstrapTable("getPage");  
	                    return index + 1;  
	                }  
                },
                {field: "weekDay",title: "星期",align: "center",valign: "middle",width:"10%"},
                {field: "sectionName",title: "节次",align: "center",valign: "middle",width:"25%"},
                {field: "week",title: "周次",align: "center",valign: "middle",width:"10%"},
//              {field: "oddEvenWeek",title: "单双周",align: "center",valign: "middle",width:"10%"},
                {field: "teacherName",title: "任课教师",align: "center",valign: "middle",width:"10%"},
                {field: "roomNum",title: "地点",align: "center",valign: "middle",width:"20%",
                    formatter: function(value, row, index) {
                    	if(row.roomNum == null){
                        	return "";
                    	}else{
                    		return row.roomNum;
                    	}
                    }
                },
                {field: "cz",title: "操作",align: "center",valign: "middle",width:"10%",
                    formatter: function(value, row, index) {
			        	row.way = item.way;
						row.courseId = item.courseId;
						row.semesterId = item.semesterId;
			    		row.courseName = item.courseName;
			    		row.credit = item.credit;
			    		row.totalHour = item.totalHour;
                        var adjustBtn = "<button id='btn_tz' has-permission='scheduleManage:query' type='button' ng-click='adjustSet(" + JSON.stringify(row) + ")'"
                        		+ " class='btn btn-default btn-sm' style='padding: 0px 3px;'>调整地点</button>";
                        return adjustBtn;
                    }
                }
            ]
        };
		/* end 已安排时间地点 */

        // 调整地点按钮
        $scope.adjustSet = function(row) {
			// 初始化最终需要传递的数组对象 把最后的结构push到该数组中
			var arrangeTeachingTaskFinalResult = [];
			// 获取所有信息的方法
			getArrangeTeachingTaskFinalResult(arrangeTeachingTaskFinalResult);
			// 通过定义scope对象 得到rootScope的初始化 通过该初始化对象的data传参
            var scope = $rootScope.$new();
            var tempWeekDaySectionId = row.weekDay+"-"+row.sectionId;
            scope.data = {
            	id : row.id,
            	roomId : row.roomId,
            	openDeptId : item.openDeptId,
            	openDeptName : item.openDeptName,
	    		semesterId : row.semesterId,
	    		week : row.week,
				weekDaySectionId : tempWeekDaySectionId
            };
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/arrange/scheduleArrange/scheduleManage/arrangeTeachingTask/adjustSet.html',
                size: 'lg',
	            scope: scope,
                resolve: {
                    itemForRoom: function() {
                        return $scope.room;	// 从弹出的窗口中获取到该room对象
                    }
                },
                controller: arrange_adjustSetController
            });
        };
		
        /**
         * 选择上课地点
         */
        $scope.selectRoom = function () {
        	var blueSquareCount = 0;
			// 循环所有的方格的sectionId 然后对所有颜色进行匹配，如果有蓝色，改为白色
			for(var i=1; i<=7; i++){
				for(var j=0; j<=allSectionId.length; j++){
					var tempSectionId = i + "_"+ allSectionId[j]+"_section"+allSection[j];
					tempSectionId = angular.element('#' + tempSectionId);
					var color = tempSectionId.css('background-color');
					// 如果有蓝色
					if(color == "rgb(3, 169, 244)"){
						blueSquareCount++;
					}
				}
			}
        	if($scope.searchSubmitIsClick == false 
	        		|| $scope.arrangeTeachingTask.startWeek == null 
	        		|| $scope.arrangeTeachingTask.endWeek == null
        			|| $scope.arrangeTeachingTask.teacherId == null
//      			|| $scope.room.roomId == null
        	){
            	alertService('请先通过"查询"筛选掉不可排的星期节次，再选星期节次！');
            }else if(blueSquareCount == 0){
            	alertService('请选择星期节次！');
			}else{
				// 初始化最终需要传递的数组对象 把最后的结构push到该数组中
				var arrangeTeachingTaskFinalResult = [];
				// 获取所有信息的方法
				getArrangeTeachingTaskFinalResult(arrangeTeachingTaskFinalResult);
				// 通过定义scope对象 得到rootScope的初始化 通过该初始化对象的data传参
	            var scope = $rootScope.$new();
	            scope.data = {
					courseId : item.courseId,
					semesterId : item.semesterId,
					startWeek : $scope.arrangeTeachingTask.startWeek,
					endWeek : $scope.arrangeTeachingTask.endWeek,
					oddEvenWeek : ($scope.arrangeTeachingTask.oddEvenWeek ? $scope.arrangeTeachingTask.oddEvenWeek : 2),
					weekDaySectionId : arrangeTeachingTaskFinalResult[0].weekDaySectionId,
	            };
	            $uibModal.open({
	                animation: true,
	                backdrop: 'static',
	                templateUrl: 'tpl/arrange/scheduleArrange/scheduleManage/arrangeTeachingTask/chooseRoomSet.html',
	                size: 'lg',
	                scope: scope,
	                resolve: {
	                    itemForRoom : function() {
	                        return $scope.room;
	                    }
	                },
	                controller: arrange_chooseRoomController
	            });
            }
        };

		// 打开清空面板
		$scope.openEmpty = function(){
			var rows = angular.element('#timeRoomAlreadyArrangeTable').bootstrapTable('getSelections');
			var scope = $rootScope.$new();
            scope.data = {
				emptyDataIsExist : $scope.emptyDataIsExist
            };
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/arrange/scheduleArrange/scheduleManage/arrangeTeachingTask/empty.html',
				size: '',
	            scope: scope,
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openEmptyController
			});
		};
        
		// 清空控制器
		var openEmptyController = function ($scope, $uibModalInstance, items, arrange_arrangeSetService, alertService) {
			if($scope.data.emptyDataIsExist == true){
				$scope.message = "确定要清空所有吗？";
			}
			if($scope.data.emptyDataIsExist == false){
				$scope.message = "当前没数据可清空!";
			}
			$scope.ok = function () {
				var arrangeTeachingTaskIds = {
					semesterId : item.semesterId,
					way : item.way,
					value : item.id
				};
                $rootScope.showLoading = true; // 开启加载提示
				arrange_arrangeSetService.delete(arrangeTeachingTaskIds, function (error, message) {
                    $rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
            		angular.element('#semesterArrangeSituatiomTable').bootstrapTable('refresh');
					angular.element('#timeRoomAlreadyArrangeTable').bootstrapTable('refresh');
					alertService('success', '清空成功');
				});
				$uibModalInstance.close();
			};
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		openEmptyController.$inject = ['$scope', '$uibModalInstance', 'items', 'arrange_arrangeSetService', 'alertService'];

        /**
         * 查询提交表单
         */
		$scope.searchTimeRoomAlreadyArrange = function (form) {
			angular.element('#timeRoomAlreadyArrangeTable').bootstrapTable('refresh');
		};

        /**
         * 清空上课地点
         */
        $scope.clearRoom = function () {
        	$scope.room.roomName = "";
        	$scope.room.roomId = "";
        };
        
        /**
         * 关闭操作 
         */
        $scope.close = function() {
            $uibModalInstance.close();
        };
        
        /**
         * 关闭操作 
         */
        $scope.clickAlready = function() {
			angular.element('#timeRoomAlreadyArrangeTable').bootstrapTable('refresh');
        };
	};
	arrange_arrangeSetController.$inject = ['$compile', '$http', '$scope', '$rootScope', '$uibModal', '$uibModalInstance', 'item', 'arrange_arrangeSetService', 'formVerifyService', 'alertService', 'app'];
})(window);