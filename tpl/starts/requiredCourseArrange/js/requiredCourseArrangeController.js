;(function (window, undefined) {
	'use strict';

	window.starts_requiredCourseArrangeController = function ($compile, $scope, $state, $uibModal, $rootScope,$stateParams, $window, starts_requiredCourseArrangeService, alertService, app) {
		var planId = $stateParams.id;
		var moduleName = $stateParams.moduleName;
		var courseNum =$stateParams.courseNum;
		var courseName =$stateParams.courseName;
		var credit = $stateParams.credit;
		var semesterId = $stateParams.semesterId;
		$scope.openPlan = {
			planId:planId,
			moduleName:moduleName,
			courseNum:courseNum,
			courseName:courseName,
			credit:credit,
			semesterId:semesterId
		};

		$scope.disabled = function () {
			var myDate = new Date();
			// var crTimes = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
			$scope.courseArrange={};
			starts_requiredCourseArrangeService.gets(function (data) {
				data.forEach (function(courseArrange) {
					if(courseArrange.sfkkk == 1){
						$scope.courseArrange = courseArrange;
					}
				});
				if($scope.openPlan.semesterId!=$scope.courseArrange.id){
					$scope.isdisabled=true;
					return;
				}
				// var crTime = new Date(crTimes);
				// var startTime = new Date($scope.courseArrange.startTime);
				// var endTime = new Date($scope.courseArrange.endTime);
				var beginTime = new Date($scope.courseArrange.beginTime);
				var finishTime = new Date($scope.courseArrange.finishTime);
				// if(startTime < beginTime && finishTime < endTime){
					if(beginTime < myDate && myDate < finishTime){
						$scope.isdisabled=false;
					}else{
						$scope.isdisabled=true;
						// $scope.isdisabled=false;
					}
				// }else{
				// 	$scope.isdisabled=true;
				// 	// $scope.isdisabled=false;
				// }
			});
		}
		// 表格的高度
		$scope.table_height = $window.innerHeight - 215;
		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var attributeNamesForOrderBy = {};
			attributeNamesForOrderBy[params.sortName] = params.sortOrder;
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				attributeNamesForOrderBy: attributeNamesForOrderBy,
				openPlanId : $scope.openPlan.planId
			};
			$rootScope.$log.debug(angular.extend(pageParam, $scope.courseArrange));
			return angular.extend(pageParam, $scope.courseArrange);
		} 
		$scope.classCourseTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#classCourseTable').contents())($scope);
			},
			//url: 'data_test/starts/tableview_courseArrange.json',
			url: app.api.address + '/virtual-class/teachingTask',
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
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field:"id", title:"主键", visible:false},
				{field:"semesterId",  visible:false},
				{field:"stopSign", title:"是否开班", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"num",title:"教学班号",align:"center",valign:"middle"},
				{field:"name",title:"教学班名称",align:"center",valign:"middle"},
				{field:"executiveClassId",visible:false},
				{field:"executiveClassName",title:"对应行政班",align:"center",valign:"middle",sortable:true},
				{field:"actualCount",title:"班级人数",align:"center",valign:"middle"},
				{field:"lowestCount",title:"最低开班人数",align:"center",valign:"middle"},
				{field:"highestCount",title:"最高人数",align:"center",valign:"middle"},
				{field:"",title:"操作",align:"center",valign:"middle",formatter: function (value, row, index) {
					var openModify = "<button has-permission='required:arrange:update'  type='button' ng-click='openEdit(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
					var openRange = "<button has-permission='required:arrange:rangeSet' type='button' ng-click='openRange(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修读范围</button>";
					var classList = "<button has-permission='required:arrange:classListSet' type='button' ng-click='classList(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>班级名单</button>";
					var removeClass = "<button has-permission='required:arrange:splitClass' type='button' ng-click='removeClass(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>拆班</button>";
					var executiveClassId = row.executiveClassId;
					if(executiveClassId){
						if(executiveClassId.split(',').length>1){
							return openModify + "&nbsp;" +openRange + "&nbsp;" +classList + "&nbsp;" +removeClass;
						}else{
							return openModify + "&nbsp;" +openRange + "&nbsp;" +classList
						}
					}
					return openModify + "&nbsp;" +openRange + "&nbsp;" +classList
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
			angular.element('#classCourseTable').bootstrapTable('resetView',{ height: $scope.table_height } );
			//angular.element('#classListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		}
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#classCourseTable').bootstrapTable('refresh');
			//angular.element('#classListTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.courseArrange = {};
			angular.element('#classCourseTable').bootstrapTable('refresh');
		}

		// 返回上一页
		$scope.goBack = function () {
			$state.go("home.common.requiredCourseClassManage");
		}

		// 打开生成面板
		$scope.generation = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/generation.html',
				resolve: {
					item: function () {
						$scope.openPlan.sign=true;
						return $scope.openPlan;
					}
				},
				size: '',
				controller: openAddController
			});
		};

		// 打开班级名单
		$scope.classList = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/list/classList.html',
				resolve: {
					item: function () {
						return data;
					}
				},
				size: 'lg',
				controller: openListController
			});
		};

		//拆班
		$scope.removeClass = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/delete.html',
				resolve: {
					item: function () {
						return data;
					},
					openPlan: function () {
						return $scope.openPlan;
					}
				},
				size: 'lg',
				controller: removeClassController
			});
		};


		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/add.html',
				size: '',
				resolve: {
					item: function () {
						$scope.openPlan.sign=false;
						return $scope.openPlan;
					}
				},
				controller: openAddController

			});
		};

		// 打开修改面板
		$scope.openEdit = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/modify.html',
				size: '',
				resolve: {
					item: function () {
						return data;
					}
				},
				controller: openModifyController
			});
		};

		// 打开修读范围面板
		$scope.openRange = function(data){

			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/range.html',
				size: 'lg',
				resolve: {
					item: function () {
						return data;
					}
				},
				controller: openRangeController
			});
		};

		// 打开删除面板
		$scope.openDelete = function(){
			var rows = angular.element('#classCourseTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					}
				},
				controller: openDeleteController
			});
		};

		// 合班
		$scope.mergeClass = function(){
			var rows = angular.element('#classCourseTable').bootstrapTable('getSelections');
			if(rows.length < 2){
				alertService('请最少选择两条数据进行合并');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					}
				},
				controller: mergeClassController
			});
		};
	};
	starts_requiredCourseArrangeController.$inject = [ '$compile', '$scope', '$state', '$uibModal', '$rootScope','$stateParams', '$window', 'starts_requiredCourseArrangeService', 'alertService', 'app'];

	var openListController = function ($scope,$uibModalInstance, $uibModal,item,$rootScope, $window, starts_requiredCourseArrangeService, formVerifyService, alertService, app) {
		//查询参数
		var a = item;
		$scope.queryParams = function queryParams(params) {
			var attributeNamesForOrderBy = {};
			attributeNamesForOrderBy[params.sortName] = params.sortOrder;
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				attributeNamesForOrderBy: attributeNamesForOrderBy,
				classId: item.id
			};
			$rootScope.$log.debug(angular.extend(pageParam, $scope.classList));
			return angular.extend(pageParam, $scope.classList);
		}

		$scope.classListTable = {
			//url: 'data_test/starts/tableview_classList.json',
			url: app.api.address + '/virtual-class/classList',
			method: 'get',
			cache: false,
			height: 495,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: '', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField: "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field: "id", title: "主键", visible: false},
				{
					field: "",
					title: "序号",
					align: "center",
					valign: "middle",
					width: "5%",
					formatter: function (value, row, index) {
						return index + 1;
					}
				},
				{field: "num", title: "学号", align: "center", valign: "middle"},
				{field: "name", title: "姓名", align: "center", valign: "middle"},
				{field: "executiveClassName", title: "行政班级", align: "center", valign: "middle"}
			]
		};
		//打开新增面板
		$scope.openAddList = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/list/add.html',
				size: 'lg',
				resolve: {
					item: function () {
						return item;
					}
				},
				controller: openListAddController
			});
		};
		// //删除
		$scope.openDeleteList = function(){
			var rows = angular.element('#classListTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			var selClassList = [];
			rows.forEach (function(selClass) {

				selClassList.push(selClass);
			});
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/requiredCourseArrange/list/delete.html',
				size: '',
				resolve: {
					items: function () {
						return selClassList;
					},
					classId :function () {
						return item.id;
					},
				},
				controller: openListDeleteController
			});
		};

		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function () {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if ($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 98;
			} else {
				$scope.table_height = $scope.table_height - 98;
			}
			angular.element('#classListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		}
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#classListTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.classList = {};
			angular.element('#classListTable').bootstrapTable('refresh');
		}

		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openListController.$inject =['$scope', '$uibModalInstance' ,'$uibModal', 'item', '$rootScope', '$window', 'starts_requiredCourseArrangeService', 'formVerifyService', 'alertService', 'app'];

	var openListAddController = function ($scope,$uibModalInstance, $uibModal, item, $rootScope, $window, starts_requiredCourseArrangeService, formVerifyService, alertService, app) {
		//查询参数
		$scope.queryParams = function queryParams(params) {
			var attributeNamesForOrderBy = {};
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				classId: item.id
			};
			$rootScope.$log.debug(angular.extend(pageParam, $scope.unSelClassList));
			return angular.extend(pageParam, $scope.unSelClassList);
		}

		$scope.unSelClassListTable = {
			//url: 'data_test/starts/tableview_classList.json',
			url: app.api.address + '/virtual-class/unSelectClassList',
			method: 'get',
			cache: false,
			height: 493,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: '', // 默认排序字段
			sortOrder: 'desc', // 默认排序方式
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			idField: "id", // 指定主键列
			uniqueId: "id", // 每行唯一标识
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			showColumns: true,
			showRefresh: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{checkbox: true, width: "5%"},
				{field: "id", title: "主键", visible: false},
				{
					field: "",
					title: "序号",
					align: "center",
					valign: "middle",
					width: "5%",
					formatter: function (value, row, index) {
						return index + 1;
					}
				},
				{field: "id", visible: false},
				{field: "num", title: "学号", align: "center", valign: "middle"},
				{field: "name", title: "姓名", align: "center", valign: "middle"},
				{field: "executiveClassName", title: "行政班级", align: "center", valign: "middle"}
			]
		};

		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function () {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if ($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 98;
			} else {
				$scope.table_height = $scope.table_height - 98;
			}
			angular.element('#unSelClassListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		}
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#unSelClassListTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.unSelClassList = {};
			angular.element('#unSelClassListTable').bootstrapTable('refresh');
		}

		$scope.ok = function (form) {
			// 处理前验证
			var rows = angular.element('#unSelClassListTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要新增的项');
				return;
			}
			var selClassList = [];
			rows.forEach (function(selClass) {
				selClass.teachingTaskId = item.id;
				selClass.semesterId = item.semesterId;
				selClass.schoolId = selClass.id
				selClass.teachingClassId = '1';
				selClassList.push(selClass);
			});
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			starts_requiredCourseArrangeService.addClassList(selClassList, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classListTable').bootstrapTable('refresh');
				angular.element('#classCourseTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
			$uibModalInstance.close();
		};

		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openListAddController.$inject =['$scope', '$uibModalInstance' ,'$uibModal', 'item', '$rootScope', '$window', 'starts_requiredCourseArrangeService', 'formVerifyService', 'alertService', 'app'];

	// 添加控制器
	var openAddController = function ($scope, $uibModalInstance,item, $uibModal, starts_requiredCourseArrangeService, formVerifyService, alertService) {
		$scope.ok = function (form) {
			if($scope.courseArrange.lowestCount>$scope.courseArrange.highestCount){
				alertService("最低开班人数不能大于最高容纳人数");
				return;
			}
			// 处理前验证
			$scope.courseArrange.openPlanId = item.planId;
			$scope.courseArrange.sign = item.sign;
			$scope.courseArrange.courseProperty = '1';
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_requiredCourseArrangeService.add($scope.courseArrange, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classCourseTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openAddController.$inject = ['$scope', '$uibModalInstance', 'item','$uibModal', 'starts_requiredCourseArrangeService', 'formVerifyService', 'alertService'];


	var openRangeController = function ($scope, $uibModalInstance, item, starts_requiredCourseArrangeService, alertService, formVerifyService) {
		// $scope.rangeData = item.rangeData;
		var classId = item.id;
		
		var rangeData = [];
		starts_requiredCourseArrangeService.get(classId, function (data) {
			console.log(data);
			rangeData = data;
			rangeDate();
		});
		var rangeDate = function () {
			$scope.arrays = rangeData.deptData;
			$scope.arrays2 = [{val: "2014",name: "2014",selectSign: false,rangeType:2},{val: "2015",name: "2015",selectSign: false,rangeType:2},
				{val: "2016",name: "2016",selectSign: false,rangeType:2},{val: "2017",name: "2017",selectSign: false,rangeType:2}];
			$scope.arrays3 = rangeData.majorData;
			$scope.arrays4 = rangeData.classData;
			$scope.arraySeled =rangeData.deptReadRangeData;
			$scope.arraySeled2 =rangeData.gradeReadRangeData;
			angular.forEach($scope.arraySeled2 , function(seled,i,arraySel){
				angular.forEach($scope.arrays2 , function(sel,index,array){
					if(seled.val == sel.val){
						var index = $scope.arrays2.indexOf(sel);
						$scope.arrays2.splice(index,1);
					}
				});

			});
			$scope.arraySeled3 =rangeData.majorReadRangeData;
			$scope.arraySeled4 =rangeData.classReadRangeData;
			$scope.selectChildArrays = function(array){

				var remark = angular.element('#selectRemark')[0].value;
				if(remark == "可选"){
					array.selectSign = true;
				}else{
					array.selectSign = false;
				}
				var index = $scope.arrays.indexOf(array);
				$scope.arrays.splice(index,1);
				$scope.arraySeled.push(array);
			};

			$scope.selectedChildArrays = function(array){
				var remark = angular.element('#selectRemark')[0].value;
				var index = $scope.arraySeled.indexOf(array);
				$scope.arraySeled.splice(index,1);
				$scope.arrays.push(array);
			};

			$scope.selectChildArrays2 = function(array){

				var remark = angular.element('#selectRemark2')[0].value;
				if(remark == "可选"){
					array.selectSign = true;
				}else{
					array.selectSign = false;
				}
				var index = $scope.arrays2.indexOf(array);
				$scope.arrays2.splice(index,1);
				$scope.arraySeled2.push(array);
			};

			$scope.selectedChildArrays2 = function(array){
				var remark = angular.element('#selectRemark2')[0].value;
				var index = $scope.arraySeled2.indexOf(array);
				$scope.arraySeled2.splice(index,1);
				$scope.arrays2.push(array);
			};

			$scope.selectChildArrays3 = function(array){

				var remark = angular.element('#selectRemark3')[0].value;
				if(remark == "可选"){
					array.selectSign = true;
				}else{
					array.selectSign = false;
				}
				var index = $scope.arrays3.indexOf(array);
				$scope.arrays3.splice(index,1);
				$scope.arraySeled3.push(array);
			};

			$scope.selectedChildArrays3 = function(array){
				var remark = angular.element('#selectRemark3')[0].value;
				var index = $scope.arraySeled3.indexOf(array);
				$scope.arraySeled3.splice(index,1);
				$scope.arrays3.push(array);
			};

			$scope.selectChildArrays4 = function(array){

				var remark = angular.element('#selectRemark4')[0].value;
				if(remark == "可选"){
					array.selectSign = true;
				}else{
					array.selectSign = false;
				}
				var index = $scope.arrays4.indexOf(array);
				$scope.arrays4.splice(index,1);
				$scope.arraySeled4.push(array);
			};

			$scope.selectedChildArrays4 = function(array){
				var remark = angular.element('#selectRemark4')[0].value;
				var index = $scope.arraySeled4.indexOf(array);
				$scope.arraySeled4.splice(index,1);
				$scope.arrays4.push(array);
			};

			$scope.ok = function (form) {
				// 处理前验证
				if(form.$invalid) {
					// 调用共用服务验证（效果：验证不通过的输入框会变红色）
					formVerifyService(form);
					return;
				};
				var arraySeled = [] ;
				angular.forEach($scope.arraySeled , function(data,index,array){
					arraySeled.push(data);
				});
				angular.forEach($scope.arraySeled2 , function(data,index,array){
					arraySeled.push(data);
				});
				angular.forEach($scope.arraySeled3 , function(data,index,array){
					arraySeled.push(data);
				});
				angular.forEach($scope.arraySeled4 , function(data,index,array){
					arraySeled.push(data);
				});
				console.log(arraySeled);
				starts_requiredCourseArrangeService.updateRange(classId, arraySeled, function (error, message) {
					if (error) {
						alertService(message);
						return;
					}
					$uibModalInstance.close();
					angular.element('#classCourseTable').bootstrapTable('refresh');
					alertService('success', '修改成功');
				});
			};
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openRangeController.$inject = ['$scope', '$uibModalInstance', 'item', 'starts_requiredCourseArrangeService', 'alertService', 'formVerifyService'];
	// 修改控制器
	var openModifyController = function ($scope, $uibModalInstance, item, starts_requiredCourseArrangeService, alertService, formVerifyService) {
		$scope.courseArrange = item;
		$scope.ok = function (form) {
			if($scope.courseArrange.lowestCount>$scope.courseArrange.highestCount){
				alertService("最低开班人数不能大于最高容纳人数");
				return;
			}
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_requiredCourseArrangeService.update($scope.courseArrange, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#classCourseTable').bootstrapTable('refresh');
				alertService('success', '修改成功');
			});
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openModifyController.$inject = ['$scope', '$uibModalInstance', 'item', 'starts_requiredCourseArrangeService', 'alertService', 'formVerifyService'];

	// 删除控制器
	var openDeleteController = function ($scope, $uibModalInstance, items, starts_requiredCourseArrangeService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(courseArrange) {
				ids.push(courseArrange.id);
			});
			starts_requiredCourseArrangeService.delete(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classCourseTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};


	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_requiredCourseArrangeService', 'alertService'];

	// 删除控制器
	var openListDeleteController = function ($scope, $uibModalInstance, items,classId, starts_requiredCourseArrangeService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(selClassList) {
				ids.push(selClassList.id);
			});
			starts_requiredCourseArrangeService.deleteClassList(ids, classId, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classListTable').bootstrapTable('refresh');
				angular.element('#classCourseTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};


	};
	openListDeleteController.$inject = ['$scope', '$uibModalInstance', 'items','classId', 'starts_requiredCourseArrangeService', 'alertService'];

	// 合班控制器
	var mergeClassController = function ($scope, $uibModalInstance, items, starts_requiredCourseArrangeService, alertService) {
		$scope.message = "确定要合并吗？ 合并之后修读范围将全部清空，班级名单合并！";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(selClassList) {
				ids.push(selClassList.id);
			});
			starts_requiredCourseArrangeService.mergeClass(ids, items, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classCourseTable').bootstrapTable('refresh');
				alertService('success', '合并成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};


	};
	mergeClassController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_requiredCourseArrangeService', 'alertService'];

	// 拆班控制器
	var removeClassController = function ($scope, $uibModalInstance, item, openPlan, starts_requiredCourseArrangeService, alertService) {
		$scope.message = "确定要拆分吗？ 拆分之后修读范围将全部清空，班级名单按行政班拆分！";
		$scope.ok = function () {
			starts_requiredCourseArrangeService.splitClass(openPlan.planId, item, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#classCourseTable').bootstrapTable('refresh');
				alertService('success', '拆分成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};


	};
	removeClassController.$inject = ['$scope', '$uibModalInstance', 'item', 'openPlan', 'starts_requiredCourseArrangeService', 'alertService'];
})(window);
