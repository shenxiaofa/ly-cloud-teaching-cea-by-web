;(function (window, undefined) {
	'use strict';

	window.starts_projectCodeController = function ($compile, $scope, $uibModal, $rootScope, $window, starts_projectCodeService, alertService, app) {
		$scope.table_height = $window.innerHeight -184;
		//查询参数
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
			return angular.extend(pageParam, $scope.code);
		}

		$scope.codeTable = {
			onLoadSuccess: function() {
				$compile(angular.element('#codeTable').contents())($scope);
			},
			// url: 'data_test/starts/tableview_classList.json',
			url: app.api.address + '/virtual-class/projectCode',
			method: 'get',
			cache: false,
			height: $scope.table_height,
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [10, 20, 30, 50, 100], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			sortName: 'sort', // 默认排序字段
			sortOrder: 'asc', // 默认排序方式
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
				{field: "sort", title: "排序", align: "center", valign: "middle",sortable:true},
				{field:"",title:"操作",align:"center",valign:"middle",formatter: function (value, row, index) {
					var openCodeEdit = "<button has-permission='projectCode:update'  type='button' ng-click='openCodeEdit(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>修改</button>";
					return openCodeEdit;
				}}
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
			angular.element('#codeTable').bootstrapTable('resetView',{ height: $scope.table_height } );
			//angular.element('#classListTable').bootstrapTable('resetView',{ height: $scope.table_height } );
		}

		$scope.close = function () {
			$uibModalInstance.close();
		};

		// 打开新增面板
		$scope.openAdd = function(){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCode/add.html',
				size: '',
				controller: openAddCodeController
			});
		};

		// 打开修改面板
		$scope.openCodeEdit = function(data){
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCode/modify.html',
				size: '',
				resolve: {
					item: function () {
						return data;
					}
				},
				controller: openModifyCodeController
			});
		};

		//删除
		$scope.openDelete = function(){
			var rows = angular.element('#codeTable').bootstrapTable('getSelections');
			if(rows.length == 0){
				alertService('请先选择要删除的项');
				return;
			}
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/starts/projectCode/delete.html',
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
			angular.element('#codeTable').bootstrapTable('selectPage', 1);
			// angular.element('#codeTable').bootstrapTable('refresh');
		}
		// 查询表单重置
		$scope.searchReset = function () {
			$scope.code = {};
			angular.element('#codeTable').bootstrapTable('refresh');
		}
	};
	starts_projectCodeController.$inject = [ '$compile', '$scope', '$uibModal', '$rootScope', '$window', 'starts_projectCodeService', 'alertService', 'app'];





	// 添加控制器
	var openAddCodeController = function ($scope, $uibModalInstance, $uibModal, starts_projectCodeService, formVerifyService, alertService) {
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectCodeService.addCode($scope.code, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#codeTable').bootstrapTable('refresh');
				alertService('success', '新增成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openAddCodeController.$inject = ['$scope', '$uibModalInstance', '$uibModal', 'starts_projectCodeService', 'formVerifyService', 'alertService'];

	// 修改控制器
	var openModifyCodeController = function ($scope, $uibModalInstance, item, starts_projectCodeService, alertService, formVerifyService) {
		// 数据初始化
		$scope.code = item;
		$scope.ok = function (form) {
			// 处理前验证
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};

			starts_projectCodeService.updateCode($scope.code, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				$uibModalInstance.close();
				angular.element('#codeTable').bootstrapTable('refresh');
				alertService('success', '修改成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openModifyCodeController.$inject = ['$scope', '$uibModalInstance', 'item', 'starts_projectCodeService', 'alertService', 'formVerifyService'];

	// 删除控制器
	var openDeleteCodeController = function ($scope, $uibModalInstance, items, starts_projectCodeService, alertService) {
		$scope.message = "确定要删除吗？";
		$scope.ok = function () {
			var ids = []; // 代码类型号数组
			items.forEach (function(code) {
				ids.push(code.id);
			});
			starts_projectCodeService.deleteCode(ids, function (error, message) {
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#codeTable').bootstrapTable('refresh');
				alertService('success', '删除成功');
			});
			$uibModalInstance.close();
		};
		$scope.close = function () {
			$uibModalInstance.close();
		};
	};
	openDeleteCodeController.$inject = ['$scope', '$uibModalInstance', 'items', 'starts_projectCodeService', 'alertService'];
})(window);
