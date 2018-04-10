;
(function(window, undefined) {
	'use strict';

	window.choose_monitorAdjustManageController = function($scope, baseinfo_generalService, $state, $http, $uibModal, $compile, $rootScope, $window, choose_monitorAdjustManageService, alertService, app) {

		$scope.monitorAdjustManage = {};
		// 表格的高度
		$scope.table_height = $window.innerHeight - 263;
		$scope.deleteDataIsExist = true; // 检测删除部分的数据是否存在

		// 基础资源获取学年学期Id
		$scope.semesterId = [];
		choose_monitorAdjustManageService.getSemesterId(function(error, message, data) {
			$scope.semesterId = data.data;
			var html = '' +
				'<select ui-select2 ' +
				' ng-model="monitorAdjustManage.semesterId" id="semesterId" name="semesterId" ng-change="showRound()"' +
				' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > ' +
				'<option value="">==请选择==</option> ' +
				'<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> ' +
				'</select>';
			angular.element("#semesterId").parent().empty().append(html);
			$compile(angular.element("#semesterId").parent().contents())($scope);
		});


		$scope.showRound = function () {
			choose_monitorAdjustManageService.getRound($scope.monitorAdjustManage.semesterId,function(error, message, data) {
				$scope.rounds = data.data;
				var html = '' +
					'<select ui-select2 ' +
					' ng-model="monitorAdjustManage.roundId" id="roundId" name="roundId" ng-required="true" ' +
					' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > ' +
					'<option value="">==请选择==</option> ' +
					'<option  ng-repeat="round in rounds" value="{{round.id}}">{{round.name}}</option> ' +
					'</select>';
				angular.element("#roundId").parent().empty().append(html);
				$compile(angular.element("#roundId").parent().contents())($scope);
			});
		}

		$scope.deptObjs = {};
		baseinfo_generalService.findDepartmentNamesBox(function (error, message, data) {
			if (error) {
				alertService(message);
				return;
			}
			$scope.deptObjs = data.data;
			var html = '' +
				'<select ui-select2 ng-options="deptObj.id as deptObj.departmentName  for deptObj in deptObjs" '
				+  ' ng-model="monitorAdjustManage.deptId" id="deptId" name="deptId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
				+  '<option value="">==请选择==</option> '
				+  '</select>';
			angular.element("#deptId").parent().empty().append(html);
			$compile(angular.element("#deptId").parent().contents())($scope);
		});

		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize: params.pageSize, //页面大小
				pageNo: params.pageNumber //页码
			};
			return angular.extend(pageParam, $scope.monitorAdjustManage);
		};

		$scope.monitorAdjustManageTable = {
			url: app.api.address + '/choose/monitor',
			//url: 'data_test/choose/tableview_monitorAdjustManage.json',
			method: 'get',
			cache: false,
			height: $scope.table_height, //使高度贴底部
			toolbar: '#toolbar', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			striped: true,
			pagination: true,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50], // 设置可供选择的页面数据条数
			paginationPreText: '上一页',
			paginationNextText: '下一页',
			silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams, //传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#monitorAdjustManageTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler:function(response){
				return response.data;
			},
			columns: [
				{field: "semester", title: "学年学期", align: "center", valign: "middle"},
				{field: "roundName", title: "选课轮次", align: "center", valign: "middle"},
				{field: "status", title: "选课状态", align: "center", valign: "middle"},
				{field: "chosenControl", title: "选课控制", align: "center", valign: "middle"},
				{field: "chooseWay", title: "选课方式", align: "center", valign: "middle"},
				{field: "courseNum", title: "课程编号", align: "center", valign: "middle"},
				{field: "courseName", title: "课程名称", align: "center", valign: "middle"},
				{field: "dept", title: "开课单位", align: "center", valign: "middle"},
				{field: "courseProperty", title: "课程属性", align: "center", valign: "middle"},
				{field: "credit", title: "学分", align: "center", valign: "middle"},
				{field: "teachingTaskName", title: "教学班名称", align: "center", valign: "middle"},
				{field: "teachingTaskMax", title: "容量", align: "center", valign: "middle"},
				{field: "beChoosedNum", title: "已选人数", align: "center", valign: "middle"},
				{field: "choosedNum", title: "选上人数", align: "center", valign: "middle"},
				{field: "teacher", title: "任课教师", align: "center", valign: "middle"},
				{title: "操作", align: "center", valign: "middle", width: "5%",
					formatter: function(value, row, index) {
						var adjustButton = "<button type='button' has-permission='' ng-click='adjustCapacity(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>容量调整</button>";
						return adjustButton;
					}
				}
			]
		};

		// 容量调整按钮
		$scope.adjustCapacity = function(rows) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseProcessManage/monitorAdjustManage/adjust.html',
				size: '',
				resolve: {
					items: function() {
						return rows;
					},
				},
				controller: adjustCapacityController
			});
		};

		// 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function() {
			angular.element('#monitorAdjustManageTable').bootstrapTable('selectPage', 1);
		};

		// 查询表单重置
		$scope.searchReset = function() {
			$scope.monitorAdjustManage = {};
			// 重新初始化下拉框
			angular.element('form[name="monitorAdjustManageForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#monitorAdjustManageTable').bootstrapTable('selectPage', 1);
		};

		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm;
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 155;
			} else {
				$scope.table_height = $scope.table_height - 155;
			}
			angular.element('#monitorAdjustManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_monitorAdjustManageController.$inject = ['$scope', 'baseinfo_generalService', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_monitorAdjustManageService', 'alertService', 'app'];

	// 容量调整控制器
	var adjustCapacityController = function($scope, $rootScope, $uibModalInstance, items, formVerifyService, choose_monitorAdjustManageService, alertService) {
		$scope.data = items;
		if( !isNaN($scope.data.teachingTaskMax)){

			$scope.data.teachingTaskMax = parseInt($scope.data.teachingTaskMax);
		}

		//提交确认按钮事件
		$scope.ok = function(form) {
			// 处理前验证input输入框
			if(form.$invalid) {
				// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				formVerifyService(form);
				return;
			};
			$rootScope.showLoading = true; // 加载提示
			var param = {
				id:items.id,
				capacity :$scope.data.teachingTaskMax
			}
			choose_monitorAdjustManageService.adjust(param, function (error, message) {
				$rootScope.showLoading = false; // 关闭加载提示
				if (error) {
					alertService(message);
					return;
				}
				angular.element('#monitorAdjustManageTable').bootstrapTable('refresh');
				alertService('success', '操作成功');
			});
			$uibModalInstance.close();
		};

		// 关闭窗口事件
		$scope.close = function() {
			$uibModalInstance.close();
		};
	};
	adjustCapacityController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'items', 'formVerifyService', 'choose_monitorAdjustManageService', 'alertService'];
})(window);