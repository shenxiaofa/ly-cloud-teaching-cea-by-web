;(function(window, undefined) {
	'use strict';

	window.arrange_roomTimeSetController = function($timeout, $state, $stateParams, alertService, $compile, $scope, $uibModal, $rootScope, $window, arrange_roomTimeDemandSetService, app) {
		
		// 将传过来的json字符串转换为json格式数据
		var stateParams = JSON.parse($stateParams.params);
		
		$scope.roomTimeDemand = {};
		// 表格的高度
        $scope.table_height = $window.innerHeight - 152;
        $scope.deleteDataIsExist = true;	// 检测删除部分的数据是否存在
        
        // 传3个参数给后台，获取到场地时间要求以及显示学年学期
	    var roomIdTemp = stateParams.roomId;
	    var semesterIdTemp = stateParams.semesterId;
	    var semesterNameTemp = stateParams.semesterName;
	    
	    // 获取到当前的学年学期Id
	    var tempSemesterId = stateParams.semesterId;
	    
		// 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
            	type : 'selectByRoomIdAndSemesterId',
            	roomId: roomIdTemp,	// 传值 场地Id
            	semesterId: semesterIdTemp,	// 传值 学年学期Id
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber  //页码
            };
    		$scope.semesterName = semesterNameTemp;
            $rootScope.$log.debug(angular.extend(pageParam, $scope.roomTimeDemand));
            return angular.extend(pageParam, $scope.roomTimeDemand);
        };
	        
		$scope.roomTimeDemandSettingTable = {
			url: app.api.address + '/arrange/roomTimeDemand',
			method: 'get',
			cache: false,
			height: $scope.table_height,
        	toolbar: '#versionModelToolbar', //工具按钮用哪个容器
        	sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "number", // 指定主键列
            uniqueId: "number", // 每行唯一标识
        	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
//				showColumns: true,
//				showRefresh: true,
			onLoadSuccess: function() {
				$compile(angular.element('#roomTimeDemandSettingTable').contents())($scope);
			},
			responseHandler: function(data) {
				// 若传回来的数据不为空
            	if(data.data.rows.length !== 0){
            		$scope.deleteDataIsExist = true;
            	}
            	// 若传回来的数据为空，则清空时显示“当前没数据可清空”
            	if(data.data.rows.length == 0){
            		$scope.deleteDataIsExist = false;
            	}
                return {
                    "total": data.data.total,//总页数
                    "rows": data.data.rows   //数据
                };
        	},
			clickToSelect: true,
			columns: [{checkbox: true,width: "3%"},
				{  
                    field : 'number',title : '序号',align:"center",valign:"middle",width:"5%",
                    formatter : function(value, row, index) {  
                        var page = angular.element('#roomTimeDemandSettingTable').bootstrapTable("getPage");  
                        return page.pageSize * (page.pageNumber - 1) + index + 1;  
                    }  
                },
				{field: "arrangeSign",title: "是否可排",align: "center",valign: "middle",width: "10%",
					formatter: function(value, row, index) {
						var arrangeSignResult = "";
						var arrangeSign = row.arrangeSign;
						// 判断周几并转换成字符串输出来
						if(arrangeSign == 1) {
							arrangeSignResult = "是";
						}if(arrangeSign == 2) {
							arrangeSignResult = "否";
						}
						return arrangeSignResult;
					}
				},
				{field: "startWeek",title: "周次",align: "center",valign: "middle",width:"25%",
					formatter: function(value, row, index) {
						var oddEvenWeek = "";
						if(row.oddEvenWeek == 1){
							oddEvenWeek = "";
						}if(row.oddEvenWeek == 2){
							oddEvenWeek = "单周";
						}if(row.oddEvenWeek == 3){
							oddEvenWeek = "双周";
						}
						return value+" - "+row.endWeek+"  "+oddEvenWeek;
					}
				},
				{field: "sectionName",title: "星期节次",align: "center",valign: "middle",width:"57%",
					formatter: function(value, row, index) {
						var weekName = "";
						var weekDay = row.weekDay;
						// 判断周几并转换成字符串输出来
						if(weekDay == 1) {
							weekName = "周一";
						}if(weekDay == 2) {
							weekName = "周二";
						}if(weekDay == 3) {
							weekName = "周三";
						}if(weekDay == 4) {
							weekName = "周四";
						}if(weekDay == 5) {
							weekName = "周五";
						}if(weekDay == 6) {
							weekName = "周六";
						}if(weekDay == 7) {
							weekName = "周日";
						}
						return weekName+"（"+value+"）";
					}
				}
			]
		};
	
		// 打开新增面板
		$scope.add = function() {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/arrange/demandSetting/roomTimeDemand/add.html',
				size: 'lg',
				resolve: {
					item: function() {
//						return row;
					}
				},
				controller: addInfoController
			});
		};
		
		// 要求设置中新增控制器
		var addInfoController = function($rootScope, $compile, $scope, $uibModalInstance, item, arrange_roomTimeDemandService, formVerifyService, alertService) {
			
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};
			
			// 按钮变色处理 通过获取颜色改变颜色
			$scope.changeButtonCss = function(tempId){
				tempId = angular.element('#' + tempId);
				if(tempId.css('background-color') == "rgb(3, 169, 244)") {
					$(tempId).css("background","rgb(255, 255, 255)");
				} else{
					$(tempId).css("background","rgb(3, 169, 244)");
				}
			};
			
			// 查询参数
	        $scope.queryParams = function queryParams(params) {
	            var pageParam = {
	            	type : 'selectSection',
	            	semesterId : tempSemesterId,
	                pageSize : params.pageSize,   //页面大小
	                pageNo : params.pageNumber  //页码
	            };
	            return angular.extend(pageParam, $scope.roomTimeDemand);
	        };
	        
			$scope.roomTimeDemandAddTable = {
				url: app.api.address + '/arrange/teacherTimeDemand',
				method: 'get',
				cache: false,
				height: 0,
				sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
				striped: true,
//					pagination: true,
				pageSize: 10,
				pageNumber: 1,
				pageList: [5, 10, 20, 50],
				search: false,
	            idField : "section", // 指定主键列
	            uniqueId: "section", // 每行唯一标识
            	queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
				queryParams: $scope.queryParams,//传递参数（*）
//					showColumns: true,
//					showRefresh: true,
				onLoadSuccess: function() {
					$compile(angular.element('#roomTimeDemandAddTable').contents())($scope);
				},
				clickToSelect: true,
				responseHandler: function(data) {
	                return {
	                    "total": data.data.total,//总页数
	                    "rows": data.data.rows   //数据
	                };
            	},
				columns: [{field: "section",title: "",align: "center",valign: "middle",width: "12.5%"},
					{field: "monday",title: "周一",align: "center",valign: "middle",width: "12.5%",
						formatter: function(value, row, index) {
                    		var tempId = "1_"+row.sectionId;
							return '<button type="button" name="timeSelect" class="btn_selectButton" '
								+ 'ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' ></button>';
						}
					},
					{field: "tuesday",title: "周二",align: "center",valign: "middle",width: "12.5%",
						formatter: function(value, row, index) {
                    		var tempId = "2_"+row.sectionId;
							return '<button type="button" name="timeSelect" class="btn_selectButton" '
								+ 'ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' ></button>';
						}
					},
					{field: "wednesday",title: "周三",align: "center",valign: "middle",width: "12.5%",
						formatter: function(value, row, index) {
                    		var tempId = "3_"+row.sectionId;
							return '<button type="button" name="timeSelect" class="btn_selectButton" '
								+ 'ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' ></button>';
						}
					},
					{field: "thursday",title: "周四",align: "center",valign: "middle",width: "12.5%",
						formatter: function(value, row, index) {
                    		var tempId = "4_"+row.sectionId;
							return '<button type="button" name="timeSelect" class="btn_selectButton" '
								+ 'ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' ></button>';
						}
					},
					{field: "friday",title: "周五",align: "center",valign: "middle",width: "12.5%",
						formatter: function(value, row, index) {
                    		var tempId = "5_"+row.sectionId;
							return '<button type="button" name="timeSelect" class="btn_selectButton" '
								+ 'ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' ></button>';
						}
					},
					{field: "saturday",title: "周六",align: "center",valign: "middle",width: "12.5%",
						formatter: function(value, row, index) {
                    		var tempId = "6_"+row.sectionId;
							return '<button type="button" name="timeSelect" class="btn_selectButton" '
								+ 'ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' ></button>';
						}
					},
					{field: "sunday",title: "周日",align: "center",valign: "middle",width: "12.5%",
						formatter: function(value, row, index) {
                    		var tempId = "7_"+row.sectionId;
							return '<button type="button" name="timeSelect" class="btn_selectButton" '
								+ 'ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' ></button>';
						}
					}
				]
			};
			
	        // 确定提交表单 	注意用到了参数formVerifyService
			$scope.ok = function (form) {
				// 处理前验证
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					alertService("带 * 为必填字段，请您填写完再保存！");
					return;
				};
				
				// 测试并结算出来
				var weekDay = 0;	// 定义星期几
				var weekDayArray = [];	// 存储星期的数组
				
				// 数组作用： 存储数据并凑成长以“,”为分割的字符串
				var mondaySectionArray = [];	// 周一数组
				var mondaySection = "";			// 周一
				var tuesdaySectionArray = [];	// 周二数组
				var tuesdaySection = "";		// 周二
				var wednesdaySectionArray = [];	// 周三数组
				var wednesdaySection = "";		// 周三
				var thursdaySectionArray = [];	// 周四数组
				var thursdaySection = "";		// 周四
				var fridaySectionArray = [];	// 周五数组
				var fridaySection = "";			// 周五
				var saturdaySectionArray = [];	// 周六数组
				var saturdaySection = "";		// 周六
				var sundaySectionArray = [];	// 周日数组
				var sundaySection = "";			// 周日
				
				var section = "";	// 定义节次，以“,”隔开
				var sectionArray = [];	// 存储节次的数组
				$("button[name='timeSelect']").each(function(j,item){
					if(item.style.backgroundColor == "rgb(3, 169, 244)") {
						weekDay = item.id.substring(item.id.indexOf("_")-1,item.id.indexOf("_"));
						section = item.id.substring(item.id.indexOf("_")+1);
						
						// 根据不同星期添加对应星期的节次,并将数组转换成字符串
						if(weekDay == 1){
							mondaySectionArray.push(section);
							mondaySection = mondaySectionArray.join(",");
						}if(weekDay == 2){
							tuesdaySectionArray.push(section);
							tuesdaySection = tuesdaySectionArray.join(",");
						}if(weekDay == 3){
							wednesdaySectionArray.push(section);
							wednesdaySection = wednesdaySectionArray.join(",");
						}if(weekDay == 4){
							thursdaySectionArray.push(section);
							thursdaySection = thursdaySectionArray.join(",");
						}if(weekDay == 5){
							fridaySectionArray.push(section);
							fridaySection = fridaySectionArray.join(",");
						}if(weekDay == 6){
							saturdaySectionArray.push(section);
							saturdaySection = saturdaySectionArray.join(",");
						}if(weekDay == 7){
							sundaySectionArray.push(section);
							sundaySection = sundaySectionArray.join(",");
						}
						
						weekDayArray.push(weekDay);
						sectionArray.push(section);
					}
				});
				
				// 星期去重
				weekDayArray.sort();	// 星期数组排序
				var weekDayArrayOnly = [weekDayArray[0]];	// 定义去重数组
				for(var i = 0; i < weekDayArray.length; i++){
					if(weekDayArray[i] !== weekDayArrayOnly[weekDayArrayOnly.length - 1]){
						weekDayArrayOnly.push(weekDayArray[i]);
					}
				}
				
				var roomTimeDemandFinalResult = [];	// 最终提交结果
				// 初始化没有的数据 5条必须的
				var roomTimeDemand = {};
				
				// 一遍判断一边push(拉)进来
				if(mondaySection != ""){
					roomTimeDemand = {
						"id" : "1",
						"semesterId" : semesterIdTemp,
						"roomId" : roomIdTemp,
						"arrangeSign" : $scope.roomTimeDemand.arrangeSign,
						"startWeek" : parseInt($scope.roomTimeDemand.startWeek),
						"endWeek" : parseInt($scope.roomTimeDemand.endWeek),
						"oddEvenWeek" : $scope.roomTimeDemand.oddEvenWeek,
						"weekDay" : 1,
						"section" : mondaySection
					};
					roomTimeDemandFinalResult.push(roomTimeDemand);
				}
				if(tuesdaySection != ""){
					roomTimeDemand = {
						"id" : "1",
						"semesterId" : semesterIdTemp,
						"roomId" : roomIdTemp,
						"arrangeSign" : $scope.roomTimeDemand.arrangeSign,
						"startWeek" : parseInt($scope.roomTimeDemand.startWeek),
						"endWeek" : parseInt($scope.roomTimeDemand.endWeek),
						"oddEvenWeek" : $scope.roomTimeDemand.oddEvenWeek,
						"weekDay" : 2,
						"section" : tuesdaySection
					};
					roomTimeDemandFinalResult.push(roomTimeDemand);
				}
				if(wednesdaySection != ""){
					roomTimeDemand = {
						"id" : "1",
						"semesterId" : semesterIdTemp,
						"roomId" : roomIdTemp,
						"arrangeSign" : $scope.roomTimeDemand.arrangeSign,
						"startWeek" : parseInt($scope.roomTimeDemand.startWeek),
						"endWeek" : parseInt($scope.roomTimeDemand.endWeek),
						"oddEvenWeek" : $scope.roomTimeDemand.oddEvenWeek,
						"weekDay" : 3,
						"section" : wednesdaySection
					};
					roomTimeDemandFinalResult.push(roomTimeDemand);
				}
				if(thursdaySection != ""){
					roomTimeDemand = {
						"id" : "1",
						"semesterId" : semesterIdTemp,
						"roomId" : roomIdTemp,
						"arrangeSign" : $scope.roomTimeDemand.arrangeSign,
						"startWeek" : parseInt($scope.roomTimeDemand.startWeek),
						"endWeek" : parseInt($scope.roomTimeDemand.endWeek),
						"oddEvenWeek" : $scope.roomTimeDemand.oddEvenWeek,
						"weekDay" : 4,
						"section" : thursdaySection
					};
					roomTimeDemandFinalResult.push(roomTimeDemand);
				}
				if(fridaySection != ""){
					roomTimeDemand = {
						"id" : "1",
						"semesterId" : semesterIdTemp,
						"roomId" : roomIdTemp,
						"arrangeSign" : $scope.roomTimeDemand.arrangeSign,
						"startWeek" : parseInt($scope.roomTimeDemand.startWeek),
						"endWeek" : parseInt($scope.roomTimeDemand.endWeek),
						"oddEvenWeek" : $scope.roomTimeDemand.oddEvenWeek,
						"weekDay" : 5,
						"section" : fridaySection
					};
					roomTimeDemandFinalResult.push(roomTimeDemand);
				}
				if(saturdaySection != ""){
					roomTimeDemand = {
						"id" : "1",
						"semesterId" : semesterIdTemp,
						"roomId" : roomIdTemp,
						"arrangeSign" : $scope.roomTimeDemand.arrangeSign,
						"startWeek" : parseInt($scope.roomTimeDemand.startWeek),
						"endWeek" : parseInt($scope.roomTimeDemand.endWeek),
						"oddEvenWeek" : $scope.roomTimeDemand.oddEvenWeek,
						"weekDay" : 6,
						"section" : saturdaySection
					};
					roomTimeDemandFinalResult.push(roomTimeDemand);
				}
				if(sundaySection != ""){
					roomTimeDemand = {
						"id" : "1",
						"semesterId" : semesterIdTemp,
						"roomId" : roomIdTemp,
						"arrangeSign" : $scope.roomTimeDemand.arrangeSign,
						"startWeek" : parseInt($scope.roomTimeDemand.startWeek),
						"endWeek" : parseInt($scope.roomTimeDemand.endWeek),
						"oddEvenWeek" : $scope.roomTimeDemand.oddEvenWeek,
						"weekDay" : 7,
						"section" : sundaySection
					};
					roomTimeDemandFinalResult.push(roomTimeDemand);
				}
				
				// 由于不需要传1条1条，所以这里还是以json传对象的方式传过去
				var roomTimeDemandFinalResultString = JSON.stringify(roomTimeDemandFinalResult);
				roomTimeDemandFinalResultString = roomTimeDemandFinalResultString.replace(/\[|]/g,'');
				
				if(roomTimeDemandFinalResult.length !== 0 && roomTimeDemandFinalResult !== 'undefined'){
					$rootScope.showLoading = true; // 开启加载提示
					arrange_roomTimeDemandSetService.add(roomTimeDemandFinalResult, function(error, message){
						$rootScope.showLoading = false; // 关闭加载提示
						if(error) {
							alertService(message);
							return;
						}
						$uibModalInstance.close();
						angular.element('#roomTimeDemandTable').bootstrapTable('selectPage', 1);
						angular.element('#roomTimeDemandSettingTable').bootstrapTable('refresh');
						alertService('success', '新增成功');
					});
				}else{
					alertService('新增失败，请选择节次！');
				}
			};
		}
		addInfoController.$inject = ['$rootScope', '$compile', '$scope', '$uibModalInstance', 'item', 'arrange_roomTimeDemandService', 'formVerifyService', 'alertService'];
		
		// 打开删除面板
		$scope.openDelete = function(){
				var rows = angular.element('#roomTimeDemandSettingTable').bootstrapTable('getSelections');
				if(rows.length == 0){
					if($scope.deleteDataIsExist == true){
						alertService('请先选择要删除的项!');
					}
					if($scope.deleteDataIsExist == false){
						alertService('当前没数据可删除!');
					}
					return;
				}
				$uibModal.open({
					animation: true,
					backdrop: 'static',
					templateUrl: 'tpl/arrange/demandSetting/roomTimeDemand/delete.html',
					size: '',
					resolve: {
						items: function () {
							return rows;
						},
					},
					controller: openDeleteController
				});
			};
			
		// 删除控制器
		var openDeleteController = function ($rootScope, $scope, $uibModalInstance, items, arrange_roomTimeDemandService, alertService) {
			$scope.message = "确定要删除吗？";
			$scope.ok = function () {
				var roomTimeDemandIds = "";
				var roomTimeDemandIdsArray = []; // 代码类型号数组
				items.forEach (function(roomTimeDemand) {
					roomTimeDemandIdsArray.push(roomTimeDemand.id);	// 删除对应的场地时间要求Id
				});
				roomTimeDemandIds = JSON.stringify(roomTimeDemandIdsArray);
				roomTimeDemandIds = roomTimeDemandIds.replace(/\[|]/g,'').replace(/\"/g,"");	// json去除[],去除""
				$rootScope.showLoading = true; // 开启加载提示
				arrange_roomTimeDemandSetService.delete(roomTimeDemandIds, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#roomTimeDemandTable').bootstrapTable('selectPage', 1);
					angular.element('#roomTimeDemandSettingTable').bootstrapTable('selectPage', 1);
					alertService('success', '删除成功');
				});
				$uibModalInstance.close();
			};
			$scope.close = function () {
				$uibModalInstance.close();
			};
		};
		openDeleteController.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'items', 'arrange_roomTimeDemandService', 'alertService'];
		
	};
    arrange_roomTimeSetController.$inject = ['$timeout', '$state', '$stateParams', 'alertService', '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'arrange_roomTimeDemandSetService', 'app'];

})(window);