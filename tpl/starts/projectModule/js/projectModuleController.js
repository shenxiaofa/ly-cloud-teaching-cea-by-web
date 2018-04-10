;(function (window, undefined) {
	'use strict';

	window.starts_projectModuleController = function ($compile, $scope, $uibModal, $rootScope, $window, starts_projectModuleService, alertService, app, $state) {
		// 表格的高度
		$scope.table_height = $window.innerHeight - 178;

		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var attributeNamesForOrderBy = {};
			attributeNamesForOrderBy[params.sortName] = params.sortOrder;
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				sortName: params.sortName,
				attributeNamesForOrderBy: attributeNamesForOrderBy,
				sortOrder: params.sortOrder
			};
			return angular.extend(pageParam, $scope.projectModule);
		}
		$scope.projectModuleTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#projectModuleTable').contents())($scope);
			},
			// url: 'data_test/starts/tableview_projectModule.json',
			url: app.api.address + '/virtual-class/projectPlate',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'createTime', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				$scope.itemArray = response.data;
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"id", title:"主键", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"semesterName",title:"学年学期",align:"center",valign:"middle"},
				{field:"num",title:"板块号",align:"center",valign:"middle"},
				{field:"name",title:"板块名称",align:"center",valign:"middle"},
				{field:"plateTime",title:"板块时间",align:"center",valign:"middle"},
				{field:"createTime",title:"创建时间",align:"center",valign:"middle",visible:false,sortable:true},
				{field:"enableSignName",title:"是否启用",align:"center",valign:"middle"},
				{field:"remark",title:"备注",align:"center",valign:"middle"},
				{field:"",title:"操作",align:"center",valign:"middle",formatter: function (value, row, index) {
					var openModify = "<button has-permission='projectModule:update' type='button' ng-click='openModify(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
					return openModify;
				}
				}
			]
		};


		// 查询表单显示和隐藏切换
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function () {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if ($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 75;
			} else {
				$scope.table_height = $scope.table_height - 75;
			}
			angular.element('#projectModuleTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		}
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#projectModuleTable').bootstrapTable('selectPage', 1);
			// angular.element('#projectModuleTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.projectModule = {};
			angular.element('#projectModuleTable').bootstrapTable('refresh');
		}
		// 打开新增面板
		$scope.openAdd = function(){
			// $uibModal.open({
			// 	animation: true,
			// 	backdrop: 'static',
			// 	templateUrl: 'tpl/starts/projectModule/add.html',
			// 	size: 'lg',
			// 	controller: openAddController
			// });
			$state.go("home.common.projectModuleAdd");
		};
		//打开修改面板
		$scope.openModify = function(data){
			// $uibModal.open({
			// 	animation: true,
			// 	backdrop: 'static',
			// 	templateUrl: 'tpl/starts/projectModule/add.html',
			// 	size: 'lg',
			// 	resolve: {
			// 		item: function () {
			// 			return data;
			// 		}
			// 	},
			// 	controller: openModifyController
			// });
			var params = angular.toJson(data);
			$state.go("home.common.projectModuleModify",{
				"params" : params
			});
		};
		//打开删除面板
		$scope.openDelete = function(){
			var rows = angular.element('#projectModuleTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteController
			});
		};
	};
	starts_projectModuleController.$inject = ['$compile', '$scope', '$uibModal', '$rootScope', '$window', 'starts_projectModuleService', 'alertService', 'app', '$state'];

	// 添加控制器
	var openAddController = function ($compile,app,$scope, $uibModalInstance, $uibModal, starts_projectModuleService, formVerifyService, alertService) {
		$scope.projectModule = {
			enableSign : '1'
		};

		//学年学期下拉框
		$scope.semesterObjs = [];
		$scope.timeSetting = {};
		starts_projectModuleService.get(function (data) {
			$scope.semesterObjs = data.data;
			var html = '' +
				'<select  ui-select2 ng-options="semesterObj.id as semesterObj.acadYearSemester  for semesterObj in semesterObjs" ui-chosen="classManageSearchForm.gradeId" ng-required="true" '
				+  ' ng-required="true" ng-model="projectModule.semesterId" id="semesterId_select" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#semesterId_select").parent().empty().append(html);
			$compile(angular.element("#semesterId_select").parent().contents())($scope);
		});

		$scope.time = [];
		$scope.plateTimeTable = {
			// url: 'data_test/starts/tableview_projectModule.json',
			url: app.api.address + '/virtual-class/projectPlateTime',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			// pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			// paginationPreText: '上一页',
			// paginationNextText: '下一页',
			sortName: 'createTime', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			// queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			// data:$scope.time,
			responseHandler:function(response){
				$scope.time.forEach (function(plateTime) {
					response.data.rows.push(plateTime);
				});
				response.data.total = $scope.time.length;
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"id", title:"主键", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
				{field:"weekDay",title:"星期",align:"center",valign:"middle"},
				{field:"sectionName",title:"节次",align:"center",valign:"middle"}
			]
		};



		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/addTime.html',
				size: 'lg',
				controller: addInfoController,
				resolve: {
					item: function () {
						return $scope.time;
					},
				},
			});
		};

		//打开删除页面
		$scope.openDelete = function(){
			var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/deleteTime.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteTimeController
			});
		};

		$scope.ok = function (form) {
			var row = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			$scope.projectModule.timeList = $scope.time;
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectModuleService.add($scope.projectModule, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#projectModuleTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openAddController.$inject = ['$compile','app','$scope', '$uibModalInstance', '$uibModal', 'starts_projectModuleService', 'formVerifyService', 'alertService'];

	//添加时间控制器
	// 要求设置中新增控制器
	var addInfoController = function(app,$compile, $scope, $uibModal, $uibModalInstance, item, starts_projectModuleService, formVerifyService, alertService) {

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
				pageSize : params.pageSize,   //页面大小
				pageNo : params.pageNumber  //页码
			};
			return angular.extend(pageParam, $scope.teacherTimeDemand);
		};

		$scope.teacherTimeDemandAddTable = {
			url: app.api.address + '/virtual-class/teacherTimeDemand',
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
			responseHandler: function(data) {
				return {
					// "total": data.data.total,//总页数
					"rows": data.data   //数据
				};
			},
			onLoadSuccess: function() {
				$compile(angular.element('#teacherTimeDemandAddTable').contents())($scope);
			},
			clickToSelect: true,
			columns: [{field: "section",title: "小节次",align: "center",valign: "middle",width: "12.5%"},
				{field: "monday",title: "周一",align: "center",valign: "middle",width: "12.5%",
					formatter: function(value, row, index) {
						var tempId = "1_"+row.id;
						var name = row.section;
						return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
					}
				},
				{field: "tuesday",title: "周二",align: "center",valign: "middle",width: "12.5%",
					formatter: function(value, row, index) {
						var tempId = "2_"+row.id;
						var name = row.section;
						return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
					}
				},
				{field: "wednesday",title: "周三",align: "center",valign: "middle",width: "12.5%",
					formatter: function(value, row, index) {
						var tempId = "3_"+row.id;
						var name = row.section;
						return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
					}
				},
				{field: "thursday",title: "周四",align: "center",valign: "middle",width: "12.5%",
					formatter: function(value, row, index) {
						var tempId = "4_"+row.id;
						var name = row.section;
						return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
					}
				},
				{field: "friday",title: "周五",align: "center",valign: "middle",width: "12.5%",
					formatter: function(value, row, index) {
						var tempId = "5_"+row.id;
						var name = row.section;
						return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
					}
				},
				{field: "saturday",title: "周六",align: "center",valign: "middle",width: "12.5%",
					formatter: function(value, row, index) {
						var tempId = "6_"+row.id;
						var name = row.section;
						return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
					}
				},
				{field: "sunday",title: "周日",align: "center",valign: "middle",width: "12.5%",
					formatter: function(value, row, index) {
						var tempId = "7_"+row.id;
						var name = row.section;
						return '<button type="button" name="timeSelect" class="btn_selectButton" ng-click=\'changeButtonCss('+ angular.toJson(tempId) +')\' id='+tempId+' value='+name+'></button>';
					}
				}
			]
		};

		// 确定提交表单 新增教师时间要求信息
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			// 测试并结算出来
			var weekDay = 0;	// 定义星期几
			var weekDayArray = [];	// 存储星期的数组

			var mondaySectionArray = [];	// 周一
			var mondaySection = "";			// 周一
			var mondaySectionNameArray = [];// 周一
			var mondaySectionName = "";

			var tuesdaySectionArray = [];	// 周二
			var tuesdaySection = "";		// 周二
			var tuesdaySectionNameArray = [];// 周一
			var tuesdaySectionName = "";

			var wednesdaySectionArray = [];	// 周三
			var wednesdaySection = "";		// 周三
			var wednesdaySectionNameArray = [];	// 周三
			var wednesdaySectionName = "";

			var thursdaySectionArray = [];	// 周四
			var thursdaySection = "";		// 周四
			var thursdaySectionNameArray = [];	// 周四
			var thursdaySectionName = "";

			var fridaySectionArray = [];	// 周五
			var fridaySection = "";			// 周五
			var fridaySectionNameArray = [];	// 周五
			var fridaySectionName = "";

			var saturdaySectionArray = [];	// 周六
			var saturdaySection = "";		// 周六
			var saturdaySectionNameArray = [];	// 周六
			var saturdaySectionName = "";

			var sundaySectionArray = [];	// 周日
			var sundaySection = "";			// 周日
			var sundaySectionNameArray = [];	// 周日
			var sundaySectionName = "";

			var sectionId = "";	// 定义节次，以“,”隔开
			var sectionName = "";
			var sectionArray = [];	// 存储节次的数组
			var sectionNameArray = [];
			$("button[name='timeSelect']").each(function(j,item){
				if(item.style.backgroundColor == "rgb(3, 169, 244)") {
					weekDay = item.id.substring(item.id.indexOf("_")-1,item.id.indexOf("_"));
					sectionId = item.id.substring(item.id.indexOf("_")+1);
					sectionName = item.value;
					console.log(sectionName);
					// 根据不同星期添加对应星期的节次,并将数组转换成字符串
					if(weekDay == 1){
						mondaySectionArray.push(sectionId);
						mondaySectionNameArray.push(sectionName);
						mondaySection = mondaySectionArray.join(",");
						mondaySectionName = mondaySectionNameArray.join(",");
					}if(weekDay == 2){
						tuesdaySectionArray.push(sectionId);
						tuesdaySectionNameArray.push(sectionName);
						tuesdaySection = tuesdaySectionArray.join(",");
						tuesdaySectionName = tuesdaySectionNameArray.join(",");
					}if(weekDay == 3){
						wednesdaySectionArray.push(sectionId);
						wednesdaySectionNameArray.push(sectionName);
						wednesdaySection = wednesdaySectionArray.join(",");
						wednesdaySectionName = wednesdaySectionNameArray.join(",");
					}if(weekDay == 4){
						thursdaySectionArray.push(sectionId);
						thursdaySectionNameArray.push(sectionName);
						thursdaySection = thursdaySectionArray.join(",");
						thursdaySectionName = thursdaySectionNameArray.join(",");
					}if(weekDay == 5){
						fridaySectionArray.push(sectionId);
						fridaySectionNameArray.push(sectionName);
						fridaySection = fridaySectionArray.join(",");
						fridaySectionName = fridaySectionNameArray.join(",");
					}if(weekDay == 6){
						saturdaySectionArray.push(sectionId);
						saturdaySectionNameArray.push(sectionName);
						saturdaySection = saturdaySectionArray.join(",");
						saturdaySectionName = saturdaySectionNameArray.join(",");
					}if(weekDay == 7){
						sundaySectionArray.push(sectionId);
						sundaySectionNameArray.push(sectionName);
						sundaySection = sundaySectionArray.join(",");
						sundaySectionName = sundaySectionNameArray.join(",");
					}

					weekDayArray.push(weekDay);
					sectionArray.push(sectionId);
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

			var teacherTimeDemandFinalResult = [];	// 最终提交结果
			// 初始化没有的数据 5条必须的
			var teacherTimeDemand = {};

			// 一遍判断一边push(拉)进来
			if(mondaySection != ""){
				teacherTimeDemand = {
					"id" : "1",
					"startWeek" : $scope.time.startWeek,
					"endWeek" : $scope.time.endWeek,
					"startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
					"oddEvenSign" : $scope.time.oddEvenWeek,
					"weekDay" : "1",
					"sectionName" : mondaySectionName,
					"section" : mondaySection
				};
				teacherTimeDemandFinalResult.push(teacherTimeDemand);
			}
			if(tuesdaySection != ""){
				teacherTimeDemand = {
					"id" : "1",
					"startWeek" : $scope.time.startWeek,
					"endWeek" : $scope.time.endWeek,
					"startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
					"oddEvenSign" : $scope.time.oddEvenWeek,
					"weekDay" : "2",
					"sectionName" : tuesdaySectionName,
					"section" : tuesdaySection
				};
				teacherTimeDemandFinalResult.push(teacherTimeDemand);
			}
			if(wednesdaySection != ""){
				teacherTimeDemand = {
					"id" : "1",
					"startWeek" : $scope.time.startWeek,
					"endWeek" : $scope.time.endWeek,
					"startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
					"oddEvenSign" : $scope.time.oddEvenWeek,
					"weekDay" : "3",
					"sectionName" : wednesdaySectionName,
					"section" : wednesdaySection
				};
				teacherTimeDemandFinalResult.push(teacherTimeDemand);
			}
			if(thursdaySection != ""){
				teacherTimeDemand = {
					"id" : "1",
					"startWeek" : $scope.time.startWeek,
					"endWeek" : $scope.time.endWeek,
					"startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
					"oddEvenSign" : $scope.time.oddEvenWeek,
					"weekDay" : "4",
					"sectionName" : thursdaySectionName,
					"section" : thursdaySection
				};
				teacherTimeDemandFinalResult.push(teacherTimeDemand);
			}
			if(fridaySection != ""){
				teacherTimeDemand = {
					"id" : "1",
					"startWeek" : $scope.time.startWeek,
					"endWeek" : $scope.time.endWeek,
					"startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
					"oddEvenSign" : $scope.time.oddEvenWeek,
					"weekDay" : "5",
					"sectionName" : fridaySectionName,
					"section" : fridaySection
				};
				teacherTimeDemandFinalResult.push(teacherTimeDemand);
			}
			if(saturdaySection != ""){
				teacherTimeDemand = {
					"id" : "1",
					"startWeek" : $scope.time.startWeek,
					"endWeek" : $scope.time.endWeek,
					"startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
					"oddEvenSign" : $scope.time.oddEvenWeek,
					"weekDay" : "6",
					"sectionName" : saturdaySectionName,
					"section" : saturdaySection
				};
				teacherTimeDemandFinalResult.push(teacherTimeDemand);
			}
			if(sundaySection != ""){
				teacherTimeDemand = {
					"id" : "1",
					"startWeek" : $scope.time.startWeek,
					"endWeek" : $scope.time.endWeek,
					"startEndWeek":$scope.time.startWeek + "-" + $scope.time.endWeek,
					"oddEvenSign" : $scope.time.oddEvenWeek,
					"weekDay" : "7",
					"sectionName" : sundaySectionName,
					"section" : sundaySection
				};
				teacherTimeDemandFinalResult.push(teacherTimeDemand);
			}
			teacherTimeDemandFinalResult.forEach (function( teacherTimeDemand) {
				item.push( teacherTimeDemand);
			});
			console.log(item);
			if(item.length !== 0 && item !== 'undefined'){
				angular.element('#plateTimeTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			}
			$uibModalInstance.close();
		};
	}
	addInfoController.$inject = ['app','$compile', '$scope', '$uibModal', '$uibModalInstance', 'item', 'starts_projectModuleService', 'formVerifyService', 'alertService'];

	// 删除时间控制器
	var openDeleteTimeController = function ($scope, $uibModalInstance, items, starts_projectModuleService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; //
			items.forEach (function(time) {
				ids.push(time.id);
			});
			starts_projectModuleService.deleteTime(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#plateTimeTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteTimeController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_projectModuleService', 'alertService'];

	//修改控制器
	var openModifyController = function ($compile,$uibModal,app,$scope, $uibModalInstance, item, starts_projectModuleService, alertService, formVerifyService) {
		//学年学期下拉框
		$scope.semesterObjs = [];
		$scope.timeSetting = {};
		starts_projectModuleService.get(function (data) {
			$scope.semesterObjs = data.data;
			var html = '' +
				'<select  ui-select2 ng-options="semesterObj.id as semesterObj.acadYearSemester  for semesterObj in semesterObjs" ui-chosen="classManageSearchForm.gradeId" ng-required="true" '
				+  ' ng-required="true" ng-model="projectModule.semesterId" id="semesterId_select" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#semesterId_select").parent().empty().append(html);
			$compile(angular.element("#semesterId_select").parent().contents())($scope);
		});

		// item.startEndWeek = item.startWeek + "-" + item.endWeek;
		// $scope.time = [item];

		$scope.projectModule = item;
		$scope.time = [];
		var timeDemandFinalResult =[];
		starts_projectModuleService.getTime(item.id, function (data) {
			console.log(data);
			timeDemandFinalResult = data;
			timeDemandFinalResultFn();
		});
		var timeDemandFinalResultFn = function () {
			timeDemandFinalResult.forEach (function( teacherTimeDemand) {
				teacherTimeDemand.startEndWeek = teacherTimeDemand.startWeek+'-'+teacherTimeDemand.endWeek;
				// teacherTimeDemand.sectionName = teacherTimeDemand.sectionName;
				// teacherTimeDemand.section = teacherTimeDemand.section;
				$scope.time.push( teacherTimeDemand);
			});
			angular.element('#plateTimeTable').bootstrapTable('refresh');
		};
		$scope.plateTimeTable = {
			// url: 'data_test/starts/tableview_projectModule.json',
			url: app.api.address + '/virtual-class/projectPlateTime',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber:1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'createTime', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				$scope.time.forEach (function(plateTime) {
					response.data.rows.push(plateTime);
				});
				response.data.total = $scope.time.length;
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"plateTimeId", title:"主键", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
				{field:"weekDay",title:"星期",align:"center",valign:"middle"},
				{field:"sectionName",title:"节次",align:"center",valign:"middle"}
			]
		};



		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/addTime.html',
				size: 'lg',
				controller: addInfoController,
				resolve: {
					item: function () {
						return $scope.time;
					},
				},
			});
		};

		//打开删除页面
		$scope.openDelete = function(){
			var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/deleteTime.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteTimeController
			});
		};

		// 数据初始化
		$scope.projectModule = item;
		$scope.ok = function (form) {
			var row = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			$scope.projectModule.timeList = $scope.time;
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectModuleService.update($scope.projectModule, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#projectModuleTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openModifyController.$inject = ['$compile','$uibModal','app','$scope', '$uibModalInstance', 'item', 'starts_projectModuleService', 'alertService', 'formVerifyService'];

	// 删除控制器
	var openDeleteController = function ($scope, $uibModalInstance, items, starts_projectModuleService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(projectModule) {
				ids.push(projectModule.id);
			});
			starts_projectModuleService.delete(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#projectModuleTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_projectModuleService', 'alertService'];

	// 添加控制器
	window.starts_openAddController = function ($rootScope, $stateParams, $http, $compile, $scope, $uibModal, $window, starts_projectModuleService, formVerifyService, app, $state) {
		$scope.projectModule = {
			enableSign : '1'
		};
		// 表格的高度
		$scope.table_height = $window.innerHeight - 360;

		$scope.scollDivHeight = $window.innerHeight -100;

		//学年学期下拉框
		$scope.semesterObjs = [];
		$scope.timeSetting = {};
		starts_projectModuleService.get(function (data) {
			$scope.semesterObjs = data.data;
			var html = '' +
				'<select  ui-select2 ng-options="semesterObj.id as semesterObj.acadYearSemester  for semesterObj in semesterObjs" ui-chosen="classManageSearchForm.gradeId" ng-required="true" '
				+  ' ng-required="true" ng-model="projectModule.semesterId" id="semesterId_select" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#semesterId_select").parent().empty().append(html);
			$compile(angular.element("#semesterId_select").parent().contents())($scope);
		});

		$scope.time = [];
		$scope.plateTimeTable = {
			// url: 'data_test/starts/tableview_projectModule.json',
			url: app.api.address + '/virtual-class/projectPlateTime',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			// striped: true,
			// pagination: true,
			pageSize: 10,
			pageNumber:1,
			// pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			// paginationPreText: '上一页',
			// paginationNextText: '下一页',
			sortName: 'createTime', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			// queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			// showColumns: true,
			// showRefresh: true,
			// data:$scope.time,
			responseHandler:function(response){
				$scope.time.forEach (function(plateTime) {
					response.data.rows.push(plateTime);
				});
				response.data.total = $scope.time.length;
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"id", title:"主键", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
				{field:"weekDay",title:"星期",align:"center",valign:"middle"},
				{field:"sectionName",title:"节次",align:"center",valign:"middle"}
			]
		};

		// 返回上一页
		$scope.goBack = function () {
			$state.go("home.common.projectModule");
		}

		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/addTime.html',
				size: 'lg',
				controller: addInfoController,
				resolve: {
					item: function () {
						return $scope.time;
					},
				},
			});
		};

		//打开删除页面
		$scope.openDelete = function(){
			var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/deleteTime.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteTimeController
			});
		};

		$scope.ok = function (form) {
			var row = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			$scope.projectModule.timeList = $scope.time;
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectModuleService.add($scope.projectModule, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				// $uibModalInstance.close();
				angular.element('#projectModuleTable').bootstrapTable('refresh');
				$state.go("home.common.projectModule");
				alertService('success', '新增成功');
			});
		};
		$scope.close = function () {
			$state.go("home.common.projectModule");
		};
	};
	starts_openAddController.$inject = ['$rootScope', '$stateParams', '$http', '$compile', '$scope', '$uibModal', '$window', 'starts_projectModuleService', 'formVerifyService', 'app', '$state'];

	// 修改控制器
	window.starts_openModifyController = function ($rootScope, $stateParams, $http, $compile, $scope, $uibModal, $window, starts_projectModuleService, formVerifyService, app, $state) {
		//学年学期下拉框
		$scope.semesterObjs = [];
		$scope.timeSetting = {};
		$scope.table_height = $window.innerHeight - 360;
		$scope.scollDivHeight = $window.innerHeight -100;
		starts_projectModuleService.get(function (data) {
			$scope.semesterObjs = data.data;
			var html = '' +
				'<select  ui-select2 ng-options="semesterObj.id as semesterObj.acadYearSemester  for semesterObj in semesterObjs" ui-chosen="classManageSearchForm.gradeId" ng-required="true" '
				+  ' ng-required="true" ng-model="projectModule.semesterId" id="semesterId_select" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#semesterId_select").parent().empty().append(html);
			$compile(angular.element("#semesterId_select").parent().contents())($scope);
		});

		// item.startEndWeek = item.startWeek + "-" + item.endWeek;
		// $scope.time = [item];
		var item = angular.fromJson($stateParams.params);
		$scope.projectModule = item;
		$scope.time = [];
		var timeDemandFinalResult =[];
		starts_projectModuleService.getTime(item.id, function (data) {
			console.log(data);
			timeDemandFinalResult = data;
			timeDemandFinalResultFn();
		});
		var timeDemandFinalResultFn = function () {
			timeDemandFinalResult.forEach (function( teacherTimeDemand) {
				teacherTimeDemand.startEndWeek = teacherTimeDemand.startWeek+'-'+teacherTimeDemand.endWeek;
				// teacherTimeDemand.sectionName = teacherTimeDemand.sectionName;
				// teacherTimeDemand.section = teacherTimeDemand.section;
				$scope.time.push( teacherTimeDemand);
			});
			angular.element('#plateTimeTable').bootstrapTable('refresh');
		};
		$scope.plateTimeTable = {
			// url: 'data_test/starts/tableview_projectModule.json',
			url: app.api.address + '/virtual-class/projectPlateTime',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			// pagination: true,
			pageSize: 20,
			pageNumber:1,
			// pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			// paginationPreText: '上一页',
			// paginationNextText: '下一页',
			sortName: 'createTime', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField : "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			// showColumns: true,
			// showRefresh: true,
			responseHandler:function(response){
				$scope.time.forEach (function(plateTime) {
					response.data.rows.push(plateTime);
				});
				response.data.total = $scope.time.length;
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"plateTimeId", title:"主键", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"startEndWeek",title:"起止周",align:"center",valign:"middle"},
				{field:"weekDay",title:"星期",align:"center",valign:"middle"},
				{field:"sectionName",title:"节次",align:"center",valign:"middle"}
			]
		};

		// 返回上一页
		$scope.goBack = function () {
			$state.go("home.common.projectModule");
		}

		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/addTime.html',
				size: 'lg',
				controller: addInfoController,
				resolve: {
					item: function () {
						return $scope.time;
					},
				},
			});
		};

		//打开删除页面
		$scope.openDelete = function(){
			var rows = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectModule/deleteTime.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteTimeController
			});
		};

		// 数据初始化
		$scope.projectModule = item;
		$scope.ok = function (form) {
			var row = angular.element('#plateTimeTable').bootstrapTable('getSelections');
			$scope.projectModule.timeList = $scope.time;
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectModuleService.update($scope.projectModule, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				//$uibModalInstance.close();
				angular.element('#projectModuleTable').bootstrapTable('refresh');
				$state.go("home.common.projectModule");
				alertService('success', '新增成功');
			});
		};

		$scope.close = function () {
			$state.go("home.common.projectModule");
		};
	};
	starts_openModifyController.$inject = ['$rootScope', '$stateParams', '$http', '$compile', '$scope', '$uibModal', '$window', 'starts_projectModuleService', 'formVerifyService', 'app', '$state'];
})(window);
