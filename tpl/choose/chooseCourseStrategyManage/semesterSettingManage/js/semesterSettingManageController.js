;(function(window, undefined) {
	'use strict';

	window.choose_semesterSettingManageController = function($scope, $state, $http, $uibModal, $compile, $rootScope, $window, choose_semesterSettingManageService, alertService, app) {

		$scope.semesterSettingManage = {};
		// 表格的高度
		$scope.table_height = $window.innerHeight - 185;

		// 基础资源获取学年学期Id
		$scope.semesterId = [];
		choose_semesterSettingManageService.getSemesterId(function (error,message,data) {
			$scope.semesterId = data.data;
			var html = ''
				+  '<select ui-select2 '
				+  ' ng-model="semesterSettingManage.semesterId" id="semesterId" name="semesterId" '
				+  ' class="form-control" ui-jq="chosen" ui-options="{search_contains: true}" > '
				+  '<option value="">==请选择==</option> '
				+  '<option  ng-repeat="semester in semesterId" value="{{semester.id}}">{{semester.acadYearSemester}}</option> '
				+  '</select>';
			angular.element("#semesterId").parent().empty().append(html);
			$compile(angular.element("#semesterId").parent().contents())($scope);
		});

		// 查询参数
		$scope.queryParams = function queryParams(params) {
			var pageParam = {
				pageSize : params.pageSize,   //页面大小
				pageNo : params.pageNumber  //页码
			};
			return angular.extend(pageParam, $scope.semesterSettingManage);
		};

		$scope.semesterSettingManageTable = {
			url: app.api.address + '/choose/semesterSet',
//         	url: 'data_test/choose/tableview_semesterSettingManage.json',
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
			queryParams: $scope.queryParams,//传递参数（*）
			search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#semesterSettingManageTable').contents())($scope);
			},
			clickToSelect: true,
			responseHandler:function(data){
				return {
					"total": data.data.total,//总页数
					"rows": data.data.rows   //数据
				};
			},
			columns: [
				{field:"id", title:"主键", visible:false},
				{field:"semesterId", title:"主键", visible:false},
				{field: "semester",title: "学年学期",align: "center",valign: "middle",width:"15%"},
				{field: "chooseSemester",title: "选课学期",align: "center",valign: "middle",width:"15%",
					formatter: function(value, row) {
						if(value == "0"){
							return "否";
						}else if(value=="1"){
							return "是";
						}else{
							return "";
						}
					}
				},
				{field: "unregisteredChoose",title: "未注册选课",align: "center",valign: "middle",width:"15%",
					formatter: function(value, row) {
						if(value == "0"){
							return "否";
						}else if(value=="1"){
							return "是";
						}else{
							return "";
						}
					}},
				{field: "arrearsChoose",title: "欠费选课",align: "center",valign: "middle",width:"15%",
					formatter: function(value, row) {
						if(value == "0"){
							return "否";
						}else if(value=="1"){
							return "是";
						}else{
							return "";
						}
					}},
				{field: "unfinishedEvaluateChoose",title: "未完成评价选课",align: "center",valign: "middle",width:"15%",
					formatter: function(value, row) {
						if(value == "0"){
							return "否";
						}else if(value=="1"){
							return "是";
						}else{
							return "";
						}
					}},
				{title: "操作",align: "center",valign: "middle",width:"5%",
					formatter: function(value, row, index) {
						if(row.id != null && row.id != ""){
							var updateButton = "<button type='button' has-permission='' ng-click='semesterUpdate(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>修改</button>";
							return updateButton;
						}else{
							var addButton = "<button type='button' has-permission='' ng-click='semesterAdd(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm' style='padding: 0px 3px;'>添加</button>";
							return addButton;
						}
					}
				}
			]
		};

		// 修改按钮
		$scope.semesterUpdate = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/semesterSettingManage/update.html',
				size: '',
				resolve: {
					item: function () {
						return row;
					},
				},
				controller: updateSemesterController
			});
		};

		// 修改控制器
		var updateSemesterController = function ($scope, $uibModalInstance, item, choose_semesterSettingManageService, alertService) {
			$scope.semesterSettingManage = item;
			console.log("123");
			// $scope.message = "确定要删除吗？";
			$scope.ok = function () {
				$rootScope.showLoading = true; // 开启加载提示
				choose_semesterSettingManageService.update($scope.semesterSettingManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#semesterSettingManageTable').bootstrapTable('refresh');
					alertService('success', '修改成功');
				});

				$uibModalInstance.close();
			};
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};

		};
		updateSemesterController.$inject = ['$scope', '$uibModalInstance', 'item', 'choose_semesterSettingManageService', 'alertService'];

		// 添加按钮
		$scope.semesterAdd = function(row) {
			$uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'tpl/choose/chooseCourseStrategyManage/semesterSettingManage/add.html',
				size: '',
				resolve: {
					item: function () {
						return row;
					},
				},
				controller: addSemesterController
			});
		};

		// 添加控制器
		var addSemesterController = function ($scope, $uibModalInstance, item, formVerifyService, choose_semesterSettingManageService, alertService) {
			$scope.semesterSettingManage = item;
			$scope.semesterSettingManage.chooseSemester = '1';
			$scope.semesterSettingManage.unregisteredChoose = '1';
			$scope.semesterSettingManage.arrearsChoose = '1';
			$scope.semesterSettingManage.unfinishedEvaluateChoose = '1';
			// $scope.semesterSettingManage = {
			// 	chooseSemester : '1',
			// 	unregisteredChoose : '1',
			// 	arrearsChoose : '1',
			// 	unfinishedEvaluateChoose : '1'
			// };
			$scope.arrangeSign = true;
			$scope.ok = function (form) {
				// if(form.$invalid) {
				// 	// 调用共用服务验证（效果：验证不通过的输入框会变红色）
				// 	formVerifyService(form);
				// 	return;
				// };
				$rootScope.showLoading = true; // 开启加载提示
				choose_semesterSettingManageService.add($scope.semesterSettingManage, function (error, message) {
					$rootScope.showLoading = false; // 关闭加载提示
					if (error) {
						alertService(message);
						return;
					}
					angular.element('#semesterSettingManageTable').bootstrapTable('refresh');
					alertService('success', '新增成功');
				});
				
				$uibModalInstance.close();
			};
			// 关闭窗口事件
			$scope.close = function() {
				$uibModalInstance.close();
			};

		};
		addSemesterController.$inject = ['$scope', '$uibModalInstance', 'item', 'formVerifyService', 'choose_semesterSettingManageService', 'alertService'];

		// 确定提交表单 新增教师时间要求信息
		$scope.searchSubmit = function () {
			angular.element('#semesterSettingManageTable').bootstrapTable('selectPage', 1);
		};

		// 查询表单重置
		$scope.searchReset = function () {
			$scope.semesterSettingManage = {};
			// 重新初始化下拉框
			angular.element('form[name="semesterSettingManageForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
			angular.element('#semesterSettingManageTable').bootstrapTable('selectPage', 1);
		};

		// 显示隐藏
		$scope.isHideSearchForm = false; // 默认显示
		$scope.searchFormHideToggle = function() {
			$scope.isHideSearchForm = !$scope.isHideSearchForm;
			if($scope.isHideSearchForm) {
				$scope.table_height = $scope.table_height + 45;
			} else {
				$scope.table_height = $scope.table_height - 45;
			}
			angular.element('#semesterSettingManageTable').bootstrapTable('resetView', {
				height: $scope.table_height
			});
		};
	};
	choose_semesterSettingManageController.$inject = ['$scope', '$state', '$http', '$uibModal', '$compile', '$rootScope', '$window', 'choose_semesterSettingManageService', 'alertService', 'app'];

})(window);