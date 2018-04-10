;(function (window, undefined) {
	'use strict';

	window.starts_projectCodeMaintenanceController = function ($compile, $scope, $uibModal, $rootScope, $window, starts_projectCodeMaintenanceService, alertService, app) {
		// 表格的高度
		$scope.table_height = $window.innerHeight -68;
		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var attributeNamesForOrderBy = {};
			attributeNamesForOrderBy[params.sortName] = params.sortOrder;
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				sortName: params.sortName,
				attributeNamesForOrderBy: attributeNamesForOrderBy
			};
			return angular.extend(pageParam, $scope.projectCode);
		}
		$scope.projectCodeTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#projectCodeTable').contents())($scope);
			},
			// url: 'data_test/starts/tableview_projectCode.json',
			url: app.api.address + '/virtual-class/projectType',
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
			sortName: 'num', // 默认排序字段
			sortOrder: 'asc', // 默认排序方式
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
				{field:"courseId", title:"主键", visible:false},
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field:"num",title:"项目类别码",align:"center",valign:"middle", sortable:true},
				{field:"name",title:"项目类别",align:"center",valign:"middle"},
				{field:"engName",title:"英文名称",align:"center",valign:"middle"},
				{field:"courseNum",title:"对应课程号",align:"center",valign:"middle"},
				{field:"courseName",title:"对应课程名称",align:"center",valign:"middle"},
				{field:"",title:"操作",align:"center",valign:"middle",formatter: function (value, row, index) {
					var openModify = "<button has-permission='projectCodeMaintenance:update' type='button' ng-click='openEdit(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
					var codeMaintenance = "<button has-permission='projectCodeMaintenance:codeMaintenance' type='button' ng-click='codeMaintenance(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>代码维护</button>";
					return openModify + "&nbsp;" +codeMaintenance ;
					}
				}
			]
		};

		// 查询表单显示和隐藏切换
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function () {
			$scope.isHideSearchForm = !$scope.isHideSearchForm
			if ($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 98;
			} else {
				$scope.table_height = $scope.table_height - 98;
			}
			angular.element('#projectCodeTable').bootstrapTable('resetView',{ height: $scope.table_height } );
			//angular.element('#classListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		}
		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#projectCodeTable').bootstrapTable('selectPage', 1);
			// angular.element('#projectCodeTable').bootstrapTable('refresh');
			//angular.element('#classListTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			// $scope.projectCode = {};
			angular.element('#projectCodeTable').bootstrapTable('refresh');
			// angular.element('#classListTable').bootstrapTable('refresh');
		}

		// 打开代码维护
		$scope.codeMaintenance = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCodeMaintenance/codeMaintenance/codeMaintenance.html',
				resolve: {
					item: function () {
						return data;
					}
				},
				size: 'lg',
				controller: codeMaintenanceController
			});
		};

		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCodeMaintenance/add.html',
				size: 'lg',
				controller: openAddController
			});
		};

		// 打开修改面板
		$scope.openEdit = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCodeMaintenance/modify.html',
				size: 'lg',
				resolve: {
					item: function () {
						return data;
					}
				},
				controller: openModifyController
			});
		};

		// 打开删除面板
		$scope.openDelete = function(){
			var rows = angular.element('#projectCodeTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCodeMaintenance/delete.html',
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
	starts_projectCodeMaintenanceController.$inject = [ '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'starts_projectCodeMaintenanceService', 'alertService', 'app'];

	var codeMaintenanceController = function ($window, item,app,$compile, $scope, $uibModalInstance, $uibModal, starts_projectCodeMaintenanceService, formVerifyService, alertService) {
		$scope.codeMaintenanceTable_height = $window.innerHeight -300;

		//查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				sortName: params.sortName,
				sortOrder: params.sortOrder
			};
			return angular.extend(pageParam, $scope.code);
		}

		// $scope.code.projectTypeId = item.id;
		$scope.codeMaintenanceTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#codeMaintenanceTable').contents())($scope);
			},
			// url: 'data_test/starts/tableview_classList.json',
			url: app.api.address + '/virtual-class/projectTypeSettingVo/projectTypeId/' + item.id,
			method: 'get',
			cache: false,
			height: $scope.codeMaintenanceTable_height,
			toolbar: '#toolbar1', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'sort', // 默认排序字段
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
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field: "num", title: "项目代码", align: "center", valign: "middle"},
				{field: "name", title: "项目名称", align: "center", valign: "middle"},
				{field: "sort", title: "排序", align: "center", valign: "middle"}
			]
		};

		$scope.close = function () {
			$uibModalInstance.close();
		};

		// 打开新增面板
		$scope.openAddCode = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCodeMaintenance/codeMaintenance/codeList.html',
				size: 'lg',
				resolve: {
					item: function () {
						return item;
					},
				},
				controller: openAddCodeController
			});
		};

		//删除
		$scope.openDelete = function(){
			var rows = angular.element('#codeMaintenanceTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCodeMaintenance/codeMaintenance/delete.html',
				size: '',
				resolve: {
					items: function () {
						return rows;
					},
				},
				controller: openDeleteCodeController
			});
		};

		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#codeMaintenanceTable').bootstrapTable('selectPage', 1);
			// angular.element('#codeMaintenanceTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.code = {};
			angular.element('#codeMaintenanceTable').bootstrapTable('refresh');
		}


	};

	codeMaintenanceController.$inject = ['$window', 'item','app', '$compile', '$scope', '$uibModalInstance','$uibModal', 'starts_projectCodeMaintenanceService', 'formVerifyService', 'alertService'];


	// 添加控制器
	var openAddController = function ($compile,$scope, $uibModalInstance, $uibModal, starts_projectCodeMaintenanceService, formVerifyService, alertService) {
		// 对应课程信息下拉框数据
		$scope.courseData = [
			{
				id: "",
				courseName:"==请选择=="
			}
		];
		starts_projectCodeMaintenanceService.getCourse(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.courseData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="projectCode.courseId"  ng-required="true" id="courseName" name="courseName" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in courseData" value="{{date.id}}">{{date.courseName}}</option>'+
				'</select>';
			angular.element("#courseName").parent().empty().append(html);
			$compile(angular.element("#courseName").parent().contents())($scope);

		});
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectCodeMaintenanceService.add($scope.projectCode, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#projectCodeTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openAddController.$inject = ['$compile','$scope', '$uibModalInstance', '$uibModal', 'starts_projectCodeMaintenanceService', 'formVerifyService', 'alertService'];

	// 修改控制器
	var openModifyController = function ($compile, $scope, $uibModalInstance, item, starts_projectCodeMaintenanceService, alertService, formVerifyService) {
		// 项目类型下拉框数据
		$scope.projetTypeData = [
			{
				id: "",
				name:"==请选择=="
			}
		];
		starts_projectCodeMaintenanceService.getprojetType(function (error, message, data) {
			for(var i = 0; i < data.rows.length; i++){
				$scope.projetTypeData.push(data.rows[i]);
			}

		});
		// 对应课程信息下拉框数据
		$scope.courseData = [
			{
				id: "",
				name:"==请选择=="
			}
		];
		starts_projectCodeMaintenanceService.getCourse(function (error, message, data) {
			for(var i = 0; i < data.length; i++){
				$scope.courseData.push(data[i]);
			}
			var html = '' +
				'<select ng-model="projectCode.courseId"  ng-required="true" id="courseName" name="courseName" ui-jq="chosen" ui-options="{search_contains: true}"  class="form-control">'+
				'<option ng-repeat="date in courseData" value="{{date.id}}">{{date.courseName}}</option>'+
				'</select>';
			angular.element("#courseName").parent().empty().append(html);
			$compile(angular.element("#courseName").parent().contents())($scope);

		});
		// 数据初始化
		$scope.projectCode = item;
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectCodeMaintenanceService.update($scope.projectCode, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#projectCodeTable').bootstrapTable('refresh');
				alertService('success', '修改成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openModifyController.$inject = ['$compile', '$scope', '$uibModalInstance', 'item', 'starts_projectCodeMaintenanceService', 'alertService', 'formVerifyService'];

	// 删除控制器
	var openDeleteController = function ($scope, $uibModalInstance, items, starts_projectCodeMaintenanceService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(projectCode) {
				ids.push(projectCode.id);
			});
			starts_projectCodeMaintenanceService.delete(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#projectCodeTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_projectCodeMaintenanceService', 'alertService'];


	//代码维护页面增删改
	// 添加控制器
	var openAddCodeController = function ($window, item,$compile,app,$scope, $uibModalInstance, $uibModal, starts_projectCodeMaintenanceService, formVerifyService, alertService) {
		$scope.openAddCodeTable_height = $window.innerHeight -330;
		$scope.code1 = {
			id : item.id
		}
		//查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize,   //页面大小
				pageNo: params.pageNumber,  //页码
				sortName: params.sortName,
				sortOrder: params.sortOrder
			};
			return angular.extend(pageParam, $scope.code1);
		}

		$scope.codeTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#codeMaintenanceTable').contents())($scope);
			},
			// url: 'data_test/starts/tableview_classList.json',
			url: app.api.address + '/virtual-class/projectCode/projectTypeId',
			method: 'get',
			cache: false,
			height: $scope.openAddCodeTable_height,
			toolbar: '#toolbar2', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'sort', // 默认排序字段
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
				{field:"",title:"序号",align:"center",valign:"middle", width: "5%", formatter: function (value, row, index) {
					return index+1;
				}},
				{field: "num", title: "项目代码", align: "center", valign: "middle"},
				{field: "name", title: "项目名称", align: "center", valign: "middle"},
				{field: "sort", title: "排序", align: "center", valign: "middle"}
			]
		};

		// 查询表单提交
		$scope.searchSubmit = function () {
			angular.element('#codeTable').bootstrapTable('selectPage', 1);
			// angular.element('#codeTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.code1 = {};
			angular.element('#codeTable').bootstrapTable('refresh');
		};

		$scope.close = function () {
			$uibModalInstance.close();
		};
		$scope.ok = function () {
			var rows = angular.element('#codeTable').bootstrapTable('getSelections');
			var ids = []; // 数组
			rows.forEach (function(code) {
				ids.push(code.id);
			});
			starts_projectCodeMaintenanceService.addCode({ids:ids,projectTypeId:item.id}, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#codeMaintenanceTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openAddCodeController.$inject = ['$window', 'item','$compile','app','$scope', '$uibModalInstance', '$uibModal', 'starts_projectCodeMaintenanceService', 'formVerifyService', 'alertService'];

	// 删除控制器
	var openDeleteCodeController = function ($scope, $uibModalInstance, items, starts_projectCodeMaintenanceService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(code) {
				ids.push(code.id);
			});
			starts_projectCodeMaintenanceService.deleteCode(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#codeMaintenanceTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteCodeController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_projectCodeMaintenanceService', 'alertService'];
})(window);
